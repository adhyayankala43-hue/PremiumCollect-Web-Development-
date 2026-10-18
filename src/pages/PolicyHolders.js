/**
 * PremiumCollect - Policy Holders Page
 * Full policyholder lifecycle management, high-volume pagination, filtering, editing, and exports.
 */

import { state, persistAll } from '../utils/storage.js';
import { formatINR, formatDate, getDaysDifference, showToast, escapeHTML, downloadCSV } from '../utils/formatters.js';
import { openModal, closeModal } from '../components/Modal.js';
import { updateDashboard } from './Dashboard.js';

export const tablePaginationState = {
  holders: { page: 1, pageSize: 25 },
  dueDates: { page: 1, pageSize: 25 },
  installments: { page: 1, pageSize: 25 }
};

let userScopedFilters = {
  holdersShowAll: false
};

let holdersNavigateCallback = null;
let holdersSelectHolderCallback = null;

export function renderPaginationControls(containerId, infoId, totalItems, stateObj, onPageChange) {
  const nav = document.getElementById(containerId);
  const info = document.getElementById(infoId);
  if (!nav || !info) return;

  const pageSize = stateObj.pageSize === 'all' ? totalItems : parseInt(stateObj.pageSize, 10);
  const totalPages = (pageSize >= totalItems || pageSize <= 0) ? 1 : Math.ceil(totalItems / pageSize);
  if (stateObj.page > totalPages) stateObj.page = Math.max(1, totalPages);

  const startIdx = totalItems === 0 ? 0 : (stateObj.page - 1) * (stateObj.pageSize === 'all' ? totalItems : pageSize) + 1;
  const endIdx = stateObj.pageSize === 'all' ? totalItems : Math.min(stateObj.page * pageSize, totalItems);

  info.textContent = totalItems === 0 
    ? 'No records found'
    : `Showing ${startIdx.toLocaleString()}–${endIdx.toLocaleString()} of ${totalItems.toLocaleString()} records`;

  if (totalPages <= 1) {
    nav.innerHTML = '';
    return;
  }

  let buttonsHtml = '';
  buttonsHtml += `<button type="button" class="pagination-btn" data-page="${stateObj.page - 1}" ${stateObj.page === 1 ? 'disabled' : ''} title="Previous Page"><i class="fa-solid fa-chevron-left"></i></button>`;

  const cur = stateObj.page;
  const pagesToShow = [];
  pagesToShow.push(1);
  if (cur > 3) pagesToShow.push('...');
  for (let p = Math.max(2, cur - 1); p <= Math.min(totalPages - 1, cur + 1); p++) {
    pagesToShow.push(p);
  }
  if (cur < totalPages - 2) pagesToShow.push('...');
  if (totalPages > 1) pagesToShow.push(totalPages);

  pagesToShow.forEach(p => {
    if (p === '...') {
      buttonsHtml += `<span class="pagination-ellipsis">…</span>`;
    } else {
      buttonsHtml += `<button type="button" class="pagination-btn ${p === cur ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  buttonsHtml += `<button type="button" class="pagination-btn" data-page="${stateObj.page + 1}" ${stateObj.page === totalPages ? 'disabled' : ''} title="Next Page"><i class="fa-solid fa-chevron-right"></i></button>`;

  nav.innerHTML = buttonsHtml;

  nav.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = parseInt(btn.dataset.page, 10);
      if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
        stateObj.page = targetPage;
        onPageChange();
      }
    });
  });
}

export function renderHoldersTable() {
  const tbody = document.getElementById('holders-table-tbody');
  const emptyState = document.getElementById('holders-empty-state');
  const noticeContainer = document.getElementById('holders-scope-notice-container');
  const searchVal = document.getElementById('holder-search-input')?.value.toLowerCase().trim() || '';
  const freqVal = document.getElementById('holder-filter-freq')?.value || '';
  const statusVal = document.getElementById('holder-filter-status')?.value || '';

  if (!tbody) return;

  const user = state.currentUser;
  let baseList = state.holders;

  // Scope notice & role-specific initial dataset
  if (noticeContainer) {
    if (user && user.role === 'Agent') {
      const agentCode = user.agentCode || 'AG-102';
      const agentName = user.name || 'R. K. Verma';
      const myClients = state.holders.filter(h => 
        h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(agentName))
      );

      if (!userScopedFilters.holdersShowAll) {
        baseList = myClients;
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-user-tag text-primary"></i> <strong>Agent Portfolio Scope:</strong> 
              Showing <strong>${myClients.length}</strong> client policies assigned to Advisor <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-holders-scope">
              <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Policies View:</strong> Showing all branch clients across all advisors.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-holders-scope">
              <i class="fa-solid fa-filter"></i> Filter to My Clients (${myClients.length})
            </button>
          </div>
        `;
      }
    } else if (user && user.role === 'Policyholder') {
      const policyNo = user.policyNo || 'LIC-12345';
      const myRecord = state.holders.filter(h => 
        (user.policyNo && h.policy_number === user.policyNo) || 
        h.name.toLowerCase() === user.name.toLowerCase()
      );

      if (!userScopedFilters.holdersShowAll) {
        baseList = myRecord.length > 0 ? myRecord : state.holders.slice(0, 1);
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-shield-halved text-success"></i> <strong>Insured Member Portal:</strong> 
              Showing registered policy for <strong>${escapeHTML(user.name)}</strong> (<code>${policyNo}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-holders-scope">
              <i class="fa-solid fa-folder-open"></i> Browse Public Branch Directory
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-folder-open text-muted"></i> <strong>Public Directory View:</strong> Showing all branch policies.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-holders-scope">
              <i class="fa-solid fa-user-shield"></i> Focus on My Policy
            </button>
          </div>
        `;
      }
    } else {
      noticeContainer.innerHTML = '';
    }

    document.getElementById('btn-toggle-holders-scope')?.addEventListener('click', () => {
      userScopedFilters.holdersShowAll = !userScopedFilters.holdersShowAll;
      renderHoldersTable();
    });
  }

  let filtered = baseList.filter(h => {
    const matchSearch = !searchVal ||
      h.name.toLowerCase().includes(searchVal) ||
      h.policy_number.toLowerCase().includes(searchVal) ||
      (h.phone && h.phone.toLowerCase().includes(searchVal));

    const matchFreq = !freqVal || h.payment_frequency === freqVal;

    let status = 'Active';
    const days = getDaysDifference(h.next_due_date);
    if (days < -30) status = 'Overdue';
    else if (days < 0) status = 'Grace Period';

    const matchStatus = !statusVal || status === statusVal;

    return matchSearch && matchFreq && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState?.classList.remove('hidden');
    document.getElementById('holders-pagination-bar')?.classList.add('hidden');
    return;
  }

  emptyState?.classList.add('hidden');
  document.getElementById('holders-pagination-bar')?.classList.remove('hidden');

  const pSize = tablePaginationState.holders.pageSize === 'all' ? filtered.length : parseInt(tablePaginationState.holders.pageSize, 10);
  const totalPages = Math.ceil(filtered.length / pSize) || 1;
  if (tablePaginationState.holders.page > totalPages) tablePaginationState.holders.page = 1;
  const start = (tablePaginationState.holders.page - 1) * pSize;
  const pageItems = tablePaginationState.holders.pageSize === 'all' ? filtered : filtered.slice(start, start + pSize);

  tbody.innerHTML = pageItems.map(h => {
    const days = getDaysDifference(h.next_due_date);
    let statusBadge = '<span class="badge badge-success">Active</span>';
    if (days < -30) {
      statusBadge = '<span class="badge badge-danger">Lapsed / Overdue</span>';
    } else if (days < 0) {
      statusBadge = '<span class="badge badge-warning">Grace Period</span>';
    }

    const isMyPolicy = user && user.role === 'Policyholder' && (h.policy_number === user.policyNo || h.name.toLowerCase() === user.name.toLowerCase());

    return `
      <tr class="${isMyPolicy ? 'highlight-row' : ''}">
        <td>
          <strong>${escapeHTML(h.name)}</strong>
          ${isMyPolicy ? '<span class="badge badge-primary ml-1">My Policy</span>' : ''}
          <div class="text-xs text-muted">Nominee: ${escapeHTML(h.nominee || 'Self')}</div>
        </td>
        <td>
          <code>${escapeHTML(h.policy_number)}</code>
          <div class="text-xs text-muted">${escapeHTML(h.plan_name || 'Endowment Plan')}</div>
        </td>
        <td><strong>${formatINR(h.premium_amount)}</strong></td>
        <td><span class="badge badge-neutral">${escapeHTML(h.payment_frequency)}</span></td>
        <td>
          <span>${formatDate(h.next_due_date)}</span>
          <div class="text-xs ${days < 0 ? 'text-danger' : 'text-muted'}">
            ${days < 0 ? `${Math.abs(days)}d past due` : `in ${days} days`}
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="text-xs">
            <i class="fa-solid fa-phone"></i> ${escapeHTML(h.phone || '-')}<br>
            <i class="fa-regular fa-envelope"></i> ${escapeHTML(h.email || '-')}
          </div>
        </td>
        <td class="text-right">
          <div class="table-action-btns">
            <button class="btn btn-primary btn-sm btn-holder-pay" data-id="${h.id}" title="Collect Payment">
              <i class="fa-solid fa-receipt"></i> Pay
            </button>
            ${user.role !== 'Policyholder' ? `
            <button class="btn btn-outline btn-sm btn-holder-edit" data-id="${h.id}" title="Edit Holder">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-outline btn-sm btn-holder-delete text-danger" data-id="${h.id}" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
            ` : `
            <button class="btn btn-outline btn-sm btn-holder-view" data-id="${h.id}" title="View Details">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-holder-pay').forEach(btn => {
    btn.addEventListener('click', () => {
      if (holdersNavigateCallback) holdersNavigateCallback('payment');
      if (holdersSelectHolderCallback) holdersSelectHolderCallback(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('.btn-holder-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditHolderModal(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('.btn-holder-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      deletePolicyHolder(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('.btn-holder-view').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditHolderModal(btn.dataset.id);
    });
  });

  renderPaginationControls('holders-pagination-nav', 'holders-pagination-info', filtered.length, tablePaginationState.holders, renderHoldersTable);
}

export function openEditHolderModal(id) {
  const holder = state.holders.find(h => h.id === parseInt(id, 10));
  if (!holder) return;

  const editIdEl = document.getElementById('holder-edit-id');
  if (editIdEl) editIdEl.value = holder.id;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal('new-holder-name', holder.name);
  setVal('new-holder-policy', holder.policy_number);
  setVal('new-holder-plan', holder.plan_name);
  setVal('new-holder-sum-assured', holder.sum_assured);
  setVal('new-holder-amount', holder.premium_amount);
  setVal('new-holder-freq', holder.payment_frequency);
  setVal('new-holder-due-date', holder.next_due_date);
  setVal('new-holder-phone', holder.phone || '');
  setVal('new-holder-email', holder.email || '');
  setVal('new-holder-nominee', holder.nominee || '');

  const titleEl = document.getElementById('modal-holder-title');
  if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Policy Holder';
  openModal('modal-add-holder');
}

export function savePolicyHolder() {
  const editId = document.getElementById('holder-edit-id')?.value;
  const name = document.getElementById('new-holder-name')?.value.trim();
  const policy = document.getElementById('new-holder-policy')?.value.trim();
  const plan = document.getElementById('new-holder-plan')?.value.trim();
  const sumAssured = parseFloat(document.getElementById('new-holder-sum-assured')?.value) || 0;
  const amount = parseFloat(document.getElementById('new-holder-amount')?.value) || 0;
  const freq = document.getElementById('new-holder-freq')?.value;
  const dueDate = document.getElementById('new-holder-due-date')?.value;
  const phone = document.getElementById('new-holder-phone')?.value.trim();
  const email = document.getElementById('new-holder-email')?.value.trim();
  const nominee = document.getElementById('new-holder-nominee')?.value.trim();

  if (!name || !policy || !dueDate || amount <= 0) {
    showToast('Validation Error', 'Please complete all required fields.', 'error');
    return;
  }

  if (editId) {
    const idx = state.holders.findIndex(h => h.id === parseInt(editId, 10));
    if (idx !== -1) {
      state.holders[idx] = {
        ...state.holders[idx],
        name, policy_number: policy, plan_name: plan,
        sum_assured: sumAssured, premium_amount: amount,
        payment_frequency: freq, next_due_date: dueDate,
        phone, email, nominee
      };
      showToast('Updated', `Policy holder ${name} updated successfully!`, 'success');
    }
  } else {
    const newId = (state.holders.reduce((max, h) => Math.max(max, h.id), 0) || 0) + 1;
    const newHolder = {
      id: newId,
      name,
      policy_number: policy,
      plan_name: plan,
      sum_assured: sumAssured,
      premium_amount: amount,
      payment_frequency: freq,
      next_due_date: dueDate,
      phone,
      email,
      nominee,
      agent_name: `${state.currentUser.name} (${state.currentUser.agentCode || state.currentUser.deskId || 'Counter'})`
    };

    state.holders.push(newHolder);

    const newInstId = (state.installments.reduce((max, i) => Math.max(max, i.id), 0) || 0) + 1;
    state.installments.push({
      id: newInstId,
      holder_id: newId,
      installment_no: 1,
      total_installments: freq === 'Yearly' ? 20 : freq === 'Half-Yearly' ? 40 : 80,
      amount,
      due_date: dueDate,
      status: "Pending"
    });

    showToast('Holder Added', `New policy holder ${name} created with policy ${policy}`, 'success');
  }

  persistAll();
  closeModal('modal-add-holder');
  renderHoldersTable();
  updateDashboard();
}

export function deletePolicyHolder(id) {
  const holder = state.holders.find(h => h.id === parseInt(id, 10));
  if (!holder) return;

  if (confirm(`Are you sure you want to delete policy holder "${holder.name}" (${holder.policy_number})?`)) {
    state.holders = state.holders.filter(h => h.id !== parseInt(id, 10));
    persistAll();
    showToast('Deleted', `Policy holder removed from system.`, 'info');
    renderHoldersTable();
    updateDashboard();
  }
}

export function exportHoldersToCSV() {
  const headers = ["ID", "Name", "Policy Number", "Plan Name", "Sum Assured", "Premium Amount", "Frequency", "Next Due Date", "Phone", "Email", "Nominee", "Agent"];
  const rows = state.holders.map(h => [
    h.id,
    `"${h.name}"`,
    `"${h.policy_number}"`,
    `"${h.plan_name}"`,
    h.sum_assured,
    h.premium_amount,
    h.payment_frequency,
    h.next_due_date,
    `"${h.phone}"`,
    `"${h.email}"`,
    `"${h.nominee}"`,
    `"${h.agent_name || '-'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV("Policy_Holders_Export.csv", csvContent);
  showToast('Export Complete', 'Downloaded policy holders CSV', 'success');
}

export function initHoldersPage(onNavigate, onSelectHolder) {
  holdersNavigateCallback = onNavigate;
  holdersSelectHolderCallback = onSelectHolder;

  document.getElementById('holder-search-input')?.addEventListener('input', () => {
    tablePaginationState.holders.page = 1;
    renderHoldersTable();
  });
  document.getElementById('holder-filter-freq')?.addEventListener('change', () => {
    tablePaginationState.holders.page = 1;
    renderHoldersTable();
  });
  document.getElementById('holder-filter-status')?.addEventListener('change', () => {
    tablePaginationState.holders.page = 1;
    renderHoldersTable();
  });
  document.getElementById('holders-page-size')?.addEventListener('change', (e) => {
    tablePaginationState.holders.pageSize = e.target.value;
    tablePaginationState.holders.page = 1;
    renderHoldersTable();
  });
  document.getElementById('btn-reset-holder-filters')?.addEventListener('click', () => {
    const s = document.getElementById('holder-search-input');
    const f = document.getElementById('holder-filter-freq');
    const st = document.getElementById('holder-filter-status');
    if (s) s.value = '';
    if (f) f.value = '';
    if (st) st.value = '';
    tablePaginationState.holders.page = 1;
    userScopedFilters.holdersShowAll = false;
    renderHoldersTable();
  });

  document.getElementById('btn-open-add-holder-modal')?.addEventListener('click', () => {
    document.getElementById('form-add-holder')?.reset();
    const editIdEl = document.getElementById('holder-edit-id');
    if (editIdEl) editIdEl.value = '';
    const titleEl = document.getElementById('modal-holder-title');
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-user-plus"></i> Add New Policy Holder';
    openModal('modal-add-holder');
  });

  document.getElementById('form-add-holder')?.addEventListener('submit', (e) => {
    e.preventDefault();
    savePolicyHolder();
  });

  document.getElementById('btn-export-holders-csv')?.addEventListener('click', exportHoldersToCSV);
}
