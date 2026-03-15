-- ============================================================
-- FLOWVA INDEXES v1 (Consolidated)
-- Generated: 2026-03-15
-- Depends on: 20260315000000_flowva_schema.sql
-- ============================================================
-- All indexes use CREATE INDEX IF NOT EXISTS for idempotency.
-- Sections:
--   1. Project & membership indexes
--   2. Task indexes
--   3. Sprint indexes
--   4. Activity log indexes
--   5. User profile indexes
--   6. Chat indexes
-- ============================================================
-- Best practices applied (supabase-postgres-best-practices):
--   • schema-foreign-key-indexes: Postgres does NOT auto-create indexes
--     for foreign keys. Every FK column that appears in JOIN or WHERE
--     clauses needs an explicit index.
--   • query-composite-indexes: Equality columns first, range columns last.
--     Column order follows the most common query patterns.
--   • query-partial-indexes: WHERE clause indexes for sparse data
--     (e.g. column_id IS NOT NULL, status = 'active').
--   • security-rls-performance: RLS helper functions query project_members
--     by (user_id, project_id, role) — composite index covers all three.
-- ============================================================


-- ============================================================
-- 1. PROJECTS & MEMBERSHIP
-- ============================================================

-- RLS helpers (is_admin_or_owner, is_project_member) filter by (user_id, project_id, role).
-- Composite covers all three columns in one scan; ordering: equality cols first.
CREATE INDEX IF NOT EXISTS idx_project_members_user_project_role
    ON public.project_members(user_id, project_id, role);

-- ON DELETE CASCADE on boards → project_members needs FK index for cascade walk
CREATE INDEX IF NOT EXISTS idx_boards_project_id
    ON public.boards(project_id);

-- ON DELETE CASCADE on board_columns → boards
CREATE INDEX IF NOT EXISTS idx_board_columns_board_id
    ON public.board_columns(board_id);


-- ============================================================
-- 2. TASKS
-- ============================================================

-- project_id: primary filter for dashboard, backlog, and RLS policies
CREATE INDEX IF NOT EXISTS idx_tasks_project_id
    ON public.tasks(project_id);

-- Kanban board view: tasks for a project grouped by column
-- Partial: column_id IS NOT NULL (backlog tasks excluded — they have no column)
CREATE INDEX IF NOT EXISTS idx_tasks_project_column
    ON public.tasks(project_id, column_id)
    WHERE column_id IS NOT NULL;

-- Separate partial index for column_id FK (ON DELETE SET NULL cascade scan)
CREATE INDEX IF NOT EXISTS idx_tasks_column_id
    ON public.tasks(column_id)
    WHERE column_id IS NOT NULL;

-- Sprint backlog queries: tasks per sprint
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_id
    ON public.tasks(sprint_id)
    WHERE sprint_id IS NOT NULL;

-- Dashboard: tasks approaching due date (equality on project_id, range on due_date)
CREATE INDEX IF NOT EXISTS idx_tasks_project_due_date
    ON public.tasks(project_id, due_date)
    WHERE due_date IS NOT NULL;

-- ON DELETE CASCADE task → task sub-tables
CREATE INDEX IF NOT EXISTS idx_tasks_created_by
    ON public.tasks(created_by);

-- Task Comments
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id
    ON public.task_comments(task_id);

CREATE INDEX IF NOT EXISTS idx_task_comments_user_id
    ON public.task_comments(user_id);

-- Task Assignees
CREATE INDEX IF NOT EXISTS idx_task_assignees_user_id
    ON public.task_assignees(user_id);

-- Task Checklist Items
CREATE INDEX IF NOT EXISTS idx_task_checklist_items_task_id
    ON public.task_checklist_items(task_id);

-- Task Attachments
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id
    ON public.task_attachments(task_id);

CREATE INDEX IF NOT EXISTS idx_task_attachments_uploaded_by
    ON public.task_attachments(uploaded_by);


-- ============================================================
-- 3. SPRINTS
-- ============================================================

-- Sprints per project (list view, RLS)
CREATE INDEX IF NOT EXISTS idx_sprints_project_id
    ON public.sprints(project_id);

-- Active sprint lookup: used by dashboard to find current sprint
-- Partial index on the hot path (only 'active' rows indexed)
CREATE INDEX IF NOT EXISTS idx_sprints_active
    ON public.sprints(project_id, start_date, end_date)
    WHERE status = 'active';


-- ============================================================
-- 4. ACTIVITY LOGS
-- ============================================================

-- Activity feed ordered by time — equality on project_id, range on created_at
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_created
    ON public.activity_logs(project_id, created_at DESC);


-- ============================================================
-- 5. USER PROFILES
-- ============================================================

-- User search by display name
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name
    ON public.user_profiles(display_name);


-- ============================================================
-- 6. CHAT
-- ============================================================

-- -- Conversations --

-- RLS and listing conversations for a project
CREATE INDEX IF NOT EXISTS idx_conversations_project_id
    ON public.conversations(project_id);

-- Related task FK (ON DELETE SET NULL)
CREATE INDEX IF NOT EXISTS idx_conversations_related_task_id
    ON public.conversations(related_task_id);

-- Inbox ordering: most recently active conversations first
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
    ON public.conversations(last_message_at DESC NULLS LAST);

-- Enforce: at most one 'task' conversation per task
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_task_conversation
    ON public.conversations(related_task_id)
    WHERE type = 'task' AND related_task_id IS NOT NULL;

-- -- Conversation Members --

-- Find all conversations a user is a member of (inbox query)
CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id
    ON public.conversation_members(user_id);

-- -- Messages --

-- Message timeline: paginate messages within a conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sent_at
    ON public.messages(conversation_id, sent_at DESC);

-- ON DELETE SET NULL on messages.sender_id
CREATE INDEX IF NOT EXISTS idx_messages_sender_id
    ON public.messages(sender_id);

-- -- Message Reads --

-- Find all messages read by a user
CREATE INDEX IF NOT EXISTS idx_message_reads_user_id
    ON public.message_reads(user_id);

-- -- Conversation Task Links --

-- Reverse lookup: find conversations linked to a task
CREATE INDEX IF NOT EXISTS idx_conversation_task_links_task_id
    ON public.conversation_task_links(task_id);

-- Enforce: at most one primary link per conversation
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_task_link_per_conversation
    ON public.conversation_task_links(conversation_id)
    WHERE is_primary = true;

-- -- Message Task Mentions --

-- Reverse lookup: find messages that mention a task
CREATE INDEX IF NOT EXISTS idx_message_task_mentions_task_id
    ON public.message_task_mentions(task_id);

-- -- Message Reactions --

-- All reactions on a message (aggregation for emoji counts)
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id
    ON public.message_reactions(message_id);

-- All reactions by a user (profile/activity view)
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id
    ON public.message_reactions(user_id);

-- -- Message User Mentions --

-- Notification feed: all @mentions of a user, newest first
CREATE INDEX IF NOT EXISTS idx_message_user_mentions_user
    ON public.message_user_mentions(mentioned_user_id, created_at DESC);

-- Reverse lookup: all @mentions in a message
CREATE INDEX IF NOT EXISTS idx_message_user_mentions_message
    ON public.message_user_mentions(message_id);
