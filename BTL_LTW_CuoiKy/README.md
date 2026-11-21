# Sổ tay công thức nấu ăn (BTL cuối kỳ Lập trình Web, Đề 3)

React (Vite) + Tailwind + Redux Toolkit · Node.js + Express · MongoDB (Mongoose)

## Yêu cầu
Node.js 20 LTS trở lên, MongoDB (cài local hoặc dùng MongoDB Atlas), Git.

## Cài đặt và chạy
```bash
# Terminal 1 - server
cd server
npm install
cp .env.example .env      # sửa MONGO_URI và JWT_SECRET
npm run seed              # nạp dữ liệu mẫu
npm run dev               # http://localhost:5000

# Terminal 2 - client
cd client
npm install
npm run dev               # http://localhost:5173
```

## Tài khoản demo (sau khi chạy `npm run seed`)
| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| Thành viên | an@example.com | Member@123 |
| Thành viên | binh@example.com | Member@123 |

## Việc cần hoàn thiện (TODO của nhóm)
- Upload ảnh cho từng bước làm (hiện chỉ có ảnh món chính)
- Hồ sơ cá nhân, đổi mật khẩu
- Nâng cao: chỉnh khẩu phần, chế độ nấu có hẹn giờ, in thực đơn PDF
- Deploy: chuyển upload sang Cloudinary
