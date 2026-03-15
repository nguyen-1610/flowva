# Phase 2: Migration Consolidation — Status Report
**From**: database-agent
**To**: spec-lead (review & approve)
**Date**: 2026-03-15
**Status**: ⏸️ AWAITING LEAD APPROVAL (before deleting old files)

---

## What Was Done

Đọc toàn bộ 12 migration files từ Phase 0-1, tổng hợp lại thành **3 file migration sạch** để team dễ đọc và maintain. Old files **chưa bị xóa** — đang chờ lead approve.

---

## 3 File Mới (trong `supabase/migrations/`)

### 1. `20260315000000_flowva_schema.sql`
> Core schema: ENUMs, tables, functions, triggers, enable RLS

**Nội dung:**
- 8 ENUMs (project_role, task_priority, sprint_status, và 4 chat enums)
- **22 tables** theo thứ tự FK dependency (không bị lỗi reference)
- **Helper functions** (SECURITY DEFINER, SET search_path = '') — final version sau tất cả fixes
- **11 triggers** (new user → profile, new project → member, task move → activity log, chat triggers…)
- Xử lý circular FK: conversations ↔ messages bằng `ALTER TABLE ADD COLUMN` sau

**Thay đổi quan trọng so với Phase 0-1:**
- Tất cả columns dùng `TEXT` thay `VARCHAR` (theo `schema-data-types` best practice)
- Tất cả timestamps dùng `TIMESTAMPTZ` (không phải `TIMESTAMP`)
- `tasks.column_id` là nullable với `ON DELETE SET NULL` (task về backlog khi xóa column)
- `tasks.project_id` denormalized (thêm từ Phase 1 refactor)
- `sprints.status` là ENUM `sprint_status` (không phải `VARCHAR`)
- **Không có** trigger `set_project_owner_id` (đã remove trong Phase 1)

---

### 2. `20260315000001_flowva_rls.sql`
> RLS policies: toàn bộ 21 tables, consolidated và complete

**Nội dung:**
- **21 tables** đều có đủ policies (SELECT/INSERT/UPDATE/DELETE)
- **Fix Phase 1 được tích hợp**: `(SELECT auth.uid())` thay vì `auth.uid()` (5-10x faster)
- **Fix RLS recursion**: `is_project_member_bypass()` cho project_members SELECT
- **Fix project INSERT**: owner_id = (SELECT auth.uid()) với TO authenticated
- **Fix project_members INSERT**: cho phép trigger insert owner lúc project mới tạo
- `activity_logs` và `message_task_mentions`: immutable (UPDATE/DELETE USING false)

**Tables được bổ sung policies lần đầu** (chưa có trong old migrations):
- `boards` — 4 policies (SELECT/INSERT/UPDATE/DELETE)
- `board_columns` — 4 policies
- `sprints` — 4 policies (đã có partial, nay complete)
- `task_comments` — 4 policies
- `task_assignees` — 3 policies
- `task_checklist_items` — 4 policies
- `task_attachments` — 3 policies

**Tasks policy đơn giản hóa:**
- Old (Phase 0): join qua `board_columns → boards → project_members` (chậm, phức tạp)
- New: join thẳng `tasks.project_id → project_members` (task đã có project_id sau refactor)

---

### 3. `20260315000002_flowva_indexes.sql`
> Tất cả indexes, consolidated

**Tổng cộng:** ~28 indexes

**Bao gồm từ tất cả migrations cũ:**
- FK indexes (Phase 1 critical indexes): boards, board_columns, tasks, task_comments, task_assignees, task_checklist_items, task_attachments
- Chat indexes (Phase 0 chat schema): conversations, conversation_members, messages, message_reads, conversation_task_links, message_task_mentions, message_reactions, message_user_mentions
- Performance indexes (Phase 1 fix & enhance): project_members composite, tasks project+due_date, activity_logs project+created_at, sprints active partial
- **Thêm mới**: `idx_tasks_project_id` (standalone, cho backlog queries)

---

## 12 Files Cũ (CHƯA XÓA)

```
20260226163545_init_flowva_schema.sql
20260226164620_setup_full_rls_policies.sql
20260228183449_refactor_tasks_and_add_features.sql
20260310110000_add_chat_schema.sql
20260310140000_fix_and_enhance_schema.sql
20260310200000_fix_rls_recursion.sql
20260310183000_set_project_owner_id.sql
20260314100000_add_critical_indexes.sql
20260314170756_fix_project_insert_rls.sql
20260314171334_fix_project_members_insert_policy.sql
20260314172218_force_fix_project_insert.sql
20260314172736_remove_set_owner_id_trigger.sql
```

---

## Checklist cho Lead Review

Trước khi approve xóa old files, lead vui lòng verify:

- [ ] **Schema file**: Tất cả 22 tables đều có trong file mới?
- [ ] **Schema file**: Circular FK (conversations ↔ messages) xử lý đúng chưa?
- [ ] **RLS file**: Phase 1 bug fixes đã được tích hợp chưa? (projects INSERT, project_members INSERT)
- [ ] **RLS file**: Boards/board_columns/task sub-tables có đủ policies chưa (đây là additions so với cũ)?
- [ ] **Indexes file**: Tất cả indexes từ old migrations đều có trong file mới?
- [ ] **General**: 3 file mới có đủ để `supabase db reset` tạo ra schema hoạt động y chang hiện tại không?

---

## Sau Khi Approve

1. Xóa 12 file cũ
2. Test với `supabase db reset` (local)
3. Verify với `supabase migration list`
4. Report to spec-lead → update `shared/2-report.md`

---

## Rủi Ro Cần Lưu Ý

- **db reset bắt buộc**: 3 file mới không thể apply incremental lên DB hiện có (vì DROP/CREATE conflict). Team cần chạy `supabase db reset` sau khi xóa old files.
- **Boards/board_columns policies mới**: Nếu app đang bypass RLS (dùng service role) cho boards thì policies mới này sẽ restrict client-side access. Cần verify với backend-agent rằng boards/columns queries có đi qua service role không.
