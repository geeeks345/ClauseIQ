const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Contract = require('../models/Contract');
const Analysis = require('../models/Analysis');
const Notification = require('../models/Notification');
const History = require('../models/History');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clauseiq';
    console.log(`[Seeder] Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Clearing previous demo data...');
    await User.deleteMany({ email: { $in: ['demo@clauseiq.ai', 'admin@clauseiq.ai', 'reviewer@clauseiq.ai'] } });

    // 1. Create Admin Account
    console.log('[Seeder] Creating admin account (admin@clauseiq.ai)...');
    const adminUser = await User.create({
      name: 'Victoria Vance (Admin)',
      email: 'admin@clauseiq.ai',
      password: 'password123',
      company: 'ClauseIQ Global Enterprise',
      role: 'admin',
      stats: {
        contractsUploaded: 12,
        analysesCompleted: 12,
        highRiskClausesFlagged: 18
      }
    });

    // 2. Create Regular User Account
    console.log('[Seeder] Creating standard user account (demo@clauseiq.ai)...');
    const demoUser = await User.create({
      name: 'Pradeep Kumar',
      email: 'demo@clauseiq.ai',
      password: 'password123',
      company: 'Apex Legal Technologies',
      role: 'user',
      stats: {
        contractsUploaded: 4,
        analysesCompleted: 4,
        highRiskClausesFlagged: 6
      }
    });

    console.log(`[Seeder] Accounts created: Admin (${adminUser.email}), User (${demoUser.email})`);

    // Sample Contract 1: Employment Agreement
    const contract1 = await Contract.create({
      userId: demoUser._id,
      title: 'Senior Software Engineer Employment Agreement',
      fileName: 'Employment_Agreement_2026.pdf',
      originalName: 'Senior_SWE_Employment_Contract.pdf',
      filePath: path.join(__dirname, '..', 'uploads', 'sample-employment.pdf'),
      fileType: 'pdf',
      fileSize: 1024 * 350,
      status: 'analyzed',
      pageCount: 6,
      wordCount: 2450,
      contractType: 'Employment',
      riskSummary: {
        overallScore: 78,
        riskLevel: 'Critical',
        highRiskCount: 2,
        mediumRiskCount: 2,
        lowRiskCount: 1,
        totalClauses: 5
      }
    });

    const analysis1 = await Analysis.create({
      contractId: contract1._id,
      userId: demoUser._id,
      overallRiskScore: 78,
      riskLevel: 'Critical',
      executiveSummary: 'This Employment Agreement contains two critical red flags: a 24-month worldwide non-compete covenant (void under Section 27 of the Indian Contract Act) and an immediate termination for convenience clause lacking severance compensation.',
      keyStrengths: [
        'Comprehensive confidentiality and proprietary rights protection',
        'Standard intellectual property assignment for work-for-hire'
      ],
      criticalRedFlags: [
        'Worldwide 24-month non-compete restriction severely impedes future career mobility',
        'Unilateral right for company to terminate without prior notice or severance pay'
      ],
      riskDistribution: { high: 2, medium: 2, low: 1 },
      clauses: [
        {
          clauseId: 'cl_emp_1',
          title: 'Non-Compete & Restrictive Covenants',
          type: 'Non-Compete',
          originalText: 'Employee agrees that for a period of 24 months post-termination, they shall not directly or indirectly engage in, advise, or be employed by any enterprise operating in the software intelligence sector globally.',
          plainEnglish: 'You cannot work for any tech or AI company anywhere in the world for 2 full years after leaving.',
          risk: 'Critical',
          riskRationale: 'Under Section 27 of the Indian Contract Act 1872, all post-termination non-compete clauses are void and unenforceable as restraints of trade.',
          realWorldExample: 'If you resign, the company could attempt to block your next job offer at another software firm.',
          recommendation: 'Refuse post-employment non-competes. Agree only to a reasonable 6-month non-solicitation of active clients.',
          confidenceScore: 0.98,
          pageNumber: 3,
          legalReferences: [
            {
              statute: 'Indian Contract Act, 1872',
              section: 'Section 27 (Restraint of Trade)',
              jurisdiction: 'India & Common Law Precedents',
              summary: 'Agreements restraining lawful exercise of profession or trade are void.',
              relevanceScore: 0.99
            }
          ]
        },
        {
          clauseId: 'cl_emp_2',
          title: 'Termination for Convenience',
          type: 'Termination',
          originalText: 'The Company reserves the unilateral right to terminate Employee without cause immediately upon written notice, without obligation to provide severance pay or notice wages.',
          plainEnglish: 'The company can dismiss you instantly on any day with zero notice and zero severance payout.',
          risk: 'High',
          riskRationale: 'One-sided immediate exit without severance exposes the employee to abrupt financial loss.',
          realWorldExample: 'During corporate restructuring, you could be terminated with no compensation.',
          recommendation: 'Insist on a mutual 60-day notice period or 2 months of salary in lieu of notice.',
          confidenceScore: 0.95,
          pageNumber: 4,
          legalReferences: [
            {
              statute: 'Industrial Relations Code & Employment Standards',
              section: 'Chapter V-A',
              jurisdiction: 'National Labour Law',
              summary: 'Mandates reasonable notice or wages in lieu thereof prior to termination.',
              relevanceScore: 0.91
            }
          ]
        },
        {
          clauseId: 'cl_emp_3',
          title: 'Dispute Resolution & Exclusive Seat',
          type: 'Arbitration & Dispute',
          originalText: 'Any disputes shall be resolved by a sole arbitrator nominated solely by the Managing Director of the Company.',
          plainEnglish: 'Only the company gets to pick the judge who will decide disputes.',
          risk: 'Medium',
          riskRationale: 'Unilateral arbitrator nomination violates statutory neutrality requirements.',
          realWorldExample: 'In an unpaid bonus dispute, the company appoints their internal counsel to arbitrate.',
          recommendation: 'Replace with mutual agreement on an independent arbitrator.',
          confidenceScore: 0.92,
          pageNumber: 5,
          legalReferences: [
            {
              statute: 'Arbitration and Conciliation Act, 1996',
              section: 'Section 12(5)',
              jurisdiction: 'Supreme Court of India (Perkins Eastman)',
              summary: 'Unilateral appointment of a sole arbitrator by an interested party is invalid.',
              relevanceScore: 0.97
            }
          ]
        },
        {
          clauseId: 'cl_emp_4',
          title: 'Intellectual Property Assignment',
          type: 'Intellectual Property',
          originalText: 'All inventions, software code, and works developed during employment belong exclusively to Company as work-made-for-hire.',
          plainEnglish: 'The company owns all software you write while working for them.',
          risk: 'Low',
          riskRationale: 'Standard employment practice for technology roles.',
          realWorldExample: 'Features built during office hours belong to the employer.',
          recommendation: 'Carve out pre-existing personal open-source projects created on personal time.',
          confidenceScore: 0.94,
          pageNumber: 2,
          legalReferences: []
        }
      ]
    });

    contract1.latestAnalysisId = analysis1._id;
    await contract1.save();

    // Sample Contract 2: Mutual NDA
    const contract2 = await Contract.create({
      userId: demoUser._id,
      title: 'Enterprise Vendor Mutual Non-Disclosure Agreement',
      fileName: 'Mutual_NDA_Vendor.docx',
      originalName: 'Vendor_Mutual_NDA.docx',
      filePath: path.join(__dirname, '..', 'uploads', 'sample-nda.docx'),
      fileType: 'docx',
      fileSize: 1024 * 120,
      status: 'analyzed',
      pageCount: 3,
      wordCount: 1100,
      contractType: 'NDA',
      riskSummary: {
        overallScore: 32,
        riskLevel: 'Medium',
        highRiskCount: 0,
        mediumRiskCount: 1,
        lowRiskCount: 3,
        totalClauses: 4
      }
    });

    const analysis2 = await Analysis.create({
      contractId: contract2._id,
      userId: demoUser._id,
      overallRiskScore: 32,
      riskLevel: 'Medium',
      executiveSummary: 'Standard mutual NDA with well-balanced obligations. Found one medium risk regarding perpetual confidentiality on non-trade secret commercial communications.',
      keyStrengths: [
        'Mutual bilateral protection for both disclosing and receiving parties',
        'Standard exclusions for publicly known information'
      ],
      criticalRedFlags: [],
      riskDistribution: { high: 0, medium: 1, low: 3 },
      clauses: [
        {
          clauseId: 'cl_nda_1',
          title: 'Term & Perpetual Secrecy',
          type: 'Confidentiality',
          originalText: 'The receiving party agrees to hold all confidential disclosures in perpetuity with no sunset period.',
          plainEnglish: 'You must keep general business conversations secret forever without expiration.',
          risk: 'Medium',
          riskRationale: 'Commercial confidentiality should have a 3-5 year sunset, keeping perpetuity strictly for trade secrets.',
          realWorldExample: 'You could be sued 10 years later for mentioning general pricing discussions.',
          recommendation: 'Limit commercial information secrecy to 3 years post-expiration.',
          confidenceScore: 0.91,
          pageNumber: 2,
          legalReferences: [
            {
              statute: 'Information Technology Act, 2000',
              section: 'Section 72A',
              jurisdiction: 'National',
              summary: 'Protects against unauthorized disclosure of confidential data.',
              relevanceScore: 0.88
            }
          ]
        }
      ]
    });

    contract2.latestAnalysisId = analysis2._id;
    await contract2.save();

    // Sample Contract 3: SaaS Master Services Agreement
    const contract3 = await Contract.create({
      userId: demoUser._id,
      title: 'Cloud Infrastructure SaaS Master Agreement',
      fileName: 'Cloud_MSA_2026.pdf',
      originalName: 'Cloud_SaaS_MSA.pdf',
      filePath: path.join(__dirname, '..', 'uploads', 'sample-msa.pdf'),
      fileType: 'pdf',
      fileSize: 1024 * 480,
      status: 'analyzed',
      pageCount: 8,
      wordCount: 3400,
      contractType: 'Vendor / Service',
      riskSummary: {
        overallScore: 62,
        riskLevel: 'High',
        highRiskCount: 1,
        mediumRiskCount: 2,
        lowRiskCount: 1,
        totalClauses: 4
      }
    });

    const analysis3 = await Analysis.create({
      contractId: contract3._id,
      userId: demoUser._id,
      overallRiskScore: 62,
      riskLevel: 'High',
      executiveSummary: 'SaaS Agreement contains an aggressive evergreen auto-renewal clause with a 90-day opt-out window, combined with uncapped customer indemnification obligations.',
      keyStrengths: ['Detailed 99.9% uptime Service Level Agreement (SLA) with credit remedies'],
      criticalRedFlags: ['90-day opt-out evergreen renewal easily locks customer into unwanted annual billing'],
      riskDistribution: { high: 1, medium: 2, low: 1 },
      clauses: [
        {
          clauseId: 'cl_saas_1',
          title: 'Evergreen Auto-Renewal',
          type: 'Auto-Renewal',
          originalText: 'This subscription shall automatically renew for additional 12-month terms unless cancelled via registered mail exactly 90 days before renewal.',
          plainEnglish: 'The subscription renews automatically for another full year unless you cancel 3 months in advance by postal mail.',
          risk: 'High',
          riskRationale: 'Creates accidental recurring budget commitments.',
          realWorldExample: 'Missing the 90-day window by 1 day obligates a $50,000 annual charge.',
          recommendation: 'Change to 30-day email notice and require vendor reminder 15 days prior.',
          confidenceScore: 0.96,
          pageNumber: 3,
          legalReferences: [
            {
              statute: 'Consumer Protection / Unfair Terms Regulations',
              section: 'Section 2(46)',
              jurisdiction: 'National & FTC Guidelines',
              summary: 'Onerous auto-renewal conditions without prior notification are considered unfair.',
              relevanceScore: 0.92
            }
          ]
        }
      ]
    });

    contract3.latestAnalysisId = analysis3._id;
    await contract3.save();

    // Create Initial Notifications
    console.log('[Seeder] Creating demo notifications and activity logs...');
    await Notification.create([
      {
        userId: demoUser._id,
        title: 'Critical Risk Alert: Senior SWE Contract',
        message: 'AI flagged 24-month worldwide Non-Compete and immediate termination clause.',
        type: 'risk_alert',
        link: `/analysis/${contract1._id}`
      },
      {
        userId: demoUser._id,
        title: 'Analysis Complete: Cloud MSA',
        message: 'Successfully analyzed Cloud Infrastructure SaaS Agreement (Score: 62/100).',
        type: 'success',
        link: `/analysis/${contract3._id}`
      },
      {
        userId: demoUser._id,
        title: 'Welcome to ClauseIQ v1.0.0',
        message: 'Your AI Contract Intelligence suite is fully configured and ready.',
        type: 'info'
      }
    ]);

    // Create Activity History
    await History.create([
      {
        userId: demoUser._id,
        action: 'ANALYSIS_COMPLETED',
        contractId: contract1._id,
        contractTitle: contract1.title,
        details: { overallRiskScore: 78, highRiskCount: 2 }
      },
      {
        userId: demoUser._id,
        action: 'CONTRACT_UPLOADED',
        contractId: contract1._id,
        contractTitle: contract1.title,
        details: { pages: 6, fileSize: contract1.fileSize }
      }
    ]);

    console.log('✅ [Seeder] Database successfully seeded with Admin and User accounts, contracts, and alerts!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedDatabase();
