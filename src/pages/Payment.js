/**
 * PremiumCollect - Premium Payment Page
 * Multi-channel premium collection counter, late fee calculator, receipt generation & batch processing.
 */

import { state, persistAll } from '../utils/storage.js';
import { formatINR, formatDate, getDaysDifference, showToast, escapeHTML } from '../utils/formatters.js';
import { openModal, closeModal } from '../components/Modal.js';

let paymentNavigateCallback = null;

export function populatePaymentHoldersDropdown(query = '') {
  const select = document.getElementById('pay-holder-select');
  const chipsContainer = document.getElementById('quick-autofill-chips');
  const submitBtn = document.getElementById('btn-submit-payment');
  if (!select) return;

  const user = state.currentUser;
  let list = state.holders;

  if (query) {
    const q = query.toLowerCase().trim();
    list = state.holders.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.policy_number.toLowerCase().includes(q) ||
      (h.phone && h.phone.includes(q))
    );
  }

  const displayList = list.slice(0, 100);
  const placeholder = query
    ? `-- Found ${list.length.toLocaleString()} matching policies (showing top 100) --`
    : `-- Choose Policy Holder (${state.holders.length.toLocaleString()} total, or search above) --`;

  select.innerHTML = `<option value="">${placeholder}</option>` +
    displayList.map(h => `
      <option value="${h.id}">${escapeHTML(h.name)} (${escapeHTML(h.policy_number)}) - Due: ${formatDate(h.next_due_date)} [₹${h.premium_amount.toLocaleString()}]</option>
    `).join('');

  if (query && list.length === 1) {
    select.value = list[0].id;
    triggerHolderSelectionChange(list[0].id);
  }

  let relevantHolders = state.holders;

  if (user && user.role === 'Policyholder') {
    const myHolder = state.holders.find(h => 
      (user.policyNo && h.policy_number === user.policyNo) || 
      h.name.toLowerCase() === user.name.toLowerCase()
    ) || state.holders[0];

    if (myHolder) {
      select.value = myHolder.id;
      triggerHolderSelectionChange(myHolder.id);
      relevantHolders = [myHolder];
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay My Premium (Secure Checkout)';
    }
  } else if (user && user.role === 'Agent') {
    const agentCode = user.agentCode || 'AG-102';
    const myClients = state.holders.filter(h => 
      h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name))
    );
    if (myClients.length > 0) relevantHolders = myClients;

    if (submitBtn) {
      submitBtn.innerHTML = `<i class="fa-solid fa-handshake"></i> Collect Client Renewal (${escapeHTML(user.name)})`;
    }
  } else {
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Process Payment & Issue Receipt';
    }
  }

  if (chipsContainer) {
    chipsContainer.innerHTML = relevantHolders.slice(0, 4).map(h => `
      <button type="button" class="autofill-chip-btn ${user && user.role === 'Policyholder' ? 'active' : ''}" data-id="${h.id}">
        <div>
          <strong>${user && user.role === 'Policyholder' ? '★ Your Policy: ' : ''}${escapeHTML(h.name)}</strong>
          <span>${escapeHTML(h.policy_number)} • Due: ${formatDate(h.next_due_date)}</span>
        </div>
        <span class="badge badge-success">${formatINR(h.premium_amount)}</span>
      </button>
    `).join('');

    chipsContainer.querySelectorAll('.autofill-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectHolderInPaymentForm(btn.dataset.id);
      });
    });
  }
}

export function selectHolderInPaymentForm(holderId) {
  const select = document.getElementById('pay-holder-select');
  if (!select) return;

  select.value = holderId;
  triggerHolderSelectionChange(holderId);
}

