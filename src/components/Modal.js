/**
 * PremiumCollect - Modal Component
 * Reusable modal open, close, escape-key and overlay controls.
 */

export function openModal(modalId) {
  if (!modalId) return;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  if (!modalId) return;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

export function initModalControls() {
  // 1. Direct click listeners on buttons with data-close-modal or modal-close-btn
  document.querySelectorAll('[data-close-modal], .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = btn.dataset?.closeModal || btn.getAttribute('data-close-modal') || btn.closest('.modal-overlay')?.id;
      if (targetId) {
        closeModal(targetId);
      }
    });
  });

  // 2. Global delegated click handler
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close-modal], .modal-close-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const targetId = closeBtn.dataset?.closeModal || closeBtn.getAttribute('data-close-modal') || closeBtn.closest('.modal-overlay')?.id;
      if (targetId) {
        closeModal(targetId);
      }
      return;
    }

    // Backdrop overlay click
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
      closeModal(e.target.id);
    }
  });

  // 3. Escape key to close any active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}
