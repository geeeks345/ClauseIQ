const PDFDocument = require('pdfkit');

class PDFReportGenerator {
  static generateContractReport(contract, analysis, user, res) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ClauseIQ_Report_${contract.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

    doc.pipe(res);

    // Header Banner
    doc
      .rect(0, 0, doc.page.width, 85)
      .fill('#0f172a'); // Dark slate

    doc
      .fillColor('#06b6d4') // Cyan
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('ClauseIQ', 40, 25);

    doc
      .fillColor('#94a3b8')
      .fontSize(10)
      .font('Helvetica')
      .text('AI Contract Intelligence & Legal Risk Assessment Report', 40, 52);

    doc
      .fillColor('#ffffff')
      .fontSize(9)
      .text(`Generated: ${new Date().toLocaleDateString()} | User: ${user.name}`, 380, 52, { align: 'right' });

    doc.moveDown(4);

    // Contract Meta Block
    doc.fillColor('#1e293b').fontSize(16).font('Helvetica-Bold').text(contract.title, 40, 110);
    doc.fontSize(10).font('Helvetica').fillColor('#64748b');
    doc.text(`File: ${contract.originalName} | Type: ${contract.fileType.toUpperCase()} | Word Count: ${contract.wordCount || 'N/A'}`);
    
    // Overall Risk Banner
    const score = analysis ? analysis.overallRiskScore : 0;
    let scoreColor = '#10b981'; // Green
    if (score >= 70) scoreColor = '#ef4444'; // Red
    else if (score >= 40) scoreColor = '#f59e0b'; // Orange

    doc.moveDown(1);
    doc.rect(40, doc.y, doc.page.width - 80, 50).fillAndStroke('#f8fafc', '#e2e8f0');

    const bannerY = doc.y - 45;
    doc.fillColor('#334155').fontSize(12).font('Helvetica-Bold').text('Overall Risk Score:', 55, bannerY + 5);
    doc.fillColor(scoreColor).fontSize(20).text(`${score}/100 (${analysis?.riskLevel || 'Analyzed'})`, 185, bannerY);
    
    const dist = analysis?.riskDistribution || { high: 0, medium: 0, low: 0 };
    doc.fillColor('#64748b').fontSize(10).font('Helvetica').text(
      `High Risk: ${dist.high}   |   Medium Risk: ${dist.medium}   |   Low Risk: ${dist.low}`,
      350,
      bannerY + 7
    );

    doc.moveDown(3);

    // Executive Summary
    if (analysis?.executiveSummary) {
      doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Executive Summary');
      doc.moveDown(0.5);
      doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(analysis.executiveSummary, {
        lineGap: 3,
        align: 'justify'
      });
      doc.moveDown(1.5);
    }

    // Critical Red Flags
    if (analysis?.criticalRedFlags && analysis.criticalRedFlags.length > 0) {
      doc.fillColor('#dc2626').fontSize(11).font('Helvetica-Bold').text('Critical Attention Required:');
      doc.moveDown(0.5);
      analysis.criticalRedFlags.forEach((flag) => {
        doc.fillColor('#b91c1c').fontSize(9).font('Helvetica').text(`•  ${flag}`, { indent: 15, lineGap: 2 });
      });
      doc.moveDown(1.5);
    }

    // Detailed Clause Analysis
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Extracted Clauses & AI Remediation');
    doc.moveDown(0.5);

    if (analysis?.clauses && analysis.clauses.length > 0) {
      analysis.clauses.forEach((clause, index) => {
        if (doc.y > 680) {
          doc.addPage();
        }

        const tagColor = clause.risk === 'Critical' || clause.risk === 'High' ? '#ef4444' : clause.risk === 'Medium' ? '#f59e0b' : '#10b981';

        doc.fillColor('#0f172a').fontSize(10.5).font('Helvetica-Bold').text(`${index + 1}. ${clause.title} [${clause.type}]`);
        doc.fillColor(tagColor).fontSize(9).text(`Risk: ${clause.risk} (Confidence: ${Math.round((clause.confidenceScore || 0.9) * 100)}%)`);
        
        doc.moveDown(0.3);
        doc.fillColor('#475569').fontSize(8.5).font('Helvetica-Oblique').text(`"Original Text: ${clause.originalText}"`, { lineGap: 2 });
        
        doc.moveDown(0.3);
        doc.fillColor('#0369a1').fontSize(9).font('Helvetica-Bold').text('Plain English Translation:');
        doc.fillColor('#0284c7').fontSize(8.5).font('Helvetica').text(clause.plainEnglish, { lineGap: 2 });

        if (clause.recommendation) {
          doc.moveDown(0.3);
          doc.fillColor('#15803d').fontSize(9).font('Helvetica-Bold').text('Remediation Advice:');
          doc.fillColor('#166534').fontSize(8.5).font('Helvetica').text(clause.recommendation, { lineGap: 2 });
        }

        if (clause.legalReferences && clause.legalReferences.length > 0) {
          doc.moveDown(0.3);
          doc.fillColor('#6b21a8').fontSize(8.5).font('Helvetica-Bold').text('Legal Statutory Citation:');
          clause.legalReferences.forEach(ref => {
            doc.fillColor('#7e22ce').fontSize(8).font('Helvetica').text(`- ${ref.statute} (${ref.section}): ${ref.summary}`);
          });
        }

        doc.moveDown(1);
        doc.strokeColor('#e2e8f0').moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
        doc.moveDown(1);
      });
    }

    // Footer
    doc.fontSize(8).fillColor('#94a3b8').text('Generated by ClauseIQ v1.0.0 — Confidential & Proprietary', 40, doc.page.height - 30, { align: 'center' });

    doc.end();
  }
}

module.exports = PDFReportGenerator;