export function triggerHolderSelectionChange(holderId) {
  const summaryBox = document.getElementById('payment-holder-summary');
  const amountInput = document.getElementById('pay-amount-input');
  const lateFeeInput = document.getElementById('pay-late-fee-input');
  const lateFeeHint = document.getElementById('pay-late-fee-hint');

  if (!holderId) {
    summaryBox?.classList.add('hidden');
    if (amountInput) amountInput.value = '';
    if (lateFeeInput) lateFeeInput.value = '0';
    recalculateNetPayable();
    return;
  }

  const holder = state.holders.find(h => h.id === parseInt(holderId, 10));
  if (!holder) return;

  summaryBox?.classList.remove('hidden');
  const pNo = document.getElementById('pay-summary-policy-no');
  const pPlan = document.getElementById('pay-summary-plan');
  const pFreq = document.getElementById('pay-summary-freq');
  const pDue = document.getElementById('pay-summary-due-date');
  const pNom = document.getElementById('pay-summary-nominee');

  if (pNo) pNo.textContent = holder.policy_number;
  if (pPlan) pPlan.textContent = `${holder.plan_name} (Sum: ${formatINR(holder.sum_assured)})`;
  if (pFreq) pFreq.textContent = holder.payment_frequency;
  if (pDue) pDue.textContent = formatDate(holder.next_due_date);
  if (pNom) pNom.textContent = holder.nominee || 'Self';

  const days = getDaysDifference(holder.next_due_date);
  const badge = document.getElementById('pay-summary-grace-badge');

  let lateFee = 0;
  if (days < -30) {
    lateFee = Math.round(holder.premium_amount * 0.015);
    if (badge) {
      badge.className = 'badge badge-danger';
      badge.textContent = `Lapsed (${Math.abs(days)} days overdue) • Late Fee Applicable`;
    }
    if (lateFeeHint) lateFeeHint.textContent = `Overdue past 30 days grace window (+1.5% interest assessed)`;
  } else if (days < 0) {
    if (badge) {
      badge.className = 'badge badge-warning';
      badge.textContent = `Grace Period Active (${30 - Math.abs(days)} days grace remaining) • 0 Late Fee`;
    }
    if (lateFeeHint) lateFeeHint.textContent = `Cover active in grace window. No penalty charged.`;
  } else {
    if (badge) {
      badge.className = 'badge badge-success';
      badge.textContent = `Regular Advance Payment (${days} days till due)`;
    }
    if (lateFeeHint) lateFeeHint.textContent = `On-time collection.`;
  }

  if (amountInput) amountInput.value = holder.premium_amount;
  if (lateFeeInput) lateFeeInput.value = lateFee;

  recalculateNetPayable();
}

export function recalculateNetPayable() {
  const amount = parseFloat(document.getElementById('pay-amount-input')?.value) || 0;
  const lateFee = parseFloat(document.getElementById('pay-late-fee-input')?.value) || 0;
  const total = amount + lateFee;

  const display = document.getElementById('pay-total-payable-display');
  if (display) display.textContent = formatINR(total);
}

