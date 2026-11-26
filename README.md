# IOE Lớp 5 – Luyện Thi Cấp Xã & Chuỗi Học Tập

Web luyện thi IOE Tiếng Anh Lớp 5 (Cấp Xã / Cấp Trường) với giao diện mô phỏng phòng thi thật `ioe.vn`, chế độ luyện nhanh có giải thích chi tiết, bài nghe tự động (Web Speech API), chuỗi ngày học (Streak) và lịch học theo tháng.

## Chạy tại máy

```bash
pnpm install
pnpm dev
```

## Build production

```bash
pnpm run build
```

## Đẩy lên Vercel (miễn phí)

### Cách 1: Đẩy qua GitHub (Khuyên dùng)
1. Tạo 1 repository mới trên GitHub và đẩy thư mục `ioe-lop5` lên.
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → Chọn repo vừa tạo.
3. Vercel tự nhận cấu hình từ `vercel.json` (Vite + `pnpm run build` + `dist`) → Bấm **Deploy** là có link `.vercel.app` ngay!

### Cách 2: Đẩy trực tiếp bằng lệnh (Vercel CLI)
```bash
pnpm dlx vercel --prod
```
(Đăng nhập tài khoản Vercel khi được hỏi, sau đó nhấn Enter để deploy.)
