import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/login', { email, password });
      alert(res.data.message);
      
      // Báo cho App.js biết đã đăng nhập để mở khóa Route Dashboard
      onLoginSuccess(); 
      
      // Chuyển hướng vào trang quản lý
      navigate('/dashboard'); 
    } catch (error) {
      alert(error.response?.data?.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
        <input placeholder="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button}>Đăng nhập</button>
      </form>
      <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
    </div>
  );
}

const styles = {
  input: { display: 'block', margin: '10px auto', padding: '10px', width: '250px' },
  button: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }
};

export default Login;