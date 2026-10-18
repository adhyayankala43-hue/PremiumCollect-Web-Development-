# 💰 PremiumCollect - Complete Insurance Premium Collection & Payment Tracking Platform

[![Internship Task](https://img.shields.io/badge/Task%20ID-WD--LIC--003-emerald)](https://www.freeinternships.in/blog/)
[![Student Code](https://img.shields.io/badge/Student%20Code-DAS--LIC--003-blue)](https://www.freeinternships.in/blog/)
[![Company](https://img.shields.io/badge/Company-Data%20Alcott%20Systems-green)](https://www.dataalcott.com)
[![Internship](https://img.shields.io/badge/Internship-Free%20Web%20Development%20Online-brightgreen)](https://freeinternships.in)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

> Built for the **Free Web Development Internship Online** conducted by **Data Alcott Systems**.  
> **Official Task Link**: [https://www.freeinternships.in/blog/](https://www.freeinternships.in/blog/)

---

## 📋 Task Information

| Field | Detail |
| :--- | :--- |
| **Task ID** | `WD-LIC-003` |
| **Student Code** | `DAS-LIC-003` |
| **Domain** | Premium Collection (Insurance & Finance - LIC Standards) |
| **Task Name** | Premium Collection System (`PremiumCollect`) |
| **Company** | Data Alcott Systems (`www.dataalcott.com`) |
| **Portal** | [freeinternships.in](https://freeinternships.in) |
| **Blog Submission URL** | [https://www.freeinternships.in/blog/](https://www.freeinternships.in/blog/) |

---

## 🌟 Project Overview

**PremiumCollect** is an all-in-one, front-office Insurance Premium Collection and Payment Tracking Web Platform. Designed specifically for insurance branch cashiers, field advisors, accounting auditors, and self-service policyholders, it delivers lightning-fast receipt generation, statutory grace period tracking, payment reconciliation, and tax deduction compliance.

The platform requires **no external database**; all records (policyholders, premium schedules, payments, receipts, reconciliation records, and user session states) are managed via robust client-side JavaScript with `localStorage` persistence and fallback mechanisms.

---

## 🎨 Design & Aesthetic Guidelines

- **Color Palette**:
  - Primary Emerald Green: `#059669`
  - Crisp White: `#FFFFFF`
  - Mint / Light Green Accent: `#D1FAE5`
  - Surface Background: `#F8FAFC` / `#0F172A` (Dark Mode)
- **Typography**: Modern and professional typography utilizing `Plus Jakarta Sans` and `JetBrains Mono`.
- **Layout**: Clean responsive navigation with collapsable sidebar, sticky top bar, breadcrumbs, search shortcuts, and modal dialogs.
- **Dark Mode**: Integrated one-click Dark Mode toggle (`Ctrl+Shift+D` or theme switch button).

---

## 🚀 Key Features

### Core Modules
1. **📊 Executive Dashboard**: Real-time KPI summaries, today's collections, interactive Canvas doughnut chart for payment methods, 6-month collection trend bar chart, and recent activity logs.
2. **👥 Policy Holder Management**: Register new policyholders, edit existing policies, filter by frequency (*Yearly*, *Half-Yearly*, *Quarterly*, *Monthly*, *Single Premium*), and instant search.
3. **💳 Premium Payment Collection**: Multi-channel collection supporting Credit/Debit Card, UPI (with QR code simulation), Net Banking NEFT/RTGS, Counter Cash, Cheque/DD, and Mobile Wallets.
4. **📅 Installment Tracking**: Detailed installment schedule matrix (1/12, 2/12...) with one-click multi-installment bulk clearance.
5. **⏳ Due Date & Grace Period Engine**: Statutory 30-day grace period tracking, automatic 1.5% late fee interest calculation on overdue policies, and simulated WhatsApp/SMS/Email payment reminders.
6. **🧾 Official Receipt Generation**: Standard LIC receipt template with GSTIN, digital watermark stamp, cashier signature, and Indian numbering words converter (*"Twelve Thousand Rupees Only"*), compliant with Section 64VB of the Insurance Act.
7. **🕒 Payment History & Audit Log**: Complete searchable transaction ledger with CSV export and transaction reversal capabilities.
8. **⚖️ Payment Reconciliation**: End-of-Day cashier cash drawer tally, discrepancy detection, and audit sign-off.
9. **📈 Reports & Analytics**: 5 pre-configured reports: Daily Collections, Defaulters List, Frequency Distribution, Agent Commission Ledger, and Section 80C Tax Exemption Statements.

- ✅ **High-Volume Dataset**: 2,006 authentic Indian policyholders with instant search, frequency filters, and table pagination (25, 50, 100, 250, All records).
- ✅ **Dark Mode Toggle**: Sleek dark theme with preserved state.
- ✅ **User Personas & Role Switching**: 4 distinct roles (Admin, Cashier, Field Agent, and Policyholder) with user-dependent scoping.
- ✅ **Simulated Payment Reminders**: Interactive notification drawer for WhatsApp, SMS, and Email reminders.
- ✅ **Print-Optimized Receipts**: Seamless `@media print` styling for standard A4 paper.
- ✅ **Data Export**: Instant export to CSV and JSON for external accounting.
- ✅ **Zero-Dependency Node Server**: Built-in `server.js` running on port `5173`.
- ✅ **1-Click Batch Launchers**: `run.bat` and `start.bat` for Windows desktop users.

---

## 📁 Repository Structure

```text
premium-collect/
├── src/
│   ├── components/      # Reusable UI (Navbar, Sidebar, Buttons, Modal)
│   ├── pages/           # Main views (Dashboard, PolicyHolders, Payment, Reports)
│   ├── mockData/        # JSON files holding fake data for policies & payments
│   ├── assets/          # Images, icons, CSS files
│   ├── utils/           # Safe storage, INR formatting, date helpers
│   └── App.js           # Main routing file
├── index.html            # Main single-page application entry point
├── server.js             # Zero-dependency Node.js HTTP server (Port 5173)
├── package.json          # Project manifest & npm scripts
├── run.bat               # 1-Click desktop launcher for Windows
├── start.bat             # Alternative desktop launcher alias
├── USER_MANUAL.md        # Comprehensive operator and user guide
├── PROJECT_REPORT.md     # 1-2 page formal internship project report
└── README.md             # Project documentation & submission instructions
```

---

## 💻 Getting Started & Local Setup

### Option 1: 1-Click Launcher (Windows)
Double-click `run.bat` or `start.bat` in the project root. The application will start and open automatically in your default browser at `http://localhost:5173`.

### Option 2: Terminal / Node.js
```bash
# Clone the repository
git clone https://github.com/your-username/premium-collection-system.git

# Navigate to project directory
cd premium-collection-system

# Start the application server
npm start
# or
node server.js
```
Open your browser and navigate to: **`http://localhost:5173`**

### Option 3: Direct File Execution
Double-click `index.html` to open directly in any modern browser without requiring Node.js or a web server.

---

## 👥 User Personas & Scoping

| Persona | Name | Role | Default Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | Rajesh Raman | Administrator | Full audit access across all policies, reports, and reconciliation. |
| **Branch Cashier** | Pooja Hegde | Cashier | Front-desk payment collection, instant receipts, daily drawer tally. |
| **Senior Advisor** | K. S. Sundaram | Agent (AGT-9921) | Scoped agent portfolio: manages assigned policies (*LIC-12345*, *LIC-67890*). |
| **Policyholder** | Amit Sharma | Customer | Self-service portal: views personal policy (*LIC-12345*), pays dues, downloads 80C receipt. |

---

