import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
  Zap,
  Layers,
  FileText,
  Scale,
  GitCompare,
  Lock,
  ChevronRight,
  Play,
  Building2,
  TrendingUp,
  Cpu,
  BarChart3,
  Search,
  Check,
  Globe,
  UploadCloud,
  ChevronDown,
  HelpCircle,
  FileSearch,
  BookOpen,
  Download,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Logo } from '../components/common/Logo';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  const workflowSteps = [
    { num: 1, title: 'Upload', desc: 'Drag and drop PDF, DOCX, or TXT agreements' },
    { num: 2, title: 'Read & Parse', desc: 'Smart document reader extracts layout, text, and structure' },
    { num: 3, title: 'Extract Clauses', desc: 'Identifies and organizes paragraphs into discrete legal sections' },
    { num: 4, title: 'Detect Risks', desc: 'Flags non-competes, auto-renewals, and unfair liabilities' },
    { num: 5, title: 'Explain', desc: 'Translates complex legal language into clear plain English' },
    { num: 6, title: 'Verify Standards', desc: 'Cross-checks terms against corporate guidelines & legal standards' },
    { num: 7, title: 'Calculate Score', desc: 'Generates a clear 0-100 overall safety score with redline suggestions' },
    { num: 8, title: 'Executive Report', desc: 'Generates boardroom-ready summary reports and downloads' },
  ];

  const features = [
    {
      icon: UploadCloud,
      title: 'Contract Ingestion',
      desc: 'High-speed document reading supporting PDF, DOCX, and TXT files up to 25MB with complete structural accuracy.',
    },
    {
      icon: Cpu,
      title: 'Intelligent Clause Detection',
      desc: 'Automatic detection of termination, indemnity, non-compete, and confidentiality obligations.',
    },
    {
      icon: Shield,
      title: 'Risk Safety Score',
      desc: 'Clear 0-100 safety rating with high, medium, and low risk summaries to protect your organization.',
    },
    {
      icon: Bot,
      title: 'AI Contract Assistant',
      desc: 'Ask questions in everyday language and receive clear answers directly from your contract text.',
    },
    {
      icon: GitCompare,
      title: 'Contract Comparison',
      desc: 'Side-by-side version comparison showing added, removed, and modified terms with net change summary.',
    },
    {
      icon: BarChart3,
      title: 'Executive PDF Reports',
      desc: 'Generate professional multi-page compliance reports and summaries ready for leadership review.',
    },
  ];

  const faqs = [
    {
      q: 'How does ClauseIQ detect risks in contracts?',
      a: 'ClauseIQ reads your contract, identifies each clause, and compares the wording against standard legal benchmarks to highlight one-sided or unfair obligations before you sign.',
    },
    {
      q: 'Can I compare two different versions of a contract?',
      a: 'Yes. The comparison tool places both agreements side by side, highlighting added commitments, removed protections, and modified terms.',
    },
    {
      q: 'What file formats are supported for upload?',
      a: 'ClauseIQ supports standard PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) files up to 25MB.',
    },
    {
      q: 'Is my contract data kept confidential and secure?',
      a: 'Yes. All contracts are processed in private, encrypted workspaces with enterprise security, and your data is never shared or used to train third-party models.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-16 h-[72px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-10">
          <Logo size="md" />

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#475569]">
            <a href="#features" className="hover:text-[#2563EB] transition">Product</a>
            <a href="#workflow" className="hover:text-[#2563EB] transition">How it Works</a>
            <a href="#lifecycle" className="hover:text-[#2563EB] transition">Solutions</a>
            <a href="#pricing" className="hover:text-[#2563EB] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#2563EB] transition">FAQ</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="md">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Request Demo
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto hero-gradient">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              Smart Contract Analysis • Clear Insights • Better Decisions
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#0F172A] tracking-tight leading-[1.1]">
              Understand Every Clause. <br />
              <span className="bg-gradient-to-r from-[#00A3FF] to-[#00D2A0] bg-clip-text text-transparent">
                Sign with Confidence.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload agreements, identify hidden risks, explain legal terms in plain English, and get actionable recommendations before you sign.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="h-[52px] px-8 text-base shadow-lg shadow-blue-600/25">
                  Analyze Contract <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-[52px] px-7 text-base">
                  <Play className="w-4 h-4 mr-2 text-[#2563EB] fill-[#2563EB]" /> Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-[#475569]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Instant document review</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Clear plain English summaries</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="card-surface p-6 shadow-2xl space-y-5 relative overflow-hidden bg-white border-[#E2E8F0]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-500 ml-2">Contract Review Summary</span>
                </div>
                <Badge variant="high">Risk Score: 78/100</Badge>
              </div>

              <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0F172A]">Clause 12: Non-Compete Restriction</h4>
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Critical Flag</span>
                </div>
                <p className="text-xs font-mono text-slate-600 italic bg-white p-2.5 rounded-[10px] border border-slate-200">
                  "Employee agrees not to engage with any competing software entity for 24 months globally post-termination."
                </p>
                <div className="p-2.5 rounded-[10px] bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                  <strong className="block font-bold text-[#2563EB]">Plain English Explanation:</strong>
                  <span>You cannot work for any tech company anywhere in the world for 2 full years after leaving.</span>
                </div>
                <div className="p-2.5 rounded-[10px] bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <strong className="block font-bold text-[#16A34A]">Suggested Recommendation:</strong>
                  <span>This post-employment restriction is legally void and overly restrictive. We recommend striking this clause.</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-[14px] bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-medium text-[#475569] block">Total Clauses</span>
                  <span className="text-lg font-black text-[#0F172A]">18</span>
                </div>
                <div className="p-3 rounded-[14px] bg-red-50 border border-red-200">
                  <span className="text-[11px] font-medium text-red-600 block">High Risk</span>
                  <span className="text-lg font-black text-[#DC2626]">3</span>
                </div>
                <div className="p-3 rounded-[14px] bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-medium text-emerald-600 block">Standard</span>
                  <span className="text-lg font-black text-[#16A34A]">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED COMPANIES MARQUEE */}
      <section className="py-12 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs font-bold text-[#475569] uppercase tracking-widest">
            TRUSTED BY BUSINESS LEADERS, LEGAL TEAMS & GROWING COMPANIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 font-black text-xl tracking-wider text-slate-400">
            <span className="hover:text-[#0F172A] transition">L'ORÉAL</span>
            <span className="hover:text-[#0F172A] transition">OpenAI</span>
            <span className="hover:text-[#0F172A] transition">Mastercard</span>
            <span className="hover:text-[#0F172A] transition">Dropbox</span>
            <span className="hover:text-[#0F172A] transition">Glassdoor</span>
            <span className="hover:text-[#0F172A] transition">Zoom</span>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <section id="workflow" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="info">WORKFLOW</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            How ClauseIQ Reviews Your Contracts
          </h2>
          <p className="text-sm text-[#475569]">
            A simple step-by-step process that turns complex agreements into clear, actionable advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="card-surface p-6 card-surface-hover space-y-3 relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-[12px] bg-[#2563EB]/10 text-[#2563EB] font-black text-sm flex items-center justify-center">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">{step.title}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURE GRID */}
      <section id="features" className="py-24 bg-white border-y border-[#E2E8F0] px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="info">KEY CAPABILITIES</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Everything You Need to Review & Negotiate
            </h2>
            <p className="text-sm text-[#475569]">
              Complete suite of contract analysis tools designed for clarity and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="card-surface p-8 card-surface-hover space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{feat.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CONTRACT LIFECYCLE */}
      <section id="lifecycle" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="info">END-TO-END PROCESS</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Streamline Contract Review from Start to Finish
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-surface p-8 space-y-4">
            <span className="text-2xl font-black text-[#2563EB]">01</span>
            <h3 className="text-lg font-bold text-[#0F172A]">Upload & Intake</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Upload customer drafts, vendor agreements, or employment offers in PDF or Word formats.
            </p>
          </div>

          <div className="card-surface p-8 space-y-4 border-blue-300 shadow-md">
            <span className="text-2xl font-black text-[#2563EB]">02</span>
            <h3 className="text-lg font-bold text-[#0F172A]">Review & Recommendations</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Instantly see flagged risks, one-sided terms, and suggested revision wording to protect your interests.
            </p>
          </div>

          <div className="card-surface p-8 space-y-4">
            <span className="text-2xl font-black text-[#2563EB]">03</span>
            <h3 className="text-lg font-bold text-[#0F172A]">Summary & Sign</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Download clean executive summary reports and move forward with total confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white border-y border-[#E2E8F0] px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="info">PRICING</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Simple, Transparent Plans
            </h2>
            <p className="text-sm text-[#475569]">
              Choose the plan that fits your review volume and team size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-surface p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Starter</h3>
                <p className="text-xs text-[#475569]">For individual reviewers and small teams</p>
                <div className="text-3xl font-black text-[#0F172A]">
                  $29 <span className="text-xs font-normal text-[#475569]">/ user / mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#475569] pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> 25 Contract Reviews / mo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Plain English Explanations</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Document Risk Scoring</li>
                </ul>
              </div>
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Start with Starter
                </Button>
              </Link>
            </div>

            <div className="card-surface p-8 space-y-6 flex flex-col justify-between border-2 border-[#2563EB] shadow-xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Professional</h3>
                <p className="text-xs text-[#475569]">For growing businesses and regular contract reviews</p>
                <div className="text-3xl font-black text-[#0F172A]">
                  $99 <span className="text-xs font-normal text-[#475569]">/ user / mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#0F172A] pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16A34A]" /> Unlimited Contract Uploads</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16A34A]" /> Interactive AI Chat Assistant</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16A34A]" /> Version Comparison & Diff</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16A34A]" /> Legal Guideline References</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16A34A]" /> Executive PDF Reports</li>
                </ul>
              </div>
              <Link to="/register">
                <Button variant="primary" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            <div className="card-surface p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Enterprise</h3>
                <p className="text-xs text-[#475569]">For organizations with custom workflows and team controls</p>
                <div className="text-3xl font-black text-[#0F172A]">
                  Custom <span className="text-xs font-normal text-[#475569]">annual tier</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#475569] pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Dedicated Team Workspace</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Custom Review Guidelines</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Activity & Audit Logs</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2563EB]" /> Priority Support</li>
                </ul>
              </div>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="info">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="card-surface overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left font-bold text-sm text-[#0F172A] flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-[#475569] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="rounded-[24px] bg-[#2563EB] p-10 md:p-16 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Understand Every Clause. Sign with Confidence.
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join business leaders and legal teams saving hours on contract review with ClauseIQ.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-[#2563EB] font-bold text-base px-8 h-[52px]">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-16 px-6 md:px-16 text-xs text-[#475569]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 space-y-4">
            <Logo size="md" showTagline />
            <p className="text-xs text-[#475569] max-w-sm leading-relaxed mt-2">
              Contract intelligence and review platform. Analyze contracts, detect hidden risks, and negotiate with confidence.
            </p>
            <p className="text-[11px] text-slate-400">© 2026 ClauseIQ Technologies Inc. All rights reserved.</p>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-[#0F172A] text-xs">Product</p>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-[#2563EB]">Dashboard</Link></li>
              <li><Link to="/upload" className="hover:text-[#2563EB]">Upload Contract</Link></li>
              <li><Link to="/contracts" className="hover:text-[#2563EB]">Contract Library</Link></li>
              <li><Link to="/compare" className="hover:text-[#2563EB]">Comparison Tool</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-[#0F172A] text-xs">Solutions</p>
            <ul className="space-y-2">
              <li><span className="text-[#475569]">Employment Contracts</span></li>
              <li><span className="text-[#475569]">Service & Vendor Agreements</span></li>
              <li><span className="text-[#475569]">Non-Disclosure Agreements</span></li>
              <li><span className="text-[#475569]">Executive PDF Reports</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-[#0F172A] text-xs">Privacy & Trust</p>
            <ul className="space-y-2">
              <li><span className="text-[#475569]">Privacy Policy</span></li>
              <li><span className="text-[#475569]">Terms of Service</span></li>
              <li><span className="text-[#475569]">Security Standards</span></li>
              <li><span className="text-[#475569]">Confidentiality Guarantee</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
