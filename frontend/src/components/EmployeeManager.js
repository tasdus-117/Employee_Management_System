import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Form, Card, Navbar, Row, Col } from 'react-bootstrap';

function EmployeeManager() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hàm lấy token nhanh từ ví
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return {};
    }
    return { Authorization: `Bearer ${token}` };
  };

  // 1. Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:4000/users', {
        headers: getAuthHeader()
      });
      setEmployees(res.data.users);
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Thêm nhân viên
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/users", 
        { name, email, password }, 
        { headers: getAuthHeader() } // Phải có thẻ mới được thêm
      );
      setName(""); setEmail(""); setPassword("");
      fetchEmployees();
      alert("Thêm thành công!");
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Không có quyền"));
    }
  };

  // 3. Xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`http://localhost:4000/users/${id}`, {
          headers: getAuthHeader() // Phải có thẻ mới được xóa
        });
        fetchEmployees();
      } catch (error) {
        alert("Không thể xóa. Vui lòng kiểm tra quyền đăng nhập.");
      }
    }
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Button variant="outline-danger" size="sm" onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>
            Đăng xuất
          </Button>
          <Navbar.Brand className="ms-auto">Hệ Thống Quản Lý Nhân Viên</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">Thêm Nhân Viên Mới</Card.Title>
                <Form onSubmit={handleAdd}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu tạm thời</Form.Label>
                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    + Thêm vào danh sách
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Danh Sách Nhân Viên</Card.Title>
                <Table striped bordered hover responsive className="mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>STT</th>
                      <th>Họ và Tên</th>
                      <th>Email</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={emp.id}>
                        <td>{index + 1}</td>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td className="text-center">
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/users/${emp.id}`)}>
                            Sửa
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(emp.id)}>
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EmployeeManager;