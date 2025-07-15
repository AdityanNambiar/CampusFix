import React from 'react';
const ComplaintCard = ({ complaint }) => (
  <div className="complaint-card">
    <b>{complaint.title}</b> | {complaint.category} | {complaint.status} | {complaint.location}
    <div>{complaint.description}</div>
    <div>Assigned To: {complaint.assignedTo?.name || 'Unassigned'}</div>
    <div>Created: {new Date(complaint.createdAt).toLocaleString()}</div>
    {complaint.remarks && <div>Remarks: {complaint.remarks}</div>}
  </div>
);
export default ComplaintCard; 