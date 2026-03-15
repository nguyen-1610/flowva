---
name: flowva-architecture
description: Cấu trúc dự án Flowva (Next.js 16 + Supabase Modular Monolith). Sử dụng khi tạo file mới, refactor code hoặc tìm kiếm file.
---

# Quy tắc Kiến trúc Flowva

Dự án tuân thủ nghiêm ngặt cấu trúc **Supabase-Native Modular Monolith**. Mọi code phải nằm trong `src/`.

## 1. Bản đồ thư mục (Directory Map)

### `src/app/` - Next.js App Router
- **Chỉ chứa**: Routing (Page, Layout) và Global Styles (`global.css`)
- **TUYỆT ĐỐI KHÔNG** chứa logic nghiệp vụ phức tạp
- **TUYỆT ĐỐI KHÔNG** tạo `api/` routes (dùng Server Actions thay thế)
- Route groups: `(auth)/`, `(main)/`

### `src/backend/` - Server-side Only
- **`services/`**: Chứa toàn bộ Business Logic và Supabase queries
  - Format: `[name].service.ts` (VD: `task.service.ts`)
  - **KHÔNG BAO GIỜ** import vào Client Component
- **`lib/supabase/`**: Supabase Client initialization
  - `server.ts` - Server-side client (cookies-based)
  - `client.ts` - Browser client
  - `admin.ts` - Admin client (service role)

### `src/frontend/` - Client-side UI
- **`features/[feature-name]/`**: Code UI theo tính năng
  - `components/` - React Components
  - `actions.ts` - Server Actions (thay thế API routes)
  - `hooks/` - Custom Hooks
  - `stores/` - Zustand State (UI state only, không lưu server data)
- **`components/`**: Shared UI components (Button, Modal, Input...)
- **`lib/`**: Client utilities (cn, format, hooks...)

### `src/shared/` - Contracts
- **`types/`**: TypeScript types & DTOs
  - `database.types.ts` - **[AUTO-GEN]** từ Supabase schema
  - Các types khác - App-level types (Task, User, Sprint...)

### `supabase/` - Database Management
- **`migrations/`**: **[QUAN TRỌNG]** Lịch sử thay đổi schema (SQL files)
  - **KHÔNG BAO GIỜ** sửa DB trực tiếp trên Dashboard
  - Mọi thay đổi schema phải qua migration files
- **`snippets/`**: SQL utilities (seed data, helper queries)

## 2. Quy tắc đặt file mới

| Loại file | Đặt ở đâu |
|-----------|-----------|
| UI Component dùng chung | `src/frontend/components/` |
| UI Component riêng feature | `src/frontend/features/[name]/components/` |
| Server Action | `src/frontend/features/[name]/actions.ts` |
| Business Logic + Supabase queries | `src/backend/services/[name].service.ts` |
| Types/DTOs | `src/shared/types/[name].ts` |
| Database schema change | `supabase/migrations/` (tạo bằng `npx supabase migration new`) |

## 3. Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Supabase) với RLS
- **Auth**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Styling**: Tailwind CSS v4
- **State**: Zustand (UI state only)
- **Validation**: Zod

## 4. Critical Rules

### Security
- **2-layer security**: Service Layer (application) + RLS (database)
- **KHÔNG BAO GIỜ** gọi Supabase trực tiếp từ `actions.ts` - phải qua Service
- **LUÔN LUÔN** enable RLS cho mọi table

### Database
- **Mọi thay đổi schema** qua migration files
- **Sau mỗi migration**: Chạy `npm run gen-types` để update TypeScript types
- **KHÔNG** sửa DB trực tiếp trên Supabase Dashboard

### Data Flow
```
User Interaction
  → Form/Event Handler (Client)
  → Server Action (actions.ts)
  → Service Layer (business logic + auth check)
  → Supabase Client (query DB)
  → PostgreSQL (RLS validate)
  → revalidatePath / response về UI
```
