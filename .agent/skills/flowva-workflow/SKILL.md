---
name: flowva-workflow
description: Quy trình phát triển tính năng mới sử dụng Server Actions. Dùng khi người dùng yêu cầu "tạo tính năng", "viết API", hoặc "xử lý form".
---

# Quy trình Code tính năng (Modern Flow)

Khi tạo một tính năng mới (ví dụ: Tạo Task), hãy thực hiện đúng thứ tự sau:

## Bước 1: Contract (Types)
- Định nghĩa DTO/Interface trong `src/shared/types/`.
- Sử dụng **Zod** để validate dữ liệu đầu vào.

## Bước 2: Backend Logic (Service)
- Tạo/Sửa file `src/backend/services/[name].service.ts`.
- Viết hàm xử lý logic và truy vấn DB (Prisma).
- Hàm này phải trả về dữ liệu thuần (Plain Object), không trả về Response object.

## Bước 3: Server Action (The Glue)
- Vào thư mục `src/frontend/features/[name]/`.
- Tạo hoặc sửa file `actions.ts`.
- Khai báo `"use server";` ở đầu file.
- Viết hàm `export async function [actionName]` gọi đến Service ở Bước 2.
- Sử dụng `revalidatePath` nếu dữ liệu thay đổi.
- **Lưu ý:** Bọc lỗi bằng `try-catch` hoặc wrapper `safeAction` để trả về object `{ success, error }` cho Client.

## Bước 4: Frontend Integration
- **Server Component (`page.tsx`):** Gọi trực tiếp hàm Service để lấy data (GET).
- **Client Component (Form):**
  - Dùng `useTransition` hoặc `useFormStatus` để handle loading.
  - Gọi Server Action từ Bước 3 trong `onClick` hoặc `form action`.