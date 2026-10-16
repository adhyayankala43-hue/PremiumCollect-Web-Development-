/**
 * PremiumCollect - Buttons & Interactive Triggers Component
 * Handles persona switchers, quick action shortcuts, reset triggers, and batch buttons.
 */

import { state, safeStorage, STORAGE_KEYS } from '../utils/storage.js';
import { setCurrentUser } from './Navbar.js';
import { openModal, closeModal } from './Modal.js';
import { showToast } from '../utils/formatters.js';

export function initButtons(onNavigate) {
  // 1-Click Persona Switching Buttons
  document.querySelectorAll('.btn-persona').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.user;
      const matched = state.users.find(u => u.id === userId || u.username === userId);
      if (matched) {
        setCurrentUser(matched);
        closeModal('modal-auth');
      } else {
        showToast('Error', 'User persona not found.', 'error');
      }
    });
  });

  // Hero Quick Action Buttons
  document.getElementById('hero-quick-pay-btn')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('payment');
  });

  document.getElementById('hero-add-holder-btn')?.addEventListener('click', () => {
    openModal('modal-add-holder');
  });

  // Stat Card Quick Jumps
  document.querySelector('.stat-primary')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('history');
  });
  document.querySelector('.stat-success')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('history');
  });
  document.querySelector('.stat-warning')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('due-dates');
  });
  document.querySelector('.stat-danger')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('due-dates');
  });

  // Reset Sample Data
  const resetHandler = () => {
    if (confirm("Reset application data back to 2,006 policyholders (Amit Sharma, Priya Patel, etc.) and accounts?")) {
      safeStorage.removeItem(STORAGE_KEYS.USERS);
      safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      safeStorage.removeItem(STORAGE_KEYS.HOLDERS);
      safeStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      safeStorage.removeItem(STORAGE_KEYS.INSTALLMENTS);
      safeStorage.removeItem(STORAGE_KEYS.RECEIPTS);
      safeStorage.removeItem(STORAGE_KEYS.RECONCILIATION);
      safeStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      safeStorage.removeItem(STORAGE_KEYS.ROLE);
      safeStorage.removeItem(STORAGE_KEYS.THEME);
      location.reload();
    }
  };

  document.getElementById('reset-sample-data-btn')?.addEventListener('click', resetHandler);
}
