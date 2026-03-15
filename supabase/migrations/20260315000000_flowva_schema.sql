-- ============================================================
-- FLOWVA DATABASE SCHEMA v1 (Consolidated)
-- Generated: 2026-03-15
-- Replaces: 12 migration files from Phase 0-1
-- ============================================================
-- Tables: 22
-- Sections:
--   1. Custom Types (ENUMs)
--   2. Utility Functions (no table refs — set_updated_at only)
--   3. Core Tables       (created in FK-dependency order)
--   4. Helper Functions  (SECURITY DEFINER — must come after tables for LANGUAGE sql)
--   5. Triggers
--   6. Enable RLS        (policies live in 20260315000001_flowva_rls.sql)
-- ============================================================


-- ============================================================
-- 1. CUSTOM TYPES (ENUMs)
-- ============================================================

-- Project membership roles
CREATE TYPE public.project_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Task urgency levels
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Sprint lifecycle states
CREATE TYPE public.sprint_status AS ENUM ('planned', 'active', 'completed', 'cancelled');

-- Chat conversation kinds
CREATE TYPE public.chat_conversation_type AS ENUM ('direct', 'group', 'project', 'task');
CREATE TYPE public.chat_visibility        AS ENUM ('private', 'project');
CREATE TYPE public.chat_member_role       AS ENUM ('admin', 'member');
CREATE TYPE public.chat_message_type      AS ENUM ('text', 'system', 'file');


-- ============================================================
-- 2. UTILITY FUNCTIONS  (no table references — safe to create early)
-- ============================================================
-- Best-practice notes:
--   • All SECURITY DEFINER functions use SET search_path = '' to prevent
--     search-path injection attacks.
--   • Use (SELECT auth.uid()) inside functions/policies instead of bare
--     auth.uid() so Postgres can cache the value once per statement
--     instead of re-evaluating it for every row (5-10x faster on large tables).
--   • LANGUAGE sql (not plpgsql) where possible — planner can inline sql
--     functions into the query plan, improving performance further.
-- ============================================================

-- Generic trigger helper: set updated_at = now() before any UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';


-- ============================================================
-- 3. CORE TABLES  (FK-dependency order)
-- ============================================================

