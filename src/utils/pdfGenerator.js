import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateStudentSummaryPDF = async (userData) => {
  const { profile, academicRecords, documents, applications } = userData;

  const doc = new jsPDF();
  let yPosition = 20;

  // Helper to run autoTable safely
  const runAutoTable = (options) => {
    if (doc.autoTable) {
      doc.autoTable(options);
    } else {
      autoTable(doc, options);
    }
  };

  // Helper function to add section title
  const addSectionTitle = (title, y) => {
    doc.setFillColor(79, 156, 255);
    doc.rect(10, y - 5, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y + 2);
    doc.setTextColor(0, 0, 0);
    return y + 15;
  };

  // Header
  doc.setFillColor(14, 14, 20);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Profile Summary', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

  yPosition = 50;

  // ==================== PERSONAL INFORMATION ====================
  yPosition = addSectionTitle('Personal Information', yPosition);

  const personalInfo = [
    ['Full Name', profile?.full_name || 'N/A'],
    ['Email', profile?.email || 'N/A'],
    ['Phone', profile?.phone || 'N/A'],
    ['Date of Birth', profile?.date_of_birth || 'N/A'],
    ['Gender', profile?.gender || 'N/A'],
    ['Address', profile?.address || 'N/A'],
    ['City', profile?.city || 'N/A'],
    ['Country', profile?.country || 'N/A'],
    ['Postal Code', profile?.postal_code || 'N/A']
  ];

  runAutoTable({
    startY: yPosition,
    head: [['Field', 'Value']],
    body: personalInfo,
    theme: 'grid',
    headStyles: { fillColor: [79, 156, 255], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 15, right: 15 }
  });

  yPosition = (doc.lastAutoTable?.finalY || yPosition) + 15;

  // ==================== ACADEMIC RECORDS ====================
  if (academicRecords && academicRecords.length > 0) {
    yPosition = addSectionTitle('Academic Records', yPosition);

    const academicData = academicRecords.map(record => [
      record.exam_type || 'N/A',
      record.institution || 'N/A',
      record.board || 'N/A',
      record.gpa || 'N/A',
      record.year || 'N/A'
    ]);

    runAutoTable({
      startY: yPosition,
      head: [['Exam Type', 'Institution', 'Board', 'GPA', 'Year']],
      body: academicData,
      theme: 'grid',
      headStyles: { fillColor: [0, 230, 118], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc.lastAutoTable?.finalY || yPosition) + 15;
  }

  // Check if new page is needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // ==================== UPLOADED DOCUMENTS ====================
  if (documents && documents.length > 0) {
    yPosition = addSectionTitle('Uploaded Documents', yPosition);

    const documentData = documents.map(doc => [
      doc.document_type || 'Other',
      doc.type || 'N/A',
      new Date(doc.uploaded_at || doc.created_at).toLocaleDateString()
    ]);

    runAutoTable({
      startY: yPosition,
      head: [['Document Type', 'File Type', 'Upload Date']],
      body: documentData,
      theme: 'grid',
      headStyles: { fillColor: [255, 79, 210], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc.lastAutoTable?.finalY || yPosition) + 15;
  }

  // Check if new page is needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // ==================== APPLICATIONS ====================
  if (applications && applications.length > 0) {
    yPosition = addSectionTitle('Applications', yPosition);

    const applicationData = applications.map(app => [
      app.program_name || 'N/A',
      app.university_name || 'N/A',
      app.status || 'N/A',
      new Date(app.created_at).toLocaleDateString()
    ]);

    runAutoTable({
      startY: yPosition,
      head: [['Program', 'University', 'Status', 'Applied Date']],
      body: applicationData,
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: 0 },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc.lastAutoTable?.finalY || yPosition) + 15;
  }

  // ==================== SUMMARY STATISTICS ====================
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition = addSectionTitle('Summary Statistics', yPosition);

  const stats = [
    ['Total Academic Records', academicRecords?.length || 0],
    ['Total Documents Uploaded', documents?.length || 0],
    ['Total Applications', applications?.length || 0],
    ['Profile Completion', profile ? '100%' : '0%']
  ];

  runAutoTable({
    startY: yPosition,
    head: [['Metric', 'Count']],
    body: stats,
    theme: 'grid',
    headStyles: { fillColor: [79, 156, 255], textColor: 255 },
    styles: { fontSize: 10, fontStyle: 'bold' },
    margin: { left: 15, right: 15 }
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      'Generated by BhortiJuddho - University Application System',
      105,
      285,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `${profile?.full_name || 'Student'}_Profile_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

