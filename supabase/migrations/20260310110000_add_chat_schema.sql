-- ==========================================
-- Chat Schema: Project-aware conversations
-- ==========================================

-- 1. ENUMS & TYPES
CREATE TYPE public.chat_conversation_type AS ENUM ('direct', 'group', 'project', 'task');
CREATE TYPE public.chat_visibility AS ENUM ('private', 'project');
CREATE TYPE public.chat_member_role AS ENUM ('admin', 'member');
CREATE TYPE public.chat_message_type AS ENUM ('text', 'system', 'file');

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
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
                    AND cm.user_id = auth.uid()
              )
          )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_post_to_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id = auth.uid()
        WHERE c.id = p_conversation_id
          AND pm.role != 'viewer'
          AND (
              c.visibility = 'project'
              OR EXISTS (
                  SELECT 1
                  FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = auth.uid()
                    AND cm.can_post = true
              )
          )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_conversation(p_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.conversations c
        JOIN public.project_members pm
          ON pm.project_id = c.project_id
         AND pm.user_id = auth.uid()
        WHERE c.id = p_conversation_id
          AND (
              pm.role IN ('owner', 'admin')
              OR c.created_by = auth.uid()
              OR EXISTS (
                  SELECT 1
                  FROM public.conversation_members cm
                  WHERE cm.conversation_id = c.id
                    AND cm.user_id = auth.uid()
                    AND cm.role = 'admin'
              )
          )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CORE TABLES
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type public.chat_conversation_type NOT NULL DEFAULT 'group',
    visibility public.chat_visibility NOT NULL DEFAULT 'private',
    name VARCHAR,
    description TEXT,
    topic TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    related_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT conversations_name_required CHECK (
        (
            type IN ('group', 'project', 'task')
            AND char_length(trim(coalesce(name, ''))) > 0
        )
        OR type = 'direct'
    )
);

CREATE TABLE public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.chat_member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_muted BOOLEAN NOT NULL DEFAULT false,
    can_post BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT,
    message_type public.chat_message_type NOT NULL DEFAULT 'text',
    reply_to_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT messages_payload_required CHECK (
        char_length(trim(coalesce(content, ''))) > 0
        OR metadata <> '{}'::jsonb
    )
);

ALTER TABLE public.conversations
ADD COLUMN last_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

CREATE TABLE public.message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR NOT NULL,
    mime_type VARCHAR,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.message_reads (
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE public.conversation_task_links (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    linked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (conversation_id, task_id)
);

CREATE TABLE public.message_task_mentions (
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    mentioned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (message_id, task_id)
);

-- NOTE: last_read_message_id được thêm an toàn trong migration 20260310140000_fix_and_enhance_schema.sql
-- bằng DO block idempotent để tránh lỗi duplicate column khi db reset.

-- 4. INDEXES
CREATE INDEX idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX idx_conversations_related_task_id ON public.conversations(related_task_id);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC NULLS LAST);
CREATE UNIQUE INDEX idx_unique_task_conversation
ON public.conversations(related_task_id)
WHERE type = 'task' AND related_task_id IS NOT NULL;

CREATE INDEX idx_conversation_members_user_id ON public.conversation_members(user_id);
CREATE INDEX idx_messages_conversation_id_sent_at ON public.messages(conversation_id, sent_at DESC);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_message_reads_user_id ON public.message_reads(user_id);
CREATE INDEX idx_conversation_task_links_task_id ON public.conversation_task_links(task_id);
CREATE INDEX idx_message_task_mentions_task_id ON public.message_task_mentions(task_id);

CREATE UNIQUE INDEX idx_one_primary_task_link_per_conversation
ON public.conversation_task_links(conversation_id)
WHERE is_primary = true;

