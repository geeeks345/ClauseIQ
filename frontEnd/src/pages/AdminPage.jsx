import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  Activity,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  FileText,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, Button, Badge, LoadingSpinner } from '../components/common';

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'metrics' | 'audit'
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, metricsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/metrics'),
      ]);
      setUsers(usersRes.data.data.users || []);
      setMetrics(metricsRes.data.data || null);
      setLoading(false);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to load admin data' });
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setFeedback({ type: 'success', text: `User role updated to '${newRole}' successfully.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update role' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate and remove this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setFeedback({ type: 'success', text: 'User removed from workspace.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to remove user' });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Admin Header Banner */}
      <div className="card-surface p-6 bg-gradient-to-r from-blue-900 to-[#0F172A] text-white border-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Admin Access
            </span>
            <span className="text-xs text-blue-200">Organization Governance</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Admin & Governance Portal</h1>
          <p className="text-xs text-slate-300">
            Manage team access permissions, organize reviewer roles, and monitor organization-wide contract health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <span className="text-slate-300 block text-[10px]">Logged in as:</span>
            <strong className="text-white">{user?.name} (Admin)</strong>
          </div>
        </div>
      </div>

      {/* Status Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-[14px] text-xs font-medium flex items-center gap-2 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-[#16A34A]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#DC2626]" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 bg-white border border-[#E2E8F0]'
          }`}
        >
          <Users className="w-4 h-4" /> Team Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition ${
            activeTab === 'metrics'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 bg-white border border-[#E2E8F0]'
          }`}
        >
          <Activity className="w-4 h-4" /> System Overview
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition ${
            activeTab === 'audit'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 bg-white border border-[#E2E8F0]'
          }`}
        >
          <Clock className="w-4 h-4" /> Organization Activity Logs
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : activeTab === 'users' ? (
        /* 1. TEAM MANAGEMENT TAB */
        <div className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search team members by name, email, or organization..."
                className="w-full pl-10 pr-4 py-2 text-xs enterprise-input"
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-[#E2E8F0] text-[#475569] font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Member</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Access Level</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === user?._id;
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 pl-6 font-semibold text-[#0F172A]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] font-bold text-xs flex items-center justify-center">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : 'US'}
                            </div>
                            <div>
                              <p className="font-bold text-[#0F172A]">
                                {u.name} {isSelf && <span className="text-[10px] text-[#2563EB] font-bold">(You)</span>}
                              </p>
                              <span className="text-[10px] text-[#475569]">User ID: {u._id.slice(-6)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#475569] font-mono text-[11px]">{u.email}</td>
                        <td className="p-4 text-[#475569]">{u.company || 'Enterprise'}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={isSelf}
                            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border transition ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.role === 'legal_reviewer'
                                ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                                : 'bg-slate-50 text-[#475569] border-[#E2E8F0]'
                            }`}
                          >
                            <option value="user">Standard User</option>
                            <option value="legal_reviewer">Legal Reviewer</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                        <td className="p-4 text-[#475569]">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isSelf}
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Deactivate / Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : activeTab === 'metrics' ? (
        /* 2. SYSTEM OVERVIEW TAB */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Card className="space-y-1">
              <span className="text-xs font-semibold text-[#475569]">Active Team Members</span>
              <h3 className="text-3xl font-black text-[#0F172A] mt-1">{metrics?.totalUsers || 0}</h3>
              <p className="text-xs text-[#16A34A] font-semibold">Active Accounts</p>
            </Card>

            <Card className="space-y-1">
              <span className="text-xs font-semibold text-[#475569]">Total Contracts Ingested</span>
              <h3 className="text-3xl font-black text-[#0F172A] mt-1">{metrics?.totalContracts || 0}</h3>
              <p className="text-xs text-[#2563EB] font-semibold">Vault Repository</p>
            </Card>

            <Card className="space-y-1">
              <span className="text-xs font-semibold text-[#475569]">Analyses Completed</span>
              <h3 className="text-3xl font-black text-[#0F172A] mt-1">{metrics?.totalAnalyses || 0}</h3>
              <p className="text-xs text-indigo-600 font-semibold">Verified & Audited</p>
            </Card>

            <Card className="space-y-1">
              <span className="text-xs font-semibold text-[#475569]">Critical Flags Detected</span>
              <h3 className="text-3xl font-black text-[#DC2626] mt-1">
                {metrics?.riskOverview?.high || 0}
              </h3>
              <p className="text-xs text-red-600 font-semibold">High-Risk Clauses</p>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Platform Service Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-1">
                <span className="text-[#475569] font-bold block">Document Processing Service</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational & Healthy
                </span>
              </div>
              <div className="p-4 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-1">
                <span className="text-[#475569] font-bold block">AI Risk Engine</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational & Healthy
                </span>
              </div>
              <div className="p-4 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-1">
                <span className="text-[#475569] font-bold block">Encrypted Document Vault</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Secure & Connected
                </span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* 3. GLOBAL AUDIT LOGS TAB */
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#E2E8F0] text-xs">
            {metrics?.recentAuditLogs?.length === 0 ? (
              <div className="p-8 text-center text-[#475569]">No activity logs recorded yet.</div>
            ) : (
              metrics?.recentAuditLogs?.map((log) => (
                <div key={log._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#0F172A]">{log.action.replace(/_/g, ' ')}</span>
                      {log.contractTitle && (
                        <span className="text-[#475569] ml-1.5">"{log.contractTitle}"</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#475569] font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
