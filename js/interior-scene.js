import * as THREE from 'three';
import { clearPins, createPin, setPinPosition } from './ui.js';

let renderer, scene, camera;
let pinEntries = [];
let panAngle = 0;

export function initInteriorScene(container, sceneConfig, onPinClick) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);

  if (sceneConfig.id === 'cripta') {
    _buildCripta(sceneConfig);
    camera.position.set(0, 1.6, 4);
  } else {
    _buildGaleria(sceneConfig);
    camera.position.set(0, 1.8, 6);
  }
  camera.lookAt(0, 1.2, 0);

  clearPins();
  pinEntries = [];
  sceneConfig.elements.forEach(el => {
    const pos = new THREE.Vector3(el.position.x, el.position.y, el.position.z);
    const pinEl = createPin({ id: el.id, label: el.label, foto: '', info: el.info, pregunta: '' }, onPinClick);
    pinEntries.push({ el: pinEl, pos });
  });

  window.addEventListener('resize', _onResize);
}

function _buildCripta(config) {
  scene.background = new THREE.Color(0x1a1208);
  scene.fog = new THREE.Fog(0x1a1208, 8, 20);

  scene.add(new THREE.AmbientLight(0xffddb0, 0.4));

  const spotlight = new THREE.SpotLight(0xffd580, 3, 12, Math.PI / 5, 0.4);
  spotlight.position.set(0, 5, -1.5);
  spotlight.target.position.set(0, 0, -1.5);
  scene.add(spotlight);
  scene.add(spotlight.target);

  [-2.5, 2.5].forEach(x => {
    const torch = new THREE.PointLight(0xff6600, 1.2, 8);
    torch.position.set(x, 2.5, 0);
    scene.add(torch);
  });

  const marbleFloor  = _mat(0x2a2420, 0.3, 0.8);
  const marbleWall   = _mat(0x3a3530, 0.2, 0.6);
  const marbleColumn = _mat(0x706050, 0.3, 0.5);
  const goldMat      = _mat(0xD4AF37, 0.8, 0.2);
  const sarcMat      = _mat(0x4a3f35, 0.3, 0.5);

  _box(scene, 10, 0.1, 12, 0, -0.05, 0, marbleFloor);
  _box(scene, 10, 0.1, 12, 0, 4,    0, marbleWall);
  _box(scene, 0.1, 4, 12, -5, 2, 0, marbleWall);
  _box(scene, 0.1, 4, 12,  5, 2, 0, marbleWall);
  _box(scene, 10, 4, 0.1,  0, 2, -6, marbleWall);
  _box(scene, 10, 4, 0.1,  0, 2,  6, marbleWall);

  [[-2, 0, -2], [2, 0, -2], [-2, 0, 2], [2, 0, 2]].forEach(([x, , z]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3.8, 16), marbleColumn);
    col.position.set(x, 1.9, z);
    scene.add(col);
  });

  _box(scene, 1.2, 0.5, 2.2, 0, 0.25, -1.5, sarcMat);
  _box(scene, 1.0, 0.15, 2.0, 0, 0.57, -1.5, goldMat);
  _box(scene, 0.08, 0.6, 1.0, 1.8, 1.1, 0, goldMat);
}

function _buildGaleria(config) {
  scene.background = new THREE.Color(0xf0ece4);
  scene.fog = new THREE.Fog(0xf0ece4, 12, 30);

  scene.add(new THREE.AmbientLight(0xffffff, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(0, 8, 4);
  scene.add(key);

  const creamWall  = _mat(0xe8e4d8, 0.05, 0.4);
  const whiteMar   = _mat(0xf5f2ec, 0.1,  0.6);
  const blueMat    = _mat(0x4A90D9, 0.05, 0.2);
  const glassMat   = new THREE.MeshStandardMaterial({ color: 0xaad4f5, transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.1 });

  _box(scene, 6, 0.1, 20, 0, -0.05, 0, whiteMar);
  _box(scene, 6, 0.1, 20, 0, 4.5, 0, creamWall);
  _box(scene, 0.1, 4.5, 20, -3, 2.25, 0, creamWall);
  _box(scene, 0.1, 4.5, 20,  3, 2.25, 0, creamWall);
  _box(scene, 6, 4.5, 0.1, 0, 2.25, -10, creamWall);

  [-4, -2, 0, 2, 4].forEach(z => {
    _box(scene, 6.2, 0.3, 0.2, 0, 4.3, z, creamWall);
  });

  _box(scene, 1.5, 2.5, 0.08, 0, 1.5, -3, glassMat);
  _box(scene, 0.08, 2.5, 0.5, -0.75, 1.5, -3.25, glassMat);
  _box(scene, 0.08, 2.5, 0.5,  0.75, 1.5, -3.25, glassMat);

  _box(scene, 1.2, 0.5, 0.02, 0, 2.0, -3.2, _mat(0x4A90D9, 0.0, 0.8));
  _box(scene, 1.2, 0.3, 0.02, 0, 1.5, -3.2, _mat(0xffffff, 0.0, 0.8));
  _box(scene, 1.2, 0.5, 0.02, 0, 1.0, -3.2, _mat(0x4A90D9, 0.0, 0.8));

  [-6, -3, 0, 3, 6].forEach(z => {
    _box(scene, 0.04, 0.8, 0.5, -2.95, 2.2, z, blueMat);
    _box(scene, 0.04, 0.8, 0.5,  2.95, 2.2, z, blueMat);
  });
}

function _mat(hex, roughness = 0.5, metalness = 0.1) {
  return new THREE.MeshStandardMaterial({ color: hex, roughness, metalness });
}

function _box(scene, w, h, d, x, y, z, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

function _updatePins() {
  const wp  = new THREE.Vector3();
  const prj = new THREE.Vector3();
  pinEntries.forEach(({ el, pos }) => {
    wp.copy(pos);
    prj.copy(wp).project(camera);
    const behind = prj.z > 1;
    const sx = (prj.x *  0.5 + 0.5) * window.innerWidth;
    const sy = (prj.y * -0.5 + 0.5) * window.innerHeight;
    setPinPosition(el, sx, sy, !behind);
  });
}

export function renderInterior() {
  panAngle += 0.003;
  const panX = Math.sin(panAngle) * 0.8;
  camera.position.x = panX;
  camera.lookAt(0, 1.2, 0);
  _updatePins();
  renderer.render(scene, camera);
}

export function destroyInteriorScene() {
  window.removeEventListener('resize', _onResize);
  clearPins();
  pinEntries = [];
  panAngle = 0;
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }
  scene = null;
  camera = null;
}

function _onResize() {
  if (!renderer || !camera) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
