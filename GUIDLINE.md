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
> 1. `src/app/globals.css` (QUAN TRỌNG: Chứa biến màu `@theme` của Tailwind v4).
> 2. `src/shared/types/[feature].ts` (Để biết data hiển thị có những trường nào).
>
> **Tại sao:** Nếu không gửi `globals.css`, AI sẽ tự chế màu hex (`#f3f4f6`) thay vì dùng biến chuẩn (`var(--background)`), làm hỏng Dark Mode.

### ⚙️ Kịch bản 2: Viết Backend (Server Actions)

> **Gửi kèm:**
>
> 1. `prisma/schema.prisma` (Cấu trúc DB).
> 2. `src/shared/types/[feature].ts` (Hợp đồng dữ liệu vào/ra).
> 3. `src/backend/services/[feature].service.ts` (Nếu đã có file này).
>
> **Tại sao:** AI cần biết `Shared Types` để validate request data chuẩn xác và biết `Prisma Schema` để query đúng tên bảng.

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
4. Client Actions: Gọi Server Actions trực tiếp từ event handlers hoặc useEffect.
5. Types: Import DTO từ `src/shared/types`.
```

### ➤ Prompt cho Backend (Server Actions Pattern)

Dùng Server Actions thay vì API Routes.

**Plaintext**

```
Viết Server Action [Tên Action] cho tính năng [Tên].
Yêu cầu:
1. Service: Viết trong `src/backend/services`. Xử lý logic nghiệp vụ, check quyền và gọi Prisma.
2. Server Action: Viết trong `src/actions/[feature].ts` hoặc `src/frontend/features/[name]/actions.ts`.
   - Phải có dòng `"use server"` ở đầu file.
   - Validate input bằng Zod (từ Shared Types).
   - Gọi Service và trả về kết quả hoặc lỗi.
   - Revalidate path nếu cần (`revalidatePath`).
3. Tuyệt đối KHÔNG tạo folder `controllers` hay `api routes`.
4. Error Handling: Dùng try/catch và trả về object lỗi chuẩn.
```

---

## 🛡 4. Quy Tắc "Chống Ảo Giác" (Hallucination Control)

AI vẫn nhớ kiến thức cũ (2023-2024). Hãy coi chừng những lỗi sau:

**❌ Dấu hiệu AI đang "ngáo":**

1. Nó tạo thư mục `src/app/api` hoặc `controllers` -> **SAI** (Dự án dùng Server Actions).
2. Nó dùng `axios` hoặc `fetch` để gọi API nội bộ -> **SAI** (Gọi trực tiếp Server Action như hàm bình thường).
3. Nó viết API Login (`/api/auth/login`) -> **SAI** (Frontend gọi thẳng Supabase Auth).
4. Nó import `useRouter` từ `next/router` -> **SAI** (Phải là `next/navigation`).

**✅ Cách sửa:**

Quát nó ngay: *"Dừng lại. Dự án này dùng Server Actions, không dùng API Routes hay Axios. Quên kiến thức cũ đi."*

