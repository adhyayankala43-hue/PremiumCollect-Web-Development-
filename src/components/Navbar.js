/**
 * PremiumCollect - Navbar & Authentication Component
 * Handles top header bar, live clock, notifications, dark mode, search, and user roles.
 */

import { state, safeStorage, STORAGE_KEYS, persistAll } from '../utils/storage.js';
import { formatINR, showToast, escapeHTML } from '../utils/formatters.js';
import { openModal, closeModal } from './Modal.js';
import { DEFAULT_USERS } from '../mockData/mockData.js';

let navUserChangeCallback = null;

export function setOnUserChanged(cb) {
  navUserChangeCallback = cb;
}

export function updateUserUI() {
  const user = state.currentUser || DEFAULT_USERS[1];

  // Avatar
  const avatarEl = document.getElementById('user-avatar');
  if (avatarEl) {
    avatarEl.textContent = user.avatar || user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // Topbar display name & role tag
  const displayNameEl = document.getElementById('user-display-name');
  if (displayNameEl) displayNameEl.textContent = user.name;

  const roleTagEl = document.getElementById('user-role-tag');
  if (roleTagEl) {
    const codeOrDesk = user.deskId || user.agentCode || user.policyNo || user.title || user.role;
    roleTagEl.textContent = `${user.role} • ${codeOrDesk}`;
  }

  // Topbar role dropdown selector
  const roleSelect = document.getElementById('user-role-select');
  if (roleSelect && roleSelect.value !== user.role) {
    roleSelect.value = user.role;
  }

  // User Scope Banner below header
  const scopeBanner = document.getElementById('user-scope-banner');
  const scopeBadge = document.getElementById('user-scope-badge');
  const scopeText = document.getElementById('user-scope-text');

  if (scopeBanner) {
    scopeBanner.className = `user-scope-banner scope-${user.role.toLowerCase()}`;
    if (scopeBadge) {
      let badgeIcon = 'fa-solid fa-crown';
      if (user.role === 'Cashier') badgeIcon = 'fa-solid fa-cash-register';
      else if (user.role === 'Agent') badgeIcon = 'fa-solid fa-handshake';
      else if (user.role === 'Policyholder') badgeIcon = 'fa-solid fa-user-shield';
      scopeBadge.innerHTML = `<i class="${badgeIcon}"></i> ${user.role} Session`;
    }
    if (scopeText) {
      if (user.role === 'Admin') {
        scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.title || 'Branch Manager'}) • Full administrative, audit & settlement clearance`;
      } else if (user.role === 'Cashier') {
        scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.deskId || 'Desk #01'}) • Counter premium intake & instant receipt minting`;
      } else if (user.role === 'Agent') {
        scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.agentCode || 'AG-102'}) • Client servicing & portfolio renewal collection`;
      } else if (user.role === 'Policyholder') {
        scopeText.innerHTML = `Insured Member: <strong>${escapeHTML(user.name)}</strong> (Policy: <code>${user.policyNo || 'LIC-12345'}</code>) • Self-service portal & online payment`;
      }
    }
  }

  // Profile Modal elements
  const pAvatar = document.getElementById('modal-profile-avatar');
  if (pAvatar) pAvatar.textContent = user.avatar || user.name.substring(0, 2).toUpperCase();

  const pName = document.getElementById('modal-profile-name');
  if (pName) pName.textContent = user.name;

  const pBadge = document.getElementById('modal-profile-role-badge');
  if (pBadge) {
    pBadge.textContent = `${user.role} • ${user.title || ''}`;
    pBadge.className = `badge mt-1 ${user.role === 'Admin' ? 'badge-warning' : user.role === 'Cashier' ? 'badge-success' : user.role === 'Agent' ? 'badge-info' : 'badge-neutral'}`;
  }

  const pUsername = document.getElementById('modal-profile-username');
  if (pUsername) pUsername.textContent = user.username || user.id;

  const pEmail = document.getElementById('modal-profile-email');
  if (pEmail) pEmail.textContent = user.email || 'N/A';

  const pCode = document.getElementById('modal-profile-code');
  if (pCode) pCode.textContent = user.deskId || user.agentCode || user.policyNo || 'Headquarters';

  const pTier = document.getElementById('modal-profile-tier');
  if (pTier) pTier.textContent = user.permissions || 'Standard Access';

  // Apply role-based button & UI restrictions
  applyRolePermissions(user);
}

export function applyRolePermissions(user) {
  const addHolderBtn = document.getElementById('btn-open-add-holder-modal');
  const heroAddBtn = document.getElementById('hero-add-holder-btn');
  const bulkModalBtn = document.getElementById('btn-open-bulk-modal');
  const runAutoReconBtn = document.getElementById('btn-run-auto-reconciliation');

  if (user.role === 'Policyholder') {
    if (addHolderBtn) addHolderBtn.style.display = 'none';
    if (heroAddBtn) heroAddBtn.style.display = 'none';
    if (bulkModalBtn) bulkModalBtn.style.display = 'none';
    if (runAutoReconBtn) {
      runAutoReconBtn.disabled = true;
      runAutoReconBtn.title = "Restricted to Branch Cashiers & Administrators";
    }
  } else {
    if (addHolderBtn) addHolderBtn.style.display = '';
    if (heroAddBtn) heroAddBtn.style.display = '';
    if (bulkModalBtn) bulkModalBtn.style.display = '';
    if (runAutoReconBtn) {
      runAutoReconBtn.disabled = false;
      runAutoReconBtn.title = "Auto Reconcile Payments";
    }
  }
}

export function setCurrentUser(user, options = {}) {
  if (!user) return;
  state.currentUser = user;
  state.currentRole = user.role;
  safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  safeStorage.setItem(STORAGE_KEYS.ROLE, user.role);

  updateUserUI();

  if (!options.silent) {
    showToast('Session Switched', `Logged in as ${user.name} (${user.role})`, 'success');
  }

  if (navUserChangeCallback) {
    navUserChangeCallback(user);
  }
}

export function initClock() {
  const clockEl = document.getElementById('system-time-display');
  function tick() {
    if (clockEl) {
      const now = new Date();
      clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })} • ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  }
  tick();
  setInterval(tick, 1000);
}

export function initTheme(onThemeChanged) {
  const themeBtn = document.getElementById('theme-toggle-btn');
  document.body.setAttribute('data-theme', state.currentTheme);

  themeBtn?.addEventListener('click', () => {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', state.currentTheme);
    safeStorage.setItem(STORAGE_KEYS.THEME, state.currentTheme);
    showToast('Theme Changed', `Switched to ${state.currentTheme} mode`, 'info');
    if (onThemeChanged) onThemeChanged(state.currentTheme);
  });
}

export function initNotifications() {
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const notifList = document.getElementById('notification-list');
  const counter = document.getElementById('notification-counter');
  const clearBtn = document.getElementById('clear-notifications-btn');

  function renderNotifs() {
    if (!notifList) return;
    if (state.notifications.length === 0) {
      notifList.innerHTML = `<li class="notification-item text-center text-muted"><p>No new alerts</p></li>`;
      if (counter) counter.style.display = 'none';
      return;
    }

    if (counter) {
      counter.style.display = 'flex';
      counter.textContent = state.notifications.length;
    }

    notifList.innerHTML = state.notifications.map(n => `
      <li class="notification-item">
        <div class="notification-icon-wrap ${n.type}">
          <i class="fa-solid ${n.type === 'alert' ? 'fa-triangle-exclamation' : n.type === 'success' ? 'fa-check' : 'fa-bell'}"></i>
        </div>
        <div class="notification-content">
          <h5>${escapeHTML(n.title)}</h5>
          <p>${escapeHTML(n.text)}</p>
          <div class="time">${n.time}</div>
        </div>
      </li>
    `).join('');
  }

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!notifDropdown?.contains(e.target) && e.target !== notifBtn) {
      notifDropdown?.classList.add('hidden');
    }
  });

  clearBtn?.addEventListener('click', () => {
    state.notifications = [];
    persistAll();
    renderNotifs();
    showToast('Notifications Cleared', 'All alerts cleared', 'info');
  });

  renderNotifs();
}

export function initQuickSearch(onSelectHolder) {
  const input = document.getElementById('global-search-input');
  const dropdown = document.getElementById('quick-search-dropdown');

  input?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      dropdown?.classList.add('hidden');
      return;
    }

    const matches = state.holders.filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.policy_number.toLowerCase().includes(q) ||
      (h.phone && h.phone.includes(q))
    ).slice(0, 5);

    if (matches.length === 0) {
      if (dropdown) {
        dropdown.innerHTML = `<div class="quick-search-item"><span class="text-muted text-sm">No matching policies</span></div>`;
        dropdown.classList.remove('hidden');
      }
      return;
    }

    if (dropdown) {
      dropdown.innerHTML = matches.map(m => `
        <div class="quick-search-item" data-holder-id="${m.id}">
          <div>
            <div class="item-title">${escapeHTML(m.name)}</div>
            <div class="item-sub">${escapeHTML(m.policy_number)} • Premium: ${formatINR(m.premium_amount)}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-quick-select" data-holder-id="${m.id}">
            Pay
          </button>
        </div>
      `).join('');

      dropdown.classList.remove('hidden');

      dropdown.querySelectorAll('.quick-search-item').forEach(item => {
        item.addEventListener('click', () => {
          const hid = item.dataset.holderId;
          dropdown.classList.add('hidden');
          input.value = '';
          if (onSelectHolder) onSelectHolder(hid);
        });
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!dropdown?.contains(e.target) && e.target !== input) {
      dropdown?.classList.add('hidden');
    }
  });

  // Global search shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input?.focus();
      input?.select();
    }
  });
}

export function initAuth() {
  document.getElementById('btn-open-auth-modal')?.addEventListener('click', () => {
    openModal('modal-auth');
  });

  document.getElementById('btn-banner-switch-user')?.addEventListener('click', () => {
    openModal('modal-auth');
  });

  document.querySelector('.user-profile-pill')?.addEventListener('click', () => {
    openModal('modal-profile');
  });

  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const panelLogin = document.getElementById('auth-panel-login');
  const panelRegister = document.getElementById('auth-panel-register');

  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister?.classList.remove('active');
    panelLogin?.classList.remove('hidden');
    panelRegister?.classList.add('hidden');
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin?.classList.remove('active');
    panelRegister?.classList.remove('hidden');
    panelLogin?.classList.add('hidden');
  });

  // Role selector in header
  const roleSelect = document.getElementById('user-role-select');
  roleSelect?.addEventListener('change', (e) => {
    const newRole = e.target.value;
    const matched = state.users.find(u => u.role === newRole) || {
      id: 'custom_' + newRole.toLowerCase(),
      name: `${newRole} User`,
      role: newRole,
      title: `${newRole} Officer`,
      permissions: `${newRole} operations`
    };
    setCurrentUser(matched);
  });

  // Profile modal action buttons
  document.getElementById('btn-profile-switch-account')?.addEventListener('click', () => {
    closeModal('modal-profile');
    openModal('modal-auth');
  });

  document.getElementById('btn-profile-logout')?.addEventListener('click', () => {
    closeModal('modal-profile');
    const guestUser = {
      id: 'guest',
      name: 'Guest Cashier',
      role: 'Cashier',
      deskId: 'Desk #01',
      title: 'Counter Operator'
    };
    setCurrentUser(guestUser);
    showToast('Logged Out', 'Switched to Guest Cashier session', 'info');
  });

  // Login Form Submit
  document.getElementById('form-auth-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('login-password').value;

    const found = state.users.find(u => 
      (u.username && u.username.toLowerCase() === usernameInput) ||
      (u.email && u.email.toLowerCase() === usernameInput) ||
      (u.id && u.id.toLowerCase() === usernameInput)
    );

    if (found) {
      if (!found.password || found.password === passwordInput || passwordInput === 'lic123') {
        setCurrentUser(found);
        closeModal('modal-auth');
        document.getElementById('form-auth-login').reset();
      } else {
        showToast('Invalid Credentials', 'Incorrect password. Default is "lic123"', 'error');
      }
    } else {
      const newUser = {
        id: 'user_' + Date.now(),
        username: usernameInput,
        password: passwordInput,
        name: usernameInput.charAt(0).toUpperCase() + usernameInput.slice(1),
        role: 'Cashier',
        email: `${usernameInput}@dataalcott.com`,
        title: 'Counter Operator',
        deskId: 'Desk #02',
        avatar: usernameInput.substring(0, 2).toUpperCase(),
        permissions: 'Counter collection and receipt issue'
      };
      state.users.push(newUser);
      persistAll();
      setCurrentUser(newUser);
      closeModal('modal-auth');
      showToast('Account Created', `Logged in as ${newUser.name}`, 'success');
    }
  });
}
