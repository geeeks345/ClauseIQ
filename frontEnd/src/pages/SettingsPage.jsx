import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Bell,
  Building,
  Check,
  Lock,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge } from '../components/common';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'Pradeep Kumar');
  const [email, setEmail] = useState(user?.email || 'demo@clauseiq.ai');
  const [company, setCompany] = useState(user?.company || 'Apex Legal Technologies');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('ciq_live_98e1b3c87d4ecf90bc');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'organization', label: 'Organization', icon: Building },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Manage your personal account profile, security credentials, organization, and API tokens.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition ${
                isSelected
                  ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-[#16A34A]" />
          Settings successfully updated.
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <Card className="space-y-6">
          <h3 className="text-base font-bold text-[#0F172A]">Personal Information</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs enterprise-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs enterprise-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs enterprise-input"
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              Save Profile Changes
            </Button>
          </form>
        </Card>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <Card className="space-y-6">
          <h3 className="text-base font-bold text-[#0F172A]">Security & Password</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs enterprise-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs enterprise-input"
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              Update Password
            </Button>
          </form>
        </Card>
      )}

      {/* Tab: API Keys */}
      {activeTab === 'api-keys' && (
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">API Access Keys</h3>
              <p className="text-xs text-[#475569] mt-0.5">Use your secret key to integrate ClauseIQ review capabilities into your workflow.</p>
            </div>
            <Badge variant="low">Active</Badge>
          </div>

          <div className="p-4 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-2">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">Live Secret Key</span>
            <div className="flex items-center gap-2">
              <input
                type={showSecret ? 'text' : 'password'}
                readOnly
                value="ciq_live_98e1b3c87d4ecf90bc2eecd76cf7b00"
                className="flex-1 px-3.5 py-2 text-xs font-mono bg-white border border-[#E2E8F0] rounded-[10px]"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-2 text-[#475569] hover:text-[#0F172A]"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <Button variant="outline" size="sm" onClick={handleCopyKey}>
                <Copy className="w-4 h-4 mr-1" />
                {apiKeyCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-[#0F172A]">Email & In-App Alerts</h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#2563EB]" />
              <div>
                <strong className="block text-[#0F172A]">Document Review Completion</strong>
                <span className="text-[#475569]">Receive instant alerts when document parsing and clause risk scoring finishes.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#2563EB]" />
              <div>
                <strong className="block text-[#0F172A]">Critical Risk Alerts</strong>
                <span className="text-[#475569]">Notify when clauses with high risk are detected.</span>
              </div>
            </label>
          </div>
        </Card>
      )}

      {/* Tab: Organization */}
      {activeTab === 'organization' && (
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-[#0F172A]">Enterprise Organization</h3>
          <p className="text-xs text-[#475569]">Manage workspace seats and team members.</p>
          <div className="p-4 rounded-[14px] bg-slate-50 border border-[#E2E8F0] flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#0F172A]">{company}</p>
              <p className="text-[#475569]">Professional Plan • 4 Active Team Seats</p>
            </div>
            <Badge variant="low">Active Subscription</Badge>
          </div>
        </Card>
      )}
    </div>
  );
};
