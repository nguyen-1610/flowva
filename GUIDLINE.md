
# AI Guidelines & Best Practices - Flowva Project

---

## 1. Đội Hình AI 

Để đạt hiệu quả cao nhất, đừng dùng một con AI cho tất cả mọi việc. Hãy chia việc theo sở trường:

| Vị trí                                                     | Model Khuyên Dùng                                          | Lý do & Nhiệm vụ                                                                                                                                                                                    |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend & Logic** `<br>` *(Node.js, Prisma)*     | **Claude 4.5 Sonnet** (Anthropic)                      | **Vua Logic.** Dùng để viết `Services`, thiết kế `Schema Prisma`, xử lý thuật toán phức tạp. Nó tuân thủ kiến trúc file chặt chẽ nhất và ít bịa code.                 |
| **Frontend & UI** `<br>` *(React 19, Tailwind v4)* | **GPT-5** (OpenAI) `<br>`hoặc **v0** (Vercel) | **Vua Sáng Tạo.** GPT-5 hiểu ngữ cảnh UI/UX cực tốt. Dùng để chuyển design sang code, chỉnh sửa CSS, animation. Dùng v0 để generate nhanh component từ prompt.                  |
| **Debug & Research** `<br>` *(Fix lỗi, Search)*   | **Gemini 3 Pro** (Google)                              | **Vua Context.** Với cửa sổ context khổng lồ, hãy ném *toàn bộ* folder `src` vào khi gặp lỗi khó hiểu. Nó có thể search web thời gian thực để fix lỗi thư viện mới. |

---

## 2. Sử Dụng Tool (IDE)

### A. Cursor (Khuyên dùng chính)

Cursor là IDE "must-have" cho dự án này.

- **Context:** Khi chat, gõ `@Codebase` để nó hiểu toàn bộ dự án, hoặc `@File` để trỏ đúng file cần sửa.

### B. Antigravity (Hoặc các Agentic IDE tương tự)

Nếu team dùng các công cụ "Agent" (AI tự chạy terminal, tự tạo file như Antigravity/Windsurf):

- **Cảnh báo:** Hãy cẩn thận khi cho phép nó chạy lệnh `npm install` hoặc xóa file. Luôn review diff trước khi `Accept`.
- **Sức mạnh:** Dùng để setup boilerplate ban đầu (Ví dụ: "Tạo trọn bộ feature Tasks gồm controller, service, route và UI").

---

## 3. Context Strategy: Gửi gì cho AI hiểu?

AI năm 2026 rất thông minh, nhưng nó không đọc được suy nghĩ của bạn. Để code chạy ngay lần đầu (Zero-shot), **BẮT BUỘC** phải cung cấp context sau:

### Kịch bản 1: Viết Backend (API)

> **Gửi kèm:** `prisma/schema.prisma` + `src/shared/types`
> **Tại sao:** AI cần biết cấu trúc Database và kiểu dữ liệu chung để viết Service không bị lỗi type.

### Kịch bản 2: Viết Frontend (UI)

> **Gửi kèm:** `app/globals.css` + File component cha (nếu có)
> **Tại sao:** File `globals.css` chứa các biến `@theme` của Tailwind v4. Nếu không gửi, AI sẽ tự chế màu hex code (`#fff`) thay vì dùng biến chuẩn (`var(--background)`).

### Kịch bản 3: Fix lỗi (Debug)

> **Gửi kèm:** Nội dung lỗi + File đang lỗi + File gọi đến nó.
> **Ví dụ:** Lỗi ở `TaskCard.tsx`, hãy gửi kèm cả `TaskList.tsx` (component cha) và `task.interface.ts`.

---

## 4. Prompt Engineering (Mẫu câu lệnh chuẩn)

Copy các mẫu prompt này để đảm bảo AI code đúng Tech Stack mới nhất.

### Prompt cho Frontend (Tailwind v4 Focus)

### Prompt cho Backend (Modular Monolith)

**Plaintext**

```
Viết API [Tên API] theo mô hình Controller-Service.
Yêu cầu:
1. Service: Viết trong `src/backend/services`. Xử lý logic, gọi Prisma.
2. Controller: Viết trong `src/backend/controllers`. Chỉ validate request và gọi Service.
3. Dùng `NextResponse` của Next.js 16.
4. Xử lý lỗi bằng try/catch và trả về status code chuẩn.
```

---

## 🛡 5. Quy Tắc "Chống Ảo Giác" (Hallucination Control)

Do Next.js 16 và Tailwind v4 thay đổi rất nhiều so với bản cũ, AI thỉnh thoảng sẽ "nhớ nhầm" kiến thức năm 2024.

**❌ Dấu hiệu AI đang sai:**

1. Nó import `useRouter` từ `next/router` ->  **SAI** . (Phải là `next/navigation`).
2. Nó nhắc đến file `tailwind.config.js` ->  **SAI** . (v4 không cần file này).
3. Nó dùng `getStaticProps` / `getServerSideProps` ->  **SAI** . (Phải dùng React Server Components - `async function`).

**✅ Cách sửa:**

Quát nó ngay: *"Dừng lại. Dự án này dùng Next.js 16 App Router và Tailwind v4. Quên kiến thức cũ đi và dùng cú pháp mới nhất."*

---

## 🚀 6. System Prompt (Setup cho Cursor)

Copy đoạn này vào file `.cursorrules` ở root để AI tự động ngoan:

**Markdown**

```
Role: Senior Full-stack Engineer (2026 Edition)
Project: Flowva
Stack: Next.js 16 (App Router), Tailwind v4, Supabase, Prisma, Zustand.

CRITICAL RULES:
1. TAILWIND V4: Never mention `tailwind.config.js`. Use CSS variables in `app/globals.css` via `@theme`.
2. NEXT.JS 16: Use Server Actions for mutations. Use `next/navigation` for routing.
3. ARCHITECTURE: 
   - Backend logic goes to `src/backend/services`.
   - Frontend features go to `src/frontend/features`.
4. TYPESCRIPT: No `any`. Always define interfaces in `src/shared/types` if shared.
```
