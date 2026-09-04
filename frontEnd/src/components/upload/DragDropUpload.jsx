import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const UploadProgressBar = ({ progress, isUploading }) => {
  if (!isUploading) return null;

  return (
    <div className="w-full mt-4 space-y-2 animate-fade-in">
      <div className="flex justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-cyan-400 animate-bounce" />
          Ingesting and parsing document text...
        </span>
        <span className="font-semibold text-cyan-400">{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const DragDropUpload = ({ onFileSelected, isUploading, progress }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contractType, setContractType] = useState('Employment');
  const [customTitle, setCustomTitle] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedExtensions = ['pdf', 'docx', 'txt'];

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError('Invalid file format. Please upload a PDF (.pdf), Word document (.docx), or Text file (.txt).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25MB limit.');
      return;
    }

    setSelectedFile(file);
    if (!customTitle) {
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a contract file to upload.');
      return;
    }
    onFileSelected({
      file: selectedFile,
      title: customTitle || selectedFile.name,
      contractType,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-slate-800/80">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your contract here, or <span className="text-cyan-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT up to 25MB</p>
            </div>
          </div>
        </div>

        {/* Selected File Card */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30">
            <div className="flex items-center gap-3 min-w-0">
              <File className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.split('.').pop().toUpperCase()}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Contract Title / Nickname
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Senior Developer Employment Agreement"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Contract Classification
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-slate-200 bg-slate-900"
            >
              <option value="Employment">Employment & Service Agreement</option>
              <option value="NDA">Mutual / Non-Disclosure Agreement (NDA)</option>
              <option value="Vendor / Service">Vendor & SaaS Agreement</option>
              <option value="Lease / Real Estate">Commercial Lease / Tenancy</option>
              <option value="IP License">IP License & Work Assignment</option>
              <option value="Other">Other / General Contract</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <UploadProgressBar progress={progress} isUploading={isUploading} />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5"
          disabled={!selectedFile || isUploading}
          isLoading={isUploading}
        >
          {isUploading ? 'Uploading & Parsing...' : 'Ingest & Start AI Intelligence Analysis'}
        </Button>
      </form>
    </Card>
  );
};