-- -------------------------------------------------------
-- 3.1  USER PROFILES
-- -------------------------------------------------------
-- One row per auth.users entry; auto-created by trigger on_auth_user_created.
-- Stores display info (name, avatar) and preferences (timezone).
CREATE TABLE public.user_profiles (
    id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url   TEXT,
    timezone     TEXT        NOT NULL DEFAULT 'UTC',
    bio          TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.2  PROJECTS
-- -------------------------------------------------------
-- owner_id is set explicitly by the backend (ProjectService.create).
-- A trigger (on_project_created) auto-inserts the owner into project_members.
CREATE TABLE public.projects (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id    UUID        NOT NULL REFERENCES auth.users(id),
    name        TEXT        NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.3  PROJECT MEMBERS
-- -------------------------------------------------------
-- Composite PK: one row per (project, user) pair.
-- Partial unique index enforces exactly one 'owner' per project.
CREATE TABLE public.project_members (
    project_id UUID              NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id    UUID              NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
    role       public.project_role NOT NULL DEFAULT 'member',
    joined_at  TIMESTAMPTZ       NOT NULL DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);

-- Only one owner per project
CREATE UNIQUE INDEX idx_unique_owner_per_project
    ON public.project_members(project_id)
    WHERE role = 'owner';

-- -------------------------------------------------------
-- 3.4  BOARDS & COLUMNS
-- -------------------------------------------------------
CREATE TABLE public.boards (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.board_columns (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id   UUID        NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    position   INT         NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.5  SPRINTS
-- -------------------------------------------------------
CREATE TABLE public.sprints (
    id         UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID                 NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name       TEXT                 NOT NULL,
    start_date TIMESTAMPTZ,
    end_date   TIMESTAMPTZ,
    status     public.sprint_status NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ          NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.6  TASKS
-- -------------------------------------------------------
-- project_id: denormalized for fast dashboard/backlog queries (avoids deep joins).
-- column_id:  nullable → NULL means the task is in the backlog (no column assigned).
-- sprint_id:  nullable → NULL means the task is not in any sprint.
-- ON DELETE SET NULL on column_id: deleting a column moves tasks to backlog instead of
--   cascading deletion, which avoids accidental data loss.
CREATE TABLE public.tasks (
    id          UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID                 NOT NULL REFERENCES public.projects(id)      ON DELETE CASCADE,
    column_id   UUID                          REFERENCES public.board_columns(id) ON DELETE SET NULL,
    sprint_id   UUID                          REFERENCES public.sprints(id)       ON DELETE SET NULL,
    title       TEXT                 NOT NULL,
    description TEXT,
    priority    public.task_priority NOT NULL DEFAULT 'medium',
    due_date    TIMESTAMPTZ,
    tags        TEXT[]               NOT NULL DEFAULT '{}',
    created_by  UUID                 NOT NULL REFERENCES auth.users(id),
    created_at  TIMESTAMPTZ          NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ          NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.7  TASK SUB-TABLES
-- -------------------------------------------------------

CREATE TABLE public.task_comments (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id    UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES auth.users(id),
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.task_assignees (
    task_id     UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, user_id)
);

CREATE TABLE public.task_checklist_items (
    id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id      UUID    NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    content      TEXT    NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    position     INT     NOT NULL DEFAULT 0
);

CREATE TABLE public.task_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    file_url    TEXT        NOT NULL,
    file_name   TEXT        NOT NULL,
    uploaded_by UUID        NOT NULL REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.8  ACTIVITY LOGS
-- -------------------------------------------------------
-- Append-only audit trail of project events (task moves, etc.).
-- RLS prevents UPDATE and DELETE to preserve audit integrity.
CREATE TABLE public.activity_logs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id     UUID                 REFERENCES auth.users(id)      ON DELETE SET NULL,
    action_type TEXT        NOT NULL,   -- e.g. 'task_moved', 'task_created'
    target_id   UUID        NOT NULL,   -- ID of the affected entity
    details     JSONB       NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3.9  CONVERSATIONS
-- -------------------------------------------------------
-- NOTE: conversations ↔ messages have a circular FK (last_message_id).
-- We create conversations first without last_message_id, then add it after
-- the messages table exists.
CREATE TABLE public.conversations (
    id              UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID                         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type            public.chat_conversation_type NOT NULL DEFAULT 'group',
    visibility      public.chat_visibility        NOT NULL DEFAULT 'private',
    name            TEXT,
    description     TEXT,
    topic           TEXT,
    created_by      UUID                         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    related_task_id UUID                                  REFERENCES public.tasks(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ,
    is_archived     BOOLEAN                      NOT NULL DEFAULT false,
    metadata        JSONB                        NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ                  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ                  NOT NULL DEFAULT now(),
    -- group / project / task conversations must have a name; direct ones do not
    CONSTRAINT conversations_name_required CHECK (
        (type IN ('group', 'project', 'task') AND char_length(trim(coalesce(name, ''))) > 0)
        OR type = 'direct'
    )
);

-- -------------------------------------------------------
-- 3.10  CONVERSATION MEMBERS
-- -------------------------------------------------------
-- last_read_message_id FK added after messages table exists (see below).
CREATE TABLE public.conversation_members (
    conversation_id      UUID                      NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id              UUID                      NOT NULL REFERENCES auth.users(id)           ON DELETE CASCADE,
    role                 public.chat_member_role   NOT NULL DEFAULT 'member',
    joined_at            TIMESTAMPTZ               NOT NULL DEFAULT now(),
    last_read_at         TIMESTAMPTZ,
    last_read_message_id UUID,           -- FK constraint added below
    is_muted             BOOLEAN                   NOT NULL DEFAULT false,
    can_post             BOOLEAN                   NOT NULL DEFAULT true,
    PRIMARY KEY (conversation_id, user_id)
);

-- -------------------------------------------------------
-- 3.11  MESSAGES
-- -------------------------------------------------------
CREATE TABLE public.messages (
    id                  UUID                      PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID                      NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id           UUID                               REFERENCES auth.users(id)           ON DELETE SET NULL,
    content             TEXT,
    message_type        public.chat_message_type  NOT NULL DEFAULT 'text',
    reply_to_message_id UUID                               REFERENCES public.messages(id)      ON DELETE SET NULL,
    metadata            JSONB                     NOT NULL DEFAULT '{}'::jsonb,
    sent_at             TIMESTAMPTZ               NOT NULL DEFAULT now(),
    edited_at           TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    -- Message must have content or non-empty metadata (e.g. file attachment)
    CONSTRAINT messages_payload_required CHECK (
        char_length(trim(coalesce(content, ''))) > 0
        OR metadata <> '{}'::jsonb
    )
);

-- Resolve circular FK: conversations.last_message_id → messages.id
ALTER TABLE public.conversations
    ADD COLUMN last_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- Resolve deferred FK: conversation_members.last_read_message_id → messages.id
ALTER TABLE public.conversation_members
    ADD CONSTRAINT fk_cm_last_read_message
    FOREIGN KEY (last_read_message_id) REFERENCES public.messages(id) ON DELETE SET NULL;

-- -------------------------------------------------------
-- 3.12  CHAT SUPPORTING TABLES
-- -------------------------------------------------------

CREATE TABLE public.message_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id  UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url    TEXT        NOT NULL,
    file_name   TEXT        NOT NULL,
    mime_type   TEXT,
    file_size   BIGINT,
    uploaded_by UUID                 REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.message_reads (
    message_id UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
    read_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, user_id)
);

-- Links a conversation to one or more tasks (is_primary = the canonical link)
CREATE TABLE public.conversation_task_links (
    conversation_id UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    task_id         UUID        NOT NULL REFERENCES public.tasks(id)         ON DELETE CASCADE,
    linked_by       UUID                 REFERENCES auth.users(id)           ON DELETE SET NULL,
    is_primary      BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (conversation_id, task_id)
);

-- Records task @mentions inside messages (immutable audit; no UPDATE/DELETE allowed by RLS)
CREATE TABLE public.message_task_mentions (
    message_id   UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    task_id      UUID        NOT NULL REFERENCES public.tasks(id)    ON DELETE CASCADE,
    mentioned_by UUID                 REFERENCES auth.users(id)      ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, task_id)
);

-- Discord-style emoji reactions to messages
CREATE TABLE public.message_reactions (
    message_id UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
    emoji      TEXT        NOT NULL CHECK (char_length(trim(emoji)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, user_id, emoji)
);

-- Records @user mentions inside messages (immutable audit)
CREATE TABLE public.message_user_mentions (
    message_id        UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    mentioned_user_id UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
    mentioned_by      UUID                 REFERENCES auth.users(id)      ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, mentioned_user_id)
);


-- ============================================================
-- 4. HELPER FUNCTIONS  (created after tables — LANGUAGE sql validates table refs)
-- ============================================================

-- -------------------------------------------------------
-- Project-membership helpers
-- -------------------------------------------------------

-- Bypass RLS to check membership — used in SELECT policies to break
-- the infinite-recursion problem (policy queries the same table).
-- Takes explicit user_id arg so it can be called from within policies
-- without re-checking auth.uid() every row.
CREATE OR REPLACE FUNCTION public.is_project_member_bypass(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_project_id
          AND user_id    = p_user_id
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Check whether the current authenticated user is a member of a project
CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_id
          AND user_id    = (SELECT auth.uid())
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Check whether the current user is an owner or admin of a project
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(p_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_id
          AND user_id    = (SELECT auth.uid())
          AND role IN ('owner', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Return the current user's role in a project (NULL if not a member)
CREATE OR REPLACE FUNCTION public.get_project_role(p_id UUID)
RETURNS public.project_role AS $$
    SELECT role FROM public.project_members
    WHERE project_id = p_id
      AND user_id    = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- -------------------------------------------------------
-- Chat-access helpers
-- -------------------------------------------------------

-- Can the current user READ a conversation?
-- A user can access a conversation if:
--   • They are a project member, AND
--   • The conversation is 'project'-visible, OR they are a conversation_member
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
                  SELECT 1 FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Can the current user POST to a conversation?
-- Requires project membership with role != 'viewer', plus conversation access
CREATE OR REPLACE FUNCTION public.can_post_to_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id    = (SELECT auth.uid())
        WHERE c.id = p_conversation_id
          AND pm.role != 'viewer'
          AND (
              c.visibility = 'project'
              OR EXISTS (
                  SELECT 1 FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
                    AND cm.can_post = true
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';

-- Can the current user MANAGE (edit/delete) a conversation?
-- True if the user is a project owner/admin, the conversation creator,
-- or a conversation_member with role = 'admin'
CREATE OR REPLACE FUNCTION public.can_manage_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id    = (SELECT auth.uid())
        WHERE c.id = p_conversation_id
          AND (
              pm.role IN ('owner', 'admin')
              OR c.created_by = (SELECT auth.uid())
              OR EXISTS (
                  SELECT 1 FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = (SELECT auth.uid())
                    AND cm.role   = 'admin'
              )
          )
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';


-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- -------------------------------------------------------
-- 4.1  Auth: auto-create user_profile on new signup
-- -------------------------------------------------------
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------
-- 4.2  user_profiles: auto-update updated_at
-- -------------------------------------------------------
CREATE TRIGGER user_profiles_set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 4.3  Projects: auto-insert creator as owner in project_members
-- -------------------------------------------------------
-- NOTE: owner_id is set by backend (ProjectService.create).
-- This trigger reads NEW.owner_id (already correct) and adds it
-- to project_members so RLS SELECT policies work immediately.
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_project();

-- -------------------------------------------------------
-- 4.4  Projects: auto-update updated_at
-- -------------------------------------------------------
CREATE TRIGGER projects_set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 4.5  Tasks: auto-update updated_at
-- -------------------------------------------------------
CREATE TRIGGER tasks_set_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 4.6  Tasks: log column changes (kanban card moves) to activity_logs
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_task_column_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.column_id IS DISTINCT FROM NEW.column_id THEN
        INSERT INTO public.activity_logs (project_id, user_id, action_type, target_id, details)
        VALUES (
            NEW.project_id,
            (SELECT auth.uid()),
            'task_moved',
            NEW.id,
            jsonb_build_object(
                'task_title',    NEW.title,
                'from_column_id', OLD.column_id,
                'to_column_id',   NEW.column_id
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_task_column_change
    AFTER UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.log_task_column_change();

-- -------------------------------------------------------
-- 4.7  Conversations: auto-update updated_at
-- -------------------------------------------------------
CREATE TRIGGER conversations_set_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 4.8  Conversations: add creator as admin + link task (on INSERT)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_conversation()
RETURNS TRIGGER AS $$
BEGIN
    -- Add creator as conversation admin
    INSERT INTO public.conversation_members (conversation_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    -- If linked to a task, create the primary task link
    IF NEW.related_task_id IS NOT NULL THEN
        INSERT INTO public.conversation_task_links (conversation_id, task_id, linked_by, is_primary)
        VALUES (NEW.id, NEW.related_task_id, NEW.created_by, true)
        ON CONFLICT (conversation_id, task_id) DO UPDATE
            SET is_primary = EXCLUDED.is_primary;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_conversation_created
    AFTER INSERT ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_conversation();

-- -------------------------------------------------------
-- 4.9  Conversations: sync task link when related_task_id changes (UPDATE only)
-- -------------------------------------------------------
-- INSERT is already handled by on_conversation_created above.
CREATE OR REPLACE FUNCTION public.sync_conversation_task_link()
RETURNS TRIGGER AS $$
BEGIN
    -- Short-circuit: only run when related_task_id actually changed
    IF OLD.related_task_id IS NOT DISTINCT FROM NEW.related_task_id THEN
        RETURN NEW;
    END IF;

    IF NEW.related_task_id IS NOT NULL THEN
        INSERT INTO public.conversation_task_links (conversation_id, task_id, linked_by, is_primary)
        VALUES (NEW.id, NEW.related_task_id, (SELECT auth.uid()), true)
        ON CONFLICT (conversation_id, task_id) DO UPDATE SET is_primary = true;

        -- Demote any previous primary links
        UPDATE public.conversation_task_links
        SET is_primary = false
        WHERE conversation_id = NEW.id
          AND task_id <> NEW.related_task_id
          AND is_primary = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_conversation_task_updated
    AFTER UPDATE OF related_task_id ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.sync_conversation_task_link();

-- -------------------------------------------------------
-- 4.10  Messages: refresh last_message_id / last_message_at on conversations
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.refresh_conversation_last_message()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    v_conversation_id := COALESCE(NEW.conversation_id, OLD.conversation_id);

    -- Update to the most recent non-deleted message
    UPDATE public.conversations c
    SET last_message_id = last_msg.id,
        last_message_at = last_msg.sent_at,
        updated_at      = now()
    FROM LATERAL (
        SELECT m.id, m.sent_at
        FROM public.messages m
        WHERE m.conversation_id = v_conversation_id
          AND m.deleted_at IS NULL
        ORDER BY m.sent_at DESC, m.id DESC
        LIMIT 1
    ) AS last_msg
    WHERE c.id = v_conversation_id;

    -- Clear if no non-deleted messages remain
    UPDATE public.conversations
    SET last_message_id = NULL,
        last_message_at = NULL,
        updated_at      = now()
    WHERE id = v_conversation_id
      AND NOT EXISTS (
          SELECT 1 FROM public.messages m
          WHERE m.conversation_id = v_conversation_id
            AND m.deleted_at IS NULL
      );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_message_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.refresh_conversation_last_message();

-- -------------------------------------------------------
-- 4.11  Message reads: sync last_read_at in conversation_members
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_last_read_at()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    SELECT conversation_id INTO v_conversation_id
    FROM public.messages WHERE id = NEW.message_id;

    UPDATE public.conversation_members
    SET last_read_at         = NEW.read_at,
        last_read_message_id = NEW.message_id
    WHERE conversation_id = v_conversation_id
      AND user_id         = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_message_read
    AFTER INSERT OR UPDATE ON public.message_reads
    FOR EACH ROW EXECUTE FUNCTION public.sync_last_read_at();


-- ============================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================================
-- Policies are defined in 20260315000001_flowva_rls.sql

ALTER TABLE public.user_profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_columns           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_checklist_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_task_mentions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_user_mentions   ENABLE ROW LEVEL SECURITY;
