# AI Guidelines & Best Practices - Flowva Project

---

## 1. Đội Hình AI

Để đạt hiệu quả cao nhất, đừng dùng một con AI cho tất cả mọi việc. Hãy chia việc theo sở trường:

| Vị trí                                                   | Model Khuyên Dùng                                        | Lý do & Nhiệm vụ                                                                                                                                                                                    |
| :--------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend & Logic** <br />*(Node.js, Prisma)*      | **Claude 4.5 Sonnet** (Anthropic)                    | **Vua Logic.** Dùng để viết `Services`, thiết kế `Schema Prisma`, xử lý thuật toán phức tạp. Nó tuân thủ kiến trúc file chặt chẽ nhất và ít bịa code.                 |
| **Frontend & UI** <br /> *(React 19, Tailwind v4)* | **GPT-5** (OpenAI) <br />hoặc **v0** (Vercel) | **Vua Sáng Tạo.** GPT-5 hiểu ngữ cảnh UI/UX cực tốt. Dùng để chuyển design sang code, chỉnh sửa CSS, animation. Dùng v0 để generate nhanh component từ prompt.                  |
| **Debug & Research** <br /> *(Fix lỗi, Search)*  | **Gemini 3 Pro** (Google)                            | **Vua Context.** Với cửa sổ context khổng lồ, hãy ném *toàn bộ* folder `src` vào khi gặp lỗi khó hiểu. Nó có thể search web thời gian thực để fix lỗi thư viện mới. |

---

## 2. Context Strategy: Gửi gì cho AI hiểu?

AI code sai thường do thiếu thông tin. Để code chạy ngay lần đầu (Zero-shot), **BẮT BUỘC** phải kẹp thêm các file sau vào prompt:

### 🎨 Kịch bản 1: Viết Frontend (UI Component)

> **Gửi kèm:**
>
> 1. `app/globals.css` (QUAN TRỌNG: Chứa biến màu `@theme` của Tailwind v4).
> 2. `src/shared/types/[feature].ts` (Để biết data hiển thị có những trường nào).
>
> **Tại sao:** Nếu không gửi `globals.css`, AI sẽ tự chế màu hex (`#f3f4f6`) thay vì dùng biến chuẩn (`var(--background)`), làm hỏng Dark Mode.

### ⚙️ Kịch bản 2: Viết Backend (API Route)

> **Gửi kèm:**
>
> 1. `prisma/schema.prisma` (Cấu trúc DB).
> 2. `src/shared/types/[feature].ts` (Hợp đồng dữ liệu vào/ra).
> 3. `src/backend/services/[feature].service.ts` (Nếu đã có file này).
>
> **Tại sao:** AI cần biết `Shared Types` để validate request body chuẩn xác và biết `Prisma Schema` để query đúng tên bảng.

### 🐛 Kịch bản 3: Fix lỗi (Debug)

> **Gửi kèm:** Nội dung lỗi + File đang lỗi +  **File gọi đến nó** .
>
> **Ví dụ:** Lỗi ở `TaskCard.tsx`, hãy gửi kèm cả `TaskList.tsx` (component cha) để AI biết data được truyền xuống như thế nào.

---

## 3. Prompt Engineering (Nên làm)

Copy các mẫu prompt này để đảm bảo AI code đúng Tech Stack mới nhất.

**Lưu ý:** File `README.md` đóng vai trò là  **"Tấm Bản Đồ"** cần thiết gửi **1 lần duy nhất** lúc bắt đầu đoạn chat mới.

### ➤ Prompt cho Frontend (Tailwind v4 Focus)

**Plaintext**

```
Viết Component [Tên Component] dùng React 19 + Tailwind v4.
Yêu cầu:
1. Styling: Dùng biến CSS từ `globals.css` (VD: --color-primary). KHÔNG dùng file config.
2. Structure: Đặt file tại `src/frontend/features/[tên]/components`.
3. Logic: Tách logic ra custom hook nếu phức tạp.
4. Types: Import DTO từ `src/shared/types`.
```

### ➤ Prompt cho Backend (Service Pattern)

Bỏ Controller, dùng Route Handler trực tiếp.

**Plaintext**

```
Viết API [Tên API] cho tính năng [Tên].
Yêu cầu:
1. Service: Viết trong `src/backend/services`. Xử lý logic nghiệp vụ, check quyền và gọi Prisma.
2. Route Handler: Viết trong `app/api/.../route.ts`. Chỉ làm 3 việc: 
   - Parse Request Body (ép kiểu theo Shared Types).
   - Validate cơ bản.
   - Gọi Service và trả về `NextResponse`.
3. Tuyệt đối KHÔNG tạo folder `controllers`.
4. Error Handling: Dùng try/catch chuẩn trong Route.
```

---

## 🛡 4. Quy Tắc "Chống Ảo Giác" (Hallucination Control)

AI vẫn nhớ kiến thức cũ (2023-2024). Hãy coi chừng những lỗi sau:

**❌ Dấu hiệu AI đang "ngáo":**

1. Nó tạo thư mục `src/backend/controllers` hoặc `repositories` -> **SAI** (Dự án này đã bỏ).
2. Nó viết API Login (`/api/auth/login`) -> **SAI** (Frontend gọi thẳng Supabase Auth).
3. Nó nhắc đến file `tailwind.config.js` -> **SAI** (Tailwind v4 cấu hình trong CSS).
4. Nó import `useRouter` từ `next/router` -> **SAI** (Phải là `next/navigation`).

**✅ Cách sửa:**

Quát nó ngay: *"Dừng lại. Dự án này dùng Modular Monolith (No Controller) và Tailwind v4. Quên kiến thức cũ đi."*

---

## 🚀 5. System Prompt (Setup cho Cursor / Windsurf / Antigravity) (Nếu muốn)

Copy đoạn này vào file `.cursorrules` ở root project để AI tự động ngoan ngay từ đầu:

**Markdown**

```
Role: Senior Full-stack Engineer (2026 Edition)
Project: Flowva
Stack: Next.js 15+ (App Router), Tailwind v4, Supabase, Prisma, Zustand.

CRITICAL RULES:
1. ARCHITECTURE (Modular Monolith):
   - Frontend features: `src/frontend/features/[name]`.
   - Backend logic: `src/backend/services/[name].service.ts`.
   - API Routes: `app/api/[resource]/route.ts` (Acts as Controller).
   - NO `controllers` or `repositories` folders.

2. DATA FLOW:
   - ALWAYS define types in `src/shared/types` FIRST.
   - Flow: UI -> API Client (`.api.ts`) -> Route Handler -> Service (`.service.ts`) -> Prisma.

3. TECH SPECIFICS:
   - Tailwind v4: Use `@theme` in `globals.css`. No config JS.
   - Auth: Use Native Supabase Client on Frontend. No Backend Auth API proxies.
   - Naming: Frontend services end with `.api.ts`. Backend services end with `.service.ts`.

4. BEHAVIOR:
   - If I ask for UI, ask for `globals.css` context.
   - If I ask for API, ask for `schema.prisma` context.
```
