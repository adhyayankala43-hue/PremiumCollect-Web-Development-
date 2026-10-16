/**
 * PremiumCollect - Installments Tracking Page
 * Installment schedule matrix, bulk clearance, and portfolio milestones.
 */

import { state } from '../utils/storage.js';
import { formatINR, formatDate, escapeHTML, downloadCSV, showToast } from '../utils/formatters.js';
import { tablePaginationState, renderPaginationControls } from './PolicyHolders.js';

let userScopedFilters = {
  installmentsShowAll: false
};

let installmentsNavigateCallback = null;
let installmentsSelectHolderCallback = null;

export function renderInstallmentsTable() {
  const tbody = document.getElementById('installments-table-tbody');
  const noticeContainer = document.getElementById('installments-scope-notice-container');
  const searchVal = document.getElementById('inst-search-input')?.value.toLowerCase().trim() || '';
  const statusVal = document.getElementById('inst-status-filter')?.value || '';

  if (!tbody) return;

  const user = state.currentUser;
  let baseList = state.installments;

  if (noticeContainer) {
    if (user && user.role === 'Policyholder') {
      const myHolder = state.holders.find(h => 
        (user.policyNo && h.policy_number === user.policyNo) || 
        h.name.toLowerCase() === user.name.toLowerCase()
      );
      const myHolderId = myHolder ? myHolder.id : 1;
      const myInsts = state.installments.filter(i => i.holder_id === myHolderId);

      if (!userScopedFilters.installmentsShowAll) {
        baseList = myInsts;
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-calendar-check text-success"></i> <strong>Personal Installment Schedule:</strong> 
              Showing policy repayment milestones for <strong>${escapeHTML(user.name)}</strong> (<code>${user.policyNo || 'LIC-12345'}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-inst-scope">
              <i class="fa-solid fa-list"></i> View All Branch Installments (${state.installments.length})
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-list text-muted"></i> <strong>All Branch Installments:</strong> Showing entire branch portfolio.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-inst-scope">
              <i class="fa-solid fa-user-shield"></i> Focus on My Schedule (${myInsts.length})
            </button>
          </div>
        `;
      }
    } else if (user && user.role === 'Agent') {
      const agentCode = user.agentCode || 'AG-102';
      const myClientIds = state.holders
        .filter(h => h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name)))
        .map(h => h.id);
      const myInsts = state.installments.filter(i => myClientIds.includes(i.holder_id));

      if (!userScopedFilters.installmentsShowAll) {
        baseList = myInsts;
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-user-tag text-primary"></i> <strong>Advisor Portfolio Schedules:</strong> 
              Showing installments for clients assigned to <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-inst-scope">
              <i class="fa-solid fa-list"></i> View All Branch Installments (${state.installments.length})
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Installments View:</strong> Showing all branch schedules.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-inst-scope">
              <i class="fa-solid fa-filter"></i> Filter to My Portfolio (${myInsts.length})
            </button>
          </div>
        `;
      }
    } else {
      noticeContainer.innerHTML = '';
    }

    document.getElementById('btn-toggle-inst-scope')?.addEventListener('click', () => {
      userScopedFilters.installmentsShowAll = !userScopedFilters.installmentsShowAll;
      renderInstallmentsTable();
    });
  }

  const totalInst = baseList.length;
  const paidInst = baseList.filter(i => i.status === 'Paid').length;
  const pendingInst = baseList.filter(i => i.status === 'Pending').length;
  const overdueInst = baseList.filter(i => i.status === 'Overdue').length;

  const totalEl = document.getElementById('inst-stat-total');
  const paidEl = document.getElementById('inst-stat-paid');
  const pendingEl = document.getElementById('inst-stat-pending');
  const overdueEl = document.getElementById('inst-stat-overdue');

  if (totalEl) totalEl.textContent = totalInst;
  if (paidEl) paidEl.textContent = paidInst;
  if (pendingEl) pendingEl.textContent = pendingInst;
  if (overdueEl) overdueEl.textContent = overdueInst;

  let filtered = baseList.filter(inst => {
    const holder = state.holders.find(h => h.id === inst.holder_id) || {};
    const matchSearch = !searchVal ||
      (holder.name && holder.name.toLowerCase().includes(searchVal)) ||
      (holder.policy_number && holder.policy_number.toLowerCase().includes(searchVal));

    const matchStatus = !statusVal || inst.status === statusVal;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No installments matching filter.</td></tr>`;
    document.getElementById('installments-pagination-bar')?.classList.add('hidden');
    return;
  }

  document.getElementById('installments-pagination-bar')?.classList.remove('hidden');

  const pSize = tablePaginationState.installments.pageSize === 'all' ? filtered.length : parseInt(tablePaginationState.installments.pageSize, 10);
  const totalPages = Math.ceil(filtered.length / pSize) || 1;
  if (tablePaginationState.installments.page > totalPages) tablePaginationState.installments.page = 1;
  const start = (tablePaginationState.installments.page - 1) * pSize;
  const pageItems = tablePaginationState.installments.pageSize === 'all' ? filtered : filtered.slice(start, start + pSize);

  tbody.innerHTML = pageItems.map(inst => {
    const holder = state.holders.find(h => h.id === inst.holder_id) || { name: 'Unknown', policy_number: '-' };
    let badge = '<span class="badge badge-warning">Pending</span>';
    if (inst.status === 'Paid') badge = '<span class="badge badge-success">Paid</span>';
    else if (inst.status === 'Overdue') badge = '<span class="badge badge-danger">Overdue</span>';

    return `
      <tr>
        <td><strong>#${inst.installment_no}</strong> of ${inst.total_installments}</td>
        <td>${escapeHTML(holder.name)}</td>
        <td><code>${escapeHTML(holder.policy_number)}</code></td>
        <td>${formatDate(inst.due_date)}</td>
        <td><strong>${formatINR(inst.amount)}</strong></td>
        <td>${badge}</td>
        <td>
          ${inst.status === 'Paid'
            ? '<span class="text-xs text-muted"><i class="fa-solid fa-check"></i> Settled</span>'
            : `<button class="btn btn-primary btn-sm btn-collect-inst" data-holder-id="${holder.id}">
                <i class="fa-solid fa-credit-card"></i> ${user && user.role === 'Policyholder' ? 'Pay Online' : 'Collect Now'}
               </button>`
          }
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-collect-inst').forEach(btn => {
    btn.addEventListener('click', () => {
      if (installmentsNavigateCallback) installmentsNavigateCallback('payment');
      if (installmentsSelectHolderCallback) installmentsSelectHolderCallback(btn.dataset.holderId);
    });
  });

  renderPaginationControls('installments-pagination-nav', 'installments-pagination-info', filtered.length, tablePaginationState.installments, renderInstallmentsTable);
}

export function initInstallmentsPage(onNavigate, onSelectHolder) {
  installmentsNavigateCallback = onNavigate;
  installmentsSelectHolderCallback = onSelectHolder;

  document.getElementById('inst-search-input')?.addEventListener('input', () => {
    tablePaginationState.installments.page = 1;
    renderInstallmentsTable();
  });
  document.getElementById('inst-status-filter')?.addEventListener('change', () => {
    tablePaginationState.installments.page = 1;
    renderInstallmentsTable();
  });
  document.getElementById('installments-page-size')?.addEventListener('change', (e) => {
    tablePaginationState.installments.pageSize = e.target.value;
    tablePaginationState.installments.page = 1;
    renderInstallmentsTable();
  });
  document.getElementById('btn-reset-inst-filters')?.addEventListener('click', () => {
    const s = document.getElementById('inst-search-input');
    const st = document.getElementById('inst-status-filter');
    if (s) s.value = '';
    if (st) st.value = '';
    tablePaginationState.installments.page = 1;
    userScopedFilters.installmentsShowAll = false;
    renderInstallmentsTable();
  });

  document.getElementById('btn-export-installments-csv')?.addEventListener('click', () => {
    const headers = ["Installment No", "Holder Name", "Policy Number", "Due Date", "Amount", "Status"];
    const rows = state.installments.map(i => {
      const holder = state.holders.find(h => h.id === i.holder_id) || {};
      return [
        `"${i.installment_no} of ${i.total_installments}"`,
        `"${holder.name || '-'}"`,
        `"${holder.policy_number || '-'}"`,
        i.due_date,
        i.amount,
        i.status
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV("Installments_Tracking_Report.csv", csvContent);
    showToast('Export Complete', 'Exported installment schedule CSV', 'success');
  });
}
