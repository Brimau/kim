const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let width, height;
let pieces = [];
let running = false;

const COLORS = ["#ffffff", "#0a0a0a", "#cccccc", "#555555", "#ffffff", "#e6e6e6"];

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

document.getElementById("confettiBtn").addEventListener("click", drama);
setTimeout(burst, 800);
setTimeout(burst, 2600);

const DRAMA_WORDS = ["¡MADDIE!", "que siga el drama", "ROBA LA ESCENA", "en su carita", "sin filtros", "main character", "sin guion", "aplausos", "que baje la cortina", "créditos finales"];

function drama() {
  const btn = document.getElementById("confettiBtn");
  const card = document.querySelector(".card");
  const title = document.querySelector(".title");
  const flash = document.getElementById("flash");

  burst(260);

  /* sacudón de pantalla */
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 600);

  /* la tarjeta rebota */
  card.classList.remove("pop");
  void card.offsetWidth;
  card.classList.add("pop");
  setTimeout(() => card.classList.remove("pop"), 750);

  /* destello */
  flash.classList.remove("go");
  void flash.offsetWidth;
  flash.classList.add("go");
  setTimeout(() => flash.classList.remove("go"), 750);

  /* el nombre KIM se prende */
  title.classList.add("drama");
  setTimeout(() => title.classList.remove("drama"), 700);

  /* palabras de reina volando desde el botón */
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const word = document.createElement("span");
    word.className = "drama-word";
    word.textContent = DRAMA_WORDS[(Math.random() * DRAMA_WORDS.length) | 0];
    word.style.left = rect.left + rect.width / 2 + "px";
    word.style.top = rect.top + "px";
    word.style.setProperty("--dx", (Math.random() - 0.5) * 260 + "px");
    word.style.setProperty("--rot", (Math.random() - 0.5) * 50 + "deg");
    document.body.appendChild(word);
    setTimeout(() => word.remove(), 1200);
  }
}

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

/* música: "7 rings" de Ariana Grande (audio local) */
const musicBtn = document.getElementById("musicBtn");
const songPlayer = document.getElementById("songPlayer");
let playing = false;

function startMusic() {
  songPlayer.currentTime = 0;
  songPlayer.play();
}

function stopMusic() {
  songPlayer.pause();
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
    musicBtn.textContent = "⏸ parar música";
    musicBtn.classList.add("on");
  }
});