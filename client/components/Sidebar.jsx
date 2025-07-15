import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  return (
    <aside className="sidebar">
      {user.role === 'Student' && <Link to="/student-dashboard">Student Dashboard</Link>}
      {user.role === 'Maintenance' && <Link to="/maintenance-dashboard">Maintenance Dashboard</Link>}
      {user.role === 'Admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
    </aside>
  );
};
export default Sidebar; 