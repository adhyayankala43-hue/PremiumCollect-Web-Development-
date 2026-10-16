/**
 * PremiumCollect - Official Premium Receipt Page
 * Section 64VB compliant insurance receipt generator, number to words converter & watermark printing.
 */

import { state } from '../utils/storage.js';
import { formatINR, formatDate, numberToWordsINR, showToast } from '../utils/formatters.js';

export function renderReceiptView() {
  const selector = document.getElementById('receipt-selector-dropdown');
  if (!selector) return;

  const user = state.currentUser;
  let availableReceipts = state.receipts;

  if (user && user.role === 'Policyholder') {
    const myReceipts = state.receipts.filter(r => 
      (user.policyNo && r.policy_no === user.policyNo) || 
      (r.holder_name && r.holder_name.toLowerCase() === user.name.toLowerCase())
    );
    if (myReceipts.length > 0) {
      availableReceipts = myReceipts;
      if (!availableReceipts.some(r => r.id === state.activeReceiptId)) {
        state.activeReceiptId = availableReceipts[availableReceipts.length - 1].id;
      }
    }
  }

  selector.innerHTML = availableReceipts.map(r => `
    <option value="${r.id}" ${r.id === state.activeReceiptId ? 'selected' : ''}>
      ${r.receipt_no} - ${r.holder_name} (${formatINR(r.total_amount || r.amount)}) - ${r.date}
    </option>
  `).join('');

  selector.onchange = (e) => {
    state.activeReceiptId = parseInt(e.target.value, 10);
    populateOfficialReceiptCard();
  };

  populateOfficialReceiptCard();
}

export function populateOfficialReceiptCard() {
  const rcpt = state.receipts.find(r => r.id === state.activeReceiptId) || state.receipts[state.receipts.length - 1];
  if (!rcpt) return;

  const holder = state.holders.find(h => h.id === rcpt.holder_id) || {
    name: rcpt.holder_name,
    policy_number: rcpt.policy_no,
    plan_name: rcpt.plan_name,
    phone: "+91 98765 43210",
    email: "insured@example.com",
    payment_frequency: "Yearly",
    next_due_date: "2027-10-13"
  };

  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setEl('rcpt-number', rcpt.receipt_no);
  setEl('rcpt-date', formatDate(rcpt.date));
  setEl('rcpt-time', rcpt.time || "10:00 AM");

  setEl('rcpt-holder-name', rcpt.holder_name || holder.name);
  setEl('rcpt-policy-no', rcpt.policy_no || holder.policy_number);
  setEl('rcpt-mobile', holder.phone || '+91 98765 43210');
  setEl('rcpt-email', holder.email || 'insured@example.com');

  setEl('rcpt-plan-name', rcpt.plan_name || holder.plan_name || 'Standard Life Plan');
  setEl('rcpt-freq', holder.payment_frequency || 'Yearly');
  setEl('rcpt-due-date', formatDate(rcpt.date));
  setEl('rcpt-next-due', formatDate(holder.next_due_date));

  setEl('rcpt-installment-desc', rcpt.period_desc || `${holder.payment_frequency} insurance installment`);
  setEl('rcpt-base-amount', formatINR(rcpt.amount));
  setEl('rcpt-late-fee', formatINR(rcpt.late_fee || 0));

  const total = rcpt.total_amount || (rcpt.amount + (rcpt.late_fee || 0));
  setEl('rcpt-total-amount', formatINR(total));
  setEl('rcpt-words', numberToWordsINR(total));

  setEl('rcpt-method', rcpt.payment_method || 'UPI');
  setEl('rcpt-ref', rcpt.reference_no || 'TXN-92819201');

  const collectorDisplay = document.getElementById('rcpt-collector');
  if (collectorDisplay) {
    collectorDisplay.textContent = rcpt.collector || `${state.currentUser.name} (${state.currentUser.deskId || state.currentUser.agentCode || 'Counter Desk'})`;
  }

  const signatoryText = document.getElementById('rcpt-signatory');
  if (signatoryText) {
    if (state.currentUser.role === 'Admin') {
      signatoryText.textContent = `${state.currentUser.name} (Branch Manager)`;
    } else if (state.currentUser.role === 'Cashier') {
      signatoryText.textContent = `${state.currentUser.name} (Authorized Cashier)`;
    } else if (state.currentUser.role === 'Agent') {
      signatoryText.textContent = `${state.currentUser.name} (Senior Advisor)`;
    } else {
      signatoryText.textContent = 'Vikramaditya Singh (Branch Manager)';
    }
  }
}

export function initReceiptPage() {
  document.getElementById('btn-print-receipt')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-email-sim-receipt')?.addEventListener('click', () => {
    const email = document.getElementById('rcpt-email')?.textContent;
    showToast('Receipt Dispatched', `Receipt PDF successfully emailed to ${email}`, 'success');
  });
}
