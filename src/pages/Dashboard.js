/**
 * PremiumCollect - Dashboard Page
 * Real-time KPI summaries, today's collections, Canvas charts, and recent activity streams.
 */

import { state } from '../utils/storage.js';
import { formatINR, formatDate, getDaysDifference, escapeHTML } from '../utils/formatters.js';

let dashboardNavigateCallback = null;
let dashboardSelectHolderCallback = null;

export function updateDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysPayments = state.payments.filter(p => p.paid_date === todayStr);
  const dailyTotal = todaysPayments.reduce((sum, p) => sum + (p.total_amount || p.amount || 0), 0);

  const dailyEl = document.getElementById('stat-daily-collections');
  const dailyCountEl = document.getElementById('stat-daily-count');
  if (dailyEl) dailyEl.textContent = formatINR(dailyTotal);
  if (dailyCountEl) dailyCountEl.textContent = todaysPayments.length;

  const currentYearMonth = todayStr.substring(0, 7);
  const monthlyPayments = state.payments.filter(p => (p.paid_date || '').startsWith(currentYearMonth));
  const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + (p.total_amount || p.amount || 0), 0);
  const target = 350000;
  const targetPct = Math.min(100, Math.round((monthlyTotal / target) * 100));

  const monthlyEl = document.getElementById('stat-monthly-collections');
  const targetPctEl = document.getElementById('stat-target-pct');
  if (monthlyEl) monthlyEl.textContent = formatINR(monthlyTotal);
  if (targetPctEl) targetPctEl.textContent = `${targetPct}% of target`;

  let pendingCount = 0;
  let pendingTotal = 0;
  let overdueCount = 0;
  let overdueTotal = 0;

  state.holders.forEach(h => {
    const days = getDaysDifference(h.next_due_date);
    if (days < -30) {
      overdueCount++;
      overdueTotal += (h.premium_amount || 0);
    } else if (days <= 30) {
      pendingCount++;
      pendingTotal += (h.premium_amount || 0);
    }
  });

  const pendingAmtEl = document.getElementById('stat-pending-amount');
  const pendingCountEl = document.getElementById('stat-pending-count');
  if (pendingAmtEl) pendingAmtEl.textContent = formatINR(pendingTotal);
  if (pendingCountEl) pendingCountEl.textContent = pendingCount;

  const overdueAmtEl = document.getElementById('stat-overdue-amount');
  const overdueCountEl = document.getElementById('stat-overdue-count');
  if (overdueAmtEl) overdueAmtEl.textContent = formatINR(overdueTotal);
  if (overdueCountEl) overdueCountEl.textContent = overdueCount;

  const badgeHolders = document.getElementById('badge-holders-count');
  const badgeOverdue = document.getElementById('badge-overdue-count');
  if (badgeHolders) badgeHolders.textContent = state.holders.length > 999 ? '2,000+' : state.holders.length;
  if (badgeOverdue) badgeOverdue.textContent = overdueCount;

  // User-Dependent Hero Title & Description
  const user = state.currentUser;
  const heroH2 = document.querySelector('.dashboard-hero .hero-text h2');
  const heroP = document.querySelector('.dashboard-hero .hero-text p');
  if (user && heroH2) {
    heroH2.textContent = `Welcome back, ${user.name}`;
  }
  if (user && heroP) {
    if (user.role === 'Admin') {
      heroP.innerHTML = `<span class="badge badge-warning">Branch Executive</span> Central Management & Settlement Console • Full clearance over counters & agent network`;
    } else if (user.role === 'Cashier') {
      heroP.innerHTML = `<span class="badge badge-success">Counter Terminal</span> ${user.deskId || 'Desk #01'} Active • Rapid premium intake, digital receipts & instant ledger clearance`;
    } else if (user.role === 'Agent') {
      heroP.innerHTML = `<span class="badge badge-info">Life Advisor</span> Advisor Code: <strong>${user.agentCode || 'AG-102'}</strong> • Portfolio servicing & client renewal follow-ups`;
    } else if (user.role === 'Policyholder') {
      heroP.innerHTML = `<span class="badge badge-primary">Insured Portal</span> Policy <code>${user.policyNo || 'LIC-12345'}</code> • Instant premium renewal, receipt downloads & Section 80C certs`;
    }
  }

  renderDashboardUrgentTable();
  renderDashboardRecentPayments();
  updateCharts();
}

export function renderDashboardUrgentTable() {
  const tbody = document.getElementById('dashboard-urgent-dues-tbody');
  if (!tbody) return;

  const urgent = state.holders
    .map(h => ({ ...h, days: getDaysDifference(h.next_due_date) }))
    .filter(h => h.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  if (urgent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No urgent dues currently.</td></tr>`;
    return;
  }

  tbody.innerHTML = urgent.map(item => {
    let statusBadge = '';
    if (item.days < -30) {
      statusBadge = `<span class="badge badge-danger">Lapsed (${Math.abs(item.days)}d ago)</span>`;
    } else if (item.days < 0) {
      statusBadge = `<span class="badge badge-warning">Grace Period (${Math.abs(item.days)}d)</span>`;
    } else {
      statusBadge = `<span class="badge badge-info">Due in ${item.days}d</span>`;
    }

    return `
      <tr>
        <td><strong>${escapeHTML(item.name)}</strong></td>
        <td><code>${escapeHTML(item.policy_number)}</code></td>
        <td>${formatDate(item.next_due_date)}</td>
        <td><strong>${formatINR(item.premium_amount)}</strong></td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-primary btn-sm btn-pay-now" data-holder-id="${item.id}">
            <i class="fa-solid fa-credit-card"></i> Pay
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-pay-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const hid = btn.dataset.holderId;
      if (dashboardNavigateCallback) dashboardNavigateCallback('payment');
      if (dashboardSelectHolderCallback) dashboardSelectHolderCallback(hid);
    });
  });
}

