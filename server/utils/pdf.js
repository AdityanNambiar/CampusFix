const PDFDocument = require('pdfkit');
const fs = require('fs');

// Generate a PDF report of unresolved complaints
const generateUnresolvedReport = (complaints, filePath, statusFilter) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(18).text('Unresolved Complaints Report', { align: 'center' });
    doc.moveDown();
    if (!statusFilter) {
      // All unresolved: group by status
      const open = complaints.filter(c => c.status === 'open');
      const inProgress = complaints.filter(c => c.status === 'in progress');
      doc.fontSize(15).text('Open Complaints', { underline: true });
      doc.moveDown(0.5);
      open.forEach((c, i) => {
        doc.fontSize(12).text(`${i+1}. ${c.title} | ${c.category} | ${c.location} | Status: ${c.status}`);
        doc.text(`Description: ${c.description}`);
        doc.text(`Created: ${c.createdAt}`);
        doc.moveDown();
      });
      doc.addPage();
      doc.fontSize(15).text('In Progress Complaints', { underline: true });
      doc.moveDown(0.5);
      inProgress.forEach((c, i) => {
        doc.fontSize(12).text(`${i+1}. ${c.title} | ${c.category} | ${c.location} | Status: ${c.status}`);
        doc.text(`Description: ${c.description}`);
        doc.text(`Created: ${c.createdAt}`);
        doc.moveDown();
      });
    } else if (statusFilter === 'resolved') {
      // Resolved complaints: heading and list
      doc.fontSize(15).text('Resolved Complaints', { underline: true });
      doc.moveDown(0.5);
      complaints.forEach((c, i) => {
        doc.fontSize(12).text(`${i+1}. ${c.title} | ${c.category} | ${c.location} | Status: ${c.status}`);
        doc.text(`Description: ${c.description}`);
        doc.text(`Created: ${c.createdAt}`);
        doc.moveDown();
      });
    } else {
      // Single status: just list
      complaints.forEach((c, i) => {
        doc.fontSize(12).text(`${i+1}. ${c.title} | ${c.category} | ${c.location} | Status: ${c.status}`);
        doc.text(`Description: ${c.description}`);
        doc.text(`Created: ${c.createdAt}`);
        doc.moveDown();
      });
    }
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = { generateUnresolvedReport }; 