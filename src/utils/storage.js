/**
 * PremiumCollect - Safe Storage & State Management Abstraction
 */

import {
  DEFAULT_USERS,
  DEFAULT_PAYMENTS,
  DEFAULT_RECEIPTS,
  DEFAULT_RECONCILIATION,
  DEFAULT_NOTIFICATIONS,
  ALL_SEED_HOLDERS,
  ALL_SEED_INSTALLMENTS
} from '../mockData/mockData.js';

const memoryFallback = {};

export const safeStorage = {
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Memory fallback
    }
    return memoryFallback[key] !== undefined ? memoryFallback[key] : null;
  },
  setItem(key, value) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // Memory fallback
    }
    memoryFallback[key] = String(value);
  },
  removeItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Memory fallback
    }
    delete memoryFallback[key];
  }
};

export const STORAGE_KEYS = {
  USERS: 'premiumcollect_users',
  CURRENT_USER: 'premiumcollect_current_user',
  HOLDERS: 'premiumcollect_holders',
  PAYMENTS: 'premiumcollect_payments',
  INSTALLMENTS: 'premiumcollect_installments',
  RECEIPTS: 'premiumcollect_receipts',
  RECONCILIATION: 'premiumcollect_reconciliation',
  NOTIFICATIONS: 'premiumcollect_notifications',
  ROLE: 'premiumcollect_user_role',
  THEME: 'premiumcollect_theme'
};

export function loadJsonFromStorage(key, fallback) {
  try {
    const data = safeStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function loadHoldersFromStorage() {
  let saved = loadJsonFromStorage(STORAGE_KEYS.HOLDERS, null);
  if (!saved || !Array.isArray(saved) || saved.length < 2000) {
    saved = ALL_SEED_HOLDERS;
    safeStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(saved));
  }
  return saved;
}

export function loadInstallmentsFromStorage() {
  let saved = loadJsonFromStorage(STORAGE_KEYS.INSTALLMENTS, null);
  if (!saved || !Array.isArray(saved) || saved.length < 2000) {
    saved = ALL_SEED_INSTALLMENTS;
    safeStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(saved));
  }
  return saved;
}

// Global Application Reactive State
export const state = {
  users: loadJsonFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS),
  currentUser: loadJsonFromStorage(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[1]), // Defaults to cashier Pooja
  holders: loadHoldersFromStorage(),
  payments: loadJsonFromStorage(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS),
  installments: loadInstallmentsFromStorage(),
  receipts: loadJsonFromStorage(STORAGE_KEYS.RECEIPTS, DEFAULT_RECEIPTS),
  reconciliation: loadJsonFromStorage(STORAGE_KEYS.RECONCILIATION, DEFAULT_RECONCILIATION),
  notifications: loadJsonFromStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS),
  currentRole: safeStorage.getItem(STORAGE_KEYS.ROLE) || 'Cashier',
  currentTheme: safeStorage.getItem(STORAGE_KEYS.THEME) || 'light',
  activeReceiptId: 4,
  charts: {}
};

export function persistAll() {
  safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
  safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(state.currentUser));
  safeStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(state.holders));
  safeStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(state.payments));
  safeStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(state.installments));
  safeStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(state.receipts));
  safeStorage.setItem(STORAGE_KEYS.RECONCILIATION, JSON.stringify(state.reconciliation));
  safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(state.notifications));
}
