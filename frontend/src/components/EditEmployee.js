import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from 'react-bootstrap';

function EditEmployee() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Gọi API lấy chi tiết 1 user để hiện lên form
    axios.get(`http://localhost:4000/users/${id}`)
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPassword(res.data.password); // Không hiện mật khẩu cũ
      })
      .catch(err => console.log("Lỗi lấy data:", err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // 1. Lấy token từ bộ nhớ trình duyệt
    const token = localStorage.getItem("token"); 

    try {
        // 2. Gửi kèm token trong cấu hình headers
        await axios.put(`http://localhost:4000/users/${id}`, 
            { name, email }, // Data gửi đi
            {
                headers: {
                    Authorization: `Bearer ${token}` // Chìa khóa ở đây!
                }
            }
        );
        
        navigate("/dashboard");
    } catch (error) {
        console.error("Cập nhật thất bại:", error.response?.data || error.message);
        // Có thể thông báo cho người dùng là "Phiên đăng nhập hết hạn"
    }
};

  return (
    <Container className="mt-4">
      <h3>Chỉnh sửa nhân viên (ID: {id})</h3>
      <Form onSubmit={handleUpdate}>
        <Form.Control placeholder="name" className="mb-2" value={name} onChange={e => setName(e.target.value)} />
        <Form.Control placeholder="email" className="mb-2" value={email} onChange={e => setEmail(e.target.value)} />
        <Form.Control placeholder="password (không bắt buộc)" className="mb-2" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit" variant="success">Lưu</Button>
      </Form>
    </Container>
  );
}
export default EditEmployee;