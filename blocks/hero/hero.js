export default function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-media';
    picture.remove();
    media.append(picture);
    block.append(media);
  }

  rows.forEach((row) => {
    content.append(...row.childNodes);
    row.remove();
  });

  block.append(content);
}
