# Flowva - Project Management System

Tài liệu hướng dẫn phát triển (Development Guide) cho dự án Flowva.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 (New Architecture)
- **Database:** PostgreSQL (via Supabase) with RLS
- **State Management:** Zustand
- **Realtime:** Supabase Realtime

---

## 🚀 Hướng Dẫn Cài Đặt (Setup)

### 1. Yêu cầu (Prerequisites)

- **Node.js**: Phiên bản 20 trở lên.
- **Git**: Đã cài đặt.
- **Docker**: (BẮT BUỘC để chạy Supabase Local). Cài đặt Docker Desktop và đảm bảo nó đang chạy.
- **Supabase CLI**: Cài đặt để quản lý database local.
  ```bash
  # Mac (Homebrew)
  brew install supabase/tap/supabase
  # Windows (Scoop)
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

### 2. Cài đặt Project

#### 🪟 Dành cho Windows

1. Clone repo về máy.
2. Tại thư mục gốc, click đúp vào file `install_project.bat` để chạy `npm install`.
3. Khởi động Supabase Local:
   ```bash
   supabase start
   ```
4. Copy file `.env.example` thành `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   _(Các giá trị trong .env.example đã được cấu hình sẵn cho môi trường local mặc định)._

#### 🍎/🐧 Dành cho Mac & Linux

Mở terminal tại thư mục dự án và chạy lần lượt:

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi động Supabase Local (Yêu cầu Docker đang chạy)
npx supabase start

