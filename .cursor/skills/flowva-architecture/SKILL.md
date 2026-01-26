---
name: flowva-architecture
description: Cấu trúc dự án Flowva (Next.js 16 Modular Monolith). Sử dụng khi tạo file mới, refactor code hoặc tìm kiếm file.
---

# Quy tắc Kiến trúc Flowva

Dự án tuân thủ nghiêm ngặt cấu trúc Modular Monolith. Mọi code phải nằm trong `src/`.

## 1. Bản đồ thư mục (Directory Map)
- **`src/app/`**: Chỉ chứa Routing (Page, Layout) và Global Styles.
  - **TUYỆT ĐỐI KHÔNG** chứa logic nghiệp vụ phức tạp tại đây.
  - **TUYỆT ĐỐI KHÔNG** tạo `api/` routes (trừ Webhook).
- **`src/backend/services/`**: Chứa toàn bộ Business Logic và gọi Database (Prisma).
  - Định dạng: `[name].service.ts` (VD: `task.service.ts`).
- **`src/frontend/features/[feature-name]/`**: Chứa code UI theo tính năng.
  - `components/`: React Components.
  - `actions.ts`: **Server Actions** (Thay thế cho API Controller).
  - `hooks/`: Custom Hooks.

## 2. Quy tắc phân lớp (Layering)
- **UI Layer (`page.tsx`, Components):** Chỉ hiển thị dữ liệu.
- **Action Layer (`actions.ts`):** Nhận request từ UI -> Gọi Service.
- **Service Layer (`services/`):** Xử lý logic -> Gọi DB.
- **Data Layer (`prisma`):** Chỉ được gọi từ Service.

## 3. Tech Stack bắt buộc
- **Styling:** Tailwind CSS v4 (Sử dụng `@theme` trong `globals.css`).
- **State:** Zustand (cho Client UI state).
- **Data Fetching:** Gọi trực tiếp Service trong Server Component.