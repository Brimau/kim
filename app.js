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