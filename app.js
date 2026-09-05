const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let width, height;
let pieces = [];
let running = false;

const COLORS = ["#ff3ea5", "#ffd166", "#8a2be2", "#ffffff", "#ff7b9c", "#b388ff"];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

function spawn(count) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.3,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      vy: 2.5 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  pieces = pieces.filter((p) => p.y < height + 30);

  for (const p of pieces) {
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  if (pieces.length) {
    requestAnimationFrame(draw);
  } else {
    running = false;
    ctx.clearRect(0, 0, width, height);
  }
}

function burst() {
  spawn(160);
  if (!running) {
    running = true;
    draw();
  }
}

document.getElementById("confettiBtn").addEventListener("click", burst);
setTimeout(burst, 800);
setTimeout(burst, 2600);

/* destellos que siguen el cursor */
let lastSpark = 0;
document.addEventListener("pointermove", (e) => {
  const now = Date.now();
  if (now - lastSpark < 40) return;
  lastSpark = now;

  const s = document.createElement("span");
  s.className = "spark";
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  s.style.background = COLORS[(Math.random() * COLORS.length) | 0];
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
});

/* revelar la galería al hacer scroll */
const revealables = document.querySelectorAll(".polaroid");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("reveal");
        setTimeout(() => el.classList.add("visible"), i * 90);
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);

revealables.forEach((el) => observer.observe(el));

/* música de cumpleaños hecha con WebAudio */
const musicBtn = document.getElementById("musicBtn");
let audioCtx = null;
let playing = false;
let timerId = null;

const NOTES = [
  523.25, 0, 523.25, 0, 587.33, 659.25,
  523.25, 0, 587.33, 659.25, 523.25,
  392.0, 0, 523.25,
];

function scheduleNote(time, freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

function scheduleChime(time) {
  [1567.98, 2093.0].forEach((f) => scheduleNote(time, f, 1.2));
}

function loop() {
  const beat = 0.34;
  let t = audioCtx.currentTime + 0.1;
  NOTES.forEach((f) => {
    if (f > 0) scheduleNote(t, f, beat * 0.9);
    t += beat;
  });
  scheduleChime(t + 0.2);
  timerId = setTimeout(loop, (t - audioCtx.currentTime) * 1000);
}

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  loop();
}

function stopMusic() {
  clearTimeout(timerId);
  audioCtx.close();
  audioCtx = null;
}

musicBtn.addEventListener("click", () => {
  if (playing) {
    stopMusic();
    playing = false;
    musicBtn.textContent = "▶ poner música";
    musicBtn.classList.remove("on");
  } else {
    startMusic();
    playing = true;
    musicBtn.textContent = "⏸ música encendida";
    musicBtn.classList.add("on");
  }
});