import React, { useEffect, useState } from 'react';
import { FileBarChart2, Download, FileDown, Eye, Clock, BarChart3, Search, Filter } from 'lucide-react';
import api from '../services/api';
import { Card, Button, Badge, LoadingSpinner } from '../components/common';
import { Link } from 'react-router-dom';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewReport, setPreviewReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      setReports(res.data.data.reports || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const downloadPdf = (contractId) => {
    const token = localStorage.getItem('clauseiq_token');
    window.open(`${api.defaults.baseURL}/reports/pdf/${contractId}?token=${token}`, '_blank');
  };

  const downloadJson = (contractId) => {
    const token = localStorage.getItem('clauseiq_token');
    window.open(`${api.defaults.baseURL}/reports/json/${contractId}?token=${token}`, '_blank');
  };

  const filteredReports = reports.filter((r) =>
    r.contractTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Executive Compliance Reports
        </h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Download PDF audits and export structured clause summaries for compliance, negotiation, and record-keeping.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports by contract title..."
              className="w-full pl-10 pr-4 py-2 text-xs enterprise-input"
            />
          </div>
          <span className="text-xs text-[#475569] whitespace-nowrap">
            <strong>{filteredReports.length}</strong> reports generated
          </span>
        </div>
      </Card>

      {/* Report Cards */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : filteredReports.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <FileBarChart2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No reports generated yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Upload and analyze contracts to automatically generate executive audit reports.
          </p>
          <Link to="/upload">
            <Button variant="primary" size="md">
              Upload First Contract
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card
              key={report.contractId}
              hover
              className="flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant={report.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                    {report.riskSummary?.riskLevel || 'Analyzed'} Risk
                  </Badge>
                  <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Score: {report.riskSummary?.overallScore || 0}/100
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">{report.contractTitle}</h3>
                  <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">{report.fileName}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#475569]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Audited: {new Date(report.analyzedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => downloadPdf(report.contractId)}
                  className="flex-1"
                >
                  <FileDown className="w-3.5 h-3.5 mr-1" /> PDF Audit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadJson(report.contractId)}
                  title="Export Summary Data"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewReport(report)}
                  title="Quick Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-[#475569]" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant={previewReport.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                  {previewReport.riskSummary?.riskLevel} Risk ({previewReport.riskSummary?.overallScore}/100)
                </Badge>
                <h3 className="text-base font-bold text-[#0F172A] mt-2">{previewReport.contractTitle}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPreviewReport(null)}>
                ✕
              </Button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed bg-slate-50 p-4 rounded-[12px] border border-slate-200">
              Executive audit summary report with risk scoring breakdown, clause explanations, and recommended negotiation points.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => downloadJson(previewReport.contractId)}>
                Download Summary
              </Button>
              <Button variant="primary" size="sm" onClick={() => downloadPdf(previewReport.contractId)}>
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
