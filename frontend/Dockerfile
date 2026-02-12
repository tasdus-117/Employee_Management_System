# Sử dụng Node.js bản nhẹ nhất
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy các file quản lý thư viện trước để tối ưu hóa việc build
COPY package*.json ./

# Cài đặt thư viện (Dùng --silent để log gọn hơn, tránh rác terminal)
RUN npm install --silent

# Copy toàn bộ mã nguồn của Frontend vào container
COPY . .

# Mở cổng 3000 (cổng mặc định của React)
EXPOSE 3000

# Cấu hình quan trọng để React nhận ra thay đổi code trên Windows (Hot Reload)
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Lệnh để khởi động ứng dụng
CMD ["npm", "start"]