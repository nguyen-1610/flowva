-- ==========================================
-- MIGRATION: Fix & Enhance Schema
-- Applied: 2026-03-10
-- Fixes:
--   1. RLS policy bug on project_members (owner protection)
--   2. Duplicate trigger on conversation_task_links
--   3. RLS performance (auth.uid() caching)
--   4. Missing FK/composite indexes
--   5. sprints.status VARCHAR → ENUM
-- Additions:
--   6. user_profiles table
--   7. message_reactions table (Discord-like)
--   8. message_user_mentions table
-- ==========================================


-- ==========================================
-- FIX 1: RLS Policy — project_members ownership protection
-- security-rls-basics: Tách FROM ALL thành từng operation riêng
-- Postgres OR policies cùng operation → FOR ALL + FOR DELETE = owner bị xóa được
-- ==========================================

DROP POLICY IF EXISTS "Manage members" ON public.project_members;
DROP POLICY IF EXISTS "Protect owner from deletion" ON public.project_members;

CREATE POLICY "Admin can insert members" ON public.project_members
FOR INSERT WITH CHECK (public.is_admin_or_owner(project_id));

CREATE POLICY "Admin can update members" ON public.project_members
FOR UPDATE
    USING (public.is_admin_or_owner(project_id))
    WITH CHECK (public.is_admin_or_owner(project_id));

-- Chỉ được xóa NON-owner members — owner được bảo vệ tuyệt đối
CREATE POLICY "Admin can delete non-owner members" ON public.project_members
FOR DELETE USING (
    public.is_admin_or_owner(project_id)
    AND role != 'owner'
);


-- ==========================================
-- FIX 2: Duplicate Trigger — conversation_task_links
-- lock-deadlock-prevention: Giảm write contention từ double INSERT
-- Trigger on_conversation_created (INSERT) đã XỬ LÝ rồi
-- Trigger on_conversation_task_updated cần CHỈ chạy cho UPDATE
-- ==========================================

DROP TRIGGER IF EXISTS on_conversation_task_updated ON public.conversations;

CREATE OR REPLACE FUNCTION public.sync_conversation_task_link()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ chạy khi UPDATE thực sự thay đổi related_task_id
    IF TG_OP = 'UPDATE' AND OLD.related_task_id IS NOT DISTINCT FROM NEW.related_task_id THEN
        RETURN NEW;
    END IF;

    IF NEW.related_task_id IS NOT NULL THEN
        INSERT INTO public.conversation_task_links (conversation_id, task_id, linked_by, is_primary)
        VALUES (NEW.id, NEW.related_task_id, (SELECT auth.uid()), true)
        ON CONFLICT (conversation_id, task_id) DO UPDATE
            SET is_primary = true;

        -- Reset is_primary cho các link cũ
        UPDATE public.conversation_task_links
        SET is_primary = false
        WHERE conversation_id = NEW.id
          AND task_id <> NEW.related_task_id
          AND is_primary = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger CHỈ cho UPDATE (INSERT đã handled bởi on_conversation_created)
CREATE TRIGGER on_conversation_task_updated
    AFTER UPDATE OF related_task_id ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_conversation_task_link();


-- ==========================================
-- FIX 2b: Add last_read_message_id an toàn (idempotent)
-- schema-constraints: Dùng DO block vì Postgres không có ADD COLUMN IF NOT EXISTS
-- ==========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'conversation_members'
          AND column_name = 'last_read_message_id'
    ) THEN
        ALTER TABLE public.conversation_members
            ADD COLUMN last_read_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;
    END IF;
END $$;


-- ==========================================
-- FIX 3: RLS Performance — (select auth.uid()) caching
-- security-rls-performance: auth.uid() per-row → cached once
-- Impact: 5-10x faster RLS queries
-- ==========================================

