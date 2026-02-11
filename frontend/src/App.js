import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeManager from './components/EmployeeManager';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Nếu chưa login mà cố tình vào /dashboard sẽ bị đá văng về /login */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <EmployeeManager /> : <Navigate to="/login" />} 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;