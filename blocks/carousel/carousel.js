import { createOptimizedPicture } from '../../scripts/aem.js';

function createControl(label, className, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Featured stories');

  slides.forEach((slide, slideIndex) => {
    slide.classList.add('carousel-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${slideIndex + 1} of ${slides.length}`);
    slide.hidden = slideIndex !== 0;

    [...slide.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.classList.add('carousel-slide-image');
      } else {
        cell.classList.add('carousel-slide-content');
      }
    });
  });

  slides.forEach((slide, slideIndex) => {
    slide.querySelectorAll('picture > img').forEach((image) => {
      image.closest('picture').replaceWith(
        createOptimizedPicture(image.src, image.alt, slideIndex === 0, [
          { media: '(min-width: 900px)', width: '1600' },
          { width: '900' },
        ]),
      );
    });
  });

  if (slides.length < 2) return;

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const previous = createControl('Previous slide', 'carousel-previous', 'Previous');
  const next = createControl('Next slide', 'carousel-next', 'Next');
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  indicators.setAttribute('role', 'group');
  indicators.setAttribute('aria-label', 'Choose a slide');

  let activeIndex = 0;
  const indicatorButtons = [];
  function showSlide(slideIndex) {
    activeIndex = (slideIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.hidden = index !== activeIndex;
      indicatorButtons[index].setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
    });
  }

  slides.forEach((slide, slideIndex) => {
    const indicator = createControl(
      `Show slide ${slideIndex + 1}`,
      'carousel-indicator',
      `${slideIndex + 1}`,
    );
    indicator.setAttribute('aria-pressed', slideIndex === 0 ? 'true' : 'false');
    indicator.addEventListener('click', () => showSlide(slideIndex));
    indicators.append(indicator);
    indicatorButtons.push(indicator);
  });

  previous.addEventListener('click', () => showSlide(activeIndex - 1));
  next.addEventListener('click', () => showSlide(activeIndex + 1));
  controls.append(previous, indicators, next);
  block.append(controls);
}
