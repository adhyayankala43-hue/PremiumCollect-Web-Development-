/**
 * PremiumCollect - Sidebar Component
 * Reusable sidebar navigation, drawer toggles, and dynamic badge counters.
 */

import { state } from '../utils/storage.js';
import { getDaysDifference } from '../utils/formatters.js';

export function updateSidebarBadges() {
  const holdersBadge = document.getElementById('badge-holders-count');
  const overdueBadge = document.getElementById('badge-overdue-count');

  if (holdersBadge) {
    holdersBadge.textContent = state.holders.length > 999 ? '2,000+' : state.holders.length;
  }

  if (overdueBadge) {
    const overdueCount = state.holders.filter(h => getDaysDifference(h.next_due_date) < -30).length;
    overdueBadge.textContent = overdueCount;
  }
}

export function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.add('open');
  overlay?.classList.add('open');
}

export function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.remove('open');
  overlay?.classList.remove('open');
}

export function setActiveNavLink(targetSectionId) {
  const sectionId = (targetSectionId || 'dashboard').replace('#', '');
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

export function initSidebar(onNavigate) {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const overlay = document.getElementById('sidebar-overlay');

  toggleBtn?.addEventListener('click', openMobileSidebar);
  closeBtn?.addEventListener('click', closeMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);

  // Brand click navigates to dashboard
  document.querySelector('.sidebar-brand')?.addEventListener('click', (e) => {
    if (e.target.closest('#sidebar-close-btn')) return;
    if (onNavigate) onNavigate('dashboard');
  });

  // Nav links click
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const sectionId = link.dataset.section;
      if (sectionId) {
        e.preventDefault();
        closeMobileSidebar();
        if (onNavigate) onNavigate(sectionId);
      }
    });
  });

  updateSidebarBadges();
}
