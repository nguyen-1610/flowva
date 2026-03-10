# ==========================================
# STAGE 1: Giai đoạn xây dựng hệ điều hành (Base)
# ==========================================
# FROM: Lấy một hệ điều hành Linux siêu nhẹ có cài sẵn Node.js bản 20
FROM node:20-alpine AS base
# RUN: Chạy một lệnh trên hệ điều hành này. Dự án Next.js đôi khi cần thư viện lõi 'libc6' để hoạt động.
RUN apk add --no-cache libc6-compat


# ==========================================
# STAGE 2: Giai đoạn cài đặt thư viện (Dependencies)
# ==========================================
# FROM: Bắt đầu một giai đoạn mới, kế thừa lại cái 'base' ở trên và đặt tên nó là 'deps'
FROM base AS deps
# WORKDIR: Tạo (nếu chưa có) và nhảy vào thư mục /app bên trong Docker giống như lệnh 'cd /app'
WORKDIR /app
# COPY: Copy 2 file quản lý thư viện từ máy thật (bên trái) vào máy ảo Docker (bên phải)
COPY package.json package-lock.json ./
# RUN: Chạy lệnh cài đặt toàn bộ thư viện (npm ci giống npm install nhưng chính xác và an toàn nhất)
RUN npm ci


# ==========================================
# STAGE 3: Giai đoạn Build Source Code (Builder)
# ==========================================
FROM base AS builder
WORKDIR /app
# COPY: Lấy đống thư viện (node_modules) vừa cài xong ở giai đoạn 'deps' ở trên, vứt vào đây
COPY --from=deps /app/node_modules ./node_modules
# COPY: Copy TOÀN BỘ mã nguồn của dự án (src, public, next.config, ...) ở máy tính thật vào trong Docker
COPY . .
# RUN: Yêu cầu Next.js biên dịch (build) mã nguồn từ React/TypeScript sang html/js tối ưu
RUN npm run build


# ==========================================
# STAGE 4: Giai đoạn chạy thực tế (Runner) - Đây là cái image cuối cùng để release
# ==========================================
FROM base AS runner
WORKDIR /app

# ENV: Cài đặt biến môi trường báo hiệu dự án này đang chạy chế độ Production thật (chứ không phải code dev nữa)
ENV NODE_ENV production

# Tiếp theo, thay vì lấy toàn bộ code cồng kềnh, chúng ta chỉ nhặt dọn những file đã build xong ở stage 'builder'
# Lặp lại nguyên tắc: COPY --from=[tên stage] [đường dẫn lấy] [đường dẫn chép vào]
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# EXPOSE: Nói với Docker rằng chiếc container này sẽ sống ở cổng mạng 3000
EXPOSE 3000
# ENV: Định nghĩa cổng 3000 cho Server Next.js
ENV PORT 3000

# CMD: Câu lệnh BẮT BUỘC KHỞI CHẠY khi Server mới được bật lên
# Next.js standalone tự động gom mọi file chạy vào server.js
CMD ["node", "server.js"]
