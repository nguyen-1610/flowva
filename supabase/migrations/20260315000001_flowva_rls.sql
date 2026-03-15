-- ============================================================
-- FLOWVA RLS POLICIES v1 (Consolidated)
-- Generated: 2026-03-15
-- Depends on: 20260315000000_flowva_schema.sql
-- ============================================================
-- Permission matrix summary:
--
--   Table              | viewer | member | admin | owner
--   -------------------|--------|--------|-------|------
--   projects           | SELECT | SELECT | ALL   | ALL + DELETE
--   project_members    | SELECT | SELECT | INSERT/UPDATE/DELETE(non-owner) | same
--   boards             | SELECT | SELECT | ALL   | ALL
--   board_columns      | SELECT | SELECT | ALL   | ALL
--   sprints            | SELECT | SELECT | ALL   | ALL
--   tasks              | SELECT | ALL    | ALL   | ALL
--   task_comments      | SELECT | ALL    | ALL   | ALL
--   task_assignees     | SELECT | ALL    | ALL   | ALL
--   task_checklist_items| SELECT| ALL    | ALL   | ALL
--   task_attachments   | SELECT | ALL    | ALL   | ALL
--   activity_logs      | SELECT | SELECT | SELECT| SELECT (immutable)
--   conversations      | access | post   | manage| manage
--   messages           | read   | post   | manage| manage
-- ============================================================
-- Best practices applied:
--   • (SELECT auth.uid()) — cached once per statement (not per row)
--   • SECURITY DEFINER helpers used for all cross-table membership checks
--   • Separate policies per operation (not FOR ALL) for clarity and correctness
--   • TO authenticated on write operations to block anonymous access explicitly
-- ============================================================


-- ============================================================
-- USER PROFILES
-- ============================================================
-- Public read (needed for display names/avatars across the app).
-- Users manage only their own profile.

CREATE POLICY "Public profiles are viewable"
ON public.user_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING    ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);


-- ============================================================
-- PROJECTS
-- ============================================================
-- INSERT: backend sets owner_id explicitly; policy verifies it matches the caller.
-- The RLS fix (Phase 1): owner_id = (SELECT auth.uid()) prevents the bug where
-- bare auth.uid() returned NULL inside an INSERT context.

CREATE POLICY "Authenticated users can create projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND (SELECT auth.uid()) IS NOT NULL
);

CREATE POLICY "Members can view their projects"
ON public.projects FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(id, (SELECT auth.uid())));

CREATE POLICY "Admins and owners can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING    (public.is_admin_or_owner(id))
WITH CHECK (public.is_admin_or_owner(id));

CREATE POLICY "Only owners can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (public.get_project_role(id) = 'owner');


-- ============================================================
-- PROJECT MEMBERS
-- ============================================================
-- SELECT: uses is_project_member_bypass to avoid infinite RLS recursion
--         (a policy that queries project_members from within project_members context).
--
-- INSERT Phase 1 fix: allow EITHER an existing admin/owner to add members,
--   OR the user inserting themselves as owner (needed by on_project_created trigger
--   which runs AFTER INSERT so no members exist yet when it fires).

CREATE POLICY "Members can view project members"
ON public.project_members FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

CREATE POLICY "Admins can add members"
ON public.project_members FOR INSERT
TO authenticated
WITH CHECK (
    -- Case 1: existing admin/owner inviting someone
    public.is_admin_or_owner(project_id)
    OR
    -- Case 2: trigger inserting the creator as owner on new project
    (user_id = (SELECT auth.uid()) AND role = 'owner')
);

CREATE POLICY "Admins can update member roles"
ON public.project_members FOR UPDATE
TO authenticated
USING    (public.is_admin_or_owner(project_id))
WITH CHECK (public.is_admin_or_owner(project_id));

-- Owners are protected: admins can only remove non-owner members
CREATE POLICY "Admins can remove non-owner members"
ON public.project_members FOR DELETE
TO authenticated
USING (
    public.is_admin_or_owner(project_id)
    AND role != 'owner'
);


-- ============================================================
-- BOARDS
-- ============================================================

CREATE POLICY "Project members can view boards"
ON public.boards FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

CREATE POLICY "Admins can create boards"
ON public.boards FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_owner(project_id));

CREATE POLICY "Admins can update boards"
ON public.boards FOR UPDATE
TO authenticated
USING    (public.is_admin_or_owner(project_id))
WITH CHECK (public.is_admin_or_owner(project_id));

CREATE POLICY "Admins can delete boards"
ON public.boards FOR DELETE
TO authenticated
USING (public.is_admin_or_owner(project_id));


-- ============================================================
-- BOARD COLUMNS
-- ============================================================

CREATE POLICY "Project members can view columns"
ON public.board_columns FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.boards b
        WHERE b.id = board_columns.board_id
          AND public.is_project_member_bypass(b.project_id, (SELECT auth.uid()))
    )
);

CREATE POLICY "Admins can create columns"
ON public.board_columns FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin_or_owner(
        (SELECT project_id FROM public.boards WHERE id = board_columns.board_id)
    )
);

