import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeManager from './components/EmployeeManager';
import EditEmployee from './components/EditEmployee'; // <--- Nhớ dòng này nhé Tú!

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        {/* Trang chính: Phải login mới vào được */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <EmployeeManager /> : <Navigate to="/login" />} 
        />
        {/* Trang sửa: Cũng phải login mới được vào sửa */}
        <Route 
          path="/users/:id" 
          element={isLoggedIn ? <EditEmployee /> : <Navigate to="/login" />} 
        />
        {/* Mặc định về login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Nếu gõ tầm bậy thì về login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;