import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoSrc from '../../download.png';

/**
 * Helper: Convert image to black and white
 */
const convertImageToBlackAndWhite = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Convert to black and white
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;     // red
        data[i + 1] = gray; // green
        data[i + 2] = gray; // blue
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

/**
 * Helper: Format date for ISO
 */
const formatDateForISO = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Generate ISO Format PDF Report
 * @param {Object} report - Report object containing operatorName, createdAt, and entries
 * @returns {Promise<void>}
 */
export const generateISOPDF = async (report) => {
  try {
    // Convert logo to black and white
    const bwLogo = await convertImageToBlackAndWhite(logoSrc);
    
    // Create PDF in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    
    // Colors
    const tataBlue = [0, 84, 166];
    const lightBlue = [230, 240, 250];
    const redColor = [220, 53, 69];
    
    let yPos = margin;

    // PAGE BORDER
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // HEADER SECTION 
    const headerHeight = 35;
    
    // Draw header border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, pageWidth - 2 * margin, headerHeight);
    
    // Left section - Department
    const leftBoxWidth = 40;
    doc.line(margin + leftBoxWidth, yPos, margin + leftBoxWidth, yPos + headerHeight);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('MECHANICAL', margin + 2, yPos + 10);
    doc.text('MAINTENANCE & IBL', margin + 2, yPos + 15);
    
    // Center section - Logo and Title
    const centerStart = margin + leftBoxWidth;
    const centerWidth = pageWidth - 2 * margin - leftBoxWidth - 60;
    
    // Add logo (black and white)
    const logoWidth = 30;
    const logoHeight = 12;
    const logoX = centerStart + centerWidth / 2 - logoWidth / 2;
    doc.addImage(bwLogo, 'PNG', logoX, yPos + 3, logoWidth, logoHeight);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const division = "CHEMICALS' DIVISION";
    const divisionWidth = doc.getTextWidth(division);
    doc.text(division, centerStart + centerWidth / 2 - divisionWidth / 2, yPos + 24);
    
    // Document title
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const title = 'TITLE : MHY Limestone Plant Daily LLF Checklist';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, centerStart + centerWidth / 2 - titleWidth / 2, yPos + 30);
    
    // Right section - Metadata boxes
    const rightStart = pageWidth - margin - 60;
    
    // Metadata fields
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    yPos += headerHeight + 5;

    // REPORT INFORMATION
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Operator: ${report.operatorName}`, margin + 2, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Submitted: ${formatDateForISO(report.createdAt)}`, margin + 2, yPos + 5);
    
    yPos += 12;

    // EQUIPMENT DATA TABLES 
    // Group entries by equipment
    const equipmentGroups = {};
    report.entries.forEach(entry => {
      if (!equipmentGroups[entry.equipmentId]) {
        equipmentGroups[entry.equipmentId] = {
          name: entry.equipmentName,
          remarks: entry.equipmentRemarks,
          specs: []
        };
      }
      equipmentGroups[entry.equipmentId].specs.push(entry);
    });

    // Render each equipment group
    Object.entries(equipmentGroups).forEach(([eqId, eqData]) => {
      // Equipment header
      doc.setFillColor(...lightBlue);
      doc.setDrawColor(0);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...tataBlue);
      doc.text(eqData.name, margin + 2, yPos + 5.5);
      
      yPos += 10;

      // Specs table
      const tableData = eqData.specs.map(entry => [
        entry.specName,
        entry.status,
        entry.action || '-',
        entry.priority || '-'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Parameter', 'Status', 'Action', 'Priority']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: tataBlue,
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 30 },
          3: { cellWidth: 25, halign: 'center' }
        },
        didParseCell: function(data) {
          // Highlight "Not OK" rows
          if (data.section === 'body' && data.column.index === 1) {
            if (data.cell.raw === 'Not OK') {
              data.cell.styles.textColor = redColor;
              data.cell.styles.fontStyle = 'bold';
            }
          }
          // Highlight Priority column
          if (data.section === 'body' && data.column.index === 3) {
            if (data.cell.raw === 'P1') {
              data.cell.styles.textColor = [200, 0, 0];
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.raw === 'P2') {
              data.cell.styles.textColor = [255, 140, 0];
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.raw === 'P3') {
              data.cell.styles.textColor = [0, 100, 0];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { left: margin, right: margin }
      });

      yPos = doc.lastAutoTable.finalY + 5;

      // Equipment remarks
      if (eqData.remarks) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('Equipment Remarks:', margin + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const remarkLines = doc.splitTextToSize(eqData.remarks, pageWidth - 2 * margin - 4);
        doc.text(remarkLines, margin + 2, yPos + 4);
        yPos += 4 + (remarkLines.length * 4) + 3;
      }

      yPos += 5;
    });

    // FOOTER
    // Add some spacing before footer
    yPos += 10;
    
    // Footer table for signatures - Single row with QSF code
    const footerWidth = pageWidth - 2 * margin;
    autoTable(doc, {
      startY: yPos,
      body: [[
        'QSF-510-02-07',
        'Name of fitter and sign',
        'Name of engineer and sign',
        'Rev No: 02                                     Rev Date: 25-05-2024'
      ]],
      theme: 'grid',
      bodyStyles: {
        fontSize: 7,
        minCellHeight: 10,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: footerWidth * 0.1 },  // 10% for QSF
        1: { cellWidth: footerWidth * 0.3 },  // 30% for fitter
        2: { cellWidth: footerWidth * 0.3 },  // 30% for engineer
        3: { cellWidth: footerWidth * 0.3 }   // 30% for Rev info
      },
      margin: { left: margin, right: margin },
      pageBreak: 'avoid'
    });

    // Page number
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Page 1 of 1`, pageWidth - margin - 15, finalY + 5);

    // Save PDF
    const fileName = `ISO_Report_${report.operatorName}_${formatDateForISO(report.createdAt)}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
