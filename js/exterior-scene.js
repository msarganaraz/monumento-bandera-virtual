import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clearPins, createPin, setPinPosition } from './ui.js';

const loader = new GLTFLoader();

let renderer, scene, camera, modelGroup;
let pinEntries = [];
let dragging = false, lastX = 0, targetY = 0, currentY = 0;
let _onPinClick = null;

export function initExteriorScene(container, zones, onPinClick) {
  _onPinClick = onPinClick;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = _makeSkyBackground();

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 0.2, 0);

  scene.add(new THREE.AmbientLight(0xfff4e0, 1.8));
  const sun = new THREE.DirectionalLight(0xfff8e7, 2.5);
  sun.position.set(5, 12, 6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc8d8f0, 1.0);
  fill.position.set(-6, 4, -4);
  scene.add(fill);

  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  loader.load(
    'modelos/monumento.glb',
    (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 4 / Math.max(size.x, size.y, size.z);

      model.position.sub(center);

      const wrapper = new THREE.Group();
      wrapper.add(model);
      wrapper.scale.setScalar(scale);
      modelGroup.add(wrapper);

      _buildPins(zones);
    },
    undefined,
    (err) => console.error('Error cargando monumento.glb:', err)
  );

  window.addEventListener('pointerdown', _onDown);
  window.addEventListener('pointermove', _onMove);
  window.addEventListener('pointerup', _onUp);
  window.addEventListener('pointercancel', _onUp);
  window.addEventListener('resize', _onResize);
}

function _buildPins(zones) {
  clearPins();
  pinEntries = [];

  zones.forEach(zone => {
    const localPos = new THREE.Vector3(zone.pinLocal.x, zone.pinLocal.y, zone.pinLocal.z);
    const el = createPin(zone, _onPinClick);
    pinEntries.push({ zone, el, localPos });
  });
}

function _updatePins() {
  const worldPos = new THREE.Vector3();
  const projected = new THREE.Vector3();

  pinEntries.forEach(({ el, localPos }) => {
    worldPos.copy(localPos);
    worldPos.applyMatrix4(modelGroup.matrixWorld);

    projected.copy(worldPos).project(camera);

    const behindCamera = projected.z > 1;
    const screenX = (projected.x *  0.5 + 0.5) * window.innerWidth;
    const screenY = (projected.y * -0.5 + 0.5) * window.innerHeight;

    setPinPosition(el, screenX, screenY, !behindCamera);
  });
}

export function renderExterior() {
  currentY += (targetY - currentY) * 0.07;
  modelGroup.rotation.y = currentY;

  _updatePins();
  renderer.render(scene, camera);
}

export function destroyExteriorScene() {
  window.removeEventListener('pointerdown', _onDown);
  window.removeEventListener('pointermove', _onMove);
  window.removeEventListener('pointerup', _onUp);
  window.removeEventListener('pointercancel', _onUp);
  window.removeEventListener('resize', _onResize);
  clearPins();
  pinEntries = [];

  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }
  scene = null;
  camera = null;
  modelGroup = null;
}

function _onDown(e) {
  if (e.target.closest('#info-card') || e.target.closest('#nav-panel') ||
      e.target.closest('#start-overlay') || e.target.closest('.pin')) return;
  dragging = true;
  lastX = e.clientX;
}
function _onMove(e) {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  targetY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetY + dx * 0.007));
}
function _onUp() { dragging = false; }

function _onResize() {
  if (!renderer || !camera) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  scene.background = _makeSkyBackground();
}

function _makeSkyBackground() {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0,    '#87CEEB');
  grad.addColorStop(0.65, '#c8e6f5');
  grad.addColorStop(0.72, '#8ab4c4');
  grad.addColorStop(1,    '#6a9ab0');
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
