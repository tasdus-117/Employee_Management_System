import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/register', { name, email, password });
      alert("Đăng ký thành công! Đang chuyển sang trang đăng nhập.");
      navigate('/login'); // Chuyển về trang đăng nhập
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.error || "Không thể đăng ký"));
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} style={styles.input} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
        <input placeholder="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button}>Đăng ký</button>
      </form>
      <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
    </div>
  );
}

const styles = {
  input: { display: 'block', margin: '10px auto', padding: '10px', width: '250px' },
  button: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }
};

export default Register;