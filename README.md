
# Flowva - Project Management System

Tài liệu hướng dẫn phát triển (Development Guide) cho dự án Flowva.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
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

Dự án áp dụng kiến trúc  **Modular Monolith** , chia tách rõ ràng Frontend/Backend và quản lý theo Tính năng (Feature).

**Plaintext**

```
flowva/
├── app/                            # NEXT.JS ROUTING (Chỉ chứa Page & Layout)
│   ├── (auth)/                     # Các trang Login/Register (Layout riêng)
│   ├── (dashboard)/                # App chính (Layout có Sidebar)
│   │   ├── projects/               # Trang danh sách project
│   │   └── tasks/                  # Trang quản lý task
│   ├── api/                        # API Routes (Backend Entry points)
│   │   ├── auth/                   # Endpoint: /api/auth
│   │   └── projects/               # Endpoint: /api/projects
│   └── globals.css                 # File CSS chính (Chứa config Tailwind v4)
│
├── src/
│   ├── backend/                    # SERVER-SIDE LOGIC (Node.js)
│   │   ├── controllers/            # Nhận Request -> Validate -> Gọi Service
│   │   ├── services/               # LOGIC NGHIỆP VỤ (Xử lý dữ liệu, tính toán)
│   │   ├── middlewares/            # Check quyền (Admin, Owner), Validate token
│   │   └── lib/                    # Config Prisma, Supabase Admin
│   │
│   ├── frontend/                   # CLIENT-SIDE LOGIC (React)
│   │   ├── components/             # UI Components DÙNG CHUNG (Button, Modal, Input)
│   │   ├── features/               # MODULE TÍNH NĂNG (Code chính nằm ở đây)
│   │   │   ├── auth/               # Feature: Xác thực
│   │   │   ├── projects/           # Feature: Dự án
│   │   │   └── tasks/              # Feature: Công việc
│   │   │       ├── components/     # UI chỉ dùng cho Task (VD: TaskCard)
│   │   │       ├── hooks/          # Logic React riêng cho Task
│   │   │       └── services/       # API call riêng cho Task
│   │   ├── hooks/                  # Hooks dùng chung (useScreenSize, useTheme)
│   │   ├── lib/                    # Config Axios, Utils frontend
│   │   ├── providers/              # Context (AuthProvider, ThemeProvider)
│   │   └── stores/                 # State toàn cục (Zustand)
│   │
│   └── shared/                     # DÙNG CHUNG CHO CẢ FE VÀ BE
│       ├── types/                  # TypeScript Interfaces, DTOs
│       ├── constants/              # Hằng số (API_URL, MAX_FILE_SIZE)
│       └── utils/                  # Hàm tiện ích thuần (formatDate)
│
├── prisma/                         # Database Configuration
│   └── schema.prisma               # Nơi định nghĩa bảng (Tables)
├── public/                         # Ảnh, Fonts, Icons
├── package.json                    # Danh sách thư viện & Scripts
└── postcss.config.mjs              # Config PostCSS (Tailwind v4)
```

---

## 💡 Hướng Dẫn Code Nhanh (Mini Guide)

Khi nhận task mới, hãy tuân thủ quy tắc  **"Tính năng nào, ở nhà đó"** .

### 1. Khi tạo UI Component mới

* **Case A: Nút bấm, Ô nhập liệu dùng nhiều nơi?**
  👉 Tạo vào: `src/frontend/components/ui/`
* **Case B: Card hiển thị Task, Form tạo Project?**
  👉 Tạo vào: `src/frontend/features/[tên-feature]/components/`

### 2. Khi viết Logic xử lý (Backend)

Luồng dữ liệu chuẩn: `API Route` -> `Controller` -> `Service` -> `Database`.

* **Bước 1:** Viết logic xử lý (ví dụ: tạo project) trong `src/backend/services/project.service.ts`.
* **Bước 2:** Viết hàm nhận request và validate dữ liệu trong `src/backend/controllers/project.controller.ts`.
* **Bước 3:** Khai báo đường dẫn API trong `app/api/projects/route.ts`.

### 3. Khi sửa Database

* **Bước 1:** Sửa file `prisma/schema.prisma`.
* **Bước 2:** Chạy lệnh cập nhật DB:
  **Bash**

  ```
  npx prisma db push
  ```
* **Bước 3:** (Quan trọng) Chạy lại lệnh generate để code nhận diện thay đổi:
  **Bash**

  ```
  npx prisma generate
  ```

### 4. Quy tắc đặt tên

* **Component:** PascalCase (VD: `TaskCard.tsx`)
* **Hook:** camelCase, bắt đầu bằng use (VD: `useTaskFilter.ts`)
* **Interface/Type:** PascalCase (VD: `ITask`, `ProjectDTO`)
* **File Logic:** camelCase (VD: `project.service.ts`)

---

*Happy Coding! 🚀*
