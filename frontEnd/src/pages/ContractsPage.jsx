import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  FileText,
  Trash2,
  Edit2,
  Eye,
  Bot,
  Plus,
  Clock,
  Filter,
} from 'lucide-react';
import { useContracts } from '../context/ContractContext';
import { Card, Badge, Button, LoadingSpinner } from '../components/common';

export const ContractsPage = () => {
  const [searchParams] = useSearchParams();
  const {
    contracts,
    filters,
    setFilter,
    fetchContracts,
    deleteContract,
    renameContract,
    loading,
  } = useContracts();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || filters.search);
  const [editingContract, setEditingContract] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setFilter({ search: urlQuery });
      fetchContracts({ search: urlQuery });
    } else {
      fetchContracts();
    }
  }, [fetchContracts, searchParams, filters.risk, filters.type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter({ search: searchQuery });
    fetchContracts({ search: searchQuery });
  };

  const handleRename = async () => {
    if (!editingContract || !newTitle.trim()) return;
    await renameContract(editingContract._id, newTitle);
    setEditingContract(null);
  };

  const handleDelete = async (id) => {
    await deleteContract(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Contract Library</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Centralized repository of all uploaded contracts, risk ratings, and extracted metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-[12px] bg-slate-100 p-1 border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-bold rounded-[8px] transition ${
                viewMode === 'grid' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-[8px] transition ${
                viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569]'
              }`}
            >
              Table
            </button>
          </div>

          <Link to="/upload">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" /> Upload Contract
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by title, file name, or clause text..."
              className="w-full pl-10 pr-4 py-2 text-xs enterprise-input"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filters.risk}
              onChange={(e) => {
                setFilter({ risk: e.target.value });
                fetchContracts({ risk: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs enterprise-input"
            >
              <option value="All">All Risk Ratings</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filters.type}
              onChange={(e) => {
                setFilter({ type: e.target.value });
                fetchContracts({ type: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs enterprise-input"
            >
              <option value="All">All Types</option>
              <option value="Employment">Employment</option>
              <option value="NDA">NDA</option>
              <option value="Vendor / Service">Vendor / Service</option>
              <option value="Lease / Real Estate">Lease / Tenancy</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <Button type="submit" variant="secondary" size="sm" className="w-full h-9">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Contracts View */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : contracts.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No contracts found</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Try modifying your search or upload a new agreement to start automated AI review.
          </p>
          <Link to="/upload">
            <Button variant="primary" size="md">
              Upload First Contract
            </Button>
          </Link>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((c) => (
            <Card
              key={c._id}
              hover
              className="flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant={c.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                    {c.riskSummary?.riskLevel || 'Unanalyzed'}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#475569] uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {c.fileType}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">{c.title}</h3>
                  <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">
                    {c.originalName} • {c.contractType || 'Contract'}
                  </p>
                </div>

                {c.riskSummary && (
                  <div className="p-3 rounded-[12px] bg-slate-50 border border-slate-200 flex justify-between text-xs text-[#475569]">
                    <span>
                      Score: <strong className="text-[#0F172A]">{c.riskSummary.overallScore || 0}/100</strong>
                    </span>
                    <span>
                      Clauses: <strong className="text-[#0F172A]">{c.riskSummary.totalClauses || 0}</strong>
                    </span>
                    <span className="text-red-600">
                      High: <strong>{c.riskSummary.highRiskCount || 0}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link to={`/analysis/${c._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Analysis
                    </Button>
                  </Link>
                  <Link to={`/chat?contractId=${c._id}`}>
                    <Button variant="ghost" size="sm" title="Chat with AI">
                      <Bot className="w-4 h-4 text-[#2563EB]" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingContract(c);
                      setNewTitle(c.title);
                    }}
                    className="p-1.5 rounded-[8px] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(c._id)}
                    className="p-1.5 rounded-[8px] text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-[#475569] font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Contract</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Risk Rating</th>
                  <th className="p-4">Word Count</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {contracts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 pl-6 font-semibold text-[#0F172A]">
                      <Link to={`/analysis/${c._id}`} className="hover:text-[#2563EB] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2563EB]" />
                        <span>{c.title}</span>
                      </Link>
                    </td>
                    <td className="p-4 text-[#475569]">{c.contractType}</td>
                    <td className="p-4">
                      <Badge variant={c.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                        {c.riskSummary?.riskLevel || 'Unanalyzed'}
                        {c.riskSummary?.overallScore ? ` (${c.riskSummary.overallScore}/100)` : ''}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#475569]">{c.wordCount || 'N/A'}</td>
                    <td className="p-4 text-[#475569]">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <Link to={`/analysis/${c._id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Rename Modal */}
      {editingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#0F172A]">Rename Contract</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs enterprise-input"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingContract(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRename}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-red-600">Delete Contract</h3>
            <p className="text-xs text-[#475569]">
              Are you sure you want to delete this contract? This removes the document, extracted metadata, and AI reports permanently.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deletingId)}>
                Delete Contract
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