-- 5. TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_conversation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.conversation_members (conversation_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    IF NEW.related_task_id IS NOT NULL THEN
        INSERT INTO public.conversation_task_links (conversation_id, task_id, linked_by, is_primary)
        VALUES (NEW.id, NEW.related_task_id, NEW.created_by, true)
        ON CONFLICT (conversation_id, task_id) DO UPDATE
        SET is_primary = EXCLUDED.is_primary;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_conversation_task_link()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.related_task_id IS NOT NULL THEN
        INSERT INTO public.conversation_task_links (conversation_id, task_id, linked_by, is_primary)
        VALUES (NEW.id, NEW.related_task_id, auth.uid(), true)
        ON CONFLICT (conversation_id, task_id) DO UPDATE
        SET is_primary = true;

        UPDATE public.conversation_task_links
        SET is_primary = false
        WHERE conversation_id = NEW.id
          AND task_id <> NEW.related_task_id
          AND is_primary = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.refresh_conversation_last_message()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    v_conversation_id := COALESCE(NEW.conversation_id, OLD.conversation_id);

    UPDATE public.conversations c
    SET last_message_id = last_msg.id,
        last_message_at = last_msg.sent_at,
        updated_at = now()
    FROM LATERAL (
        SELECT m.id, m.sent_at
        FROM public.messages m
        WHERE m.conversation_id = v_conversation_id
          AND m.deleted_at IS NULL
        ORDER BY m.sent_at DESC, m.id DESC
        LIMIT 1
    ) AS last_msg
    WHERE c.id = v_conversation_id;

    UPDATE public.conversations
    SET last_message_id = NULL,
        last_message_at = NULL,
        updated_at = now()
    WHERE id = v_conversation_id
      AND NOT EXISTS (
          SELECT 1
          FROM public.messages m
          WHERE m.conversation_id = v_conversation_id
            AND m.deleted_at IS NULL
      );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_last_read_at()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    SELECT conversation_id
    INTO v_conversation_id
    FROM public.messages
    WHERE id = NEW.message_id;

    UPDATE public.conversation_members
    SET last_read_at = NEW.read_at,
        last_read_message_id = NEW.message_id
    WHERE conversation_id = v_conversation_id
      AND user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER conversations_set_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_conversation_created
    AFTER INSERT ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_conversation();

CREATE TRIGGER on_conversation_task_updated
    AFTER INSERT OR UPDATE OF related_task_id ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_conversation_task_link();

CREATE TRIGGER on_message_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.refresh_conversation_last_message();

CREATE TRIGGER on_message_read
    AFTER INSERT OR UPDATE ON public.message_reads
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_last_read_at();

-- 6. ENABLE RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_task_mentions ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
CREATE POLICY "View conversations"
ON public.conversations FOR SELECT
USING (public.can_access_conversation(id));

CREATE POLICY "Create conversations"
ON public.conversations FOR INSERT
WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM public.project_members pm
        WHERE pm.project_id = conversations.project_id
          AND pm.user_id = auth.uid()
          AND pm.role != 'viewer'
    )
);

CREATE POLICY "Manage conversations"
ON public.conversations FOR UPDATE
USING (public.can_manage_conversation(id))
WITH CHECK (public.can_manage_conversation(id));

CREATE POLICY "Delete conversations"
ON public.conversations FOR DELETE
USING (public.can_manage_conversation(id));

CREATE POLICY "View conversation members"
ON public.conversation_members FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Insert conversation members"
ON public.conversation_members FOR INSERT
WITH CHECK (public.can_manage_conversation(conversation_id));

CREATE POLICY "Update own member settings or manage members"
ON public.conversation_members FOR UPDATE
USING (
    auth.uid() = user_id
    OR public.can_manage_conversation(conversation_id)
)
WITH CHECK (
    auth.uid() = user_id
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "Leave conversation or manage members"
ON public.conversation_members FOR DELETE
USING (
    auth.uid() = user_id
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "View messages"
ON public.messages FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Insert messages"
ON public.messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND public.can_post_to_conversation(conversation_id)
);

CREATE POLICY "Update own messages or manage conversation"
ON public.messages FOR UPDATE
USING (
    sender_id = auth.uid()
    OR public.can_manage_conversation(conversation_id)
)
WITH CHECK (
    sender_id = auth.uid()
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "Delete own messages or manage conversation"
ON public.messages FOR DELETE
USING (
    sender_id = auth.uid()
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "View message attachments"
ON public.message_attachments FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Insert message attachments"
ON public.message_attachments FOR INSERT
WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_post_to_conversation(m.conversation_id)
    )
);

CREATE POLICY "Delete own attachments or manage conversation"
ON public.message_attachments FOR DELETE
USING (
    uploaded_by = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_manage_conversation(m.conversation_id)
    )
);

CREATE POLICY "View message reads"
ON public.message_reads FOR SELECT
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_reads.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Insert own message reads"
ON public.message_reads FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_reads.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Update own message reads"
ON public.message_reads FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "View conversation task links"
ON public.conversation_task_links FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Manage conversation task links"
ON public.conversation_task_links FOR ALL
USING (public.can_post_to_conversation(conversation_id))
WITH CHECK (public.can_post_to_conversation(conversation_id));

CREATE POLICY "View message task mentions"
ON public.message_task_mentions FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_task_mentions.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Manage message task mentions"
ON public.message_task_mentions FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_task_mentions.message_id
          AND public.can_post_to_conversation(m.conversation_id)
    )
)
WITH CHECK (
    mentioned_by = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM public.messages m
        WHERE m.id = message_task_mentions.message_id
          AND public.can_post_to_conversation(m.conversation_id)
    )
);