# 3. Setup môi trường
cp .env.example .env.local
```

---

## 🛠 Quản Lý Supabase Local

Khi chạy `supabase start`, bạn sẽ có các công cụ sau:

- **Supabase Studio (Dashboard local):** [http://127.0.0.1:54323](http://127.0.0.1:54323)
  - Dùng để xem dữ liệu, quản lý bảng, Auth, Storage y hệt trên web.
- **API URL:** `http://127.0.0.1:54321`
- **DB URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Mailpit (Xem email gửi đi):** [http://127.0.0.1:54324](http://127.0.0.1:54324)

**Các lệnh hữu ích:**

- `npx supabase stop`: Dừng các service (nên chạy khi không làm việc nữa để tiết kiệm RAM).
- `npx supabase status`: Kiểm tra trạng thái và các link/key.
- `npx supabase db reset`: Xóa toàn bộ dữ liệu và chạy lại các file migration/seed từ đầu.

---

## 🏃‍♂️ Chạy Ứng Dụng

### Môi trường Development (Code)

Lệnh này sẽ bật server tại `http://localhost:3000` và tự động cập nhật khi sửa code.

**Windows:** Click đúp `run_dev.bat`.

**Mac/Linux:**

**Bash**

```
npm run dev
```

### Môi trường Production (Build thử)

Chạy lệnh này để kiểm tra xem project có build thành công không trước khi deploy.

**Bash**

```
npm run build
```

---

## 📂 Cấu Trúc Repo (Project Structure)

Dự án áp dụng kiến trúc **Supabase-Native Modular Monolith**, chia tách rõ ràng Frontend/Backend và quản lý theo Tính năng (Feature).

```
flowva/
├── .agent/                         # AI Agent Settings
├── supabase/                       # [IMPORTANT] Cấu hình Supabase CLI (Local Dev)
│   └── triggers.sql                # Các Database Triggers (Login trigger...)
│
├── src/                            # SOURCE CODE
│   ├── app/                        # NEXT.JS APP ROUTER
│   │   ├── (auth)/                 # Route Group: Auth (Login/Signup)
│   │   ├── (main)/                 # Route Group: App chính (Đã đăng nhập)
│   │   │   ├── dashboard/          # /dashboard
│   │   │   ├── chat/               # /chat
│   │   │   ├── calendar/           # /calendar
│   │   │   └── layout.tsx          # Main Layout (Sidebar + TopNav)
│   │   ├── projects/               # Route: Chọn dự án
│   │   │
│   │   ├── global.css              # [CORE] Tailwind CSS v4 Main Style
│   │   ├── layout.tsx              # Root Layout (Fonts, Metadata)
│   │   └── page.tsx                # Landing Page (Trang chủ)
│   │
│   ├── backend/                    # SERVER-SIDE LOGIC
│   │   ├── services/               # [CORE] Logic Business & Supabase Query
│   │   │   ├── auth.service.ts     # Dùng Supabase Client để query
│   │   │   └── task.service.ts
│   │   └── lib/
│   │       └── supabase/           # Cấu hình Supabase Client (SSR/Client/Admin)
│   │           ├── server.ts       # Create Server Client
│   │           └── client.ts       # Create Browser Client
│   │
│   ├── frontend/                   # CLIENT-SIDE UI
│   │   ├── features/               # [MODULAR] TÍNH NĂNG (Auth, Tasks, Dashboard...)
│   │   ├── components/             # UI dùng chung (Buttons, Modals)
│   │   └── lib/                    # Utils (cn, format...)
│   │
│   └── shared/                     # TYPES & CONTRACTS
│       ├── types/
│       │   ├── auth.ts             # App Types (CurrentUser...)
│       │   └── database.types.ts   # [AUTO-GEN] Types từ Supabase Database
│
├── public/                         # Static Assets (Images, Icons)
├── middleware.ts                   # Middleware (Bảo vệ Route bằng Supabase Auth)
├── next.config.ts
├── package.json
└── tsconfig.json
```

# 💡 Hướng Dẫn Code Nhanh (Mini Guide)

Khi nhận task mới, hãy tuân thủ quy tắc **"Supabase-Native Modular Monolith"** và **"Server Actions"**.

### 1. Khi sửa Database (Supabase)

Chúng ta không còn dùng `schema.prisma`. Mọi thay đổi DB thực hiện trực tiếp trên **Supabase Dashboard** hoặc qua **Migration SQL**.

Sau khi sửa DB, chạy lệnh sau để cập nhật Type cho Frontend/Backend:

```bash
# 1. Login (chỉ lần đầu)
supabase login

# 2. Cập nhật Type
supabase gen types typescript --project-id <project-id> > src/shared/types/database.types.ts
```

### 2. Khi viết Logic xử lý (Backend Service)

Luồng dữ liệu chuẩn: **Server Action** -> **Service** -> **Supabase Client**.

- **Bước 1 (Service):**
  - Import `createSupabaseServerClient` từ `@/backend/lib/supabase/server`.
  - Import `Database` type từ `@/shared/types/database.types`.
  - Viết hàm query dùng `supabase-js`:
    ```typescript
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('Task').select('*');
    ```
- **Bước 2 (Server Action):**
  - Gọi Service như bình thường.
  - Xử lý `revalidatePath` hoặc `redirect`.

### 4. Quy tắc đặt tên (Naming Convention) 🚨

- **Component:** PascalCase (VD: `TaskCard.tsx`, `ConfirmModal.tsx`)
- **Hook:** camelCase, bắt đầu bằng `use` (VD: `useTaskFilter.ts`)
- **Types/DTO:** PascalCase, không dùng prefix I (VD: `TaskDTO`, `CreateTaskRequest`) - _Tránh dùng `ITask`_ .
- **Phân biệt File Logic (Rất quan trọng):**
  - Frontend gọi API: `[tên].api.ts` (VD: `task.api.ts`)
  - Backend xử lý: `[tên].service.ts` (VD: `task.service.ts`)

### 5. GIT WORKFLOW & VERSION CONTROL

Để lịch sử code sạch đẹp và không bị conflict khi merge, team tuân thủ quy tắc sau:

#### A. Quy tắc đặt tên nhánh (Branch Naming)

Công thức: `[loại]/[tên-ngắn-gọn]`

- **Quy tắc:** Viết thường toàn bộ, dùng gạch nối `-` thay cho khoảng trắng, không dấu tiếng Việt.

| **Loại nhánh**  | **Ý nghĩa**                  | **Ví dụ**                                  |
| --------------- | ---------------------------- | ------------------------------------------ |
| **`feat/`**     | Tính năng mới                | `feat/create-task-api`,`feat/login-ui`     |
| **`fix/`**      | Sửa lỗi (Bug)                | `fix/header-alignment`,`fix/api-error-500` |
| **`chore/`**    | Việc lặt vặt (Config, Setup) | `chore/setup-prisma`,`chore/update-readme` |
| **`refactor/`** | Viết lại code cho sạch       | `refactor/task-service`                    |

#### B. Quy tắc viết Commit (Conventional Commits)

Tuyệt đối không commit kiểu: _"fix"_ , _"update"_ , _"code xong roi"_ .

Công thức: **`[Type]([Scope]): [Nội dung ngắn gọn]`**

- `fix`: Sửa lỗi.
- `ui`: Chỉ chỉnh sửa CSS, giao diện (không dính logic).
- `refactor`: Sửa code nhưng không đổi tính năng.
- `chore`: Việc vặt (cập nhật dependency, config).

**2. Scope (Phạm vi - Nơi bạn sửa code):**

- `fe`: Frontend (`src/frontend`, `app/dashboard`...)
- `be`: Backend (`src/backend`, `app/api`...)
- `db`: Database (`prisma/schema`)
- `shared`: File dùng chung (`src/shared`)
- `auth`, `task`: (Hoặc tên Feature cụ thể nếu commit chỉ sửa 1 feature)

**3. Ví dụ Chuẩn (Copy mà học theo):**

- ✅ **Làm Backend:**
  `feat(be): add create task service and api`
- ✅ **Làm Frontend:**
  `feat(fe): integrate create task api to UI`
- ✅ **Sửa Database:**
  `chore(db): add status column to Task table`
- ✅ **Sửa giao diện:**
  `ui(fe): update dark mode colors for TaskCard`
- ✅ **Sửa Hợp đồng:**
  `refactor(shared): update TaskDTO interface`

---

### 💡 Mẹo nhỏ (Tips)

- **Trước khi tạo nhánh mới:** Luôn `git checkout main` và `git pull` để lấy code mới nhất về.
- **Trước khi Commit:** Hãy tự review lại xem mình có lỡ để quên `console.log` hay file rác không.

_Happy Coding! 🚀_
