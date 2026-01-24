# Pull Request

**Tên Task/Tính năng:** (Ví dụ: [FE] Tạo giao diện Login / [BE] API tạo Task)

---

## Mô tả thay đổi (Description)

- [ ] Thêm tính năng mới: ...
- [ ] Sửa lỗi (Bug fix): ...
- [ ] Refactor code: ...

## Checklist (BẮT BUỘC)

### 1. The Contract (Quan trọng nhất)

- [ ] **Đã cập nhật Shared Types (`src/shared/types`)** chưa? (Nếu có sửa API/Database)
- [ ] Tên biến Frontend và Backend đã khớp nhau theo Contract chưa?

### 2. Chất lượng Code

- [ ] Tôi đã tự test chức năng (Localhost).
- [ ] Đã chạy `npm run lint` và không có lỗi đỏ.
- [ ] Tôi đã đặt tên file đúng quy tắc (`.api.ts` cho FE, `.service.ts` cho BE).

### 3. Database (Nếu có đụng vào DB)

- [ ] Đã chạy `npx prisma generate`?
- [ ] Đã cập nhật file `schema.prisma` (nếu cần)?

---

## Các vấn đề còn tồn đọng (Nếu có)

- Chưa xử lý trường hợp...
