import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [errors, setErrors] = useState({});
  const [redirectRole, setRedirectRole] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!role) errs.role = 'Role is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    if (user && redirectRole) {
      if (redirectRole === 'Student') navigate('/student-dashboard');
      else if (redirectRole === 'Maintenance') navigate('/maintenance-dashboard');
      else navigate('/admin-dashboard');
    }
  }, [user, redirectRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('/auth/register', { name, email, password, role });
      toast.success('Registration successful! Logging you in...');
      // Auto-login after registration
      const loginRes = await axios.post('/auth/login', { email, password });
      login(loginRes.data.token, loginRes.data.user);
      setRedirectRole(role);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        toast.error('You are already a registered user. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="container" style={{maxWidth:400}}>
      <div className="card" style={{marginTop:48}}>
        <h2 style={{marginBottom:16}}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={errors.name ? {borderColor:'#ef4444'} : {}}
          />
          {errors.name && <div style={{color:'#ef4444',fontSize:13}}>{errors.name}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={errors.email ? {borderColor:'#ef4444'} : {}}
          />
          {errors.email && <div style={{color:'#ef4444',fontSize:13}}>{errors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={errors.password ? {borderColor:'#ef4444'} : {}}
          />
          {errors.password && <div style={{color:'#ef4444',fontSize:13}}>{errors.password}</div>}
          <select value={role} onChange={e => setRole(e.target.value)} required style={errors.role ? {borderColor:'#ef4444'} : {}}>
            <option value="Student">Student</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <div style={{color:'#ef4444',fontSize:13}}>{errors.role}</div>}
          <button type="submit">Register</button>
        </form>
        <div style={{marginTop:16, textAlign:'center'}}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" style={{color:'#3b82f6',fontWeight:500}}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 