import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * decorate the block
 * @param {Element} block the block
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  const [imageCell, contentCell] = row.children;

  imageCell.className = 'promo-image';
  contentCell.className = 'promo-content';

  const img = imageCell.querySelector('img');
  if (img) {
    imageCell.replaceChildren(createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 900px)', width: '1200' },
      { width: '750' },
    ]));
  }

  // group CTA buttons so they sit side by side instead of stacking
  const buttons = contentCell.querySelectorAll('p.button-wrapper');
  if (buttons.length) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'promo-cta';
    ctaWrapper.append(...buttons);
    contentCell.append(ctaWrapper);
  }
}
