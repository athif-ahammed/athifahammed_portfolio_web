// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    if (mainNav.classList.contains('open')) {
      mainNav.style.display = 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '76px';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = '#0a0a0b';
      mainNav.style.padding = '20px 24px';
      mainNav.style.borderBottom = '1px solid #232326';
      mainNav.style.gap = '18px';
    } else {
      mainNav.style.display = 'none';
    }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Running timecode — a nod to the editor's timeline, counts up from page load
const timecodeEl = document.getElementById('timecode');
if (timecodeEl) {
  const start = Date.now();
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const elapsed = Date.now() - start;
    const totalFrames = Math.floor(elapsed / (1000 / 24)); // 24fps
    const frames = totalFrames % 24;
    const totalSeconds = Math.floor(totalFrames / 24);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    timecodeEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    requestAnimationFrame(tick);
  }
  tick();
}
