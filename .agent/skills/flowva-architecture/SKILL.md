---
name: flowva-architecture
description: Cấu trúc dự án Flowva (Next.js 16 Modular Monolith). Sử dụng khi tạo file mới, refactor code hoặc tìm kiếm file.
---

# Quy tắc Kiến trúc Flowva

Dự án tuân thủ nghiêm ngặt cấu trúc Modular Monolith. Mọi code phải nằm trong `src/`.

## 1. Bản đồ thư mục (Directory Map)
- **`src/app/`**: Chỉ chứa Routing (Page, Layout) và Global Styles.
  - **TUYỆT ĐỐI KHÔNG** chứa logic nghiệp vụ phức tạp tại đây.
  - **TUYỆT ĐỐI KHÔNG** tạo `api/` routes (dùng Server Actions thay thế).
- **`src/backend/services/`**: Chứa toàn bộ Business Logic và gọi Database (Prisma).
  - Định dạng: `[name].service.ts` (VD: `task.service.ts`).
- **`src/frontend/features/[feature-name]/`**: Chứa code UI theo tính năng.
  - `components/`: React Components.
  - `actions.ts`: Server Actions (Thay thế API Controller).
  - `hooks/`: Custom Hooks.
  - `stores/`: Zustand State (UI state only).

## 2. Quy tắc đặt file mới
- **UI Component dùng chung?** → `src/frontend/components/`
- **UI Component riêng feature?** → `src/frontend/features/[name]/components/`
- **Server Action?** → `src/frontend/features/[name]/actions.ts`
- **Business Logic?** → `src/backend/services/[name].service.ts`
- **Types/DTOs?** → `src/shared/types/[name].ts`

## 3. Tech Stack
Xem chi tiết trong `README.md` hoặc `GUIDLINE.md`.