import React, {useState, useEffect} from "react";
import axios from "axios";
import { Container, Table, Button, Form, Card, Navbar, Row, Col } from 'react-bootstrap';
function EmployeeManager() {
  const[employees, setEmployees] = useState([]);
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:4000/users");
      setEmployees(res.data.users);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:4000/users", { name, email, password });
        console.log("Thành công:", response.data);
        setName(""); 
        setEmail("");
        setPassword("");
        fetchEmployees();
    } catch (error) {
        // Log chi tiết lỗi từ server trả về
        console.error("Mã lỗi:", error.response?.status);
        console.error("Chi tiết lỗi từ Backend:", error.response?.data);
        
        const errorMsg = error.response?.data?.message || "Lỗi không xác định";
        alert("Không thể thêm: " + errorMsg);
    }
};

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/users/${id}`);
    fetchEmployees();
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      {/* Navbar chuyên nghiệp */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#">Hệ Thống Quản Lý Nhân Viên</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Row>
          {/* Cột bên trái: Form thêm mới */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">Thêm Nhân Viên Mới</Card.Title>
                <Form onSubmit={handleAdd}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control type="text" placeholder="Nhập tên..." value={name} onChange={e => setName(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    + Thêm vào danh sách
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột bên phải: Bảng danh sách */}
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