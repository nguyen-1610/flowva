# Flowva — Project Management System

Tài liệu hướng dẫn phát triển (Development Guide) cho dự án Flowva.

> Kiến trúc hệ thống xem tại [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🛠 Tech Stack

| Lớp       | Công nghệ                     |
| --------- | ----------------------------- |
| Framework | Next.js 16 (App Router)       |
| Language  | TypeScript 5                  |
| Styling   | Tailwind CSS v4               |
| Database  | PostgreSQL (Supabase) với RLS |
| Auth      | Supabase Auth                 |
| Realtime  | Supabase Realtime             |
| State     | Zustand (UI state only)       |

---

## 🚀 Cài Đặt Project

### Yêu cầu (Prerequisites)

- **Node.js** v20+
- **Docker Desktop** đang chạy (bắt buộc cho Supabase Local)
- **Supabase CLI**:

  ```bash
  # Mac
  brew install supabase/tap/supabase

  # Windows (Scoop)
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

### Các bước cài đặt

```bash
# 1. Cài thư viện
npm install

# 2. Setup môi trường
cp .env.example .env.local

# 3. Khởi động Supabase Local (Docker phải đang chạy)
npx supabase start

# 4. Chạy ứng dụng
npm run dev
```

Truy cập app tại: [http://localhost:3000](http://localhost:3000)

---

## 🗄 Quản Lý Supabase Local

### Khởi động / Dừng

```bash
# Khởi động (yêu cầu Docker)
npx supabase start

# Dừng (nên chạy khi không làm việc để tiết kiệm RAM)
npx supabase stop

# Kiểm tra trạng thái, xem URL và API keys
npx supabase status
```

Khi đang chạy, các công cụ local có sẵn:

| Tool                     | URL                                                     |
| ------------------------ | ------------------------------------------------------- |
| Studio (Dashboard local) | http://127.0.0.1:54323                                  |
| API                      | http://127.0.0.1:54321                                  |
| Database                 | postgresql://postgres:postgres@127.0.0.1:54322/postgres |
| Mailpit (Xem email test) | http://127.0.0.1:54324                                  |

---

### Migration (Quản lý Schema DB)

Toàn bộ thay đổi schema đều thực hiện qua **Migration Files** trong `supabase/migrations/`. **Không sửa DB trực tiếp trên Dashboard** vì không được version control.

```bash
# Tạo file migration mới (đặt tên theo snake_case)
npx supabase migration new ten_migration_cua_ban
# → Tạo file: supabase/migrations/<timestamp>_ten_migration_cua_ban.sql

# Apply migration lên DB local
npx supabase migration up

# Xem danh sách migration và trạng thái (local / remote)
npx supabase migration list

# Reset DB local — xóa toàn bộ data, chạy lại tất cả migration từ đầu
npx supabase db reset
```

---

### Push lên Cloud (Production)

```bash
# Lần đầu: Login và link project
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>

# Push migration lên cloud
npx supabase db push

# Nếu migration bị fail giữa chừng, repair trạng thái rồi push lại
npx supabase migration repair --status reverted <timestamp>
npx supabase db push
```

> Project ref là chuỗi ký tự trong URL Supabase dashboard:
> `https://supabase.com/dashboard/project/<project-ref>`

---

### Cập nhật TypeScript Types

Sau mỗi lần thay đổi schema, **bắt buộc** phải regenerate types để TypeScript nhận biết các thay đổi:

```bash
# Generate từ DB local (khuyên dùng khi đang develop)
npm run gen-types

# Generate từ project cloud (nếu không chạy local)
npx supabase gen types typescript --project-id <project-id> > src/shared/types/database.types.ts
```

---

## 🏃 Chạy Ứng Dụng

```bash
# Development — tự động reload khi sửa code
npm run dev

# Build Production — kiểm tra trước khi deploy
npm run build

# Format code
npm run format
```

---

## 💡 Hướng Dẫn Code Nhanh

### Luồng dữ liệu chuẩn

```
Client Event → Server Action (actions.ts) → Service (*.service.ts) → Supabase Client → DB
```

### Khi thêm tính năng mới

1. **DB thay đổi?** → Tạo migration SQL, apply local, rồi `npm run gen-types`
2. **Service** (`src/backend/services/[name].service.ts`): Viết business logic & query Supabase
3. **Server Action** (`src/frontend/features/[name]/actions.ts`): Gọi Service, xử lý `revalidatePath`
4. **UI Component** (`src/frontend/features/[name]/components/`): Gọi Server Action từ form/event

### Quy tắc đặt tên (Naming Convention)

| Loại               | Convention                        | Ví dụ                              |
| ------------------ | --------------------------------- | ---------------------------------- |
| Component          | PascalCase                        | `TaskCard.tsx`, `ConfirmModal.tsx` |
| Hook               | camelCase + `use` prefix          | `useTaskFilter.ts`                 |
| Service            | `[name].service.ts`               | `task.service.ts`                  |
| Type/DTO           | PascalCase, không prefix `I`      | `TaskDTO`, `CreateTaskRequest`     |
| Server Action file | `actions.ts` trong feature folder | `features/tasks/actions.ts`        |

---

## 🌿 Git Workflow

### Quy tắc đặt tên nhánh

Công thức: `[loại]/[tên-ngắn-gọn]` — viết thường, dùng `-` thay khoảng trắng, không dấu.

| Loại        | Ý nghĩa                             | Ví dụ                   |
| ----------- | ----------------------------------- | ----------------------- |
| `feat/`     | Tính năng mới                       | `feat/create-task-api`  |
| `fix/`      | Sửa lỗi                             | `fix/api-error-500`     |
| `chore/`    | Config, setup, docs                 | `chore/update-readme`   |
| `refactor/` | Cải thiện code, không đổi tính năng | `refactor/task-service` |

### Quy tắc viết Commit (Conventional Commits)

Công thức: **`[type]([scope]): [nội dung ngắn gọn]`**

**Types:** `feat` · `fix` · `ui` · `refactor` · `chore`

**Scopes:** `fe` · `be` · `db` · `shared` · hoặc tên feature (`auth`, `task`...)

**Ví dụ chuẩn:**

```
feat(be): add create task service
feat(fe): integrate create task form
chore(db): add sprint_id column to tasks
ui(fe): update dark mode colors for TaskCard
refactor(shared): update TaskDTO interface
```

### Tips

- **Trước khi tạo nhánh mới:** Luôn `git checkout main && git pull`
- **Trước khi commit:** Kiểm tra không còn `console.log` hay file rác

---

_Happy Coding! 🚀_