export function processPremiumPayment() {
  const holderId = parseInt(document.getElementById('pay-holder-select')?.value, 10);
  const amount = parseFloat(document.getElementById('pay-amount-input')?.value) || 0;
  const lateFee = parseFloat(document.getElementById('pay-late-fee-input')?.value) || 0;
  const totalAmount = amount + lateFee;
  const method = document.querySelector('input[name="payment_method"]:checked')?.value || 'UPI';
  const notes = document.getElementById('pay-notes-input')?.value.trim() || '';

  if (!holderId || amount <= 0) {
    showToast('Validation Error', 'Please select a policy holder and enter a valid amount.', 'error');
    return;
  }

  const holder = state.holders.find(h => h.id === holderId);
  if (!holder) return;

  let referenceNo = '';
  if (method === 'UPI') {
    referenceNo = document.getElementById('pay-upi-ref')?.value.trim() || `UPI-${Date.now().toString().slice(-9)}`;
  } else if (method === 'Cheque') {
    const chq = document.getElementById('pay-cheque-no')?.value.trim() || `CHQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const bank = document.getElementById('pay-cheque-bank')?.value.trim() || 'Bank';
    referenceNo = `${chq} (${bank})`;
  } else if (method === 'Credit Card') {
    const auth = document.getElementById('pay-card-auth')?.value.trim() || `AUTH-${Math.floor(1000 + Math.random() * 9000)}`;
    referenceNo = `POS-CARD-${auth}`;
  } else {
    referenceNo = document.getElementById('pay-generic-ref')?.value.trim() || `TXN-${Date.now().toString().slice(-8)}`;
  }

  const nextRcptNum = state.receipts.length + 1;
  const receiptNo = `RCP-2026-${String(nextRcptNum).padStart(3, '0')}`;
  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const paymentId = (state.payments.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
  const collectorString = `${state.currentUser.name} (${state.currentUser.role}${state.currentUser.deskId ? ' • ' + state.currentUser.deskId : state.currentUser.agentCode ? ' • ' + state.currentUser.agentCode : ' • Online Portal'})`;

  const paymentRecord = {
    id: paymentId,
    holder_id: holder.id,
    amount,
    late_fee: lateFee,
    total_amount: totalAmount,
    due_date: holder.next_due_date,
    paid_date: todayStr,
    status: "Paid",
    payment_method: method,
    reference_no: referenceNo,
    receipt_no: receiptNo,
    collector: collectorString,
    notes: notes || `Premium deposit via ${method} (${state.currentUser.role} Entry)`
  };
  state.payments.push(paymentRecord);

  const receiptRecord = {
    id: nextRcptNum,
    payment_id: paymentId,
    receipt_no: receiptNo,
    date: todayStr,
    time: timeStr,
    holder_id: holder.id,
    holder_name: holder.name,
    policy_no: holder.policy_number,
    plan_name: holder.plan_name,
    amount: amount,
    late_fee: lateFee,
    total_amount: totalAmount,
    payment_method: method,
    reference_no: referenceNo,
    collector: collectorString,
    period_desc: `${holder.payment_frequency} Installment (${new Date().getFullYear()})`
  };
  state.receipts.push(receiptRecord);
  state.activeReceiptId = nextRcptNum;

  // Advance Next Due Date
  const curDue = new Date(holder.next_due_date);
  if (holder.payment_frequency === 'Yearly') {
    curDue.setFullYear(curDue.getFullYear() + 1);
  } else if (holder.payment_frequency === 'Half-Yearly') {
    curDue.setMonth(curDue.getMonth() + 6);
  } else if (holder.payment_frequency === 'Quarterly') {
    curDue.setMonth(curDue.getMonth() + 3);
  } else if (holder.payment_frequency === 'Monthly') {
    curDue.setMonth(curDue.getMonth() + 1);
  }
  holder.next_due_date = curDue.toISOString().split('T')[0];

  const pendingInst = state.installments.find(i => i.holder_id === holder.id && i.status !== 'Paid');
  if (pendingInst) {
    pendingInst.status = 'Paid';
  }

  const reconEntry = state.reconciliation.find(r => r.date === todayStr && r.channel.toLowerCase().includes(method.toLowerCase()));
  if (reconEntry) {
    reconEntry.expected += totalAmount;
    reconEntry.actual += totalAmount;
  } else {
    state.reconciliation.unshift({
      id: (state.reconciliation.reduce((max, r) => Math.max(max, r.id), 0) || 0) + 1,
      date: todayStr,
      channel: `${method} Collections`,
      expected: totalAmount,
      actual: totalAmount,
      variance: 0,
      status: "Reconciled",
      reconciled_by: `${state.currentUser.name} (${state.currentUser.role})`,
      notes: `Immediate counter credit settlement`
    });
  }

  state.notifications.unshift({
    id: Date.now(),
    title: "Payment Collected",
    text: `${formatINR(totalAmount)} collected for ${holder.name} (${holder.policy_number}).`,
    time: "Just now",
    type: "success"
  });

  persistAll();

  const successRcptEl = document.getElementById('success-modal-rcpt-no');
  const successAmtEl = document.getElementById('success-modal-amount');
  const successMethodEl = document.getElementById('success-modal-method');

  if (successRcptEl) successRcptEl.textContent = receiptNo;
  if (successAmtEl) successAmtEl.textContent = formatINR(totalAmount);
  if (successMethodEl) successMethodEl.textContent = `${method} (Ref: ${referenceNo})`;

  openModal('modal-payment-success');

  document.getElementById('premium-collection-form')?.reset();
  document.getElementById('payment-holder-summary')?.classList.add('hidden');
  const totalPayableDisplay = document.getElementById('pay-total-payable-display');
  if (totalPayableDisplay) totalPayableDisplay.textContent = '₹0';

  showToast('Payment Successful', `Receipt #${receiptNo} generated for ${holder.name}`, 'success');

  const btnSuccessRcpt = document.getElementById('btn-success-view-receipt');
  if (btnSuccessRcpt) {
    btnSuccessRcpt.onclick = () => {
      closeModal('modal-payment-success');
      if (paymentNavigateCallback) paymentNavigateCallback('receipt');
    };
  }
}

export function initBulkPaymentModal() {
  const tbody = document.getElementById('bulk-entry-tbody');
  const totalDisplay = document.getElementById('bulk-batch-total-display');

  document.getElementById('btn-open-bulk-modal')?.addEventListener('click', () => {
    renderBulkRows();
    openModal('modal-bulk-payment');
  });

  document.getElementById('btn-add-bulk-row')?.addEventListener('click', () => {
    addBulkRow();
  });

  function renderBulkRows() {
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      addBulkRow();
    }
    updateBulkTotal();
  }

  function addBulkRow() {
    if (!tbody) return;
    const rowIdx = tbody.children.length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rowIdx}</td>
      <td>
        <select class="form-control bulk-holder-select" style="min-width: 170px;">
          <option value="">-- Choose Holder --</option>
          ${state.holders.slice(0, 100).map(h => `<option value="${h.id}">${h.name} (${h.policy_number})</option>`).join('')}
        </select>
      </td>
      <td>
        <select class="form-control bulk-method-select">
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">NEFT / RTGS</option>
          <option value="Cheque">Cheque</option>
          <option value="Cash">Cash</option>
        </select>
      </td>
      <td>
        <input type="number" class="form-control bulk-amount-input" placeholder="0" min="100" style="width: 120px;">
      </td>
      <td>
        <input type="text" class="form-control bulk-ref-input" placeholder="Batch UTR / Chq #" style="width: 130px;">
      </td>
      <td>
        <button type="button" class="btn btn-outline btn-sm text-danger btn-remove-bulk-row" title="Remove Row">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    tr.querySelector('.bulk-holder-select')?.addEventListener('change', (e) => {
      const hid = e.target.value;
      const h = state.holders.find(x => x.id === parseInt(hid, 10));
      if (h) {
        const inp = tr.querySelector('.bulk-amount-input');
        if (inp) inp.value = h.premium_amount;
        updateBulkTotal();
      }
    });

    tr.querySelector('.bulk-amount-input')?.addEventListener('input', updateBulkTotal);

    tr.querySelector('.btn-remove-bulk-row')?.addEventListener('click', () => {
      if (tbody.children.length > 1) {
        tr.remove();
        updateBulkTotal();
      }
    });

    tbody.appendChild(tr);
  }

  function updateBulkTotal() {
    let sum = 0;
    tbody?.querySelectorAll('.bulk-amount-input').forEach(inp => {
      sum += parseFloat(inp.value) || 0;
    });
    if (totalDisplay) totalDisplay.textContent = formatINR(sum);
  }

  document.getElementById('btn-process-bulk-payments')?.addEventListener('click', () => {
    processBulkBatch();
  });

  function processBulkBatch() {
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    let count = 0;
    let totalCollected = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    rows.forEach(tr => {
      const hid = parseInt(tr.querySelector('.bulk-holder-select')?.value, 10);
      const method = tr.querySelector('.bulk-method-select')?.value || 'UPI';
      const amount = parseFloat(tr.querySelector('.bulk-amount-input')?.value) || 0;
      const ref = tr.querySelector('.bulk-ref-input')?.value.trim() || `BATCH-${Date.now().toString().slice(-6)}`;

      if (hid && amount > 0) {
        const holder = state.holders.find(h => h.id === hid);
        if (holder) {
          count++;
          totalCollected += amount;

          const pId = (state.payments.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
          const rNo = `RCP-2026-${String(state.receipts.length + 1).padStart(3, '0')}`;

          state.payments.push({
            id: pId,
            holder_id: holder.id,
            amount: amount,
            late_fee: 0,
            total_amount: amount,
            due_date: holder.next_due_date,
            paid_date: todayStr,
            status: "Paid",
            payment_method: method,
            reference_no: ref,
            receipt_no: rNo,
            collector: `${state.currentUser.name} (Bulk Counter)`,
            notes: "Batch clearing schedule"
          });

          state.receipts.push({
            id: state.receipts.length + 1,
            payment_id: pId,
            receipt_no: rNo,
            date: todayStr,
            time: "Batch Run",
            holder_id: holder.id,
            holder_name: holder.name,
            policy_no: holder.policy_number,
            plan_name: holder.plan_name,
            amount: amount,
            late_fee: 0,
            total_amount: amount,
            payment_method: method,
            reference_no: ref,
            collector: `${state.currentUser.name} (Bulk Counter)`,
            period_desc: "Batch Clearing"
          });
        }
      }
    });

    if (count > 0) {
      persistAll();
      closeModal('modal-bulk-payment');
      showToast('Batch Processed', `Successfully settled ${count} policies totaling ${formatINR(totalCollected)}`, 'success');
      if (paymentNavigateCallback) paymentNavigateCallback('history');
    } else {
      showToast('No Valid Rows', 'Please fill at least one row with a policy holder and amount.', 'error');
    }
  }
}

