import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Building, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const result = await register({ name, email, company, password });
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-[24px] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side Illustration */}
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
              <span>Full compliance & legal standard verification</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Interactive AI contract assistant</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Executive summary reports & downloads</span>
            </div>
          </div>

          <div className="text-xs text-blue-200">
            Join business leaders and legal teams scaling contract review.
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:col-span-7 p-8 md:p-10 space-y-6 flex flex-col justify-center">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Create Account</h1>
            <p className="text-xs text-[#475569] mt-1">Get started with automated contract review.</p>
          </div>

          {(error || validationError) && (
            <div className="flex items-center gap-2 p-3.5 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error || validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pradeep Kumar"
                  className="w-full pl-10 pr-3.5 py-2 text-xs enterprise-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2 text-xs enterprise-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Apex Technologies"
                  className="w-full pl-10 pr-3.5 py-2 text-xs enterprise-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 text-xs enterprise-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 text-xs enterprise-input"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-[#475569] font-medium">
                  <span>Password Strength</span>
                  <span>{strength >= 75 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength >= 75 ? 'bg-emerald-500' : strength >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm shadow-md mt-2"
              disabled={loading}
              isLoading={loading}
            >
              Create Account <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0] text-xs text-[#475569]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