CREATE POLICY "Admins can update columns"
ON public.board_columns FOR UPDATE
TO authenticated
USING (
    public.is_admin_or_owner(
        (SELECT project_id FROM public.boards WHERE id = board_columns.board_id)
    )
)
WITH CHECK (
    public.is_admin_or_owner(
        (SELECT project_id FROM public.boards WHERE id = board_columns.board_id)
    )
);

CREATE POLICY "Admins can delete columns"
ON public.board_columns FOR DELETE
TO authenticated
USING (
    public.is_admin_or_owner(
        (SELECT project_id FROM public.boards WHERE id = board_columns.board_id)
    )
);


-- ============================================================
-- SPRINTS
-- ============================================================

CREATE POLICY "Project members can view sprints"
ON public.sprints FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

CREATE POLICY "Non-viewers can manage sprints"
ON public.sprints FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = sprints.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
);

CREATE POLICY "Non-viewers can update sprints"
ON public.sprints FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = sprints.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = sprints.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
);

CREATE POLICY "Non-viewers can delete sprints"
ON public.sprints FOR DELETE
TO authenticated
USING (public.is_admin_or_owner(project_id));


-- ============================================================
-- TASKS
-- ============================================================
-- Now that tasks carry project_id directly, policies are simple and fast
-- (no deep JOIN through board_columns → boards required).

CREATE POLICY "Project members can view tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

CREATE POLICY "Non-viewers can create tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = tasks.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
);

CREATE POLICY "Non-viewers can update tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = tasks.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = tasks.project_id
          AND user_id    = (SELECT auth.uid())
          AND role != 'viewer'
    )
);

-- Task creator can delete their own task; admins/owners can delete any task
CREATE POLICY "Creators and admins can delete tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (
    created_by = (SELECT auth.uid())
    OR public.is_admin_or_owner(project_id)
);


-- ============================================================
-- TASK COMMENTS
-- ============================================================

CREATE POLICY "Project members can view task comments"
ON public.task_comments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id      = task_comments.task_id
          AND pm.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Non-viewers can post comments"
ON public.task_comments FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_comments.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

-- Comment authors edit only their own comments
CREATE POLICY "Authors can update own comments"
ON public.task_comments FOR UPDATE
TO authenticated
USING    (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Authors delete own comments; admins/owners can delete any comment
CREATE POLICY "Authors and admins can delete comments"
ON public.task_comments FOR DELETE
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.is_admin_or_owner(
        (SELECT project_id FROM public.tasks WHERE id = task_comments.task_id)
    )
);


-- ============================================================
-- TASK ASSIGNEES
-- ============================================================

CREATE POLICY "Project members can view assignees"
ON public.task_assignees FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_assignees.task_id
          AND pm.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Non-viewers can assign members"
ON public.task_assignees FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_assignees.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

-- Users can unassign themselves; admins can unassign anyone
CREATE POLICY "Non-viewers can remove assignees"
ON public.task_assignees FOR DELETE
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.is_admin_or_owner(
        (SELECT project_id FROM public.tasks WHERE id = task_assignees.task_id)
    )
);


-- ============================================================
-- TASK CHECKLIST ITEMS
-- ============================================================

CREATE POLICY "Project members can view checklist items"
ON public.task_checklist_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_checklist_items.task_id
          AND pm.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Non-viewers can manage checklist items"
ON public.task_checklist_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_checklist_items.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

CREATE POLICY "Non-viewers can update checklist items"
ON public.task_checklist_items FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_checklist_items.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_checklist_items.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

CREATE POLICY "Non-viewers can delete checklist items"
ON public.task_checklist_items FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_checklist_items.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);


-- ============================================================
-- TASK ATTACHMENTS
-- ============================================================

CREATE POLICY "Project members can view attachments"
ON public.task_attachments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_attachments.task_id
          AND pm.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Non-viewers can upload attachments"
ON public.task_attachments FOR INSERT
TO authenticated
WITH CHECK (
    uploaded_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id       = task_attachments.task_id
          AND pm.user_id = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

-- Uploaders remove their own attachments; admins/owners can remove any
CREATE POLICY "Uploaders and admins can delete attachments"
ON public.task_attachments FOR DELETE
TO authenticated
USING (
    uploaded_by = (SELECT auth.uid())
    OR public.is_admin_or_owner(
        (SELECT project_id FROM public.tasks WHERE id = task_attachments.task_id)
    )
);


-- ============================================================
-- ACTIVITY LOGS  (append-only)
-- ============================================================
-- UPDATE and DELETE are explicitly blocked to preserve audit integrity.

CREATE POLICY "Project members can view activity logs"
ON public.activity_logs FOR SELECT
TO authenticated
USING (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

CREATE POLICY "Non-viewers can create activity logs"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_project_member_bypass(project_id, (SELECT auth.uid())));

-- Immutable: nobody may update or delete log entries
CREATE POLICY "Activity logs cannot be updated"
ON public.activity_logs FOR UPDATE
USING (false);

CREATE POLICY "Activity logs cannot be deleted"
ON public.activity_logs FOR DELETE
USING (false);


-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE POLICY "View conversations"
ON public.conversations FOR SELECT
USING (public.can_access_conversation(id));

CREATE POLICY "Non-viewers can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.project_members pm
        WHERE pm.project_id = conversations.project_id
          AND pm.user_id    = (SELECT auth.uid())
          AND pm.role != 'viewer'
    )
);

