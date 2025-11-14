// Lightweight custom audio player script
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const seek = document.getElementById('seek');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');
const loopBtn = document.getElementById('loop-btn');
const bars = document.querySelectorAll('.audio-player .bar');

let raf;

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

audio.addEventListener('loadedmetadata', () => {
  seek.max = Math.floor(audio.duration);
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  seek.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.classList.add('playing');
    playBtn.textContent = '❚❚';
    animateBars(true);
  } else {
    audio.pause();
    playBtn.classList.remove('playing');
    playBtn.textContent = '▶';
    animateBars(false);
  }
});

seek.addEventListener('input', () => {
  audio.currentTime = seek.value;
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

loopBtn.addEventListener('click', () => {
  audio.loop = !audio.loop;
  loopBtn.classList.toggle('active', audio.loop);
});

function animateBars(active) {
  bars.forEach((b, i) => {
    if (active) {
      b.style.animationPlayState = 'running';
      b.style.animationDelay = (i * 0.08) + 's';
    } else {
      b.style.animationPlayState = 'paused';
    }
  });
}

// create a gentle idle animation when paused
animateBars(false);

// keyboard space to toggle
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    playBtn.click();
  }
});

// ensure initial volume
audio.volume = volume.value;

// cleanup on page unload
window.addEventListener('pagehide', () => {
  cancelAnimationFrame(raf);
});
