# PremiumCollect - User & Operator Manual
**Task ID**: WD-LIC-003  
**Student Code**: DAS-LIC-003  
**Domain**: Premium Collection (Insurance & Finance - LIC Standard)  
**Organization**: Data Alcott Systems (`www.dataalcott.com` / `freeinternships.in`)  
**Submission Portal**: `https://www.freeinternships.in/blog/`

---

## 1. System Overview

**PremiumCollect** is an enterprise-grade Insurance Premium Collection and Payment Tracking platform designed specifically for life insurance institutions, branch desks, field agents, and self-service policyholders.

The application incorporates statutory insurance features including:
- 30-Day Statutory Grace Period tracking with automatic late penalty calculations (1.5%/month).
- 6 payment channels (UPI, Credit/Debit Card, NEFT/RTGS Bank Transfer, Counter Cash, Cheque/DD, Mobile Wallets).
- Indian Currency Words converter for formal financial receipts (Section 64VB of Insurance Act, 1938 compliant).
- Multi-tier role-based scoping (Admin, Cashier, Field Agent, Policyholder).
- Interactive Cash Drawer Reconciliation and Discrepancy Auditing.
- Comprehensive Financial Reporting with PDF/CSV simulation, Section 80C Tax Exemption Certificates, and print optimization.

---

## 2. Quick Launch Instructions

### Method A: 1-Click Desktop Launcher (Windows)
Double-click `run.bat` or `start.bat` in the project root.  
This automatically opens your default web browser to `http://localhost:5173` and boots the local Node.js server.

### Method B: Terminal / Command Prompt
```bash
npm start
# or
node server.js
```
Open your browser and navigate to: **`http://localhost:5173`**

### Method C: Offline Direct File Access
Simply double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Brave, Safari). An integrated `safeStorage` fallback guarantees full offline operational readiness even without a web server.

---

## 3. User Personas & Role Switching

PremiumCollect provides 4 distinct user personas with contextual privilege scoping:

| Persona | Name | Role Badge | Access Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | Rajesh Raman | `Administrator • Full Audit` | Unrestricted access across all policies, audit trails, and reconciliation registers. |
| **Branch Cashier** | Pooja Hegde | `Cashier • Desk #01` | Front-office premium counter collections, instant receipt generation, daily cash register tallying. |
| **Senior Advisor** | K. S. Sundaram | `Agent Code: AGT-9921` | Scoped portfolio view: views and manages only assigned policies (*LIC-12345*, *LIC-67890*, *LIC-90123*). |
| **Policyholder** | Amit Sharma | `Customer Portal • Self-Service` | Personal policy view (*LIC-12345*), one-click online UPI premium dues clearance, instant 80C tax receipt download. |

### How to Switch Roles:
1. Click the **Profile / Role Badge** in the top navigation bar or the **"Switch Role"** button in the floating role banner.
2. The **Authentication & Role Switcher** modal will appear.
3. Click any of the **Quick Switch Personas** buttons (Admin, Cashier, Agent, Policyholder) or enter custom credentials.
4. The application instantly refreshes UI elements, metric counters, and table views according to the selected user's security scope.

---

## 4. Module-by-Module Walkthrough

### Module 1: Dashboard (`#dashboard`)
- **Key Metrics KPI Bar**: Displays Total Collections (₹), Today's Collections (₹), Active Policyholders, and Overdue Premiums.
- **Payment Method Distribution Chart**: Interactive Canvas doughnut chart displaying breakdown across UPI, Card, Cash, Bank Transfer, Cheque, and Mobile Wallet.
- **Collection Trends Chart**: 6-month historical premium collection bar graph with hover data tooltips.
- **Quick Action Bar**: One-click shortcuts for "Collect Premium", "New Policyholder", "Generate Receipt", and "Reconcile Cash".
- **Real-Time Activity Feed**: Live audit stream tracking cashier transactions, receipt generation, and reminder dispatches.

### Module 2: Policy Holder Management (`#holders`)
- **High-Capacity Policy Registry**: Pre-loaded with **2,006 authentic policyholders** (including original seed members *Amit Sharma*, *Priya Patel*, *Rahul Verma*, *Sunita Rao*, etc., plus 2,000 generated insured members with policy numbers `LIC-10001` through `LIC-12000`).
- **Interactive Pagination**: Responsive toolbar allowing 25, 50, 100, 250, or All records per page with rapid navigation.
- **Smart Search & Filters**: Search instantaneously across all 2,006 records by name, policy number, or phone. Filter by frequency (*Yearly*, *Half-Yearly*, *Quarterly*, *Monthly*, *Single Premium*) or status (*Active*, *Grace Period*, *Lapsed*).
- **Add New Policyholder**: Click **"+ Add Policyholder"** to open the modal. Complete the form to register new policies with instant LocalStorage synchronization.
- **Action Buttons**:
  - **Pay**: Direct shortcut to collect dues for that specific policy.
  - **View/Edit**: Update contact details, nominee, or premium schedules.
  - **Download Ledger**: Print individual policyholder premium account statement.

