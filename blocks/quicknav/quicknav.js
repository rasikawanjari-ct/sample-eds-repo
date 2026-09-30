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
  linksCell.className = 'quicknav-links';

  if (ctaCell) ctaCell.className = 'quicknav-cta';
}
