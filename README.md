# Employee Management System (Fullstack Dockerized)

Dự án quản lý nhân viên hoàn chỉnh được xây dựng với kiến trúc Fullstack, sử dụng **JWT (JSON Web Token)** để bảo mật và đóng gói toàn bộ môi trường bằng **Docker**.

## Tính năng nổi bật
- **Authentication (JWT):** Hệ thống cấp thẻ truy cập (Token) khi đăng nhập thành công.
- **Protected Routes:** Chỉ người dùng đã đăng nhập mới có thể vào Dashboard và quản lý dữ liệu.
- **Full CRUD:** Thêm, Xem, Sửa, Xóa nhân viên với xử lý lỗi trùng lặp Email (Unique Constraint).
- **Dockerized:** Chạy toàn bộ ứng dụng (FE, BE, DB) chỉ với một câu lệnh duy nhất.
- **Responsive UI:** Giao diện chuyên nghiệp với React-Bootstrap, tối ưu cho mọi thiết bị.

## Tech Stack
- **Frontend:** React JS, React Router v6, Axios, React-Bootstrap.
- **Backend:** Python Flask, Flask-SQLAlchemy, **Flask-JWT-Extended**, Flask-CORS.
- **Database:** PostgreSQL 12.
- **DevOps:** Docker, Docker Compose.

## Hướng dẫn cài đặt và khởi chạy

### 1. Yêu cầu hệ thống
- Máy tính đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Kích hoạt WSL 2 (nếu sử dụng Windows).

### 2. Khởi chạy dự án
Bạn không cần cài đặt Python hay Node.js thủ công. Hãy mở Terminal tại thư mục gốc và chạy:

```bash
# Clone dự án từ GitHub
git clone [https://github.com/tasdus-117/Employee-Management-System.git](https://github.com/tasdus-117/Employee-Management-System.git)

# Khởi chạy hệ thống bằng Docker
docker-compose up --build
