import { ZONES, INTERIOR_SCENES, QUIZ } from './content.js';
import {
  showInfoCard, hideInfoCard, onInfoClose,
  showNavPanel, hideNavPanel, showNavButton, hideNavButton,
  setBreadcrumb, hideBreadcrumb,
  showQuiz
} from './ui.js';
import { initExteriorScene, renderExterior, destroyExteriorScene } from './exterior-scene.js';
import { initInteriorScene, renderInterior, destroyInteriorScene } from './interior-scene.js';

const STATES = { INICIO: 'INICIO', EXTERIOR: 'EXTERIOR', CRIPTA: 'CRIPTA', GALERIA: 'GALERIA', QUIZ: 'QUIZ' };
let state = STATES.INICIO;
let rafId = null;
let visitedZones = new Set();

const container    = document.getElementById('scene-layer');
const startOverlay = document.getElementById('start-overlay');
const startBtn     = document.getElementById('start-btn');
const hintDrag     = document.getElementById('hint-drag');

startBtn.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  _goExterior();
});

function _goExterior() {
  _cancelLoop();
  destroyInteriorScene();

  state = STATES.EXTERIOR;
  setBreadcrumb('🏛️ Monumento a la Bandera — Exterior');
  showNavPanel();
  hideNavButton('btn-siguiente');
  hideNavButton('btn-quiz');
  hintDrag.classList.remove('hidden');
  setTimeout(() => hintDrag.classList.add('hidden'), 4000);

  initExteriorScene(container, ZONES, _onExteriorPinClick);
  _loop(renderExterior);
}

function _onExteriorPinClick(zone) {
  showInfoCard(zone);
  visitedZones.add(zone.id);

  if (visitedZones.size >= 2) {
    showNavButton('btn-siguiente');
  }
}

onInfoClose(hideInfoCard);

document.getElementById('btn-siguiente').addEventListener('click', () => {
  if (state === STATES.EXTERIOR) {
    hideInfoCard();
    _goCripta();
  } else if (state === STATES.CRIPTA) {
    hideInfoCard();
    _goGaleria();
  }
});

document.getElementById('btn-quiz').addEventListener('click', () => {
  hideInfoCard();
  _goQuiz();
});

function _goCripta() {
  _cancelLoop();
  destroyExteriorScene();

  state = STATES.CRIPTA;
  setBreadcrumb('⚰️ Cripta de Belgrano');
  hideNavButton('btn-siguiente');
  hideNavButton('btn-quiz');

  initInteriorScene(container, INTERIOR_SCENES[0], _onInteriorPinClick);
  _loop(renderInterior);
}

function _goGaleria() {
  _cancelLoop();
  destroyInteriorScene();

  state = STATES.GALERIA;
  setBreadcrumb('🏳️ Galería de las Banderas');
  hideNavButton('btn-siguiente');
  hideNavButton('btn-quiz');

  initInteriorScene(container, INTERIOR_SCENES[1], _onInteriorPinClick);
  _loop(renderInterior);
}

let _interiorVisited = new Set();

function _onInteriorPinClick(element) {
  showInfoCard({
    label: element.label,
    foto: '',
    info: element.info,
    pregunta: ''
  });

  _interiorVisited.add(element.id);

  const currentScene = INTERIOR_SCENES[state === STATES.CRIPTA ? 0 : 1];
  if (_interiorVisited.size >= currentScene.elements.length) {
    if (state === STATES.CRIPTA) {
      showNavButton('btn-siguiente');
    } else {
      showNavButton('btn-quiz');
    }
    _interiorVisited.clear();
  }
}

function _goQuiz() {
  _cancelLoop();
  state = STATES.QUIZ;
  hideBreadcrumb();
  hideNavPanel();

  showQuiz(QUIZ, _onQuizFinish);
}

function _onQuizFinish() {
  setBreadcrumb('¡Visita completada! 🎉');
  showNavPanel();
  showNavButton('btn-siguiente');
  document.getElementById('btn-siguiente').textContent = '🔄 Repetir visita';
  document.getElementById('btn-siguiente').onclick = () => {
    visitedZones.clear();
    _interiorVisited.clear();
    document.getElementById('btn-siguiente').textContent = 'Siguiente sala →';
    document.getElementById('btn-siguiente').onclick = null;
    _goExterior();
  };
}

function _loop(renderFn) {
  function tick() {
    rafId = requestAnimationFrame(tick);
    renderFn();
  }
  tick();
}

function _cancelLoop() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}
