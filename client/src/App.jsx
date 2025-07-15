import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import MaintenanceDashboard from '../pages/MaintenanceDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children, roles }) => {
  const { user, error } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  if (error) toast.error(error);
  return children;
};

function App() {
  const { loading } = React.useContext(AuthContext) || {};
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ToastContainer position="top-center" autoClose={2000} />
        {loading && <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.6)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner" /></div>}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={
            <PrivateRoute roles={['Student']}><StudentDashboard /></PrivateRoute>
          } />
          <Route path="/maintenance-dashboard" element={
            <PrivateRoute roles={['Maintenance']}><MaintenanceDashboard /></PrivateRoute>
          } />
          <Route path="/admin-dashboard" element={
            <PrivateRoute roles={['Admin']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