export function initPaymentPage(onNavigate) {
  paymentNavigateCallback = onNavigate;

  const select = document.getElementById('pay-holder-select');
  select?.addEventListener('change', (e) => {
    triggerHolderSelectionChange(e.target.value);
  });

  document.getElementById('pay-holder-search')?.addEventListener('input', (e) => {
    populatePaymentHoldersDropdown(e.target.value);
  });

  document.getElementById('pay-amount-input')?.addEventListener('input', recalculateNetPayable);
  document.getElementById('pay-late-fee-input')?.addEventListener('input', recalculateNetPayable);

  const channelCards = document.querySelectorAll('.payment-channel-card');
  channelCards.forEach(card => {
    card.addEventListener('click', () => {
      channelCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        updateMethodSubfields(radio.value);
      }
    });
  });

  function updateMethodSubfields(method) {
    const upi = document.getElementById('method-fields-upi');
    const cheque = document.getElementById('method-fields-cheque');
    const card = document.getElementById('method-fields-card');
    const generic = document.getElementById('method-fields-generic');

    upi?.classList.add('hidden');
    cheque?.classList.add('hidden');
    card?.classList.add('hidden');
    generic?.classList.add('hidden');

    if (method === 'UPI') upi?.classList.remove('hidden');
    else if (method === 'Cheque') cheque?.classList.remove('hidden');
    else if (method === 'Credit Card') card?.classList.remove('hidden');
    else generic?.classList.remove('hidden');
  }

  document.getElementById('premium-collection-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    processPremiumPayment();
  });

  document.getElementById('btn-clear-payment-form')?.addEventListener('click', () => {
    document.getElementById('premium-collection-form')?.reset();
    document.getElementById('payment-holder-summary')?.classList.add('hidden');
    const totalDisplay = document.getElementById('pay-total-payable-display');
    if (totalDisplay) totalDisplay.textContent = '₹0';
    showToast('Form Cleared', 'Payment form reset', 'info');
  });

  initBulkPaymentModal();
}