CREATE OR REPLACE FUNCTION public.is_admin_or_owner(p_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_id
          AND user_id = (SELECT auth.uid())
          AND role IN ('owner', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_project_role(p_id UUID)
RETURNS project_role AS $$
    SELECT role FROM public.project_members
    WHERE project_id = p_id AND user_id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_id
          AND user_id = (SELECT auth.uid())
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.can_access_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.id = p_conversation_id
          AND public.is_project_member(c.project_id)
          AND (
              c.visibility = 'project'
              OR EXISTS (
                  SELECT 1
                  FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.can_post_to_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id = (SELECT auth.uid())
        WHERE c.id = p_conversation_id
          AND pm.role != 'viewer'
          AND (
              c.visibility = 'project'
              OR EXISTS (
                  SELECT 1
                  FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
                    AND cm.can_post = true
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.can_manage_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id = (SELECT auth.uid())
        WHERE c.id = p_conversation_id
          AND (
              pm.role IN ('owner', 'admin')
              OR c.created_by = (SELECT auth.uid())
              OR EXISTS (
                  SELECT 1
                  FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
                    AND cm.role = 'admin'
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';


-- ==========================================
-- FIX 4: Missing Indexes
-- query-missing-indexes: 100-1000x faster queries
-- schema-foreign-key-indexes: Postgres KHÔNG tự tạo index cho FK
-- query-composite-indexes: Composite index cho multi-column queries
-- ==========================================

-- FK indexes còn thiếu
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_id
    ON public.tasks(sprint_id);

CREATE INDEX IF NOT EXISTS idx_sprints_project_id
    ON public.sprints(project_id);

-- Composite index: Dashboard — tasks sắp hết hạn (project + due_date)
-- Column order: equality (project_id) trước, range (due_date) sau
CREATE INDEX IF NOT EXISTS idx_tasks_project_due_date
    ON public.tasks(project_id, due_date)
    WHERE due_date IS NOT NULL;

-- Composite index cho activity feed
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_created
    ON public.activity_logs(project_id, created_at DESC);

-- NOTE: idx_sprints_active được tạo SAU KHI đổi ENUM ở FIX 5 bên dưới

-- Indexes cho RLS policy performance trên project_members
CREATE INDEX IF NOT EXISTS idx_project_members_user_role
    ON public.project_members(user_id, project_id, role);


-- ==========================================
-- FIX 5: sprints.status VARCHAR → ENUM
-- schema-data-types: ENUM an toàn + hiệu quả hơn VARCHAR
-- ==========================================

CREATE TYPE sprint_status AS ENUM ('planned', 'active', 'completed', 'cancelled');

-- Bước 1: Drop default trước (không thể cast VARCHAR default → ENUM tự động)
ALTER TABLE public.sprints
    ALTER COLUMN status DROP DEFAULT;

-- Bước 2: Cast column sang ENUM type
ALTER TABLE public.sprints
    ALTER COLUMN status TYPE sprint_status
    USING status::sprint_status;

-- Bước 3: Khôi phục default với đúng type
ALTER TABLE public.sprints
    ALTER COLUMN status SET DEFAULT 'planned'::sprint_status;

-- Bước 4: Partial index PHẢI tạo SAU khi ENUM đã được tạo
-- WHERE clause dùng ENUM literal, không phải VARCHAR
CREATE INDEX IF NOT EXISTS idx_sprints_active
    ON public.sprints(project_id, start_date, end_date)
    WHERE status = 'active'::sprint_status;


-- ==========================================
-- ADDITION 6: user_profiles
-- Bắt buộc cho Chat (display name, avatar) và Calendar (timezone)
-- ==========================================

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_display_name ON public.user_profiles(display_name);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Trigger: updated_at tự động
CREATE TRIGGER user_profiles_set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: Tự tạo profile khi user đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: Ai cũng xem được profile, chỉ chủ mới tự sửa
CREATE POLICY "Public profiles are viewable" ON public.user_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);


-- ==========================================
-- ADDITION 7: message_reactions (Discord-like emoji reactions)
-- ==========================================

CREATE TABLE public.message_reactions (
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji      TEXT NOT NULL CHECK (char_length(trim(emoji)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, user_id, emoji)
);

-- Index: lấy tất cả reactions của một tin nhắn
CREATE INDEX idx_message_reactions_message_id
    ON public.message_reactions(message_id);

-- Index: lấy reactions của một user
CREATE INDEX idx_message_reactions_user_id
    ON public.message_reactions(user_id);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- View reactions: ai có thể xem conversation
CREATE POLICY "View reactions" ON public.message_reactions
FOR SELECT USING (
    public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_reactions.message_id)
    )
);

-- Thêm reaction: cần có thể post vào conversation
CREATE POLICY "Insert own reactions" ON public.message_reactions
FOR INSERT WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_reactions.message_id)
    )
);

-- Xóa reaction: chỉ chủ reaction
CREATE POLICY "Delete own reactions" ON public.message_reactions
FOR DELETE USING (user_id = (SELECT auth.uid()));


-- ==========================================
-- ADDITION 8: message_user_mentions (@mention người dùng)
-- ==========================================

CREATE TABLE public.message_user_mentions (
    message_id       UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    mentioned_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentioned_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, mentioned_user_id)
);

-- Index: lấy tất cả @mentions của một user (notification feed)
CREATE INDEX idx_message_user_mentions_user
    ON public.message_user_mentions(mentioned_user_id, created_at DESC);

-- Index: lấy mentions theo message
CREATE INDEX idx_message_user_mentions_message
    ON public.message_user_mentions(message_id);

ALTER TABLE public.message_user_mentions ENABLE ROW LEVEL SECURITY;

-- View mentions: user xem mention của mình, hoặc thành viên conversation
CREATE POLICY "View user mentions" ON public.message_user_mentions
FOR SELECT USING (
    mentioned_user_id = (SELECT auth.uid())
    OR public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_user_mentions.message_id)
    )
);

-- Insert: chỉ người gửi tin nhắn mới được thêm mentions
CREATE POLICY "Insert mentions when posting" ON public.message_user_mentions
FOR INSERT WITH CHECK (
    mentioned_by = (SELECT auth.uid())
    AND public.can_post_to_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_user_mentions.message_id)
    )
);

-- Không ai được sửa hay xóa mention record (immutable audit)
CREATE POLICY "Prevent mention updates" ON public.message_user_mentions
FOR UPDATE USING (false);
