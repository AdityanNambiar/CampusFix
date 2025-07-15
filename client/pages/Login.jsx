import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [redirectRole, setRedirectRole] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
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
      const res = await axios.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      setRedirectRole(res.data.user.role);
      toast.success('Login successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="container" style={{maxWidth:400}}>
      <div className="card" style={{marginTop:48}}>
        <h2 style={{marginBottom:16}}>Login</h2>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
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
          <button type="submit">Login</button>
        </form>
        <div style={{marginTop:16, textAlign:'center'}}>
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" style={{color:'#3b82f6',fontWeight:500}}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 