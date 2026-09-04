import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';

export const LoginPage = () => {
  const [email, setEmail] = useState('demo@clauseiq.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login({ email, password });
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleQuickLogin = async (quickEmail, quickRole) => {
    setEmail(quickEmail);
    setPassword('password123');
    clearError();
    const result = await login({ email: quickEmail, password: 'password123' });
    if (result.success) {
      if (quickRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-[24px] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Illustration & Value Prop */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-8 md:p-10 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-[16px] w-fit shadow-md">
              <Logo size="md" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Understand Every Clause.</h2>
              <p className="text-xs text-emerald-300 font-bold mt-0.5">Sign with Confidence.</p>
            </div>
          </div>

          <div className="space-y-3.5 my-8">
            <div className="flex items-center gap-2.5 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Team & Admin role access permissions</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Automated clause detection & risk scoring</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Side-by-side contract comparison & redlines</span>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="p-3.5 rounded-[16px] bg-white/10 backdrop-blur-md border border-white/20 text-xs text-blue-100 space-y-2">
            <strong className="block text-white text-[11px] font-bold uppercase tracking-wider">
              Quick Role-Based Login:
            </strong>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('demo@clauseiq.ai', 'user')}
                className="p-2 rounded-[10px] bg-white text-[#2563EB] font-bold text-[11px] hover:bg-blue-50 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" /> Demo User
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@clauseiq.ai', 'admin')}
                className="p-2 rounded-[10px] bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 md:p-10 space-y-6 flex flex-col justify-center">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Sign In</h1>
            <p className="text-xs text-[#475569] mt-1">Enter your organization credentials to access your workspace.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs enterprise-input"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#0F172A]">Password</label>
                <a href="#forgot" className="text-[11px] text-[#2563EB] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs enterprise-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#475569] hover:text-[#0F172A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm shadow-md"
              disabled={loading}
              isLoading={loading}
            >
              Sign In <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0] text-xs text-[#475569]">
            Don't have a workspace?{' '}
            <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
              Create Organization Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
