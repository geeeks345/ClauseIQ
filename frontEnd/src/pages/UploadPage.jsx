import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';
import { DragDropUpload } from '../components/upload/DragDropUpload';
import { FileCheck, ShieldAlert, Cpu, FileText, ArrowRight, Clock } from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { Link } from 'react-router-dom';

export const UploadPage = () => {
  const navigate = useNavigate();
  const { uploadContract, isUploading, uploadProgress, contracts } = useContracts();

  const handleUpload = async ({ file, title, contractType }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('contractType', contractType);

    const res = await uploadContract(formData);
    if (res.success && res.contract?._id) {
      navigate(`/analysis/${res.contract._id}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Upload & Ingest Contract
        </h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Upload PDF, Word, or Text agreements. The review engine automatically segments sections, calculates risk ratings, and provides clear recommendations.
        </p>
      </div>

      {/* Large Upload Zone */}
      <DragDropUpload
        onFileSelected={handleUpload}
        isUploading={isUploading}
        progress={uploadProgress}
      />

      {/* Recent Uploads Section */}
      {contracts.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F172A]">Recent Uploads in Vault</h3>
            <Link to="/contracts">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contracts.slice(0, 3).map((c) => (
              <Card key={c._id} hover className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <Badge variant={c.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                    {c.riskSummary?.riskLevel || 'Unanalyzed'}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#475569] uppercase px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {c.fileType}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">{c.originalName}</p>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[10px] text-[#475569] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <Link to={`/analysis/${c._id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-[11px]">
                      View Analysis
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feature Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Card className="p-5 space-y-2">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-[#0F172A]">Smart Text Extraction</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Extracts full page text while retaining paragraphs, tables, and document layout.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-9 h-9 rounded-[10px] bg-red-50 text-[#DC2626] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-[#0F172A]">Automated Risk Scoring</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Highlights one-sided covenants, evergreen renewals, and uncapped liability terms.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-9 h-9 rounded-[10px] bg-emerald-50 text-[#16A34A] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-[#0F172A]">Legal Precedent Verification</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Cross-references contract clauses against labor standards and legal guidelines.
          </p>
        </Card>
      </div>
    </div>
  );
};
