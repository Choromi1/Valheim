const root = document.documentElement;
const tabs = Array.from(document.querySelectorAll('[data-page]'));
const cards = Array.from(document.querySelectorAll('[data-guide-page]'));
const guideGrid = document.querySelector('.guide-grid');
const zoomButtons = Array.from(document.querySelectorAll('[data-zoom]'));
const modal = document.querySelector('[data-modal]');
const modalImage = document.querySelector('[data-modal-image]');
const openImageButtons = Array.from(document.querySelectorAll('[data-open-image]'));
const closeModalButton = document.querySelector('[data-close-modal]');
const copyButton = document.querySelector('[data-copy-url]');
const toast = document.querySelector('[data-toast]');

let zoom = 1;

function setView(page) {
  tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.page === page));
  guideGrid.dataset.view = page;

  cards.forEach((card) => {
    const shouldShow = page === 'all' || card.dataset.guidePage === page;
    card.hidden = !shouldShow;
  });
}

function setZoom(nextZoom) {
  zoom = Math.min(2.2, Math.max(0.75, Number(nextZoom.toFixed(2))));
  root.style.setProperty('--zoom', zoom);

  const resetButton = document.querySelector('[data-zoom="reset"]');
  if (resetButton) resetButton.textContent = `${Math.round(zoom * 100)}%`;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 1600);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setView(tab.dataset.page));
});

zoomButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.zoom;
    if (action === 'in') setZoom(zoom + 0.15);
    if (action === 'out') setZoom(zoom - 0.15);
    if (action === 'reset') setZoom(1);
  });
});

openImageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!modal || !modalImage) return;
    modalImage.src = button.dataset.openImage;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      window.open(button.dataset.openImage, '_blank', 'noopener');
    }
  });
});

if (closeModalButton && modal) {
  closeModalButton.addEventListener('click', () => modal.close());
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('페이지 주소를 복사했어요.');
    } catch (error) {
      showToast('복사에 실패했어요. 주소창에서 직접 복사해 주세요.');
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === '1') setView('1');
  if (event.key === '2') setView('2');
  if (event.key.toLowerCase() === 'a') setView('all');
  if ((event.ctrlKey || event.metaKey) && event.key === '=') {
    event.preventDefault();
    setZoom(zoom + 0.15);
  }
  if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    event.preventDefault();
    setZoom(zoom - 0.15);
  }
});

setView('1');
setZoom(1);
