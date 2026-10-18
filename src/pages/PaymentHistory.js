/**
 * PremiumCollect - Payment History Page
 * Complete searchable transaction ledger, multi-column filters, receipt links, and CSV export.
 */

import { state } from '../utils/storage.js';
import { formatINR, formatDate, escapeHTML, downloadCSV, showToast } from '../utils/formatters.js';

let historyNavigateCallback = null;

export function renderHistoryTable() {
  const tbody = document.getElementById('history-table-tbody');
  const searchVal = document.getElementById('history-search-input')?.value.toLowerCase().trim() || '';
  const methodVal = document.getElementById('history-method-filter')?.value || '';
  const statusVal = document.getElementById('history-status-filter')?.value || '';

  if (!tbody) return;

  let filtered = [...state.payments].reverse().filter(p => {
    const holder = state.holders.find(h => h.id === p.holder_id) || {};
    const matchSearch = !searchVal ||
      (p.receipt_no && p.receipt_no.toLowerCase().includes(searchVal)) ||
      (p.reference_no && p.reference_no.toLowerCase().includes(searchVal)) ||
      (holder.name && holder.name.toLowerCase().includes(searchVal)) ||
      (holder.policy_number && holder.policy_number.toLowerCase().includes(searchVal));

    const matchMethod = !methodVal || p.payment_method === methodVal;
    const matchStatus = !statusVal || p.status === statusVal;

    return matchSearch && matchMethod && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No transactions found matching filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const holder = state.holders.find(h => h.id === p.holder_id) || {};
    return `
      <tr>
        <td>${formatDate(p.paid_date)}</td>
        <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
        <td><strong>${escapeHTML(holder.name || '-')}</strong></td>
        <td><code>${escapeHTML(holder.policy_number || '-')}</code></td>
        <td><span class="badge badge-neutral">${escapeHTML(p.payment_method)}</span></td>
        <td><small>${escapeHTML(p.reference_no || '-')}</small></td>
        <td><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
        <td><span class="badge badge-success">${escapeHTML(p.status)}</span></td>
        <td class="text-right">
          <button class="btn btn-outline btn-sm btn-history-rcpt" data-rcpt="${p.receipt_no}">
            <i class="fa-solid fa-receipt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-history-rcpt').forEach(btn => {
    btn.addEventListener('click', () => {
      const rcptNo = btn.dataset.rcpt;
      const targetRcpt = state.receipts.find(r => r.receipt_no === rcptNo);
      if (targetRcpt) {
        state.activeReceiptId = targetRcpt.id;
        if (historyNavigateCallback) historyNavigateCallback('receipt');
      }
    });
  });
}

export function initHistoryPage(onNavigate) {
  historyNavigateCallback = onNavigate;

  document.getElementById('history-search-input')?.addEventListener('input', renderHistoryTable);
  document.getElementById('history-method-filter')?.addEventListener('change', renderHistoryTable);
  document.getElementById('history-status-filter')?.addEventListener('change', renderHistoryTable);

  document.getElementById('btn-reset-history-filters')?.addEventListener('click', () => {
    const s = document.getElementById('history-search-input');
    const m = document.getElementById('history-method-filter');
    const st = document.getElementById('history-status-filter');
    if (s) s.value = '';
    if (m) m.value = '';
    if (st) st.value = '';
    renderHistoryTable();
  });

  document.getElementById('btn-export-history-csv')?.addEventListener('click', () => {
    const headers = ["Date", "Receipt No", "Holder Name", "Policy Number", "Payment Method", "Reference", "Amount", "Status"];
    const rows = state.payments.map(p => {
      const holder = state.holders.find(h => h.id === p.holder_id) || {};
      return [
        p.paid_date,
        `"${p.receipt_no || '-'}"`,
        `"${holder.name || '-'}"`,
        `"${holder.policy_number || '-'}"`,
        `"${p.payment_method}"`,
        `"${p.reference_no || '-'}"`,
        p.total_amount || p.amount,
        p.status
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV("Payment_Ledger_Export.csv", csvContent);
    showToast('Export Complete', 'Exported complete payment history CSV', 'success');
  });
}
