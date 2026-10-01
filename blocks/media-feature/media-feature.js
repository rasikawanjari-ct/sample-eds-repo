import { createOptimizedPicture } from '../../scripts/aem.js';

const VIDEO_PATTERN = /\.(mp4|webm|ogg)(\?.*)?$|youtube\.com|youtu\.be|vimeo\.com/i;

function isEmbedUrl(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

/**
 * Opens a lightbox playing the given video URL.
 * @param {string} src video file or embed URL
 * @param {HTMLElement} trigger element that opened the modal, to restore focus to on close
 */
function openVideoModal(src, trigger) {
  const overlay = document.createElement('div');
  overlay.className = 'media-feature-video-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Video player');

  const dialog = document.createElement('div');
  dialog.className = 'media-feature-video-modal-dialog';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'media-feature-video-modal-close';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.innerHTML = '&times;';

  const media = isEmbedUrl(src) ? document.createElement('iframe') : document.createElement('video');
  media.className = 'media-feature-video-modal-media';
  media.src = src;
  if (media.tagName === 'IFRAME') {
    media.title = 'Video player';
    media.allow = 'autoplay; fullscreen; picture-in-picture';
    media.allowFullscreen = true;
  } else {
    media.controls = true;
    media.autoplay = true;
  }

  dialog.append(closeBtn, media);
  overlay.append(dialog);

  function onKeydown(e) {
    if (e.key === 'Escape') close(); // eslint-disable-line no-use-before-define
  }

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeydown);
    trigger.focus();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKeydown);

  document.body.append(overlay);
  closeBtn.focus();
}

/**
 * decorate the block
 * @param {Element} block the block
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  const [imageCell, contentCell] = row.children;

  imageCell.className = 'media-feature-image';
  contentCell.className = 'media-feature-content';

  const img = imageCell.querySelector('img');
  if (img) {
    imageCell.replaceChildren(createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 900px)', width: '1200' },
      { width: '750' },
    ]));
  }

  // a CTA pointing at a video file or embed opens a lightbox instead of navigating
  contentCell.querySelectorAll('a').forEach((a) => {
    if (VIDEO_PATTERN.test(a.href)) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openVideoModal(a.href, a);
      });
    }
  });

  // group CTA buttons so they sit side by side instead of stacking
  const buttons = contentCell.querySelectorAll('p.button-wrapper');
  if (buttons.length) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'media-feature-cta';
    ctaWrapper.append(...buttons);
    contentCell.append(ctaWrapper);
  }
}
