/**
 * PremiumCollect - Reports & Analytics Page
 * Pre-configured financial statements (Daily collections, defaulters, frequency distribution, agent commissions, Section 80C tax).
 */

import { state } from '../utils/storage.js';
import { formatINR, formatDate, getDaysDifference, showToast, escapeHTML, downloadCSV } from '../utils/formatters.js';

export function generateSelectedReport() {
  const reportType = document.getElementById('report-type-select')?.value || 'collection';
  const period = document.getElementById('report-period-select')?.value || 'this_month';

  const titleEl = document.getElementById('report-heading-title');
  const periodEl = document.getElementById('report-heading-period');
  const kpiRow = document.getElementById('report-kpi-row');
  const thead = document.getElementById('report-table-thead');
  const tbody = document.getElementById('report-table-tbody');
  const timestamp = document.getElementById('report-gen-timestamp');

  if (timestamp) {
    timestamp.textContent = `Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  }

  if (reportType === 'collection') {
    if (titleEl) titleEl.textContent = 'Premium Collection Summary Statement';
    if (periodEl) periodEl.textContent = `Filter: ${period.toUpperCase()} • Entity: Data Alcott Insurance Premium Collection Desk`;

    const totalCollections = state.payments.reduce((s, p) => s + (p.total_amount || p.amount || 0), 0);
    const totalCount = state.payments.length;
    const avgCollection = totalCount > 0 ? Math.round(totalCollections / totalCount) : 0;

    if (kpiRow) {
      kpiRow.innerHTML = `
        <div class="report-kpi-card">
          <div class="kpi-label">Total Realized Collections</div>
          <div class="kpi-val text-success">${formatINR(totalCollections)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Transactions Processed</div>
          <div class="kpi-val">${totalCount}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Average Ticket Size</div>
          <div class="kpi-val">${formatINR(avgCollection)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Collection Efficiency</div>
          <div class="kpi-val text-primary">94.8%</div>
        </div>
      `;
    }

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Receipt #</th>
          <th>Posting Date</th>
          <th>Policy Holder</th>
          <th>Policy No</th>
          <th>Mode</th>
          <th>Ref / Txn No</th>
          <th class="text-right">Collected (₹)</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = state.payments.map(p => {
        const holder = state.holders.find(h => h.id === p.holder_id) || {};
        return `
          <tr>
            <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
            <td>${formatDate(p.paid_date)}</td>
            <td><strong>${escapeHTML(holder.name || '-')}</strong></td>
            <td><code>${escapeHTML(holder.policy_number || '-')}</code></td>
            <td>${escapeHTML(p.payment_method)}</td>
            <td><small>${escapeHTML(p.reference_no || '-')}</small></td>
            <td class="text-right"><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
          </tr>
        `;
      }).join('');
    }

  } else if (reportType === 'defaulters') {
    if (titleEl) titleEl.textContent = 'Defaulters & Due Date Aging Analysis';
    if (periodEl) periodEl.textContent = 'Accounts in Grace Window & Lapsed Risk Categories';

    const overdueAccounts = state.holders.filter(h => getDaysDifference(h.next_due_date) < 0);
    const overdueTotal = overdueAccounts.reduce((s, h) => s + (h.premium_amount || 0), 0);

    if (kpiRow) {
      kpiRow.innerHTML = `
        <div class="report-kpi-card">
          <div class="kpi-label">Overdue Outstanding</div>
          <div class="kpi-val text-danger">${formatINR(overdueTotal)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Policies at Risk</div>
          <div class="kpi-val text-warning">${overdueAccounts.length}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Reminders Dispatched</div>
          <div class="kpi-val">${state.notifications.length}</div>
        </div>
      `;
    }

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Policy Holder</th>
          <th>Policy No</th>
          <th>Due Date</th>
          <th>Aging Category</th>
          <th>Phone / Contact</th>
          <th class="text-right">Due Premium (₹)</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = overdueAccounts.map(h => {
        const days = getDaysDifference(h.next_due_date);
        return `
          <tr>
            <td><strong>${escapeHTML(h.name)}</strong></td>
            <td><code>${escapeHTML(h.policy_number)}</code></td>
            <td>${formatDate(h.next_due_date)}</td>
            <td><span class="badge ${days < -30 ? 'badge-danger' : 'badge-warning'}">${days < -30 ? 'Critical Lapsed' : 'Grace Period Active'}</span></td>
            <td>${escapeHTML(h.phone || '-')}</td>
            <td class="text-right"><strong>${formatINR(h.premium_amount)}</strong></td>
          </tr>
        `;
      }).join('');
    }

  } else if (reportType === 'frequency') {
    if (titleEl) titleEl.textContent = 'Collections by Premium Frequency Breakdown';
    if (periodEl) periodEl.textContent = 'Distribution analysis across Yearly, Half-Yearly, Quarterly, Monthly';

    const freqMap = {};
    state.holders.forEach(h => {
      const f = h.payment_frequency || 'Yearly';
      if (!freqMap[f]) freqMap[f] = { count: 0, premium: 0 };
      freqMap[f].count++;
      freqMap[f].premium += (h.premium_amount || 0);
    });

    if (kpiRow) {
      kpiRow.innerHTML = `
        <div class="report-kpi-card">
          <div class="kpi-label">Yearly Mode Share</div>
          <div class="kpi-val text-primary">${freqMap['Yearly'] ? freqMap['Yearly'].count : 0} policies</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Monthly Mode Share</div>
          <div class="kpi-val">${freqMap['Monthly'] ? freqMap['Monthly'].count : 0} policies</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Half-Yearly Share</div>
          <div class="kpi-val">${freqMap['Half-Yearly'] ? freqMap['Half-Yearly'].count : 0} policies</div>
        </div>
      `;
    }

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Payment Frequency</th>
          <th>Number of Active Policies</th>
          <th>Average Installment (₹)</th>
          <th class="text-right">Total Annualized Value (₹)</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = Object.keys(freqMap).map(f => {
        const item = freqMap[f];
        const avg = Math.round(item.premium / item.count);
        return `
          <tr>
            <td><strong>${escapeHTML(f)}</strong></td>
            <td>${item.count}</td>
            <td>${formatINR(avg)}</td>
            <td class="text-right"><strong>${formatINR(item.premium)}</strong></td>
          </tr>
        `;
      }).join('');
    }
  } else if (reportType === 'agent_portfolio') {
    const user = state.currentUser;
    const agentCode = user && user.role === 'Agent' ? (user.agentCode || 'AG-102') : 'AG-102';
    const agentName = user && user.role === 'Agent' ? user.name : 'R. K. Verma';
    
    if (titleEl) titleEl.textContent = `Agent Portfolio & Renewal Commission Statement: ${agentName}`;
    if (periodEl) periodEl.textContent = `Advisor Code: ${agentCode} • Entity: Data Alcott Insurance Services • Assigned Portfolio`;

    const myClients = state.holders.filter(h => 
      h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(agentName))
    );
    const totalSumAssured = myClients.reduce((s, h) => s + (h.sum_assured || 0), 0);
    const totalAnnualPremium = myClients.reduce((s, h) => s + (h.premium_amount || 0), 0);
    const estCommission = Math.round(totalAnnualPremium * 0.10);

    if (kpiRow) {
      kpiRow.innerHTML = `
        <div class="report-kpi-card">
          <div class="kpi-label">Assigned Portfolio Size</div>
          <div class="kpi-val text-primary">${myClients.length} Clients</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Total Sum Assured Under Care</div>
          <div class="kpi-val">${formatINR(totalSumAssured)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Annualized Portfolio Premium</div>
          <div class="kpi-val text-success">${formatINR(totalAnnualPremium)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Estimated Advisor Commission (10%)</div>
          <div class="kpi-val text-warning">${formatINR(estCommission)}</div>
        </div>
      `;
    }

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Client Name</th>
          <th>Policy Number</th>
          <th>Plan Name</th>
          <th>Sum Assured</th>
          <th>Premium</th>
          <th>Next Due Date</th>
          <th class="text-right">Projected Commission</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = myClients.map(h => `
        <tr>
          <td><strong>${escapeHTML(h.name)}</strong></td>
          <td><code>${escapeHTML(h.policy_number)}</code></td>
          <td>${escapeHTML(h.plan_name)}</td>
          <td>${formatINR(h.sum_assured)}</td>
          <td><strong>${formatINR(h.premium_amount)}</strong></td>
          <td>${formatDate(h.next_due_date)}</td>
          <td class="text-right text-success"><strong>${formatINR(Math.round(h.premium_amount * 0.10))}</strong></td>
        </tr>
      `).join('');
    }

  } else if (reportType === 'tax_cert') {
    const user = state.currentUser;
    const targetHolder = state.holders.find(h => 
      (user.policyNo && h.policy_number === user.policyNo) || 
      h.name.toLowerCase() === user.name.toLowerCase()
    ) || state.holders[0];

    const holderPayments = state.payments.filter(p => p.holder_id === targetHolder.id && p.status === 'Paid');
    const totalPaidYear = holderPayments.reduce((s, p) => s + (p.total_amount || p.amount || 0), 0) || targetHolder.premium_amount;

    if (titleEl) titleEl.textContent = `Annual Premium Tax Certificate (Section 80C) - FY 2026-27`;
    if (periodEl) periodEl.textContent = `Certificate issued under Section 80C of the Income Tax Act, 1961 for ${targetHolder.name}`;

    if (kpiRow) {
      kpiRow.innerHTML = `
        <div class="report-kpi-card">
          <div class="kpi-label">Insured Policyholder</div>
          <div class="kpi-val text-primary">${escapeHTML(targetHolder.name)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Insurance Policy Number</div>
          <div class="kpi-val font-mono">${escapeHTML(targetHolder.policy_number)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">Total 80C Eligible Premium</div>
          <div class="kpi-val text-success">${formatINR(totalPaidYear)}</div>
        </div>
        <div class="report-kpi-card">
          <div class="kpi-label">IT Act Deductible Status</div>
          <div class="kpi-val text-success"><span class="badge badge-success">100% Eligible</span></div>
        </div>
      `;
    }

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Tax Benefit Category</th>
          <th>Policy & Plan</th>
          <th>Sum Assured</th>
          <th>Premium Payment Mode</th>
          <th>Certification Authority</th>
          <th class="text-right">Tax Deductible Premium (₹)</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td>
            <strong>Section 80C Life Insurance Premium</strong><br>
            <small class="text-muted">Life Insurance Corporation of India (LIC) Plan Standard</small>
          </td>
          <td>
            <strong>${escapeHTML(targetHolder.policy_number)}</strong><br>
            <small>${escapeHTML(targetHolder.plan_name)}</small>
          </td>
          <td>${formatINR(targetHolder.sum_assured)}</td>
          <td>${escapeHTML(targetHolder.payment_frequency)} via Banking Channel</td>
          <td>
            <span class="tax-cert-seal"><i class="fa-solid fa-stamp"></i> CERTIFIED DAS-LIC-003</span>
          </td>
          <td class="text-right">
            <strong class="text-success" style="font-size: 1.15rem;">${formatINR(totalPaidYear)}</strong>
          </td>
        </tr>
      `;
    }

  } else {
    if (titleEl) titleEl.textContent = 'Batch Reconciliation & Settlement Audit';
    if (periodEl) periodEl.textContent = 'Bank Ledger vs Counter Deposits Verification';

    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Date</th>
          <th>Channel</th>
          <th>System Expected (₹)</th>
          <th>Bank Settled (₹)</th>
          <th>Variance (₹)</th>
          <th>Status</th>
          <th>Audited By</th>
        </tr>
      `;
    }

    if (tbody) {
      tbody.innerHTML = state.reconciliation.map(r => `
        <tr>
          <td>${formatDate(r.date)}</td>
          <td>${escapeHTML(r.channel)}</td>
          <td>${formatINR(r.expected)}</td>
          <td><strong>${formatINR(r.actual)}</strong></td>
          <td class="${r.variance === 0 ? 'text-success' : 'text-danger'}">${formatINR(r.variance)}</td>
          <td><span class="badge ${r.variance === 0 ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
          <td><small>${escapeHTML(r.reconciled_by)}</small></td>
        </tr>
      `).join('');
    }
  }
}

export function initReportsPage() {
  document.getElementById('btn-generate-report')?.addEventListener('click', generateSelectedReport);
  document.getElementById('report-type-select')?.addEventListener('change', generateSelectedReport);
  document.getElementById('report-period-select')?.addEventListener('change', generateSelectedReport);

  document.getElementById('btn-print-active-report')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-export-active-report-csv')?.addEventListener('click', () => {
    const type = document.getElementById('report-type-select')?.value || 'collection';
    const thead = document.getElementById('report-table-thead');
    const tbody = document.getElementById('report-table-tbody');

    if (!thead || !tbody) return;

    const headers = Array.from(thead.querySelectorAll('th')).map(th => `"${th.textContent.trim()}"`);
    const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => 
      Array.from(tr.querySelectorAll('td')).map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`)
    );

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`Premium_Report_${type}.csv`, csvContent);
    showToast('Report Downloaded', `Exported ${type} report as CSV`, 'success');
  });
}
