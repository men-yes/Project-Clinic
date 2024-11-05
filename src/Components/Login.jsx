// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSScomponents/Login.css';
import Header from './Header';


const Login = () => {
  const [username, setUsername] = useState('');
  const [roleType, setRoleType] = useState('');
  const navigate = useNavigate();

  const handleLogin =  async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/checkAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, role_type: roleType }),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert(data.message);

      // נווט לפי סוג התפקיד
      if (data.role_type === 'manager') {
        navigate('/Management');
      } else if (data.role_type === 'therapist') {
        navigate('/Therapist', { state: { therapistData: data.therapistData } });
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <>
    <Header />
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <label>שם משתמש:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>סיסמה:</label>
        <input type="password" value={roleType} onChange={(e) => setRoleType(e.target.value)} required />

        <button type="submit">התחבר</button>
      </form>
    </div>
    </>
   
  );
};

export default Login;
