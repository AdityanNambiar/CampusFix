import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'open': '#fbbf24',
  'in progress': '#3b82f6',
  'resolved': '#22c55e',
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [reportType, setReportType] = useState('all'); // 'all', 'open', 'in progress', 'resolved'

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const res = await api.get('/complaints', { params });
      setComplaints(res.data);
      // Analytics: count by status
      const statusCount = res.data.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {});
      setChartData(Object.entries(statusCount).map(([status, count]) => ({ status, count })));
    } catch (err) {
      toast.error('Failed to fetch complaints');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      // Get all maintenance users
      const res = await api.get('/complaints');
      const maint = res.data.map(c => c.assignedTo).filter(u => u && u.role === 'Maintenance');
      setUsers(Array.from(new Set(maint.map(u => u._id))).map(id => maint.find(u => u._id === id)));
    } catch {}
  };

  useEffect(() => { fetchComplaints(); fetchUsers(); }, []); // fetch on mount
  useEffect(() => { fetchComplaints(); fetchUsers(); }, [filters]); // fetch on filter change

  // Sync reportType with status filter
  useEffect(() => {
    if (filters.status === 'open' || filters.status === 'in progress' || filters.status === 'resolved') {
      setReportType(filters.status);
    } else {
      setReportType('all');
    }
    // eslint-disable-next-line
  }, [filters.status]);

  const handleAssign = async (id, assignedTo) => {
    try {
      await api.put(`/complaints/${id}`, { assignedTo });
      toast.success('Complaint reassigned');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to reassign');
    }
  };

  const downloadPDF = async () => {
    try {
      let url = '/reports/unresolved-pdf';
      if (reportType === 'open') url += '?status=open';
      else if (reportType === 'in progress') url += '?status=in%20progress';
      else if (reportType === 'resolved') url += '?status=resolved';
      const res = await api.get(url, { responseType: 'blob' });
      const fileName =
        reportType === 'open'
          ? 'open_complaints.pdf'
          : reportType === 'in progress'
          ? 'in_progress_complaints.pdf'
          : reportType === 'resolved'
          ? 'resolved_complaints.pdf'
          : 'unresolved_report.pdf';
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download PDF');
    }
  };

  // Summary counts
  const summary = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h2 style={{margin:0}}>Welcome, {user?.name}</h2>
        <button onClick={handleLogout} style={{background:'#1565c0',color:'#fff',fontWeight:600,borderRadius:6,padding:'0.5rem 1.5rem',border:'none',fontSize:'1.1rem',cursor:'pointer'}}>Logout</button>
      </div>
      <div style={{display:'flex', gap: '2.5rem', alignItems:'flex-start', width:'100%'}}>
        {/* Left: Analytics and Complaints Grid */}
        <div style={{flex: '2 1 0', minWidth:0, maxWidth:900}}>
          <div style={{display:'flex', gap:24, marginBottom:24}}>
            <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>Open: {summary['open']||0}</div>
            <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>In Progress: {summary['in progress']||0}</div>
            <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>Resolved: {summary['resolved']||0}</div>
          </div>
          <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(21,101,192,0.10)',padding:'1.5rem',marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
              <select value={reportType} onChange={e => setReportType(e.target.value)} style={{padding:'0.4rem 1rem',borderRadius:6,border:'1px solid #ccc',fontWeight:600}}>
                <option value="all">Download All Unresolved</option>
                <option value="open">Download Open</option>
                <option value="in progress">Download In Progress</option>
                <option value="resolved">Download All Resolved</option>
              </select>
              <button onClick={downloadPDF} style={{background:'#1565c0',color:'#fff',fontWeight:600,borderRadius:6,padding:'0.5rem 1.2rem',border:'none'}}>Download PDF</button>
            </div>
          </div>
          {loading ? <div style={{textAlign:'center',padding:24}}>Loading...</div> : (
            complaints.length === 0 ? <div className="text-muted">No complaints found.</div> :
            <ul style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',padding:0,margin:0}}>
              {complaints.map(c => (
                <li
                  key={c._id}
                  style={{
                    background:'#f9fafb',
                    borderRadius:14,
                    padding:'18px 18px 14px 18px',
                    boxShadow:'0 1px 8px rgba(21,101,192,0.06)',
                    borderLeft:`8px solid ${statusColors[c.status]||'#bdbdbd'}`,
                    minHeight:140,
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'space-between',
                  }}
                >
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <span style={{fontWeight:600,fontSize:18}}>{c.title}</span>
                    <span style={{background:'#e3f2fd',color:'#1565c0',borderRadius:8,padding:'2px 12px',fontSize:14,fontWeight:600,letterSpacing:1,marginLeft:8}}>{c.status.toUpperCase()}</span>
                  </div>
                  <div style={{color:'#6b7280',marginBottom:4}}>{c.category} | {c.location}</div>
                  <div style={{marginBottom:4}}>{c.description}</div>
                  <div style={{fontSize:13,color:'#888'}}>Created: {new Date(c.createdAt).toLocaleString()}</div>
                  <div style={{fontSize:13,color:'#888'}}>Student: {c.createdBy?.name || 'Unknown'}</div>
                  <div style={{fontSize:13,color:'#888'}}>Assigned To: {c.assignedTo?.name || 'Unassigned'}</div>
                  {c.remarks && <div style={{marginTop:6,background:'#e0f2fe',borderRadius:8,padding:'6px 10px',fontSize:14}}><b>Remarks:</b> {c.remarks}</div>}
                  <form onSubmit={e => { e.preventDefault(); handleAssign(c._id, e.target.assignedTo.value); }} style={{marginTop:12,display:'flex',gap:8,alignItems:'center'}}>
                    <select name="assignedTo" defaultValue={c.assignedTo?._id || ''} required style={{padding:'0.4rem 1rem',borderRadius:6,border:'1px solid #ccc'}}>
                      <option value="">Select Maintenance</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                    <button type="submit" style={{background:'#1565c0',color:'#fff',fontWeight:600,borderRadius:6,padding:'0.4rem 1.2rem',border:'none'}}>Reassign</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Right: Filters */}
        <div style={{flex:'0 0 320px',minWidth:260,maxWidth:340,marginLeft:'2.5rem', display:'flex', flexDirection:'column', position:'sticky', top:24, alignSelf:'flex-start'}}>
          <div className="card filter-card-ui">
            <h3 style={{marginBottom: 16}}>Filter Complaints</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <input placeholder="Category" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} />
              <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
              <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
              <button type="button" onClick={fetchComplaints} style={{background:'#1565c0',color:'#fff',fontWeight:600,borderRadius:6,padding:'0.5rem 1.2rem',border:'none'}}>Filter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 