---
name: flowva-git
description: Quy tắc đặt tên Commit và Branch của dự án. Dùng khi người dùng yêu cầu "tạo commit", "viết message commit".
---

# Git Convention

## 1. Format Commit
`type(scope): description`

- **Types:**
  - `feat`: Tính năng mới.
  - `fix`: Sửa lỗi.
  - `refactor`: Sửa code nhưng không đổi tính năng (VD: chuyển từ API sang Server Action).
  - `chore`: Config, setup, linh tinh.
  - `ui`: Chỉ sửa CSS/Giao diện.

- **Scopes:**
  - `fe`: Frontend (Components, Hooks).
  - `be`: Backend (Services, Prisma).
  - `db`: Database schema.
  - `task`, `auth`: Tên feature cụ thể.

## 2. Ví dụ chuẩn
- ✅ `feat(task): add create task server action`
- ✅ `fix(be): handle null user in auth service`
- ✅ `ui(fe): update task card shadow style`
- ❌ `update code`, `fix bug`, `add api` (Cấm tiệt!)