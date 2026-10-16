/**
 * PremiumCollect - Due Dates & Grace Period Page
 * Statutory 30-day grace period tracking, late fee interest calculation, and automated payment reminders.
 */

import { state, persistAll } from '../utils/storage.js';
import { formatINR, formatDate, getDaysDifference, escapeHTML, showToast } from '../utils/formatters.js';
import { openModal, closeModal } from '../components/Modal.js';
import { tablePaginationState, renderPaginationControls } from './PolicyHolders.js';

let userScopedFilters = {
  dueDatesShowAll: false
};

let dueDatesNavigateCallback = null;
let dueDatesSelectHolderCallback = null;

export function renderDueDatesTable() {
  const tbody = document.getElementById('due-dates-table-tbody');
  const noticeContainer = document.getElementById('due-dates-scope-notice-container');
  const urgencyFilter = document.getElementById('due-filter-urgency')?.value || '';
  if (!tbody) return;

  const user = state.currentUser;
  let baseList = state.holders;

  if (noticeContainer) {
    if (user && user.role === 'Policyholder') {
      const myHolder = state.holders.find(h => 
        (user.policyNo && h.policy_number === user.policyNo) || 
        h.name.toLowerCase() === user.name.toLowerCase()
      );
      const myRecord = myHolder ? [myHolder] : [state.holders[0]];

      if (!userScopedFilters.dueDatesShowAll) {
        baseList = myRecord;
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-clock text-warning"></i> <strong>My Policy Due Date & Grace Period:</strong> 
              Tracking deadline for <strong>${escapeHTML(user.name)}</strong> (<code>${user.policyNo || 'LIC-12345'}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-due-scope">
              <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-globe text-muted"></i> <strong>Branch Wide Due Dates:</strong> Showing all branch due schedules.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-due-scope">
              <i class="fa-solid fa-user-shield"></i> Show Only My Due Date
            </button>
          </div>
        `;
      }
    } else if (user && user.role === 'Agent') {
      const agentCode = user.agentCode || 'AG-102';
      const myClients = state.holders.filter(h => 
        h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name))
      );

      if (!userScopedFilters.dueDatesShowAll) {
        baseList = myClients;
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-user-tag text-primary"></i> <strong>Advisor Portfolio Dues:</strong> 
              Tracking grace periods for clients of <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-due-scope">
              <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
            </button>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Due Dates:</strong> Showing all branch clients.
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-due-scope">
              <i class="fa-solid fa-filter"></i> Filter to My Portfolio (${myClients.length})
            </button>
          </div>
        `;
      }
    } else {
      noticeContainer.innerHTML = '';
    }

    document.getElementById('btn-toggle-due-scope')?.addEventListener('click', () => {
      userScopedFilters.dueDatesShowAll = !userScopedFilters.dueDatesShowAll;
      renderDueDatesTable();
    });
  }

  let list = baseList.map(h => {
    const days = getDaysDifference(h.next_due_date);
    let cat = 'upcoming';
    if (days < -30) cat = 'lapsed';
    else if (days < 0) cat = 'grace';
    return { ...h, days, cat };
  });

  if (urgencyFilter) {
    list = list.filter(item => item.cat === urgencyFilter);
  }

  list.sort((a, b) => a.days - b.days);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No policy records matching urgency category.</td></tr>`;
    document.getElementById('due-dates-pagination-bar')?.classList.add('hidden');
    return;
  }

  document.getElementById('due-dates-pagination-bar')?.classList.remove('hidden');

  const pSize = tablePaginationState.dueDates.pageSize === 'all' ? list.length : parseInt(tablePaginationState.dueDates.pageSize, 10);
  const totalPages = Math.ceil(list.length / pSize) || 1;
  if (tablePaginationState.dueDates.page > totalPages) tablePaginationState.dueDates.page = 1;
  const start = (tablePaginationState.dueDates.page - 1) * pSize;
  const pageItems = tablePaginationState.dueDates.pageSize === 'all' ? list : list.slice(start, start + pSize);

  tbody.innerHTML = pageItems.map(item => {
    let daysText = '';
    let graceBadge = '';

    if (item.cat === 'lapsed') {
      daysText = `<span class="text-danger font-bold">${Math.abs(item.days)} days OVERDUE</span>`;
      graceBadge = `<span class="badge badge-danger">Lapsed (&gt;30d grace expired)</span>`;
    } else if (item.cat === 'grace') {
      daysText = `<span class="text-warning font-bold">${Math.abs(item.days)} days past due</span>`;
      graceBadge = `<span class="badge badge-warning">Grace Period (${30 - Math.abs(item.days)}d left)</span>`;
    } else {
      daysText = `<span class="text-muted font-bold">${item.days} days remaining</span>`;
      graceBadge = `<span class="badge badge-success">Regular Window</span>`;
    }

    return `
      <tr>
        <td>
          <strong>${escapeHTML(item.name)}</strong>
          <div class="text-xs text-muted">${escapeHTML(item.phone || '')}</div>
        </td>
        <td><code>${escapeHTML(item.policy_number)}</code></td>
        <td>${formatDate(item.next_due_date)}</td>
        <td>${daysText}</td>
        <td>${graceBadge}</td>
        <td><strong>${formatINR(item.premium_amount)}</strong></td>
        <td class="text-right">
          <button class="btn btn-outline btn-sm btn-open-reminder" data-id="${item.id}" title="Send Simulated Reminder">
            <i class="fa-solid fa-paper-plane"></i> Remind
          </button>
          <button class="btn btn-primary btn-sm btn-pay-due" data-id="${item.id}" title="Collect Payment">
            <i class="fa-solid fa-receipt"></i> Pay
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-open-reminder').forEach(btn => {
    btn.addEventListener('click', () => {
      openReminderModal(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('.btn-pay-due').forEach(btn => {
    btn.addEventListener('click', () => {
      if (dueDatesNavigateCallback) dueDatesNavigateCallback('payment');
      if (dueDatesSelectHolderCallback) dueDatesSelectHolderCallback(btn.dataset.id);
    });
  });

  renderPaginationControls('due-dates-pagination-nav', 'due-dates-pagination-info', list.length, tablePaginationState.dueDates, renderDueDatesTable);
}

export function openReminderModal(holderId) {
  const holder = state.holders.find(h => h.id === parseInt(holderId, 10));
  if (!holder) return;

  const days = getDaysDifference(holder.next_due_date);
  const rHolderId = document.getElementById('reminder-holder-id');
  const rName = document.getElementById('reminder-recipient-name');
  const rPolicy = document.getElementById('reminder-recipient-policy');
  const badge = document.getElementById('reminder-recipient-due-badge');

  if (rHolderId) rHolderId.value = holder.id;
  if (rName) rName.textContent = holder.name;
  if (rPolicy) rPolicy.textContent = `Policy: ${holder.policy_number} • Premium: ${formatINR(holder.premium_amount)}`;

  if (badge) {
    if (days < 0) {
      badge.className = 'badge badge-danger';
      badge.textContent = `Overdue (${Math.abs(days)} days)`;
    } else {
      badge.className = 'badge badge-warning';
      badge.textContent = `Due in ${days} days`;
    }
  }

  const template = `Dear ${holder.name},\nThis is a friendly reminder from Data Alcott Insurance Services regarding your policy ${holder.policy_number}. Your premium of ${formatINR(holder.premium_amount)} is scheduled for ${formatDate(holder.next_due_date)}. Kindly pay online or at our branch to ensure continuous life coverage.`;
  const preview = document.getElementById('reminder-message-preview');
  if (preview) preview.value = template;

  openModal('modal-reminder');
}

export function initDueDatesPage(onNavigate, onSelectHolder) {
  dueDatesNavigateCallback = onNavigate;
  dueDatesSelectHolderCallback = onSelectHolder;

  document.getElementById('due-filter-urgency')?.addEventListener('change', () => {
    tablePaginationState.dueDates.page = 1;
    renderDueDatesTable();
  });
  document.getElementById('due-dates-page-size')?.addEventListener('change', (e) => {
    tablePaginationState.dueDates.pageSize = e.target.value;
    tablePaginationState.dueDates.page = 1;
    renderDueDatesTable();
  });

  document.getElementById('btn-send-bulk-reminders')?.addEventListener('click', () => {
    const count = state.holders.filter(h => getDaysDifference(h.next_due_date) <= 30).length;
    showToast('Bulk Reminders Sent', `Successfully dispatched ${count} automated SMS/Email reminders to policyholders!`, 'warning');
    state.notifications.unshift({
      id: Date.now(),
      title: "Bulk Reminders Dispatched",
      text: `Sent notification blast to ${count} policyholders with active grace periods.`,
      time: "Just now",
      type: "info"
    });
    persistAll();
  });

  document.getElementById('btn-dispatch-reminder')?.addEventListener('click', () => {
    const name = document.getElementById('reminder-recipient-name')?.textContent;
    closeModal('modal-reminder');
    showToast('Reminder Sent', `Simulated reminder dispatched to ${name} via selected channels!`, 'success');
  });
}
