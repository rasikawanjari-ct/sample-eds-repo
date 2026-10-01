const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Pins the block to the top of the viewport once its natural position
 * scrolls there, and releases it again when scrolled back above that point.
 * @param {Element} block the block
 * @param {Element} placeholder keeps the block's layout space reserved while pinned
 */
function setupPinning(block, placeholder) {
  function update() {
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 0;
    // the mobile header stays fixed on screen, so the nav pins below it;
    // the desktop header scrolls away, so the nav pins flush to the top
    const pinPoint = isDesktop.matches ? 0 : navHeight;
    const shouldPin = placeholder.getBoundingClientRect().top <= pinPoint;

    placeholder.style.height = shouldPin ? `${block.offsetHeight}px` : '0';
    block.classList.toggle('anchor-nav-pinned', shouldPin);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  isDesktop.addEventListener('change', update);

  requestAnimationFrame(() => requestAnimationFrame(update));
  window.addEventListener('load', update);
}

/**
 * decorate the block
 * @param {Element} block the block
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  const [linksCell, ctaCell] = row.children;

  const ul = document.createElement('ul');
  linksCell.querySelectorAll('a').forEach((a) => {
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  linksCell.replaceChildren(ul);
  linksCell.className = 'anchor-nav-links';

  if (ctaCell) ctaCell.className = 'anchor-nav-cta';

  const placeholder = document.createElement('div');
  placeholder.className = 'anchor-nav-placeholder';
  block.before(placeholder);
  setupPinning(block, placeholder);
}