CREATE POLICY "Managers can update conversations"
ON public.conversations FOR UPDATE
USING    (public.can_manage_conversation(id))
WITH CHECK (public.can_manage_conversation(id));

CREATE POLICY "Managers can delete conversations"
ON public.conversations FOR DELETE
USING (public.can_manage_conversation(id));


-- ============================================================
-- CONVERSATION MEMBERS
-- ============================================================

CREATE POLICY "View conversation members"
ON public.conversation_members FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Managers can add conversation members"
ON public.conversation_members FOR INSERT
WITH CHECK (public.can_manage_conversation(conversation_id));

CREATE POLICY "Users update own settings or managers update members"
ON public.conversation_members FOR UPDATE
USING (
    user_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
)
WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "Users can leave or managers can remove members"
ON public.conversation_members FOR DELETE
USING (
    user_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
);


-- ============================================================
-- MESSAGES
-- ============================================================

CREATE POLICY "View messages"
ON public.messages FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Post messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND public.can_post_to_conversation(conversation_id)
);

CREATE POLICY "Authors and managers can edit messages"
ON public.messages FOR UPDATE
USING (
    sender_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
)
WITH CHECK (
    sender_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
);

CREATE POLICY "Authors and managers can delete messages"
ON public.messages FOR DELETE
USING (
    sender_id = (SELECT auth.uid())
    OR public.can_manage_conversation(conversation_id)
);


-- ============================================================
-- MESSAGE ATTACHMENTS
-- ============================================================

CREATE POLICY "View message attachments"
ON public.message_attachments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Post message attachments"
ON public.message_attachments FOR INSERT
TO authenticated
WITH CHECK (
    uploaded_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_post_to_conversation(m.conversation_id)
    )
);

CREATE POLICY "Uploaders and managers can delete message attachments"
ON public.message_attachments FOR DELETE
USING (
    uploaded_by = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_attachments.message_id
          AND public.can_manage_conversation(m.conversation_id)
    )
);


-- ============================================================
-- MESSAGE READS
-- ============================================================

CREATE POLICY "View message reads"
ON public.message_reads FOR SELECT
USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_reads.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Insert own message reads"
ON public.message_reads FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_reads.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Update own message reads"
ON public.message_reads FOR UPDATE
USING    (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));


-- ============================================================
-- CONVERSATION TASK LINKS
-- ============================================================

CREATE POLICY "View conversation task links"
ON public.conversation_task_links FOR SELECT
USING (public.can_access_conversation(conversation_id));

CREATE POLICY "Posters can manage conversation task links"
ON public.conversation_task_links FOR ALL
USING    (public.can_post_to_conversation(conversation_id))
WITH CHECK (public.can_post_to_conversation(conversation_id));


-- ============================================================
-- MESSAGE TASK MENTIONS  (immutable audit)
-- ============================================================

CREATE POLICY "View task mentions"
ON public.message_task_mentions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_task_mentions.message_id
          AND public.can_access_conversation(m.conversation_id)
    )
);

CREATE POLICY "Posters can insert task mentions"
ON public.message_task_mentions FOR INSERT
TO authenticated
WITH CHECK (
    mentioned_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_task_mentions.message_id
          AND public.can_post_to_conversation(m.conversation_id)
    )
);

-- Immutable: task mention records cannot be modified after creation
CREATE POLICY "Task mentions cannot be updated"
ON public.message_task_mentions FOR UPDATE
USING (false);


-- ============================================================
-- MESSAGE REACTIONS
-- ============================================================

CREATE POLICY "View reactions"
ON public.message_reactions FOR SELECT
USING (
    public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_reactions.message_id)
    )
);

CREATE POLICY "Members can react to messages"
ON public.message_reactions FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_reactions.message_id)
    )
);

CREATE POLICY "Users can remove own reactions"
ON public.message_reactions FOR DELETE
USING (user_id = (SELECT auth.uid()));


-- ============================================================
-- MESSAGE USER MENTIONS  (immutable audit)
-- ============================================================

CREATE POLICY "View user mentions"
ON public.message_user_mentions FOR SELECT
USING (
    mentioned_user_id = (SELECT auth.uid())
    OR public.can_access_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_user_mentions.message_id)
    )
);

CREATE POLICY "Posters can insert user mentions"
ON public.message_user_mentions FOR INSERT
TO authenticated
WITH CHECK (
    mentioned_by = (SELECT auth.uid())
    AND public.can_post_to_conversation(
        (SELECT conversation_id FROM public.messages WHERE id = message_user_mentions.message_id)
    )
);

-- Immutable: user mention records cannot be modified after creation
CREATE POLICY "User mentions cannot be updated"
ON public.message_user_mentions FOR UPDATE
USING (false);
