import { SCENES, QUIZ } from './content.js';

// ── Estado ──────────────────────────────────────────────
let sceneIdx = 0;
let quizIdx  = 0;
let quizScore = 0;

// ── Elementos DOM ────────────────────────────────────────
const startOverlay  = document.getElementById('start-overlay');
const tourContainer = document.getElementById('tour-container');
const sceneBg       = document.getElementById('scene-bg');
const pinsLayer     = document.getElementById('pins-layer');
const breadcrumb    = document.getElementById('breadcrumb-texto');
const sceneCounter  = document.getElementById('scene-counter');
const navDots       = document.getElementById('nav-dots');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');
const infoCard      = document.getElementById('info-card');
const infoClose     = document.getElementById('info-close');
const infoFoto      = document.getElementById('info-foto');
const infoTitulo    = document.getElementById('info-titulo');
const infoTexto     = document.getElementById('info-texto');
const infoPregunta  = document.getElementById('info-pregunta-texto');
const quizOverlay   = document.getElementById('quiz-overlay');
const quizNumero    = document.getElementById('quiz-numero');
const quizPregunta  = document.getElementById('quiz-pregunta');
const quizOpciones  = document.getElementById('quiz-opciones');
const quizResultado = document.getElementById('quiz-resultado');
const quizNext      = document.getElementById('quiz-next');

// ── Inicio ───────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  tourContainer.classList.remove('hidden');
  _buildDots();
  _showScene(0);
});

// ── Navegación ───────────────────────────────────────────
btnPrev.addEventListener('click', () => {
  if (sceneIdx > 0) _showScene(sceneIdx - 1);
});

btnNext.addEventListener('click', () => {
  if (sceneIdx < SCENES.length - 1) {
    _showScene(sceneIdx + 1);
  } else {
    _startQuiz();
  }
});

infoClose.addEventListener('click', () => infoCard.classList.add('hidden'));

// Teclado (← →) para el docente
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') btnNext.click();
  if (e.key === 'ArrowLeft')  btnPrev.click();
  if (e.key === 'Escape')     infoCard.classList.add('hidden');
});

// ── Mostrar escena ────────────────────────────────────────
function _showScene(idx) {
  infoCard.classList.add('hidden');
  sceneIdx = idx;
  const scene = SCENES[idx];

  // Transición de foto
  sceneBg.style.opacity = '0';
  sceneBg.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    sceneBg.style.backgroundImage = `url('${scene.foto}')`;
    // Reiniciar Ken Burns
    sceneBg.style.animation = 'none';
    void sceneBg.offsetWidth; // reflow
    sceneBg.style.animation = '';
    sceneBg.style.opacity = '1';
  }, 300);

  // Breadcrumb y contador
  breadcrumb.textContent = scene.titulo;
  sceneCounter.textContent = `${idx + 1} / ${SCENES.length}`;

  // Botones de navegación
  btnPrev.classList.toggle('hidden', idx === 0);
  btnNext.textContent = idx === SCENES.length - 1 ? '🏆 Ir al Quiz →' : 'Siguiente →';

  // Dots
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Pins
  _buildPins(scene.pins);
}

function _buildDots() {
  navDots.innerHTML = '';
  SCENES.forEach(() => {
    const d = document.createElement('div');
    d.className = 'nav-dot';
    navDots.appendChild(d);
  });
}

function _buildPins(pins) {
  pinsLayer.innerHTML = '';
  pins.forEach(pin => {
    const el = document.createElement('div');
    el.className = 'pin';
    el.style.left = pin.left + '%';
    el.style.top  = pin.top  + '%';
    el.innerHTML = `<div class="pin-icon"></div><div class="pin-label">${pin.label}</div>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      _showInfo(pin);
    });
    pinsLayer.appendChild(el);
  });
}

function _showInfo(pin) {
  infoFoto.src             = pin.fotoCard;
  infoFoto.alt             = pin.label;
  infoTitulo.textContent   = pin.label;
  infoTexto.textContent    = pin.info;
  infoPregunta.textContent = pin.pregunta;
  infoCard.classList.remove('hidden');
}

// ── Quiz ──────────────────────────────────────────────────
function _startQuiz() {
  tourContainer.classList.add('hidden');
  quizOverlay.classList.remove('hidden');
  quizIdx   = 0;
  quizScore = 0;
  _showQuestion();
}

function _showQuestion() {
  const q = QUIZ[quizIdx];
  quizNumero.textContent   = `Pregunta ${quizIdx + 1} de ${QUIZ.length}`;
  quizPregunta.textContent = q.pregunta;
  quizResultado.className  = 'hidden';
  quizNext.classList.add('hidden');

  quizOpciones.innerHTML = '';
  q.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opcion';
    btn.textContent = op;
    btn.addEventListener('click', () => _answerQuestion(i));
    quizOpciones.appendChild(btn);
  });
}

function _answerQuestion(idx) {
  const q = QUIZ[quizIdx];
  const btns = quizOpciones.querySelectorAll('.quiz-opcion');
  btns.forEach(b => b.disabled = true);

  if (idx === q.correcta) {
    btns[idx].classList.add('correcta');
    quizScore++;
    quizResultado.textContent = '✅ ¡Correcto!';
    quizResultado.className   = 'bien';
  } else {
    btns[idx].classList.add('incorrecta');
    btns[q.correcta].classList.add('correcta');
    quizResultado.textContent = `❌ La correcta era: "${q.opciones[q.correcta]}"`;
    quizResultado.className   = 'mal';
  }

  quizResultado.classList.remove('hidden');
  quizNext.classList.remove('hidden');
  quizNext.textContent = quizIdx < QUIZ.length - 1 ? 'Siguiente pregunta →' : '🎉 Ver resultado';
}

quizNext.addEventListener('click', () => {
  quizIdx++;
  if (quizIdx < QUIZ.length) {
    _showQuestion();
  } else {
    _showResult();
  }
});

function _showResult() {
  const pct   = Math.round((quizScore / QUIZ.length) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';

  quizNumero.textContent   = '¡Quiz terminado!';
  quizPregunta.textContent = `${emoji} ${quizScore} de ${QUIZ.length} respuestas correctas (${pct}%)`;
  quizOpciones.innerHTML   = '';
  quizResultado.className  = 'hidden';
  quizNext.classList.remove('hidden');
  quizNext.textContent = '🔄 Repetir la visita';

  if (pct >= 60) _launchConfetti();

  quizNext.onclick = () => {
    quizOverlay.classList.add('hidden');
    tourContainer.classList.remove('hidden');
    _showScene(0);
    quizNext.onclick = null;
  };
}

// ── Confetti ──────────────────────────────────────────────
function _launchConfetti() {
  const canvas  = document.createElement('canvas');
  canvas.id     = 'confetti-canvas';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const COLORS = ['#4A90D9','#D4AF37','#fff','#34c759','#ff9500'];
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: 5 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: 3 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2
  }));

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(tick);
    else canvas.remove();
  }
  tick();
}
