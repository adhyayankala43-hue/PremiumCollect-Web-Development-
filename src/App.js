/**
 * PremiumCollect - Main Application & Routing Controller (App.js)
 * Free Web Development Internship Online Task: WD-LIC-003
 * Student Code: DAS-LIC-003 | Organization: Data Alcott Systems
 *
 * Coordinates reusable components, page view routing, state events, and application bootstrapping.
 */

// Components
import { initModalControls } from './components/Modal.js';
import {
  initNavbar,
  updateUserUI,
  initClock,
  initTheme,
  initNotifications,
  initQuickSearch,
  initAuth,
  setOnUserChanged
} from './components/Navbar.js';
import { initSidebar, setActiveNavLink, updateSidebarBadges } from './components/Sidebar.js';
import { initButtons } from './components/Buttons.js';

// Pages
import { initDashboard, updateDashboard, updateCharts } from './pages/Dashboard.js';
import { initHoldersPage, renderHoldersTable } from './pages/PolicyHolders.js';
import { initPaymentPage, populatePaymentHoldersDropdown, selectHolderInPaymentForm } from './pages/Payment.js';
import { initReportsPage, generateSelectedReport } from './pages/Reports.js';
import { initInstallmentsPage, renderInstallmentsTable } from './pages/Installments.js';
import { initDueDatesPage, renderDueDatesTable } from './pages/DueDates.js';
import { initReceiptPage, renderReceiptView } from './pages/Receipt.js';
import { initHistoryPage, renderHistoryTable } from './pages/PaymentHistory.js';
import { renderReconciliationTable, initReconciliationActions } from './pages/Reconciliation.js';

// Section Titles Lookup Table
const SECTION_TITLES = {
  'dashboard': 'Dashboard Overview',
  'holders': 'Policy Holder Management',
  'payment': 'Collect Premium Payment',
  'installments': 'Installment Schedules & Tracking',
  'due-dates': 'Due Date & Grace Period Management',
  'receipt': 'Official Premium Receipt',
  'history': 'Payment History & Audit Ledger',
  'reconciliation': 'Payment Reconciliation & Settlement',
  'reports': 'Financial MIS Statements & Reports'
};

/**
 * Main Client-Side Router
 * Changes visible content section, updates navigation state, and triggers data refreshes.
 */
export function navigateTo(targetSectionId) {
  if (!targetSectionId) targetSectionId = 'dashboard';
  targetSectionId = targetSectionId.replace('#', '');

  const sections = document.querySelectorAll('.content-section');
  let matched = false;

  sections.forEach(sec => {
    if (sec.id === targetSectionId) {
      sec.classList.add('active');
      matched = true;
    } else {
      sec.classList.remove('active');
    }
  });

  if (!matched) {
    document.getElementById('dashboard')?.classList.add('active');
    targetSectionId = 'dashboard';
  }

  // Synchronize sidebar active state
  setActiveNavLink(targetSectionId);

  // Update Topbar Page Title
  const pageTitleEl = document.getElementById('current-page-title');
  if (pageTitleEl) {
    pageTitleEl.textContent = SECTION_TITLES[targetSectionId] || 'Premium Collection System';
  }

  // Update URL hash without reload
  if (window.location.hash !== `#${targetSectionId}`) {
    history.pushState(null, '', `#${targetSectionId}`);
  }

  // Refresh active view data
  refreshSection(targetSectionId);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Refreshes data and controls for the given active section.
 */
function refreshSection(sectionId) {
  switch (sectionId) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'holders':
      renderHoldersTable();
      break;
    case 'payment':
      populatePaymentHoldersDropdown();
      break;
    case 'installments':
      renderInstallmentsTable();
      break;
    case 'due-dates':
      renderDueDatesTable();
      break;
    case 'receipt':
      renderReceiptView();
      break;
    case 'history':
      renderHistoryTable();
      break;
    case 'reconciliation':
      renderReconciliationTable();
      break;
    case 'reports':
      generateSelectedReport();
      break;
    default:
      updateDashboard();
  }
}

/**
 * Global Keyboard Shortcuts
 */
function initShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + D : Toggle Theme
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      document.getElementById('theme-toggle-btn')?.click();
    }
  });
}

/**
 * Bootstrap Application
 */
export function initApp() {
  // 1. Initialize Reusable Modal Controls
  initModalControls();

  // 2. Initialize Topbar & Navigation Bar Components
  initClock();
  initTheme(() => {
    const activeSec = document.querySelector('.content-section.active')?.id;
    if (activeSec === 'dashboard') updateCharts();
  });
  initNotifications();
  initAuth();
  initQuickSearch((holderId) => {
    navigateTo('payment');
    selectHolderInPaymentForm(holderId);
  });

  // User switch listener to trigger view re-scoping
  setOnUserChanged(() => {
    const activeSec = document.querySelector('.content-section.active')?.id || 'dashboard';
    refreshSection(activeSec);
    updateSidebarBadges();
  });

  // 3. Initialize Sidebar Navigation
  initSidebar((sectionId) => {
    navigateTo(sectionId);
  });

  // 4. Initialize Interactive Buttons & Shortcuts
  initButtons((sectionId) => {
    navigateTo(sectionId);
  });
  initShortcuts();

  // 5. Initialize Page Modules
  initDashboard(
    (sec) => navigateTo(sec),
    (hid) => selectHolderInPaymentForm(hid)
  );

  initHoldersPage(
    (sec) => navigateTo(sec),
    (hid) => selectHolderInPaymentForm(hid)
  );

  initPaymentPage((sec) => navigateTo(sec));

  initInstallmentsPage(
    (sec) => navigateTo(sec),
    (hid) => selectHolderInPaymentForm(hid)
  );

  initDueDatesPage(
    (sec) => navigateTo(sec),
    (hid) => selectHolderInPaymentForm(hid)
  );

  initReceiptPage();
  initHistoryPage((sec) => navigateTo(sec));
  initReconciliationActions();
  initReportsPage();

  // 6. Bind Hash Change for Browser History Navigation (Back / Forward)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#dashboard';
    navigateTo(hash);
  });

  // 7. Initial View Setup
  updateUserUI();
  updateSidebarBadges();

  const initialHash = window.location.hash || '#dashboard';
  navigateTo(initialHash);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