### Module 3: Premium Payment Collection (`#payment`)
- **Policy Selector**: Select any policy from the intelligent dropdown; client name, plan type, due amount, and grace period status populate automatically.
- **Flexible Amount Entry**: Supports full installment dues, partial installments, or advance premium payments.
- **Late Fee Calculation**: Overdue policies automatically append the statutory 1.5% monthly late fee with clear breakdown.
- **Payment Methods Supported**:
  - 💳 **Credit / Debit Card**: Includes card number formatting, expiry, and CVV validation.
  - 📱 **UPI**: Dynamic simulated QR code and VPA field (`customer@okhdfcbank`).
  - 🏦 **Bank Transfer (NEFT/RTGS/IMPS)**: UTR / Transaction Reference verification.
  - 💵 **Cash**: Counter collection with denomination entry.
  - 📝 **Cheque / DD**: Cheque number, clearance date, and bank branch.
  - 📲 **Mobile Wallet**: Paytm, PhonePe, Amazon Pay.
- **One-Click Settlement**: Click **"Process Payment & Generate Receipt"** to log the transaction, update status, and immediately transition to the official LIC receipt preview.

### Module 4: Installment Tracking (`#installments`)
- **Schedule Matrix**: Visualizes all premium installments (e.g., Installment 1/12, 2/12) with associated due dates.
- **Bulk Installment Settlement**: Select multiple overdue or upcoming installments and execute batch settlement with a single transaction receipt.
- **Progress Visualizer**: Color-coded badges indicating *Paid*, *Current*, *In Grace*, and *Overdue*.

### Module 5: Due Date & Grace Period Management (`#due-dates`)
- **Statutory 30-Day Grace Period Engine**: Explicitly calculates remaining days in grace period.
- **Status Categories**:
  - 🟢 **Upcoming**: Due within the next 30 days.
  - 🟡 **In Grace Period**: Payment past due date but within 30-day statutory window (no interest or penalty).
  - 🔴 **Overdue / Penalty**: Past grace period (incurring 1.5% interest per month).
- **Simulated Payment Reminders**: Click **"Send Reminder"** to trigger simulated multi-channel notifications (WhatsApp, SMS, Email) with pre-filled payment links.

### Module 6: Receipt Generation (`#receipt`)
- **LIC Standard Template**: Matches standard Indian Life Insurance Corporation receipt formatting.
- **Key Fields**:
  - Official Branch Code & GSTIN (`33AAAAA0000A1Z5`).
  - Receipt Number (`RCP-2026-XXXXX`).
  - Policyholder Name, Address, & Policy Number.
  - Statutory Section 64VB Compliance Clause.
  - Amount in Figures and Indian Words (*e.g., "Twelve Thousand Rupees Only"*).
  - Next Due Date & Agent Code.
  - Digital Stamp & Authorized Cashier Signature.
- **Actions**:
  - 🖨️ **Print Receipt**: Triggers `@media print` layout stripped of sidebars, perfectly scaled for A4 paper.
  - 📄 **Download PDF**: Generates standalone client document.
  - ✉️ **Send to Policyholder**: Dispatches simulated digital copy via SMS/Email.

### Module 7: Payment History & Audit Log (`#history`)
- **Master Transaction Log**: Complete chronological table of all collections.
- **Filterable Fields**: Filter by date range, payment method, cashier desk, or status.
- **Reverse / Correction**: Admin authorization can void or mark transactions for refund/chargeback.
- **Export Capabilities**: Instant CSV and JSON export for external accounting software (Tally / SAP).

### Module 8: Payment Reconciliation (`#reconciliation`)
- **Daily Cash Drawer Tally**: Compares Expected Dues vs. Actual Physical/Digital Collections.
- **Discrepancy Resolver**: Identifies variance (+₹ surplus / -₹ shortage) and prompts cashier remarks.
- **End-of-Day Settlement**: Click **"Reconcile & Close Register"** to generate a signed EOD balancing certificate.

### Module 9: Reports & Analytics (`#reports`)
- **Pre-Configured Financial Reports**:
  1. **Daily Collection Summary**: Branch collection register categorized by payment channel.
  2. **Defaulter & Aging Analysis**: Policies 30, 60, and 90+ days overdue for field follow-up.
  3. **Payment Frequency Breakdown**: Analysis of Yearly, Half-Yearly, Quarterly, and Monthly portfolios.
  4. **Section 80C Tax Exemption Statement**: Ready-to-file statement for policyholder IT returns.
  5. **Agent Commission Statement**: Commission accrual ledger for field advisors.
- **Exporting Options**: Download as formatted CSV or print-ready PDF preview.

---

## 5. Keyboard Shortcuts & Accessibility

- `Ctrl + Shift + D`: Toggle Dark / Light Mode.
- `Alt + 1` through `Alt + 9`: Rapid navigation between the 9 operational modules.
- `Escape`: Close any active modal.
- `Ctrl + P`: When viewing a receipt, opens optimized print view.

---

## 6. Data Storage & Persistence Note

PremiumCollect stores all operational records in browser **LocalStorage** with zero external database dependencies. All modifications (new policyholders, collected payments, updated due dates, reconciliation logs) are automatically saved and restored on page refresh.

To reset the application to fresh factory sample data at any time, click **"Reset Demo Data"** in the sidebar footer or execute `localStorage.clear()` in the browser developer console.