export function renderDashboardRecentPayments() {
  const tbody = document.getElementById('dashboard-recent-payments-tbody');
  if (!tbody) return;

  const recent = [...state.payments].reverse().slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No recent transactions recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(p => {
    const holder = state.holders.find(h => h.id === p.holder_id) || {};
    return `
      <tr>
        <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
        <td>${escapeHTML(holder.name || 'Unknown')}</td>
        <td><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
        <td><span class="badge badge-neutral">${escapeHTML(p.payment_method)}</span></td>
        <td><span class="badge badge-success">Settled</span></td>
        <td>
          <button class="btn btn-outline btn-sm btn-view-rcpt" data-rcpt="${p.receipt_no}">
            <i class="fa-solid fa-receipt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-view-rcpt').forEach(btn => {
    btn.addEventListener('click', () => {
      const rcptNo = btn.dataset.rcpt;
      const targetRcpt = state.receipts.find(r => r.receipt_no === rcptNo);
      if (targetRcpt) {
        state.activeReceiptId = targetRcpt.id;
        if (dashboardNavigateCallback) dashboardNavigateCallback('receipt');
      }
    });
  });
}

export function updateCharts() {
  const isDark = state.currentTheme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  const canvasTrends = document.getElementById('chart-collection-trends');
  if (canvasTrends && canvasTrends.getContext) {
    const ctx = canvasTrends.getContext('2d');
    const w = canvasTrends.parentElement?.clientWidth || 500;
    const h = 260;
    canvasTrends.width = w;
    canvasTrends.height = h;

    ctx.clearRect(0, 0, w, h);

    const months = ['Jul', 'Aug', 'Sep', 'Oct (Curr)', 'Nov (Proj)', 'Dec (Proj)'];
    const values = [210, 280, 245, 310, 350, 420];
    const maxVal = 500;

    const paddingLeft = 45;
    const paddingBottom = 40;
    const chartW = w - paddingLeft - 20;
    const chartH = h - paddingBottom - 20;

    ctx.strokeStyle = isDark ? '#203539' : '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 20 + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${Math.round(maxVal - (maxVal / 4) * i)}k`, paddingLeft - 6, y + 3);
    }

    const barWidth = Math.min(36, (chartW / months.length) - 16);
    const bottomY = 20 + chartH;

    months.forEach((m, i) => {
      const barH = (values[i] / maxVal) * chartH;
      const x = paddingLeft + (chartW / months.length) * i + ((chartW / months.length) - barWidth) / 2;
      const y = bottomY - barH;

      const grad = ctx.createLinearGradient(0, y, 0, bottomY);
      if (i === 3) {
        grad.addColorStop(0, '#059669');
        grad.addColorStop(1, '#047857');
      } else {
        grad.addColorStop(0, '#10B981');
        grad.addColorStop(1, '#34D399');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(m, x + barWidth / 2, bottomY + 20);
      ctx.fillText(`₹${values[i]}k`, x + barWidth / 2, y - 6);
    });
  }

  const canvasMethods = document.getElementById('chart-payment-methods');
  if (canvasMethods && canvasMethods.getContext) {
    const ctx = canvasMethods.getContext('2d');
    const w = canvasMethods.parentElement?.clientWidth || 300;
    const h = 260;
    canvasMethods.width = w;
    canvasMethods.height = h;

    ctx.clearRect(0, 0, w, h);
    const centerX = w / 2;
    const centerY = h / 2 - 15;
    const radius = Math.min(centerX, centerY) - 20;

    const slices = [
      { label: 'UPI', val: 35, color: '#059669' },
      { label: 'Card', val: 25, color: '#3B82F6' },
      { label: 'Bank', val: 20, color: '#10B981' },
      { label: 'Cheque', val: 12, color: '#8B5CF6' },
      { label: 'Cash', val: 8, color: '#F59E0B' }
    ];

    let currentAngle = -0.5 * Math.PI;
    slices.forEach(s => {
      const sliceAngle = (s.val / 100) * 2 * Math.PI;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.65, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();
      currentAngle += sliceAngle;
    });

    ctx.fillStyle = textColor;
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Payment Channels', centerX, centerY + 3);
  }
}

export function initDashboard(onNavigate, onSelectHolder) {
  dashboardNavigateCallback = onNavigate;
  dashboardSelectHolderCallback = onSelectHolder;

  // Window resize debounced chart refresh
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activeSec = document.querySelector('.content-section.active');
      if (activeSec && activeSec.id === 'dashboard') {
        updateCharts();
      }
    }, 150);
  });
}
