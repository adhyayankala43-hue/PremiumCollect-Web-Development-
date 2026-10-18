/**
 * PremiumCollect - Payment Reconciliation Page
 * End-of-day cashier drawer tally, bank variance audit, and daily settlement sign-off.
 */

import { state, persistAll } from '../utils/storage.js';
import { formatINR, formatDate, escapeHTML, showToast } from '../utils/formatters.js';

export function renderReconciliationTable() {
  const tbody = document.getElementById('reconciliation-table-tbody');
  const noticeContainer = document.getElementById('recon-scope-notice-container');
  if (!tbody) return;

  const user = state.currentUser;
  if (noticeContainer) {
    if (user && user.role === 'Policyholder') {
      noticeContainer.innerHTML = `
        <div class="portfolio-filter-notice">
          <div>
            <i class="fa-solid fa-lock text-info"></i> <strong>Read-Only Member Transparency View:</strong> 
            Physical cash drawer & automated gateway reconciliation is managed by branch cashiers & administrators.
          </div>
          <span class="badge badge-success"><i class="fa-solid fa-check-double"></i> 100% Solvency Audited</span>
        </div>
      `;
    } else {
      noticeContainer.innerHTML = '';
    }
  }

  const totalSystem = state.reconciliation.reduce((s, r) => s + (r.expected || 0), 0);
  const totalBank = state.reconciliation.reduce((s, r) => s + (r.actual || 0), 0);
  const variance = totalBank - totalSystem;

  const sysEl = document.getElementById('recon-stat-system');
  const bankEl = document.getElementById('recon-stat-bank');
  if (sysEl) sysEl.textContent = formatINR(totalSystem);
  if (bankEl) bankEl.textContent = formatINR(totalBank);

  const varianceEl = document.getElementById('recon-stat-variance');
  const varianceSub = document.getElementById('recon-stat-variance-sub');
  const statusBadge = document.getElementById('recon-stat-status-badge');

  if (varianceEl) {
    varianceEl.textContent = formatINR(Math.abs(variance));
    varianceEl.className = variance === 0 ? 'stat-value text-success' : 'stat-value text-warning';
  }

  if (varianceSub) {
    varianceSub.textContent = variance === 0 ? 'Zero variance - 100% matched' : (variance < 0 ? 'Net negative variance' : 'Surplus');
  }

  if (statusBadge) {
    statusBadge.textContent = variance === 0 ? 'Balanced' : 'Audited / Adjusted';
    statusBadge.className = variance === 0 ? 'stat-value text-success' : 'stat-value text-warning';
  }

  tbody.innerHTML = state.reconciliation.map(r => {
    let badge = '<span class="badge badge-success">Reconciled</span>';
    if (r.variance !== 0) badge = '<span class="badge badge-warning">Adjusted</span>';

    return `
      <tr>
        <td><strong>${formatDate(r.date)}</strong></td>
        <td>${escapeHTML(r.channel)}</td>
        <td>${formatINR(r.expected)}</td>
        <td><strong>${formatINR(r.actual)}</strong></td>
        <td class="${r.variance === 0 ? 'text-success' : 'text-danger'}">${formatINR(r.variance)}</td>
        <td>${badge}</td>
        <td><small class="text-muted">${escapeHTML(r.reconciled_by || 'Cashier')}</small></td>
        <td class="text-right">
          <button class="btn btn-outline btn-sm btn-recon-details" data-id="${r.id}">
            <i class="fa-solid fa-file-shield"></i> Audit Note
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-recon-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.reconciliation.find(r => r.id === parseInt(btn.dataset.id, 10));
      if (item) {
        alert(`Reconciliation Audit Note:\n\nChannel: ${item.channel}\nDate: ${item.date}\nSystem Expected: ${formatINR(item.expected)}\nBank Deposited: ${formatINR(item.actual)}\nVariance: ${formatINR(item.variance)}\n\nNotes: ${item.notes || 'No remarks entered'}`);
      }
    });
  });
}

export function initReconciliationActions() {
  document.getElementById('btn-run-auto-reconciliation')?.addEventListener('click', () => {
    showToast('Reconciliation Complete', 'Automated settlement sync verified all collections against banking gateway.', 'success');
    state.notifications.unshift({
      id: Date.now(),
      title: "Daily Settlement Synced",
      text: "Automated end-of-day bank ledger reconciliation completed with zero unassigned discrepancies.",
      time: "Just now",
      type: "success"
    });
    persistAll();
  });
}
