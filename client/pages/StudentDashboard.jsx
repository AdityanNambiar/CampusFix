import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import ComplaintCard from '../components/ComplaintCard';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'open': '#fbbf24',
  'in progress': '#3b82f6',
  'resolved': '#22c55e',
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '', from: '', to: '' });
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('post'); // 'post' or 'my'

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
    } catch (err) {
      toast.error('Failed to fetch complaints');
    }
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, []); // fetch on mount
  useEffect(() => { if (view === 'my') fetchComplaints(); }, [filters, view]); // fetch on filter/view change

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', form);
      toast.success('Complaint submitted');
      setForm({ title: '', description: '', category: '', location: '' });
      if (view === 'my') fetchComplaints();
    } catch (err) {
      toast.error('Failed to submit complaint');
    }
  };

  const categoryOptions = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Internet',
    'Furniture',
    'Other',
  ];

  return (
    <div className="container" style={{maxWidth: 900}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h2 style={{margin:0}}>Welcome, {user?.name}</h2>
        <button onClick={handleLogout} style={{background:'#1565c0',color:'#fff',fontWeight:600,borderRadius:6,padding:'0.5rem 1.5rem',border:'none',fontSize:'1.1rem',cursor:'pointer'}}>Logout</button>
      </div>
      <div style={{display:'flex', gap:24, marginBottom:32}}>
        <button
          onClick={() => setView('post')}
          style={{
            background: view === 'post' ? '#1565c0' : '#fff',
            color: view === 'post' ? '#fff' : '#1565c0',
            border: '2px solid #1565c0',
            borderRadius: 8,
            padding: '0.7rem 2.2rem',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: view === 'post' ? '0 2px 8px rgba(21,101,192,0.08)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Post Complaint
        </button>
        <button
          onClick={() => setView('my')}
          style={{
            background: view === 'my' ? '#1565c0' : '#fff',
            color: view === 'my' ? '#fff' : '#1565c0',
            border: '2px solid #1565c0',
            borderRadius: 8,
            padding: '0.7rem 2.2rem',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: view === 'my' ? '0 2px 8px rgba(21,101,192,0.08)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          My Complaints
        </button>
      </div>
      {view === 'post' && (
        <div className="card" style={{marginBottom: 32, boxShadow: '0 4px 24px rgba(59,130,246,0.07)'}}>
          <h3 style={{marginBottom: 16}}>Submit a New Complaint</h3>
          <form onSubmit={handleSubmit} style={{display: 'grid', gap: 12}}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <select
              value={categoryOptions.includes(form.category) ? form.category : 'Other'}
              onChange={e => {
                const val = e.target.value;
                setForm(f => ({ ...f, category: val === 'Other' ? '' : val }));
              }}
              required
            >
              <option value="" disabled>Select Category</option>
              {categoryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {/* Show custom input if 'Other' is selected */}
            {(!categoryOptions.includes(form.category) || form.category === '') && (
              <input
                placeholder="Custom Category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                required
              />
            )}
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} style={{resize:'vertical'}} />
            <button type="submit" style={{marginTop: 8}}>Submit Complaint</button>
          </form>
        </div>
      )}
      {view === 'my' && (
        <div className="my-complaints-section-grid" style={{display:'flex', gap:'2.5rem', alignItems:'flex-start', width:'100%'}}>
          {/* Left: Complaints Grid */}
          <div style={{flex: '2 1 0', minWidth:0, maxWidth:900}}>
            <div style={{display:'flex', gap:24, marginBottom:24}}>
              <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>Open: {complaints.filter(c => c.status === 'open').length}</div>
              <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>In Progress: {complaints.filter(c => c.status === 'in progress').length}</div>
              <div style={{background:'#e3f2fd',borderRadius:8,padding:'1rem 2rem',fontWeight:600,color:'#1565c0'}}>Resolved: {complaints.filter(c => c.status === 'resolved').length}</div>
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
                      borderLeft:`8px solid ${c.status === 'open' ? '#fbbf24' : c.status === 'in progress' ? '#3b82f6' : c.status === 'resolved' ? '#22c55e' : '#bdbdbd'}`,
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
                    <div style={{fontSize:13,color:'#888'}}>Assigned To: {c.assignedTo?.name || 'Unassigned'}</div>
                    {c.remarks && <div style={{marginTop:6,background:'#e0f2fe',borderRadius:8,padding:'6px 10px',fontSize:14}}><b>Remarks:</b> {c.remarks}</div>}
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
      )}
    </div>
  );
};

export default StudentDashboard; 