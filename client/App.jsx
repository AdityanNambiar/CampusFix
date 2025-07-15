import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<ProtectedRoute roles={['Student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/maintenance-dashboard" element={<ProtectedRoute roles={['Maintenance']}><MaintenanceDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App; 