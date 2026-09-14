# UVTester - Crowdsourced Software Testing SaaS Platform

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![Next.js](<https://img.shields.io/badge/Next.js-15_(App_Router)-000000?logo=nextdotjs>)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

## 📌 Product Overview

**UVTester** is a cloud-based **Crowdsourced Software Testing (SaaS)** platform designed to bridge the gap between software development teams (**Clients**) and distributed freelance QA engineers (**Testers**).

The platform optimizes and automates the complete end-to-end testing cycle:

- **For Businesses / Clients:** Rapidly recruit qualified testers with target hardware configurations, manage test suites with visual drag-and-drop, track live execution matrices, and triage verified bug reports.
- **For Freelance Testers:** Discover matching testing gigs via an intelligent recommendation algorithm, execute structured test cases, report reproducible defects with rich media evidence, and communicate in real time.

---

## 🔄 End-to-End Workflow

```text
[ Client: Post Project ] ────► [ Smart Matching / Browse ] ────► [ Tester: Apply & Survey ]
           │                                                                 │
           ▼                                                                 ▼
[ Setup DnD Test Cases ]                                         [ Client: Review & Approve ]
           │                                                                 │
           └────────────────► [ Tester: Execute Test Cases ] ◄───────────────┘
                                           │
                                           ├─► [ Pass / Fail / Blocked Steps ]
                                           ├─► [ Report Detailed Bug (Evidence) ]
                                           └─► [ Realtime Chat (Project / 1-on-1) ]
                                                           │
                                                           ▼
                                            [ Client: Review & Acceptance ]
                                                           │
                                                           ▼
                                            [ Automated Status via Cron Job ]
```

---

## 🚀 Core SaaS Features

### 1. Client Management Portal

- **Guided Project Creation:** Multi-step wizard configuring testing objectives, in/out-of-scope boundaries, required hardware environments, milestones, and custom screening questionnaires.
- **Interactive Test Suite Builder:** Construct detailed test cases with prerequisite steps, and effortlessly reorder execution flow using intuitive drag-and-drop (`@dnd-kit`).
- **Applicant Evaluation:** Screen candidate submissions, review applicant device inventory, and evaluate survey responses with one-click approvals.
- **Live Acceptance Matrix:** Real-time visibility into test run progress per tester, inspecting step-by-step evidence (screenshots, recordings, system logs) before approving completion.
- **Unified Bug Tracker:** Centralized defect triage with standardized issue keys (e.g., `PRJ-BUG-1`), severity classification, reproduction steps, and resolution feedback.
- **Direct Talent Outreach:** Search the tester pool by verified hardware and testing skillsets, sending direct automated project invitation emails.

### 2. Freelancer Testing Workspace

- **Intelligent Project Matching:** Algorithmic ranking (**Best Match**) calculating compatibility scores across device ownership, operating systems, and domain experience.
- **Seamless Application:** Select matching personal devices and complete project-specific qualification surveys.
- **Dedicated Test Runner:** Step-by-step test execution interface, recording discrete step statuses (`Pass`, `Fail`, `Blocked`, `Skip`), hardware identifiers, and proof attachments.
- **Comprehensive Bug Submission:** Standardized bug reporting form including dynamic reproduction steps, expected vs. actual outcomes, severity ratings, browser/OS telemetry, and media uploads.
- **Profile & Device Registry:** Manage personal professional experience, testing specialties, device specs (PC, Mobile, Tablet, OS), and track profile completeness.

### 3. Platform & Infrastructure Services

- **Real-Time Collaboration:** Project-wide group discussions and private 1-on-1 channels between Client and individual Testers powered by Supabase Realtime (WebSocket) with secure attachment sharing.
- **In-App Notification Engine:** Instant alerts for application statuses, new defect reports, and review acceptances.
- **Automated Lifecycle Transitions:** Scheduled serverless cron jobs automating status lifecycles based on deadlines (e.g., Application Deadline -> `In Progress`, Testing Deadline -> `Pending Payout`).
- **Enterprise-Grade Security:** Supabase Auth for identity management, role-based route middleware, and strict PostgreSQL Row-Level Security (RLS) ensuring strict multi-tenant data isolation.

---

## 🏗️ System Architecture & Cloud Infrastructure

The application is architected as a modern serverless SaaS deployed on **Vercel** with **Supabase Cloud**:

| Layer                         | Technologies & Cloud Services                                                             |
| :---------------------------- | :---------------------------------------------------------------------------------------- |
| **Hosting & Edge Delivery**   | **Vercel** (Global Edge Network, Serverless Functions, Automatic CI/CD)                   |
| **Automation & Scheduling**   | **Vercel Cron Jobs** (Daily lifecycle status transition endpoints)                        |
| **Application Layer**         | **Next.js 15 (App Router)** with Server Components & Server Actions                       |
| **Type Safety & Validation**  | **TypeScript** (Strict mode) & **Zod** schema validation                                  |
| **UI & Experience**           | **Tailwind CSS v4**, **Radix UI**, **Lucide Icons**, **Sonner Toasts**, **TipTap Editor** |
| **Database & Auth**           | **Supabase PostgreSQL** with **Row-Level Security (RLS)** & **Supabase Auth**             |
| **Realtime Engine & Storage** | **Supabase Realtime (WebSocket)** & **Supabase Storage Buckets**                          |
| **Caching & Server State**    | **TanStack React Query v5** (Optimistic updates & background cache revalidation)          |
| **Transactional Messaging**   | **Nodemailer SMTP Gateway** (Direct invitation & system emails)                           |

---

## 📂 Codebase Organization

```text
doantotnghiep_uvtester-vn/
├── app/
│   ├── (main)/                   # Marketing landing pages, onboarding, public views
│   │   └── (auth)/               # Auth routes (login, register, email verify, password reset)
│   ├── dashboard/
│   │   ├── client/               # Client portal: project wizard, test suites, bug triage, tester search
│   │   └── tester/               # Tester portal: feed, matching, test runner, bug reporting, profile
│   ├── api/cron/                 # Scheduled endpoints triggered by Vercel Cron
│   ├── _components/              # Shared design system (Chat, Test Cases, Bugs, Notifications)
│   ├── _services/                # Data access layer (Supabase queries, React Query hooks, Matching logic)
│   └── globals.css               # Global styles & theme definitions (Tailwind CSS v4)
├── docs/                         # Software requirements specification (SRS) & system review reports
├── lib/                          # Supabase browser/server client configurations & utilities
├── supabase/migrations/          # Database DDL, RLS policies, indexes, and stored procedures
└── utils/                        # Cookie handlers and route protection middleware
```

---

## 📝 Academic Information & License

This project is submitted as an undergraduate Graduation Thesis in Information Technology at the **University of Technology and Education — The University of Danang**.

- **Author:** Le Trung Son
- **Academic Supervisor:** Dr. Nguyen Tan Thuan
- **Year:** 2026
