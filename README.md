# Flowva - Project Management System

Tài liệu hướng dẫn phát triển (Development Guide) cho dự án Flowva.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 (New Architecture)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **State Management:** Zustand
- **Realtime:** Supabase Realtime

---

## 🚀 Hướng Dẫn Cài Đặt (Setup)

### 1. Yêu cầu (Prerequisites)

- **Node.js**: Phiên bản 20 trở lên.
- **Git**: Đã cài đặt.

### 2. Cài đặt Project

#### 🪟 Dành cho Windows

1. Clone repo về máy.
2. Tại thư mục gốc, click đúp vào file `install_project.bat`.
   - Script sẽ tự động chạy `npm install`.
   - Tự động chạy `npx prisma generate` để khởi tạo database client.
3. Tạo file `.env` (copy từ `.env.example` nếu có) và điền `DATABASE_URL` của Supabase.

#### 🍎/🐧 Dành cho Mac & Linux

Mở terminal tại thư mục dự án và chạy lần lượt:

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi tạo Prisma Client (Bắt buộc để tránh lỗi DB)
npx prisma generate

# 3. Setup môi trường (Tự tạo file .env và điền connection string)
cp .env.example .env
```

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

Dự án áp dụng kiến trúc **Modular Monolith** , chia tách rõ ràng Frontend/Backend và quản lý theo Tính năng (Feature).

**Plaintext**

```
flowva/
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md    # Template PR
│
├── app/                            # NEXT.JS APP ROUTER (Routing & Entry Points)
│   ├── (auth)/                     # Group Route: Login/Register
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                # Group Route: App chính (Sidebar)
│   │   ├── layout.tsx              # Chứa Sidebar & Header
│   │   ├── tasks/page.tsx          # Trang Task
│   │   └── projects/page.tsx       # Trang Project
│   │
│   ├── api/                        # BACKEND ENTRY POINT (Route Handlers)
│   │   ├── auth/                   # (Optional) Nếu cần custom auth logic
│   │   ├── tasks/
│   │   │   └── route.ts            # [QUAN TRỌNG] Route + Controller (Validate & Gọi Service)
│   │   └── projects/
│   │       └── route.ts
│   |
│   ├── layout.tsx              <-- [BẮT BUỘC] Root Layout (Chứa html, body)
|   ├── page.tsx                <-- [BẮT BUỘC] Landing Page (Giới thiệu Flowva)
│   └── globals.css                 # Tailwind v4 Config (@theme)
│
├── src/
│   ├── backend/                    # SERVER-SIDE LOGIC (Chỉ chạy trên Server)
│   │   ├── services/               # [QUAN TRỌNG] LOGIC NGHIỆP VỤ & DB CALL
│   │   │   ├── task.service.ts     # Chứa hàm: createTask, getTasks...
│   │   │   └── user.service.ts
│   │   └── lib/                    # Cấu hình Server
│   │       ├── prisma.ts           # Prisma Client Instance
│   │       └── supabase.ts         # Supabase Admin Client (nếu cần)
│   │
│   ├── frontend/                   # CLIENT-SIDE LOGIC (React)
│   │   ├── components/             # UI Dùng chung (Button, Input, Modal)
│   │   ├── lib/                    # Cấu hình Client
│   │   │   ├── axios.ts            # Axios Instance (Gắn sẵn Base URL)
│   │   │   └── utils.ts            # Hàm tiện ích (cn, formatDate)
│   │   ├── hooks/                  # Hooks dùng chung (useDebounce, useToggle)
│   │   ├── providers/              # Context (AuthProvider, ThemeProvider)
│   │   │
│   │   └── features/               # [MODULAR] TÍNH NĂNG
│   │       ├── auth/               # Module Auth
│   │       │   ├── components/     # LoginForm, RegisterForm
│   │       │   └── hooks/          # useAuth.ts (Gọi Supabase trực tiếp)
│   │       │
│   │       |── tasks/              # Module Task
│   │           ├── components/     # TaskCard, TaskColumn, CreateTaskModal
│   │           ├── hooks/          # useTasks.ts, useDragDrop.ts
│   │           |── services/       # task.api.ts (Gọi axios sang /api/tasks)
|   | 		├── stores/              # State Management (Zustand)
│   |		|   └── task-ui.store.ts # Quản lý viewMode, filter...
|   | 		└── types/               # Local Types definition
|   | 		    └── index.ts         # Props, UI Interfaces
│   │
│   │
│   └── shared/                     # CONTRACT (Dùng chung FE & BE)
│       ├── types/
│           ├── common.ts           # ApiResponse, Pagination
│           ├── tasks.ts            # TaskDTO, CreateTaskRequest
│
├── prisma/
│   └── schema.prisma               # Database Schema
│
├── public/                         # Static Assets
├── middleware.ts                   # [QUAN TRỌNG] Next.js Middleware (Check Cookie Auth)
├── .env.local                      # Biến môi trường
├── package.json
└── tsconfig.json
```

# 💡 Hướng Dẫn Code Nhanh (Mini Guide)

Khi nhận task mới, hãy tuân thủ quy tắc **"Modular Monolith"** (Tính năng nào, ở nhà đó).

### 1. Khi tạo UI Component & State (Frontend)

- **Case A: Nút bấm, Input, Modal dùng chung cả App?**
  👉 Tạo vào: `src/frontend/components/`
- **Case B: Card Task, Form trong tính năng Project (Chỉ dùng cho 1 tính năng)?**
  👉 Tạo vào: `src/frontend/features/[tên-feature]/components/`
- **Case C: State quản lý giao diện (Zustand) hoặc Types nội bộ?**
  👉 Tạo vào: `src/frontend/features/[tên-feature]/stores/` hoặc `types/`

### 2. Khi viết Logic xử lý (Backend)

Luồng dữ liệu chuẩn: **Route Handler** (kiêm Controller) -> **Service** -> **Database** .

- **Bước 1 (The Contract):** Cập nhật file `src/shared/types/...` để thống nhất dữ liệu vào/ra.
- **Bước 2 (Service - Bếp trưởng):** Viết logic nghiệp vụ & gọi Prisma trong `src/backend/services/[tên].service.ts`.
- **Bước 3 (Route - Lễ tân):**
  - Tạo file `app/api/[tên-resource]/route.ts`.
  - Tại đây: Nhận Request -> Validate dữ liệu -> Gọi Service ở bước 2 -> Trả Response.
  - _Lưu ý:_ **KHÔNG** tạo thư mục `controllers` riêng nữa.

### 3. Khi sửa Database (Prisma)

- **Bước 1:** Sửa file `prisma/schema.prisma`.
- **Bước 2:** Đẩy lên DB (Cập nhật bảng):
  **Bash**

  ```
  npx prisma db push
  ```
- **Bước 3 (BẮT BUỘC):** Chạy lệnh tạo lại code Prisma Client:
  **Bash**

  ```
  npx prisma generate
  ```

  _(Không chạy lệnh này là VS Code không gợi ý code mới đâu!)_

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

* **Quy tắc:** Viết thường toàn bộ, dùng gạch nối `-` thay cho khoảng trắng, không dấu tiếng Việt.

| **Loại nhánh**  | **Ý nghĩa**             | **Ví dụ**                              |
| ----------------------- | ------------------------------- | ---------------------------------------------- |
| **`feat/`**     | Tính năng mới                | `feat/create-task-api`,`feat/login-ui`     |
| **`fix/`**      | Sửa lỗi (Bug)                 | `fix/header-alignment`,`fix/api-error-500` |
| **`chore/`**    | Việc lặt vặt (Config, Setup) | `chore/setup-prisma`,`chore/update-readme` |
| **`refactor/`** | Viết lại code cho sạch       | `refactor/task-service`                      |

#### B. Quy tắc viết Commit (Conventional Commits)

Tuyệt đối không commit kiểu:  *"fix"* ,  *"update"* ,  *"code xong roi"* .

Công thức: **`[Type]([Scope]): [Nội dung ngắn gọn]`**

**1. Type (Loại thay đổi):**

* `feat`: Tính năng mới.
* `fix`: Sửa lỗi.
* `ui`: Chỉ chỉnh sửa CSS, giao diện (không dính logic).
* `refactor`: Sửa code nhưng không đổi tính năng.
* `chore`: Việc vặt (cập nhật dependency, config).

**2. Scope (Phạm vi - Nơi bạn sửa code):**

* `fe`: Frontend (`src/frontend`, `app/dashboard`...)
* `be`: Backend (`src/backend`, `app/api`...)
* `db`: Database (`prisma/schema`)
* `shared`: File dùng chung (`src/shared`)
* `auth`, `task`: (Hoặc tên Feature cụ thể nếu commit chỉ sửa 1 feature)

**3. Ví dụ Chuẩn (Copy mà học theo):**

* ✅ **Làm Backend:**
  `feat(be): add create task service and api`
* ✅ **Làm Frontend:**
  `feat(fe): integrate create task api to UI`
* ✅ **Sửa Database:**
  `chore(db): add status column to Task table`
* ✅ **Sửa giao diện:**
  `ui(fe): update dark mode colors for TaskCard`
* ✅ **Sửa Hợp đồng:**
  `refactor(shared): update TaskDTO interface`

---

### 💡 Mẹo nhỏ (Tips)

* **Trước khi tạo nhánh mới:** Luôn `git checkout main` và `git pull` để lấy code mới nhất về.
* **Trước khi Commit:** Hãy tự review lại xem mình có lỡ để quên `console.log` hay file rác không.

_Happy Coding! 🚀_
