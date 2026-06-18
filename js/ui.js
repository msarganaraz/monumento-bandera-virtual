const infoCard       = document.getElementById('info-card');
const infoFoto       = document.getElementById('info-foto');
const infoTitulo     = document.getElementById('info-titulo');
const infoTexto      = document.getElementById('info-texto');
const infoPregunta   = document.getElementById('info-pregunta-texto');
const infoClose      = document.getElementById('info-close');
const quizOverlay    = document.getElementById('quiz-overlay');
const quizNumero     = document.getElementById('quiz-numero');
const quizPregunta   = document.getElementById('quiz-pregunta');
const quizOpciones   = document.getElementById('quiz-opciones');
const quizResultado  = document.getElementById('quiz-resultado');
const quizNext       = document.getElementById('quiz-next');
const breadcrumb     = document.getElementById('breadcrumb');
const breadcrumbText = document.getElementById('breadcrumb-texto');
const pinsLayer      = document.getElementById('pins-layer');
const navPanel       = document.getElementById('nav-panel');

export function showInfoCard(zone) {
  infoFoto.src = zone.foto;
  infoFoto.alt = zone.label;
  infoTitulo.textContent = zone.label;
  infoTexto.textContent = zone.info;
  infoPregunta.textContent = zone.pregunta;
  infoCard.classList.remove('hidden');
}

export function hideInfoCard() {
  infoCard.classList.add('hidden');
}

export function onInfoClose(cb) {
  infoClose.addEventListener('click', cb);
}

export function createPin(zone, onClick) {
  const el = document.createElement('div');
  el.className = 'pin';
  el.dataset.zoneId = zone.id;

  el.innerHTML = `
    <div class="pin-inner">📍</div>
    <span class="pin-label">${zone.label}</span>
  `;

  el.addEventListener('click', () => onClick(zone));
  pinsLayer.appendChild(el);
  return el;
}

export function clearPins() {
  pinsLayer.innerHTML = '';
}

export function setPinPosition(pinEl, screenX, screenY, visible) {
  if (!visible) {
    pinEl.style.display = 'none';
    return;
  }
  pinEl.style.display = 'block';
  pinEl.style.left = screenX + 'px';
  pinEl.style.top  = screenY + 'px';
}

export function showNavPanel() { navPanel.classList.remove('hidden'); }
export function hideNavPanel() { navPanel.classList.add('hidden'); }

export function showNavButton(id) {
  document.getElementById(id)?.classList.remove('hidden');
}
export function hideNavButton(id) {
  document.getElementById(id)?.classList.add('hidden');
}

export function setBreadcrumb(text) {
  breadcrumbText.textContent = text;
  breadcrumb.classList.remove('hidden');
}
export function hideBreadcrumb() {
  breadcrumb.classList.add('hidden');
}

let _quizData    = [];
let _quizIndex   = 0;
let _onFinish    = null;
let _answered    = false;

export function showQuiz(quizData, onFinish) {
  _quizData  = quizData;
  _quizIndex = 0;
  _onFinish  = onFinish;
  quizOverlay.classList.remove('hidden');
  _renderQuestion();
}

export function hideQuiz() {
  quizOverlay.classList.add('hidden');
}

function _renderQuestion() {
  _answered = false;
  const q = _quizData[_quizIndex];
  quizNumero.textContent  = `Pregunta ${_quizIndex + 1} de ${_quizData.length}`;
  quizPregunta.textContent = q.pregunta;
  quizResultado.classList.add('hidden');
  quizNext.classList.add('hidden');

  quizOpciones.innerHTML = '';
  q.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opcion';
    btn.textContent = op;
    btn.addEventListener('click', () => _selectAnswer(i));
    quizOpciones.appendChild(btn);
  });
}

function _selectAnswer(index) {
  if (_answered) return;
  _answered = true;

  const q = _quizData[_quizIndex];
  const btns = quizOpciones.querySelectorAll('.quiz-opcion');

  btns.forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    if (i === q.correcta) btn.classList.add('correcta');
    else if (i === index)  btn.classList.add('incorrecta');
  });

  const correct = index === q.correcta;
  quizResultado.textContent  = correct ? '✅ ¡Correcto!' : `❌ La respuesta era: ${q.opciones[q.correcta]}`;
  quizResultado.classList.remove('hidden');

  if (correct) launchConfetti();

  const isLast = _quizIndex === _quizData.length - 1;
  quizNext.textContent = isLast ? '🏆 Finalizar' : 'Siguiente pregunta →';
  quizNext.classList.remove('hidden');
  quizNext.onclick = () => {
    if (isLast) {
      hideQuiz();
      _onFinish?.();
    } else {
      _quizIndex++;
      _renderQuestion();
    }
  };
}

function launchConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: 6 + Math.random() * 6,
    color: ['#D4AF37','#4A90D9','#fff','#2ecc71','#e74c3c'][Math.floor(Math.random()*5)],
    vx: (Math.random() - 0.5) * 4,
    vy: 3 + Math.random() * 4,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.5);
      ctx.restore();
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotSpeed;
      p.vy += 0.1;
    });
    frame++;
    if (frame < 90) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}
