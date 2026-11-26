export function celebrate(container, reducedMotion = false, duration = 2600) {
  if (!container) return;
  container.classList.add('celebration-active');
  if (!reducedMotion) {
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 36; index += 1) {
      const piece = document.createElement('i');
      piece.style.setProperty('--x', `${Math.random() * 100}%`);
      piece.style.setProperty('--delay', `${Math.random() * 0.6}s`);
      piece.style.setProperty('--rotation', `${Math.random() * 500 - 250}deg`);
      piece.className = `confetti confetti-${index % 4}`;
      layer.append(piece);
    }
    container.append(layer);
    window.setTimeout(() => layer.remove(), duration + 800);
  }
  if (duration) window.setTimeout(() => container.classList.remove('celebration-active'), duration);
}
