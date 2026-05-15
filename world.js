import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";

const app = document.getElementById("app");

export const clamp = THREE.MathUtils.clamp;
export const lerp = THREE.MathUtils.lerp;
export const TAU = Math.PI * 2;
export const WORLD_HALF = 92;
export const CAPTAIN_INTERACT_RANGE = 14.2;

export const palette = {
  sand: 0xd9be96,
  sandDark: 0xa08558,
  stone: 0xa89070,
  stoneDark: 0x6f5c47,
  linen: 0xf5e5bf,
  israelBlue: 0x3a7d7f,
  aiRed: 0xa84638,
  bronze: 0xa87d34,
  wood: 0x764e28,
  smoke: 0x5f5850,
  olive: 0x6a7e48,
  marker: 0xf5d275
};

export const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2(0xefd5b8, 0.0054);

export const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.08, 560);
camera.position.set(0, 3.4, 60);

export const MAX_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, 1.35);

export const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", alpha: false });
renderer.setPixelRatio(MAX_PIXEL_RATIO);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
app.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xffedd8, 0x5a4838, 2.2);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfffae8, 4.8);
sun.position.set(-48, 72, 42);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.028;
sun.shadow.radius = 1.5;
sun.shadow.camera.left = -120;
sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120;
sun.shadow.camera.bottom = -120;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 180;
scene.add(sun);

const fill = new THREE.DirectionalLight(0xb8d4f8, 0.65);
fill.position.set(55, 32, -70);
scene.add(fill);

const ambientLight = new THREE.AmbientLight(0x8a7f6f, 0.35);
scene.add(ambientLight);

const sky = new Sky();
sky.scale.setScalar(450000);
const skyU = sky.material.uniforms;
skyU.turbidity.value = 7.8;
skyU.rayleigh.value = 2.65;
skyU.mieCoefficient.value = 0.0048;
skyU.mieDirectionalG.value = 0.82;
skyU.sunPosition.value.copy(sun.position).normalize();
scene.add(sky);

export const materials = {
  sand: new THREE.MeshStandardMaterial({ color: palette.sand, roughness: .92, metalness: 0 }),
  darkerSand: new THREE.MeshStandardMaterial({ color: palette.sandDark, roughness: .95, metalness: 0 }),
  stone: new THREE.MeshStandardMaterial({ color: palette.stone, roughness: .82, metalness: .04 }),
  stoneLight: new THREE.MeshStandardMaterial({ color: 0xc4a882, roughness: .78, metalness: .04 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: palette.stoneDark, roughness: .88, metalness: .02 }),
  stoneMerlon: new THREE.MeshStandardMaterial({ color: 0x8a7058, roughness: .85, metalness: .03 }),
  linen: new THREE.MeshStandardMaterial({ color: palette.linen, roughness: .88, metalness: 0 }),
  israelBlue: new THREE.MeshStandardMaterial({ color: 0x2a6b7c, roughness: .68, metalness: .10 }),
  israelDeep: new THREE.MeshStandardMaterial({ color: 0x1a3f50, roughness: .72, metalness: .10 }),
  aiRed: new THREE.MeshStandardMaterial({ color: 0xb83c2c, roughness: .68, metalness: .08 }),
  aiDark: new THREE.MeshStandardMaterial({ color: 0x7a2a20, roughness: .78, metalness: .04 }),
  bronze: new THREE.MeshStandardMaterial({ color: 0xc87a28, roughness: .45, metalness: .48 }),
  darkBronze: new THREE.MeshStandardMaterial({ color: 0x5a3818, roughness: .62, metalness: .28 }),
  wood: new THREE.MeshStandardMaterial({ color: palette.wood, roughness: .82, metalness: .04 }),
  smoke: new THREE.MeshStandardMaterial({ color: palette.smoke, roughness: 1, transparent: true, opacity: .45, depthWrite: false }),
  olive: new THREE.MeshStandardMaterial({ color: 0x586c3a, roughness: .88, metalness: 0 }),
  leafLight: new THREE.MeshStandardMaterial({ color: 0x7a9454, roughness: .84, metalness: 0 }),
  leafDark: new THREE.MeshStandardMaterial({ color: 0x3d5228, roughness: .90, metalness: 0 }),
  marker: new THREE.MeshStandardMaterial({ color: palette.marker, emissive: 0x8b6400, emissiveIntensity: .80, roughness: .35, transparent: true, opacity: .88 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf5efde, roughness: .75 }),
  black: new THREE.MeshStandardMaterial({ color: 0x1e1610, roughness: .72 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xc4855a, roughness: .72, metalness: 0 }),
  skinDark: new THREE.MeshStandardMaterial({ color: 0xa86845, roughness: .74, metalness: 0 }),
  hair: new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: .90, metalness: 0 }),
  beard: new THREE.MeshStandardMaterial({ color: 0x30180e, roughness: .92, metalness: 0 }),
  leather: new THREE.MeshStandardMaterial({ color: 0x7a4a28, roughness: .76, metalness: .06 }),
  leatherDark: new THREE.MeshStandardMaterial({ color: 0x4a2a14, roughness: .84, metalness: .02 }),
  sandal: new THREE.MeshStandardMaterial({ color: 0x3e2414, roughness: .88, metalness: 0 }),
  clothTrim: new THREE.MeshStandardMaterial({ color: 0xf0cc5a, roughness: .60, metalness: .22 }),
  eye: new THREE.MeshStandardMaterial({ color: 0x1a0e08, roughness: .45, metalness: 0 }),
  eyeWhite: new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: .60, metalness: 0 }),
  iris: new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: .50, metalness: 0 }),
  bronzeBright: new THREE.MeshStandardMaterial({ color: 0xe0a840, roughness: .32, metalness: .55 }),
  ironMat: new THREE.MeshStandardMaterial({ color: 0x7a7060, roughness: .48, metalness: .60 }),
  goldMat: new THREE.MeshStandardMaterial({ color: 0xf0c040, roughness: .28, metalness: .72 }),
  flame: new THREE.MeshStandardMaterial({ color: 0xff8820, emissive: 0xff5500, emissiveIntensity: 2.5, roughness: .28 }),
  flameCore: new THREE.MeshStandardMaterial({ color: 0xffee80, emissive: 0xffcc00, emissiveIntensity: 3.5, roughness: .20 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xe8be40, emissive: 0x8a6c10, emissiveIntensity: .45, roughness: .42, metalness: .28 }),
  plume: new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: .80, metalness: 0 }),
  plumeIsrael: new THREE.MeshStandardMaterial({ color: 0x2255cc, roughness: .80, metalness: 0 })
};

export const groups = {
  terrain: new THREE.Group(),
  city: new THREE.Group(),
  camp: new THREE.Group(),
  units: new THREE.Group(),
  markers: new THREE.Group(),
  effects: new THREE.Group(),
  props: new THREE.Group()
};

Object.values(groups).forEach(group => scene.add(group));

export const player = {
  group: null,
  body: null,
  spear: null,
  mantle: null,
  cursor: null,
  position: new THREE.Vector3(0, 0, 60),
  velocity: new THREE.Vector3(),
  yaw: Math.PI,
  speed: 16,
  targetYaw: Math.PI,
  bob: 0,
  spearRaised: 0,
  attackSwing: 0
};

export const captains = [];
export const allies = [];
export const enemies = [];
export const ambushers = [];
export const smokePuffs = [];
export const dustPuffs = [];
export const markers = {};
export const cityFlames = [];
export const captainTents = [];

export function seededNoise(x, z) {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

export function terrainHeight(x, z) {
  const base = Math.sin(x * .08) * .72 + Math.cos(z * .065) * .62 + Math.sin((x + z) * .04) * .4;
  const ridge = 2.4 * Math.exp(-Math.pow((z + 22) / 23, 2)) * (0.8 + Math.sin(x * .06) * .2);
  const cityRise = 1.25 * Math.exp(-(Math.pow((x - 18) / 26, 2) + Math.pow((z + 55) / 22, 2)));
  const ravine = -1.75 * Math.exp(-(Math.pow((x + 42) / 15, 2) + Math.pow((z + 48) / 22, 2)));
  const campHills =
    2.15 * Math.exp(-(Math.pow((x + 28) / 24, 2) + Math.pow((z - 66) / 16, 2))) +
    1.55 * Math.exp(-(Math.pow((x - 20) / 26, 2) + Math.pow((z - 74) / 20, 2))) +
    1.2 * Math.exp(-(Math.pow((x + 2) / 42, 2) + Math.pow((z - 88) / 13, 2)));
  return base + ridge + cityRise + ravine + campHills;
}

export function groundY(x, z) {
  return terrainHeight(x, z);
}

export function tentPadBaseY(x, z, w, d, s = 1) {
  const hx = w * 0.52;
  const hz = d * 0.52;
  let m = groundY(x, z);
  m = Math.max(m, groundY(x - hx, z - hz), groundY(x + hx, z - hz), groundY(x - hx, z + hz), groundY(x + hx, z + hz));
  return m + 0.22 * s;
}

/** רק סביב שלושת האוהלים — בלי סלעים/גבעות; חיילים מחוץ למלבן הזה */
export function inCampClearZone(x, z) {
  return Math.abs(x) < 19.5 && z > 44.5 && z < 56.2;
}

function makeCanvasTexture(draw, width = 512, height = 512) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const sandTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = "#cda866";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4200; i++) {
    const v = 120 + Math.floor(Math.random() * 90);
    const alpha = .07 + Math.random() * .16;
    ctx.fillStyle = `rgba(${v + 35},${v + 12},${v - 18},${alpha})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  ctx.strokeStyle = "rgba(105,73,37,.14)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const y = Math.random() * h;
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 28) {
      ctx.lineTo(x, y + Math.sin(x * .025 + i) * 8 + Math.random() * 6);
    }
    ctx.stroke();
  }
});
sandTexture.repeat.set(16, 16);
materials.sand.map = sandTexture;

const stoneTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = "#9b815d";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(62,48,32,.38)";
  ctx.lineWidth = 4;
  const rowH = 64;
  for (let y = 0; y < h + rowH; y += rowH) {
    const offset = (y / rowH) % 2 ? 70 : 0;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    for (let x = -offset; x < w; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowH);
      ctx.stroke();
    }
  }
  for (let i = 0; i < 620; i++) {
    ctx.fillStyle = `rgba(255,238,196,${Math.random() * .08})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
});
stoneTexture.repeat.set(2, 1);
materials.stone.map = stoneTexture;

const clothTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = "#f4ead3";
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 7) {
    ctx.strokeStyle = y % 14 === 0 ? "rgba(96,70,44,.16)" : "rgba(255,255,255,.22)";
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random() * 2);
    ctx.lineTo(w, y + Math.random() * 2);
    ctx.stroke();
  }
  for (let x = 0; x < w; x += 11) {
    ctx.strokeStyle = x % 22 === 0 ? "rgba(80,58,35,.12)" : "rgba(255,255,255,.2)";
    ctx.beginPath();
    ctx.moveTo(x + Math.random() * 2, 0);
    ctx.lineTo(x + Math.random() * 2, h);
    ctx.stroke();
  }
  for (let i = 0; i < 900; i++) {
    const v = 185 + Math.floor(Math.random() * 55);
    ctx.fillStyle = `rgba(${v},${v - 10},${v - 30},${.035 + Math.random() * .06})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
});
clothTexture.repeat.set(2, 3);
[materials.linen, materials.israelBlue, materials.israelDeep, materials.aiRed, materials.aiDark, materials.white].forEach(mat => {
  mat.map = clothTexture;
  mat.roughness = Math.max(mat.roughness, .86);
  mat.needsUpdate = true;
});

const leatherTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = "#85522c";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 1800; i++) {
    const a = .04 + Math.random() * .09;
    ctx.fillStyle = Math.random() > .5 ? `rgba(255,205,139,${a})` : `rgba(45,23,12,${a})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
  }
  ctx.strokeStyle = "rgba(43,22,12,.22)";
  for (let i = 0; i < 34; i++) {
    ctx.beginPath();
    const y = Math.random() * h;
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 24) ctx.lineTo(x, y + Math.sin(x * .05 + i) * 5);
    ctx.stroke();
  }
});
leatherTexture.repeat.set(2, 2);
[materials.leather, materials.sandal, materials.wood].forEach(mat => {
  mat.map = leatherTexture;
  mat.needsUpdate = true;
});

function createTerrain() {
  const size = WORLD_HALF * 2.4;
  const geo = new THREE.PlaneGeometry(size, size, 88, 88);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeight(x, z));
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, materials.sand);
  mesh.receiveShadow = true;
  groups.terrain.add(mesh);

  const road = makeRoadMesh([
    new THREE.Vector3(0, 0, 68),
    new THREE.Vector3(4, 0, 42),
    new THREE.Vector3(1, 0, 18),
    new THREE.Vector3(11, 0, -8),
    new THREE.Vector3(21, 0, -33),
    new THREE.Vector3(23, 0, -58)
  ], 5.2);
  groups.terrain.add(road);

  for (let i = 0; i < 52; i++) {
    const x = (Math.random() - .5) * 176;
    const z = (Math.random() - .5) * 176;
    if (Math.abs(x - 18) < 26 && Math.abs(z + 55) < 22) continue;
    if (inCampClearZone(x, z)) continue;
    if (Math.random() < .38) createRock(x, z, .45 + Math.random() * 1.7);
    else createScrub(x, z, .7 + Math.random() * .8);
  }

  for (let i = 0; i < 10; i++) {
    let x;
    let z;
    let guard = 0;
    do {
      x = -38 + Math.random() * 78;
      z = 50 + Math.random() * 44;
      guard++;
    } while (inCampClearZone(x, z) && guard < 40);
    if (inCampClearZone(x, z)) continue;
    createHillMound(x, z, 4 + Math.random() * 7);
  }

  for (let i = 0; i < 12; i++) {
    createOliveTree(-51 + Math.random() * 22, -52 + Math.random() * 26, .85 + Math.random() * .7);
  }

  createDistantRidges();
}

function makeRoadMesh(points, width) {
  const vertices = [];
  const indices = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const dir = new THREE.Vector3().subVectors(next, prev).normalize();
    const normal = new THREE.Vector3(-dir.z, 0, dir.x);
    const wiggle = Math.sin(i * 1.7) * .65;
    const left = new THREE.Vector3().copy(p).addScaledVector(normal, width + wiggle);
    const right = new THREE.Vector3().copy(p).addScaledVector(normal, -width + wiggle * .4);
    left.y = groundY(left.x, left.z) + .045;
    right.y = groundY(right.x, right.z) + .045;
    vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);
    if (i < points.length - 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb1844b,
    roughness: .98,
    transparent: true,
    opacity: .82
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

function createHillMound(x, z, scale = 5) {
  if (inCampClearZone(x, z)) return null;
  const geo = new THREE.DodecahedronGeometry(1, 1);
  const mat = Math.random() > .45 ? materials.darkerSand : materials.stone;
  const mound = new THREE.Mesh(geo, mat);
  mound.position.set(x, groundY(x, z) + scale * .18, z);
  mound.scale.set(scale * (1.35 + Math.random() * .45), scale * (.24 + Math.random() * .16), scale * (.85 + Math.random() * .35));
  mound.rotation.set(Math.random() * .12, Math.random() * TAU, Math.random() * .1);
  mound.castShadow = true;
  mound.receiveShadow = true;
  groups.props.add(mound);
  for (let i = 0; i < 3; i++) {
    createRock(x + (Math.random() - .5) * scale * 2.2, z + (Math.random() - .5) * scale * 1.5, .35 + Math.random() * .75);
  }
  return mound;
}

function createDistantRidges() {
  const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x8f7048, roughness: 1, metalness: 0 });
  for (let i = 0; i < 22; i++) {
    const geo = new THREE.ConeGeometry(12 + Math.random() * 18, 13 + Math.random() * 20, 6);
    const mesh = new THREE.Mesh(geo, ridgeMat);
    const angle = (i / 22) * TAU;
    const radius = 124 + Math.random() * 18;
    mesh.position.set(Math.cos(angle) * radius, -2.8, Math.sin(angle) * radius);
    mesh.scale.set(1.6, .9 + Math.random() * .6, .85);
    mesh.rotation.y = angle + Math.random();
    mesh.receiveShadow = true;
    groups.terrain.add(mesh);
  }
}

function createRock(x, z, scale = 1) {
  if (inCampClearZone(x, z)) return null;
  const geo = new THREE.DodecahedronGeometry(scale, 0);
  const mesh = new THREE.Mesh(geo, Math.random() > .45 ? materials.stoneDark : materials.darkerSand);
  mesh.position.set(x, groundY(x, z) + scale * .45, z);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  mesh.scale.set(1.4 + Math.random(), .55 + Math.random() * .6, .8 + Math.random() * .8);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  groups.props.add(mesh);
  return mesh;
}

function createScrub(x, z, scale = 1) {
  if (inCampClearZone(x, z)) return null;
  const group = new THREE.Group();

  // Multi-stem base emerging from ground
  const stemCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < stemCount; i++) {
    const stemH = (.38 + Math.random() * .52) * scale;
    const stemR = (.04 + Math.random() * .04) * scale;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(stemR * .7, stemR, stemH, 7), materials.wood);
    const angle = (i / stemCount) * TAU + Math.random() * .8;
    stem.position.set(
      Math.cos(angle) * .12 * scale,
      stemH / 2,
      Math.sin(angle) * .12 * scale
    );
    stem.rotation.z = (Math.random() - .5) * .55;
    stem.rotation.x = (Math.random() - .5) * .35;
    stem.castShadow = false;
    group.add(stem);

    // Foliage cluster at top of each stem
    const leafCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < leafCount; j++) {
      const leafGeo = new THREE.DodecahedronGeometry((.18 + Math.random() * .16) * scale, 0);
      const leaf = new THREE.Mesh(leafGeo, Math.random() > .5 ? materials.olive : materials.leafLight);
      leaf.position.set(
        stem.position.x + (Math.random() - .5) * .22 * scale,
        stemH + (Math.random() * .22) * scale,
        stem.position.z + (Math.random() - .5) * .22 * scale
      );
      leaf.rotation.set(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU);
      leaf.castShadow = false;
      group.add(leaf);
    }
  }

  group.position.set(x, groundY(x, z), z);
  group.rotation.y = Math.random() * TAU;
  groups.props.add(group);
  return group;
}

function createOliveTree(x, z, scale = 1) {
  const group = new THREE.Group();

  // Gnarled, thick trunk with taper and twist
  for (let seg = 0; seg < 4; seg++) {
    const r0 = (.34 - seg * .06) * scale;
    const r1 = (.28 - seg * .06) * scale;
    const h = .72 * scale;
    const seg3d = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 9), materials.wood);
    seg3d.position.set(
      Math.sin(seg * 1.2) * .07 * scale,
      (.36 + seg * .72) * scale,
      Math.cos(seg * .9) * .06 * scale
    );
    seg3d.rotation.z = Math.sin(seg * 1.1) * .10;
    seg3d.rotation.x = Math.cos(seg * .8) * .06;
    seg3d.castShadow = true;
    group.add(seg3d);
  }

  // Main branches splitting from upper trunk
  const branchAngles = [0, TAU / 3, TAU * 2 / 3, TAU / 6, TAU * 4 / 6];
  for (let i = 0; i < 5; i++) {
    const branchGroup = new THREE.Group();
    const bLen = (.9 + Math.random() * .55) * scale;
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(.04 * scale, .08 * scale, bLen, 7),
      materials.wood
    );
    branch.position.y = bLen / 2;
    branchGroup.position.set(0, (2.1 + Math.random() * .4) * scale, 0);
    branchGroup.rotation.y = branchAngles[i] + Math.random() * .5;
    branchGroup.rotation.z = .42 + Math.random() * .28;
    branchGroup.add(branch);

    // Secondary branch
    const sec = new THREE.Mesh(
      new THREE.CylinderGeometry(.022 * scale, .04 * scale, bLen * .6, 6),
      materials.wood
    );
    sec.position.set(.12 * scale, bLen * .6, 0);
    sec.rotation.z = .28 + Math.random() * .2;
    sec.rotation.y = Math.random() * 1.2;
    branchGroup.add(sec);

    group.add(branchGroup);
  }

  // Leaf clusters – varied sizes, two shades
  const leafMats = [materials.olive, materials.leafLight];
  const clusterCount = 7 + Math.floor(Math.random() * 4);
  for (let i = 0; i < clusterCount; i++) {
    const lMat = leafMats[i % 2];
    const r = (.72 + Math.random() * .42) * scale;
    const cluster = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), lMat);
    const angle = (i / clusterCount) * TAU + Math.random() * .6;
    const spread = (.85 + Math.random() * .55) * scale;
    cluster.position.set(
      Math.cos(angle) * spread,
      (2.6 + Math.random() * 1.1) * scale,
      Math.sin(angle) * spread
    );
    cluster.scale.set(
      1.1 + Math.random() * .35,
      .68 + Math.random() * .25,
      1.0 + Math.random() * .30
    );
    cluster.castShadow = true;
    group.add(cluster);
  }

  // Small hanging olive fruits (dark dots)
  for (let i = 0; i < 8; i++) {
    const olive = new THREE.Mesh(new THREE.SphereGeometry(.045 * scale, 6, 5), materials.stoneDark);
    olive.position.set(
      (Math.random() - .5) * 2.2 * scale,
      (2.2 + Math.random() * 1.2) * scale,
      (Math.random() - .5) * 2.2 * scale
    );
    group.add(olive);
  }

  group.position.set(x, groundY(x, z), z);
  group.rotation.y = Math.random() * TAU;
  groups.props.add(group);
  return group;
}

function createPalmTree(x, z, scale = 1) {
  const group = new THREE.Group();

  // Trunk – segmented, slightly curved
  const trunkSegs = 7;
  for (let i = 0; i < trunkSegs; i++) {
    const r = (.22 - i * .018) * scale;
    const h = .72 * scale;
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(r * .92, r, h, 10), materials.palmBark);
    seg.position.set(
      Math.sin(i * .22) * .12 * scale,
      (.36 + i * .72) * scale,
      Math.cos(i * .18) * .08 * scale
    );
    // Horizontal ring marks on trunk
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .018 * scale, 5, 12), materials.wood);
    ring.position.copy(seg.position);
    ring.position.y -= h * .42;
    ring.rotation.x = Math.PI / 2;
    seg.castShadow = true;
    group.add(seg, ring);
  }

  const crownY = (trunkSegs * .72 + .36) * scale;

  // Palm fronds radiating from crown
  const frondCount = 9;
  for (let i = 0; i < frondCount; i++) {
    const frondGroup = new THREE.Group();
    frondGroup.position.set(0, crownY, 0);
    frondGroup.rotation.y = (i / frondCount) * TAU + Math.random() * .3;

    const frondLen = (1.8 + Math.random() * .7) * scale;
    const frondBase = new THREE.Mesh(new THREE.CylinderGeometry(.02 * scale, .04 * scale, frondLen, 6), materials.palmLeaf);
    frondBase.position.y = frondLen / 2;
    frondBase.castShadow = true;

    // Leaflets along frond
    for (let j = 2; j < 10; j++) {
      const leaflet = new THREE.Mesh(new THREE.BoxGeometry(.22 * scale, .04 * scale, .42 * scale * (1 - j * .06)), materials.palmLeaf);
      leaflet.position.set(
        (Math.random() - .5) * .05 * scale,
        (j / 10) * frondLen,
        0
      );
      leaflet.rotation.y = Math.PI / 2;
      leaflet.rotation.z = .22;
      frondBase.add(leaflet);
      const leafletR = leaflet.clone();
      leafletR.rotation.y = -Math.PI / 2;
      leafletR.rotation.z = -.22;
      frondBase.add(leafletR);
    }

    frondGroup.rotation.x = -.35 - Math.random() * .25;
    frondGroup.add(frondBase);
    group.add(frondGroup);
  }

  group.position.set(x, groundY(x, z), z);
  group.rotation.y = Math.random() * TAU;
  groups.props.add(group);
  return group;
}

function createCity() {
  groups.city.position.set(18, groundY(18, -56), -56);
  const baseY = 0;
  const wallHeight = 7.2;
  const wallThickness = 2.8;
  const width = 36;
  const depth = 30;

  // ── MAIN WALLS with stone courses ──────────────────────────────
  const wallDefs = [
    { pos: [0, wallHeight / 2, -depth / 2], scale: [width, wallHeight, wallThickness] },
    { pos: [0, wallHeight / 2, depth / 2], scale: [width, wallHeight, wallThickness] },
    { pos: [-width / 2, wallHeight / 2, 0], scale: [wallThickness, wallHeight, depth] },
    { pos: [width / 2, wallHeight / 2, -8], scale: [wallThickness, wallHeight, depth - 12] }
  ];
  for (const piece of wallDefs) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...piece.scale), materials.stone);
    mesh.position.set(...piece.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    groups.city.add(mesh);

    // Horizontal stone course lines
    for (let row = 1; row < 5; row++) {
      const course = new THREE.Mesh(
        new THREE.BoxGeometry(piece.scale[0] + .02, .06, piece.scale[2] + .02),
        materials.stoneDark
      );
      course.position.set(piece.pos[0], row * (wallHeight / 5), piece.pos[2]);
      groups.city.add(course);
    }
  }

  // ── WALL WALK (top platform) ────────────────────────────────────
  const walkDefs = [
    [0, wallHeight + .18, -depth / 2, width + .4, .36, wallThickness + .6],
    [0, wallHeight + .18, depth / 2, width + .4, .36, wallThickness + .6],
    [-width / 2, wallHeight + .18, 0, wallThickness + .6, .36, depth + .4],
    [width / 2, wallHeight + .18, -8, wallThickness + .6, .36, depth - 11.6]
  ];
  for (const [x, y, z, w2, h2, d2] of walkDefs) {
    const walk = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, d2), materials.stoneLight);
    walk.position.set(x, y, z);
    walk.receiveShadow = true;
    groups.city.add(walk);
  }

  // ── CRENELLATIONS / MERLONS on walls ──────────────────────────
  function addMerlons(startX, endX, z, facing = 'z') {
    const mStep = 1.9;
    for (let mx = startX; mx <= endX; mx += mStep) {
      if (Math.abs(mx) % (mStep * 2) < mStep) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(.82, 1.05, wallThickness + .8), materials.stoneMerlon);
        if (facing === 'z') {
          merlon.position.set(mx, wallHeight + .92, z);
        } else {
          merlon.position.set(z, wallHeight + .92, mx);
          merlon.rotation.y = Math.PI / 2;
        }
        merlon.castShadow = true;
        groups.city.add(merlon);
      }
    }
  }
  addMerlons(-width / 2 + 1, width / 2 - 1, -depth / 2, 'z');
  addMerlons(-width / 2 + 1, width / 2 - 1, depth / 2, 'z');
  addMerlons(-depth / 2 + 1, depth / 2 - 1, -width / 2, 'x');

  // ── REINFORCED GATE COMPLEX ─────────────────────────────────────
  // Gate arch / opening
  const gateOpening = new THREE.Mesh(new THREE.BoxGeometry(5.5, 5.2, wallThickness + .6), materials.stoneDark);
  gateOpening.position.set(width / 2, 2.6, 9.0);
  groups.city.add(gateOpening);

  // Gate lintel (heavy stone)
  const gateLintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.2, wallThickness + .9), materials.stoneDark);
  gateLintel.position.set(width / 2, 5.5, 9.0);
  gateLintel.castShadow = true;
  groups.city.add(gateLintel);

  // Gate jamb pillars (L and R)
  for (const side of [-1, 1]) {
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 5.2, wallThickness + .6), materials.stoneLight);
    jamb.position.set(width / 2, 2.6, 9.0 + side * 3.0);
    jamb.castShadow = true;
    groups.city.add(jamb);
  }

  // Actual wooden gate doors
  for (const side of [-1, 1]) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(.22, 4.8, 2.55), materials.wood);
    door.position.set(width / 2 + .05, 2.4, 9.0 + side * 1.28);
    door.castShadow = true;
    // Iron strap hinges on doors
    for (let h2 = 0; h2 < 3; h2++) {
      const hinge = new THREE.Mesh(new THREE.BoxGeometry(.24, .12, 2.4), materials.stoneDark);
      hinge.position.set(width / 2 + .05, .85 + h2 * 1.48, 9.0 + side * 1.28);
      groups.city.add(hinge);
    }
    groups.city.add(door);
  }

  // Gate guardhouse / tower flanking gate
  const guardTower = new THREE.Mesh(new THREE.BoxGeometry(3.5, wallHeight + 2.5, 3.8), materials.stoneDark);
  guardTower.position.set(width / 2, (wallHeight + 2.5) / 2, depth / 2 - 1.8);
  guardTower.castShadow = true;
  groups.city.add(guardTower);

  // ── CORNER TOWERS ───────────────────────────────────────────────
  const towerPositions = [
    [-width / 2, 0, -depth / 2],
    [width / 2, 0, -depth / 2],
    [-width / 2, 0, depth / 2],
    [width / 2, 0, depth / 2]
  ];
  for (const p of towerPositions) {
    // Main tower body
    const tower = new THREE.Mesh(new THREE.BoxGeometry(7.2, 11.2, 7.2), materials.stoneDark);
    tower.position.set(p[0], 5.6, p[2]);
    tower.castShadow = true;
    tower.receiveShadow = true;
    groups.city.add(tower);

    // Stone course bands on tower
    for (let r = 1; r < 6; r++) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(7.4, .09, 7.4), materials.stone);
      band.position.set(p[0], r * 1.82, p[2]);
      groups.city.add(band);
    }

    // Arrow slits
    for (let side = 0; side < 4; side++) {
      const slit = new THREE.Mesh(new THREE.BoxGeometry(.28, .88, .32), materials.black);
      const ang = (side / 4) * TAU;
      slit.position.set(p[0] + Math.cos(ang) * 3.62, 6.2 + Math.sin(side * .5) * .4, p[2] + Math.sin(ang) * 3.62);
      groups.city.add(slit);
    }

    // Tower top – crenellated parapet
    for (let m = 0; m < 8; m++) {
      const ang = (m / 8) * TAU;
      if (m % 2 === 0) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.1, .9), materials.stoneMerlon);
        merlon.position.set(p[0] + Math.cos(ang) * 3.1, 12.0, p[2] + Math.sin(ang) * 3.1);
        merlon.castShadow = true;
        groups.city.add(merlon);
      }
    }

    // Flat roof slab on tower
    const towerRoof = new THREE.Mesh(new THREE.BoxGeometry(7.8, .4, 7.8), materials.stoneLight);
    towerRoof.position.set(p[0], 11.4, p[2]);
    groups.city.add(towerRoof);
  }

  // ── INTERIOR BUILDINGS ────────────────────────────────────────
  for (let i = 0; i < 14; i++) {
    const house = createHouse(
      -10 + Math.random() * 20,
      baseY,
      -9 + Math.random() * 18,
      .75 + Math.random() * .65
    );
    groups.city.add(house);
  }

  // ── TEMPLE / SHRINE (more detailed) ───────────────────────────
  const shrine = new THREE.Group();
  // Stepped platform
  for (let step = 0; step < 3; step++) {
    const stepSize = (3 - step);
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(6.8 - step * .8, .52, 5.8 - step * .7), materials.stoneDark);
    stepMesh.position.y = step * .52 + .26;
    shrine.add(stepMesh);
  }
  // Shrine body
  const shrineBody = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 4.2), materials.stoneLight);
  shrineBody.position.y = 3 * .52 + 1.6;
  shrineBody.castShadow = true;
  shrine.add(shrineBody);
  // Shrine pillars (columns)
  for (const side of [-1.5, -.5, .5, 1.5]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.22, .28, 3.8, 10), materials.stone);
    pillar.position.set(side * .9, 3 * .52 + 1.9, 2.2);
    pillar.castShadow = true;
    shrine.add(pillar);
    // Capital on pillar
    const capital = new THREE.Mesh(new THREE.BoxGeometry(.58, .28, .58), materials.stoneLight);
    capital.position.set(side * .9, 3 * .52 + 3.88, 2.2);
    shrine.add(capital);
  }
  // Shrine idol (bronze cylinder)
  const idol = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.5, 3.2, 8), materials.bronze);
  idol.position.y = 3 * .52 + 1.6;
  shrine.add(idol);
  // Shrine roof / gable
  const shrineRoof = new THREE.Mesh(new THREE.ConeGeometry(3.8, 2.2, 4), materials.darkerSand);
  shrineRoof.position.y = 3 * .52 + 3.2 + 1.1;
  shrineRoof.rotation.y = Math.PI / 4;
  shrineRoof.castShadow = true;
  shrine.add(shrineRoof);

  shrine.position.set(-5, .05, 5);
  groups.city.add(shrine);

  // ── WELL / CISTERN ────────────────────────────────────────────
  const wellRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, .32, 10, 20), materials.stone);
  wellRing.rotation.x = Math.PI / 2;
  wellRing.position.set(8, .32, -2);
  groups.city.add(wellRing);
  const wellWater = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .08, 16), new THREE.MeshStandardMaterial({ color: 0x2a6868, roughness: .1, metalness: .2 }));
  wellWater.position.set(8, .06, -2);
  groups.city.add(wellWater);

  // ── FIRE EFFECTS ──────────────────────────────────────────────
  for (let i = 0; i < 12; i++) {
    const flame = createFlame(0.8 + Math.random() * .7);
    flame.position.set(-10 + Math.random() * 20, 1.2, -8 + Math.random() * 16);
    flame.visible = false;
    groups.city.add(flame);
    cityFlames.push(flame);
  }
}

function createHouse(x, y, z, s = 1) {
  const group = new THREE.Group();

  const w = 4.2 * s;
  const d = 4.0 * s;
  const h = 3.2 * s;

  // Main mudbrick body
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials.mudbrick);
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Flat roof with parapet (raised edge)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .3 * s, .22 * s, d + .3 * s), materials.darkerSand);
  roof.position.y = h + .11 * s;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  // Parapet / low wall around roof (2 sides)
  for (const side of [-1, 1]) {
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + .3 * s, .55 * s, .22 * s), materials.stone);
    parapet.position.set(0, h + .22 * s + .27 * s, side * (d / 2 + .11 * s));
    parapet.castShadow = true;
    group.add(parapet);
    const parapetSide = new THREE.Mesh(new THREE.BoxGeometry(.22 * s, .55 * s, d + .3 * s), materials.stone);
    parapetSide.position.set(side * (w / 2 + .11 * s), h + .22 * s + .27 * s, 0);
    parapetSide.castShadow = true;
    group.add(parapetSide);
  }

  // Merlons on parapet (battlements)
  const merlon = materials.stoneMerlon;
  const merlonCount = Math.floor(w / (.55 * s));
  for (let i = 0; i < merlonCount; i++) {
    if (i % 2 === 0) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(.28 * s, .42 * s, .25 * s), merlon);
      m.position.set(-w / 2 + i * (.55 * s) + .14 * s, h + .22 * s + .55 * s + .21 * s, d / 2 + .11 * s);
      group.add(m);
      const m2 = m.clone();
      m2.position.z = -(d / 2 + .11 * s);
      group.add(m2);
    }
  }

  // Doorway – arched top with lintel
  const doorW = .85 * s;
  const doorH = 1.72 * s;
  const doorDepth = .28 * s;
  const doorframe = new THREE.Mesh(new THREE.BoxGeometry(doorW + .24 * s, doorH + .3 * s, doorDepth + .06), materials.stoneDark);
  doorframe.position.set(0, (doorH + .3 * s) / 2, d / 2 + .01);
  group.add(doorframe);

  const doorBody = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, doorDepth + .1), materials.wood);
  doorBody.position.set(0, doorH / 2, d / 2 + .02);
  group.add(doorBody);

  // Door lintel stone
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorW + .24 * s, .22 * s, doorDepth + .08), materials.stoneLight);
  lintel.position.set(0, doorH + .11 * s, d / 2 + .02);
  group.add(lintel);

  // Windows – simple square slits with stone sills
  const winPositions = [
    [w * .3, h * .62, d / 2 + .01, 0],
    [-w * .3, h * .62, d / 2 + .01, 0],
    [w / 2 + .01, h * .55, 0, Math.PI / 2],
    [-(w / 2 + .01), h * .55, 0, -Math.PI / 2]
  ];
  for (const [wx2, wy, wz, ry] of winPositions) {
    const winHole = new THREE.Mesh(new THREE.BoxGeometry(.38 * s, .38 * s, .18 * s), materials.stoneDark);
    winHole.position.set(wx2, wy, wz);
    winHole.rotation.y = ry;
    group.add(winHole);
    // Stone sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(.46 * s, .10 * s, .14 * s), materials.stoneLight);
    sill.position.set(wx2, wy - .22 * s, wz + (ry === 0 ? .07 * s : 0));
    sill.rotation.y = ry;
    group.add(sill);
  }

  // External mud-plaster texture strips (horizontal lines / courses)
  for (let row = 0; row < 4; row++) {
    const course = new THREE.Mesh(new THREE.BoxGeometry(w + .02, .06 * s, d + .02), materials.brickRed);
    course.position.set(0, (.55 + row * .72) * s, 0);
    group.add(course);
  }

  // Stone foundation base
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(w + .4 * s, .28 * s, d + .4 * s), materials.stoneDark);
  foundation.position.y = .14 * s;
  foundation.receiveShadow = true;
  group.add(foundation);

  group.position.set(x, y, z);
  group.rotation.y = Math.random() * .5 - .25;
  return group;
}

function createFlame(scale = 1) {
  const group = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(.45 * scale, 1.55 * scale, 7), materials.flame);
  outer.position.y = .75 * scale;
  const inner = new THREE.Mesh(new THREE.ConeGeometry(.25 * scale, 1.0 * scale, 7), new THREE.MeshStandardMaterial({
    color: 0xffdf6e,
    emissive: 0xffb02b,
    emissiveIntensity: 2.4,
    roughness: .3
  }));
  inner.position.y = .58 * scale;
  group.add(outer, inner);
  group.userData.outer = outer;
  group.userData.inner = inner;
  return group;
}

function createCamp() {
  const campGroup = groups.camp;
  captainTents.length = 0;

  const rowZ = 50.4;
  const spacing = 14;
  const rowX = [-spacing, 0, spacing];
  const doorYaw = 0;
  for (const x of rowX) {
    campGroup.add(createTent(x, rowZ, 1, doorYaw, "captain"));
  }
}

function createTent(x, z, s = 1, doorYaw = null, tentMode = "decor") {
  const group = new THREE.Group();
  const w = 5.8 * s;
  const d = 6.9 * s;
  const h = 2.45 * s;
  const vertices = new Float32Array([
    -w / 2, 0, -d / 2,
     w / 2, 0, -d / 2,
     0, h, -d / 2,
    -w / 2, 0,  d / 2,
     w / 2, 0,  d / 2,
     0, h,  d / 2
  ]);
  const indices = [
    0, 1, 2,
    3, 5, 4,
    0, 2, 5, 0, 5, 3,
    1, 4, 5, 1, 5, 2,
    0, 3, 4, 0, 4, 1
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const tentMat = materials.linen.clone();
  tentMat.side = THREE.DoubleSide;
  tentMat.roughness = .88;
  const mesh = new THREE.Mesh(geo, tentMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const skirtMat = materials.darkerSand.clone();
  skirtMat.roughness = .96;
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(w * .52, w * .58, .12 * s, 24), skirtMat);
  skirt.position.y = .06 * s;
  skirt.castShadow = true;
  skirt.receiveShadow = true;

  const ridge = new THREE.Mesh(new THREE.CylinderGeometry(.07 * s, .08 * s, d * 1.12, 8), materials.wood);
  ridge.position.set(0, h + .05 * s, 0);
  ridge.rotation.x = Math.PI / 2;

  const frontFlapL = new THREE.Mesh(new THREE.PlaneGeometry(1.55 * s, 1.95 * s), materials.darkerSand);
  frontFlapL.position.set(-.48 * s, .78 * s, d / 2 + .03);
  frontFlapL.rotation.set(.04, .1, -.26);
  const frontFlapR = frontFlapL.clone();
  frontFlapR.position.x = .48 * s;
  frontFlapR.rotation.z = .26;

  const pegGeo = new THREE.CylinderGeometry(.035 * s, .045 * s, .78 * s, 6);
  const pegPositions = [
    [-w / 2 - .25 * s, .28 * s, -d / 2 + .4 * s],
    [ w / 2 + .25 * s, .28 * s, -d / 2 + .4 * s],
    [-w / 2 - .25 * s, .28 * s,  d / 2 - .4 * s],
    [ w / 2 + .25 * s, .28 * s,  d / 2 - .4 * s]
  ];
  group.add(skirt, mesh, ridge, frontFlapL, frontFlapR);
  for (const p of pegPositions) {
    const peg = new THREE.Mesh(pegGeo, materials.wood);
    peg.position.set(...p);
    peg.rotation.z = .22 * Math.sign(p[0]);
    group.add(peg);
  }
  const baseY = tentPadBaseY(x, z, w, d, s);
  group.position.set(x, baseY, z);
  group.rotation.y = doorYaw !== null && doorYaw !== undefined ? doorYaw : Math.random() * .35 - .17;
  group.userData.tentScale = s;
  group.userData.tentDepth = d;
  group.userData.tentWidth = w;

  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x2a1f14,
    roughness: .98,
    metalness: 0,
    side: THREE.DoubleSide
  });
  const doorMat = innerMat.clone();
  doorMat.transparent = true;
  doorMat.opacity = .42;
  const doorShadow = new THREE.Mesh(new THREE.PlaneGeometry(w * .38, h * .88), doorMat);
  doorShadow.position.set(0, h * .44, d / 2 + .018);
  doorShadow.receiveShadow = true;
  group.add(doorShadow);

  const ropeMat = materials.wood.clone();
  ropeMat.color.setHex(0x4a3220);
  ropeMat.roughness = .9;
  function guyRope(x0, y0, z0, x1, y1, z1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dz = z1 - z0;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || .01;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.018 * s, .022 * s, len, 5), ropeMat);
    rod.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx / len, dy / len, dz / len));
    rod.castShadow = true;
    return rod;
  }
  group.add(
    guyRope(-w * .42, h * .55, d * .32, -w * .62, .12 * s, d * .52),
    guyRope(w * .42, h * .55, d * .32, w * .62, .12 * s, d * .52),
    guyRope(-w * .32, h * .35, -d * .42, -w * .55, .1 * s, -d * .52),
    guyRope(w * .32, h * .35, -d * .42, w * .55, .1 * s, -d * .52)
  );

  const door = new THREE.Group();
  door.position.set(0, 0, d * .42);
  const postGeo = new THREE.BoxGeometry(.14 * s, 2.05 * s, .12 * s);
  const postL = new THREE.Mesh(postGeo, materials.wood);
  postL.position.set(-w * .34, 1.02 * s, 0);
  postL.castShadow = true;
  const postR = postL.clone();
  postR.position.x = w * .34;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(w * .78, .12 * s, .14 * s), materials.wood);
  lintel.position.set(0, 2.08 * s, 0);
  lintel.castShadow = true;
  door.add(postL, postR, lintel);
  group.add(door);

  const innerFloor = new THREE.Mesh(new THREE.PlaneGeometry(w * .62, d * .42), innerMat);
  innerFloor.rotation.x = -Math.PI / 2;
  innerFloor.position.set(0, .04 * s, -d * .18);
  innerFloor.receiveShadow = true;
  group.add(innerFloor);

  group.userData.doorTargetOpen = false;
  group.userData.doorAnim = 0;
  group.userData.tentMode = tentMode;
  group.userData.tentParts = {
    flapL: frontFlapL,
    flapR: frontFlapR,
    doorShadow,
    flapLZ0: frontFlapL.rotation.z,
    flapRZ0: frontFlapR.rotation.z,
    flapLZp0: frontFlapL.position.z,
    flapRZp0: frontFlapR.position.z
  };
  if (tentMode === "captain") {
    captainTents.push(group);
  }

  return group;
}

function createCampfire(x, z) {
  const group = new THREE.Group();
  const log1 = new THREE.Mesh(new THREE.CylinderGeometry(.16, .18, 2.2, 7), materials.wood);
  log1.rotation.z = Math.PI / 2;
  log1.position.y = .16;
  const log2 = log1.clone();
  log2.rotation.y = Math.PI / 2;
  const flame = createFlame(.85);
  flame.position.y = .18;
  group.add(log1, log2, flame);
  group.position.set(x, groundY(x, z), z);
  return group;
}

function createBanner(x, z, color, label = "") {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 5.4, 8), materials.wood);
  pole.position.y = 2.7;
  const clothMat = new THREE.MeshStandardMaterial({ color, roughness: .8, side: THREE.DoubleSide });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.2, 6, 2), clothMat);
  cloth.position.set(-1.9, 4.1, 0);
  cloth.rotation.y = Math.PI / 2;
  group.add(pole, cloth);
  group.position.set(x, groundY(x, z), z);
  group.userData.label = label;
  return group;
}

function makeCharacter(options = {}) {
  const {
    robe = materials.israelBlue,
    sash = materials.bronze,
    head = 0xc79358,
    scale = 1,
    spear = true,
    shield = true,
    headdress = true,
    faction = "israel",
    playerAvatar = false
  } = options;
  const group = new THREE.Group();
  group.scale.setScalar(scale);

  const parts = {
    baseScale: scale,
    walkPhase: Math.random() * TAU,
    visualSpeed: 0,
    lastPosition: null,
    faction
  };

  const skinTone = head;
  const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: .72, metalness: 0 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: .74, metalness: 0 });
  skinDarkMat.color.multiplyScalar(.82);
  const clothEdgeMat = faction === "ai" ? materials.darkBronze : materials.clothTrim;
  const armorMat = faction === "ai" ? materials.bronzeHelmet : materials.metalPlate;
  const armorDarkMat = faction === "ai" ? materials.bronzeHelmetDark : materials.leather;
  const handGeo = new THREE.SphereGeometry(.12, 10, 8);

  // ── LEGS ──────────────────────────────────────────────────────
  function makeLeg(side) {
    const leg = new THREE.Group();
    leg.position.set(side * .26, 1.08, 0);

    // Tunic/kilt flap over thigh
    const kiltMat = robe.clone ? robe.clone() : robe;
    const kilt = new THREE.Mesh(new THREE.BoxGeometry(.32, .56, .28), kiltMat);
    kilt.position.y = -.18;
    kilt.castShadow = true;

    // Upper leg (thigh) with leather wrapping
    const thighGeo = new THREE.CylinderGeometry(.125, .14, .72, 12);
    const thigh = new THREE.Mesh(thighGeo, skinMat);
    thigh.position.y = -.5;
    thigh.castShadow = true;

    // Greave strip on front of thigh
    const greave = new THREE.Mesh(new THREE.BoxGeometry(.11, .38, .06), armorMat);
    greave.position.set(0, -.44, .14);
    greave.castShadow = true;

    // Lower leg (calf) 
    const calfGeo = new THREE.CylinderGeometry(.10, .125, .66, 12);
    const calf = new THREE.Mesh(calfGeo, skinMat);
    calf.position.y = -1.02;
    calf.castShadow = true;

    // Shin greave (lower)
    const shinGuard = new THREE.Mesh(new THREE.BoxGeometry(.10, .34, .055), armorMat);
    shinGuard.position.set(0, -.98, .12);
    shinGuard.castShadow = true;

    // Leather ankle wrapping straps
    for (let i = 0; i < 3; i++) {
      const strap = new THREE.Mesh(new THREE.TorusGeometry(.105 + i*.008, .013, 6, 12), materials.leather);
      strap.position.y = -1.2 + i * .065;
      strap.rotation.x = Math.PI / 2;
      leg.add(strap);
    }

    // Sandal – broader sole with toe cap
    const sole = new THREE.Mesh(new THREE.BoxGeometry(.30, .07, .58), materials.sandal);
    sole.position.set(0, -1.36, .08);

    const toeCap = new THREE.Mesh(new THREE.BoxGeometry(.28, .06, .12), materials.leather);
    toeCap.position.set(0, -1.31, .32);

    // Sandal cross straps
    const strapA = new THREE.Mesh(new THREE.BoxGeometry(.30, .05, .045), materials.leather);
    strapA.position.set(0, -1.29, .14);
    const strapB = strapA.clone();
    strapB.position.z = .28;

    leg.add(kilt, thigh, greave, calf, shinGuard, sole, toeCap, strapA, strapB);
    return leg;
  }

  const legL = makeLeg(-1);
  const legR = makeLeg(1);
  group.add(legL, legR);
  parts.legL = legL;
  parts.legR = legR;

  // ── TUNIC/ROBE BODY ──────────────────────────────────────────
  // Main tunic body – slightly tapered
  const tunicBody = new THREE.Mesh(new THREE.CylinderGeometry(.44, .52, 1.12, 14), robe);
  tunicBody.position.y = 1.38;
  tunicBody.scale.z = .72;
  tunicBody.castShadow = true;
  tunicBody.receiveShadow = true;
  group.add(tunicBody);
  parts.robeSkirt = tunicBody;

  // ── TORSO ──────────────────────────────────────────────────────
  const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(.42, .46, .82, 14), robe);
  torsoMesh.position.y = 2.10;
  torsoMesh.scale.z = .70;
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  group.add(torsoMesh);
  parts.body = torsoMesh;

  // Cloth belt / waist sash
  const beltGeo = new THREE.CylinderGeometry(.48, .50, .14, 16);
  const belt = new THREE.Mesh(beltGeo, materials.leather);
  belt.position.y = 1.72;
  belt.scale.z = .72;
  group.add(belt);

  const sashBand = new THREE.Mesh(new THREE.BoxGeometry(1.0, .10, .055), sash);
  sashBand.position.set(0, 1.74, .36);
  group.add(sashBand);

  // ── CHEST ARMOR PLATE ─────────────────────────────────────────
  if (!playerAvatar) {
    // Main chest plate (lamellar / scale armor)
    const plateH = faction === "ai" ? .70 : .62;
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(.78, plateH, .08), armorMat);
    chestPlate.position.set(0, 2.22, .38);
    chestPlate.castShadow = true;
    group.add(chestPlate);

    // Horizontal plate ridges for detail
    for (let i = 0; i < 4; i++) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(.76, .04, .05), armorDarkMat);
      ridge.position.set(0, 2.0 + i * .165, .41);
      group.add(ridge);
    }

    // Shoulder epaulette pieces
    for (const side of [-1, 1]) {
      const pauldron = new THREE.Mesh(new THREE.CylinderGeometry(.19, .22, .12, 10, 1, false, 0, Math.PI), armorMat);
      pauldron.position.set(side * .58, 2.62, 0);
      pauldron.rotation.x = Math.PI / 2;
      pauldron.rotation.z = side * .18;
      pauldron.castShadow = true;
      group.add(pauldron);

      // Pauldron lower strip
      for (let i = 0; i < 2; i++) {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(.22, .07, .12), armorDarkMat);
        strip.position.set(side * .58, 2.54 - i * .08, .03 + i * .03);
        strip.rotation.z = side * .12;
        group.add(strip);
      }
    }

    // Belly guard / pteryges (leather strips hanging from plate)
    for (let i = 0; i < 6; i++) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(.10, .32, .05), materials.leather);
      strip.position.set(-.26 + i * .10, 1.85, .37);
      strip.rotation.z = (Math.random() - .5) * .08;
      group.add(strip);
    }

    parts.chest = chestPlate;
  } else {
    parts.chest = null;
  }

  // ── NECK + HEAD ───────────────────────────────────────────────
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.14, .17, .24, 10), skinMat);
  neck.position.y = 2.76;
  group.add(neck);

  // Head – slightly elongated
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(.33, 24, 18), skinMat);
  headMesh.position.y = 3.08;
  headMesh.scale.set(.94, 1.08, .92);
  headMesh.castShadow = true;
  group.add(headMesh);
  parts.head = headMesh;

  // Cheekbones / jaw shape
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(.22, 14, 10, 0, TAU, 0, Math.PI * .48), skinDarkMat);
  jaw.position.set(0, 2.90, .06);
  jaw.scale.set(1.05, .68, .88);
  group.add(jaw);

  // Nose – slightly hooked/prominent
  const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(.025, .04, .22, 7), skinMat);
  noseBridge.position.set(0, 3.07, .30);
  noseBridge.rotation.x = Math.PI / 2;
  group.add(noseBridge);
  const nostril = new THREE.Mesh(new THREE.SphereGeometry(.055, 8, 6), skinMat);
  nostril.position.set(0, 3.01, .33);
  nostril.scale.set(1.2, .55, .8);
  group.add(nostril);

  // Eyes – whites + dark iris
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: .4 });
  const irisMat = new THREE.MeshStandardMaterial({ color: faction === "ai" ? 0x3a1a08 : 0x2a1508, roughness: .3 });
  for (const side of [-1, 1]) {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(.055, 10, 8), eyeWhiteMat);
    eyeWhite.position.set(side * .115, 3.16, .28);
    eyeWhite.scale.set(.7, .55, .55);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(.038, 8, 6), irisMat);
    iris.position.set(side * .115, 3.16, .31);
    iris.scale.set(.65, .55, .5);
    group.add(eyeWhite, iris);

    // Upper eyelid line
    const lid = new THREE.Mesh(new THREE.BoxGeometry(.11, .018, .04), skinDarkMat);
    lid.position.set(side * .115, 3.20, .28);
    group.add(lid);

    // Eyebrow – thicker and angled
    const browMat = faction === "ai" ? materials.darkBronze : materials.hair;
    const brow = new THREE.Mesh(new THREE.BoxGeometry(.13, .030, .04), browMat);
    brow.position.set(side * .115, 3.25, .27);
    brow.rotation.z = side * .18;
    group.add(brow);
  }

  // Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(.052, 8, 6), skinMat);
    ear.position.set(side * .32, 3.06, 0);
    ear.scale.set(.45, .88, .36);
    group.add(ear);
  }

  // Beard / facial hair
  const beardMat = faction === "ai" ? materials.hair : materials.beard;
  // Main beard mass
  const beardMain = new THREE.Mesh(new THREE.SphereGeometry(.21, 12, 8, 0, TAU, Math.PI*.35, Math.PI*.55), beardMat);
  beardMain.position.set(0, 2.84, .18);
  beardMain.scale.set(.85, 1.0, .65);
  group.add(beardMain);
  // Mustache
  const mustache = new THREE.Mesh(new THREE.BoxGeometry(.22, .055, .06), beardMat);
  mustache.position.set(0, 2.96, .32);
  group.add(mustache);
  // Beard tip / point
  const beardTip = new THREE.Mesh(new THREE.ConeGeometry(.09, .28, 8), beardMat);
  beardTip.position.set(0, 2.65, .18);
  beardTip.rotation.x = .25;
  group.add(beardTip);

  // Mouth line
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(.14, .025, .05), new THREE.MeshStandardMaterial({ color: 0x8a3a25, roughness: .5 }));
  mouth.position.set(0, 2.94, .32);
  group.add(mouth);

  // ── HEADDRESS / HELMET ─────────────────────────────────────────
  if (headdress) {
    // Keffiyeh / cloth headdress wrapping
    const headclothMat = new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: .88 });
    const headDome = new THREE.Mesh(new THREE.SphereGeometry(.36, 16, 10, 0, TAU, 0, Math.PI * .50), headclothMat);
    headDome.position.y = 3.20;
    headDome.scale.set(1.05, .88, 1.02);
    headDome.castShadow = true;
    group.add(headDome);

    // Cloth fold ring
    const foldRing = new THREE.Mesh(new THREE.TorusGeometry(.35, .072, 8, 22), headclothMat);
    foldRing.position.y = 3.18;
    foldRing.rotation.x = Math.PI / 2;
    group.add(foldRing);

    // Headband (agal rope – dark cord)
    const agal = new THREE.Mesh(new THREE.TorusGeometry(.345, .038, 8, 22), new THREE.MeshStandardMaterial({ color: 0x1a100a, roughness: .92 }));
    agal.position.y = 3.24;
    agal.rotation.x = Math.PI / 2;
    group.add(agal);

    // Trailing cloth at back/side
    const trail1 = new THREE.Mesh(new THREE.BoxGeometry(.22, .82, .045), headclothMat);
    trail1.position.set(-.28, 2.88, -.12);
    trail1.rotation.z = -.18;
    trail1.rotation.x = .08;
    group.add(trail1);
    const trail2 = new THREE.Mesh(new THREE.BoxGeometry(.16, .58, .04), headclothMat);
    trail2.position.set(.18, 2.92, -.18);
    trail2.rotation.z = .12;
    group.add(trail2);

  } else if (faction === "ai") {
    // Bronze war helmet with crest
    const helmetMat = materials.bronzeHelmet;
    const helmetDarkMat = materials.bronzeHelmetDark;

    // Main bowl
    const helmetBowl = new THREE.Mesh(new THREE.SphereGeometry(.37, 16, 10, 0, TAU, 0, Math.PI * .58), helmetMat);
    helmetBowl.position.y = 3.16;
    helmetBowl.scale.set(1.02, .85, 1.0);
    helmetBowl.castShadow = true;
    group.add(helmetBowl);

    // Nose guard
    const noseGuard = new THREE.Mesh(new THREE.BoxGeometry(.10, .28, .05), helmetDarkMat);
    noseGuard.position.set(0, 3.02, .36);
    group.add(noseGuard);

    // Cheek guards
    for (const side of [-1, 1]) {
      const cheekGuard = new THREE.Mesh(new THREE.BoxGeometry(.16, .26, .07), helmetMat);
      cheekGuard.position.set(side * .32, 2.96, .14);
      cheekGuard.rotation.z = side * .22;
      group.add(cheekGuard);
    }

    // Neck protector (back flap)
    const neckFlap = new THREE.Mesh(new THREE.BoxGeometry(.64, .22, .07), helmetDarkMat);
    neckFlap.position.set(0, 2.88, -.18);
    group.add(neckFlap);

    // Ridge on top of helmet
    const ridge = new THREE.Mesh(new THREE.CylinderGeometry(.045, .055, .66, 8), helmetDarkMat);
    ridge.position.set(0, 3.45, 0);
    ridge.rotation.x = Math.PI / 2;
    group.add(ridge);

    // Plume / crest (red horsehair)
    const plumeMat = materials.redPlume;
    const plumeBase = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .38, 8), helmetDarkMat);
    plumeBase.position.set(0, 3.52, 0);
    group.add(plumeBase);
    for (let i = 0; i < 5; i++) {
      const strand = new THREE.Mesh(new THREE.CylinderGeometry(.018, .04, .55 + i * .04, 6), plumeMat);
      strand.position.set((i - 2) * .05, 3.78 + Math.abs(i - 2) * -.04, 0);
      strand.rotation.x = (i - 2) * .08;
      group.add(strand);
    }
  } else {
    // Simple hair cap for soldiers without headdress
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(.34, 16, 8, 0, TAU, 0, Math.PI * .54), materials.hair);
    hairCap.position.y = 3.18;
    group.add(hairCap);
  }

  // ── ARMS ────────────────────────────────────────────────────────
  function makeArm(side) {
    const arm = new THREE.Group();
    arm.position.set(side * .56, 2.50, .04);
    arm.rotation.z = side * -.30;

    // Sleeve (cloth upper arm cover)
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.12, .145, .48, 12), robe);
    sleeve.position.y = -.22;
    sleeve.castShadow = true;

    // Upper arm (skin)
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(.09, .115, .52, 12), skinMat);
    upper.position.y = -.55;
    upper.castShadow = true;

    // Bracer / arm guard (leather wrapping on forearm)
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(.075, .10, .55, 12), skinMat);
    forearm.position.y = -.98;
    forearm.castShadow = true;

    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(.09, .105, .38, 10, 1, true, -.4, Math.PI * 1.5), armorMat);
    bracer.position.y = -.95;
    bracer.castShadow = true;

    // Bracer straps
    for (let i = 0; i < 2; i++) {
      const bracerStrap = new THREE.Mesh(new THREE.TorusGeometry(.095, .014, 6, 12), materials.leather);
      bracerStrap.position.y = -.88 + i * .16;
      bracerStrap.rotation.x = Math.PI / 2;
      arm.add(bracerStrap);
    }

    // Hand – more defined
    const hand = new THREE.Mesh(new THREE.SphereGeometry(.11, 10, 8), skinMat);
    hand.position.y = -1.28;
    hand.scale.set(1.1, .65, .85);

    // Thumb nub
    const thumb = new THREE.Mesh(new THREE.SphereGeometry(.045, 6, 5), skinMat);
    thumb.position.set(side * .09, -1.24, .06);

    arm.add(sleeve, upper, forearm, bracer, hand, thumb);
    arm.userData.forearm = forearm;
    arm.userData.hand = hand;
    return arm;
  }

  const armL = makeArm(-1);
  const armR = makeArm(1);
  group.add(armL, armR);
  parts.armL = armL;
  parts.armR = armR;

  // ── SPEAR ─────────────────────────────────────────────────────
  if (spear) {
    const spearGroup = new THREE.Group();

    // Main shaft – slightly tapered wood pole
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.028, .038, 4.5, 10), materials.wood);
    shaft.position.y = 2.1;
    shaft.castShadow = true;

    // Bronze leaf-blade tip
    const blade = new THREE.Mesh(new THREE.ConeGeometry(.065, .72, 8), materials.bronzeBright);
    blade.position.y = 4.58;
    blade.castShadow = true;

    // Blade socket / collar
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(.052, .038, .20, 10), materials.bronzeHelmetDark);
    socket.position.y = 4.26;

    // Crossguard / rivets at grip
    const crossGuard = new THREE.Mesh(new THREE.TorusGeometry(.06, .015, 6, 12), materials.bronzeBright);
    crossGuard.position.y = 1.38;
    crossGuard.rotation.x = Math.PI / 2;

    // Butt spike
    const butt = new THREE.Mesh(new THREE.ConeGeometry(.055, .28, 8), materials.darkBronze);
    butt.position.y = -.24;
    butt.rotation.x = Math.PI;

    // Leather grip wrapping
    for (let i = 0; i < 6; i++) {
      const wrap = new THREE.Mesh(new THREE.TorusGeometry(.042, .012, 6, 10), materials.leather);
      wrap.position.y = 1.1 + i * .085;
      wrap.rotation.x = Math.PI / 2;
      spearGroup.add(wrap);
    }

    spearGroup.add(shaft, blade, socket, crossGuard, butt);
    spearGroup.position.set(.80, .18, .18);
    spearGroup.rotation.z = -.10;
    spearGroup.rotation.x = .035;
    spearGroup.userData.shaft = shaft;
    group.add(spearGroup);
    parts.spear = spearGroup;
  }

  // ── SHIELD ─────────────────────────────────────────────────────
  if (shield) {
    const shieldGroup = new THREE.Group();

    // Main shield face – oval/round shape
    const shieldGeo = new THREE.CylinderGeometry(.56, .56, .10, 20);
    const shieldFace = new THREE.Mesh(shieldGeo, sash);
    shieldFace.rotation.x = Math.PI / 2;
    shieldFace.castShadow = true;

    // Reinforcing rim of leather
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.56, .052, 10, 22), materials.leather);
    rim.rotation.x = Math.PI / 2;

    // Central bronze boss (umbo)
    const boss = new THREE.Mesh(new THREE.SphereGeometry(.18, 14, 10), materials.bronzeBright);
    boss.position.z = .07;
    boss.scale.set(1, 1, .55);

    // Decorative ring around boss
    const bossRing = new THREE.Mesh(new THREE.TorusGeometry(.20, .022, 8, 20), materials.darkBronze);
    bossRing.rotation.x = Math.PI / 2;
    bossRing.position.z = .04;

    // Cross / faction marking on shield
    if (faction === "israel") {
      const barH = new THREE.Mesh(new THREE.BoxGeometry(.52, .055, .04), materials.bronzeBright);
      barH.position.z = .03;
      const barV = barH.clone();
      barV.rotation.z = Math.PI / 2;
      shieldGroup.add(barH, barV);
    } else {
      // Ai faction – serpent/eye symbol (simplified as concentric rings)
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(.32, .018, 8, 20), materials.aiDark);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.z = .02;
      shieldGroup.add(ring2);
    }

    // Handle straps on back
    const strapV = new THREE.Mesh(new THREE.BoxGeometry(.10, .58, .07), materials.leather);
    strapV.position.z = -.07;
    const strapH = new THREE.Mesh(new THREE.BoxGeometry(.52, .10, .07), materials.leather);
    strapH.position.z = -.07;

    shieldGroup.add(shieldFace, rim, boss, bossRing, strapV, strapH);
    shieldGroup.position.set(-.80, 1.90, .22);
    shieldGroup.rotation.z = .08;
    shieldGroup.rotation.y = -.08;
    shieldGroup.castShadow = true;
    group.add(shieldGroup);
    parts.shield = shieldGroup;
  }

  // ── CLOAK / MANTLE ─────────────────────────────────────────────
  if (!playerAvatar) {
    // Back cape / cloak hanging from shoulders
    const cloakMat = (faction === "ai") ? materials.aiDark : materials.israelDeep;
    const cloak = new THREE.Mesh(new THREE.BoxGeometry(.98, .92, .055), cloakMat);
    cloak.position.set(0, 2.10, -.38);
    cloak.rotation.x = .10;
    cloak.castShadow = true;
    group.add(cloak);

    // Shoulder trim
    const cloakShoulder = new THREE.Mesh(new THREE.BoxGeometry(1.08, .12, .07), clothEdgeMat);
    cloakShoulder.position.set(0, 2.58, -.22);
    group.add(cloakShoulder);
  }

  // ── FACTION TRIM ────────────────────────────────────────────────
  if (faction === "ai") {
    // Red cord / banner tied around waist
    const redCord = new THREE.Mesh(new THREE.TorusGeometry(.49, .024, 8, 20), materials.aiRed);
    redCord.position.y = 2.45;
    redCord.rotation.x = Math.PI / 2;
    group.add(redCord);
  } else {
    // Gold shoulder trim – mark of Israel
    const shoulderTrim = new THREE.Mesh(new THREE.TorusGeometry(.46, .028, 8, 18), clothEdgeMat);
    shoulderTrim.position.y = 2.60;
    shoulderTrim.rotation.x = Math.PI / 2;
    group.add(shoulderTrim);
    // Collar / neckline trim
    const collar = new THREE.Mesh(new THREE.TorusGeometry(.28, .022, 6, 16), clothEdgeMat);
    collar.position.y = 2.70;
    collar.rotation.x = Math.PI / 2;
    group.add(collar);
  }

  group.userData = parts;
  const shadowMeshes = new Set([parts.body, parts.chest, parts.robeSkirt].filter(Boolean));
  group.traverse(obj => {
    if (obj.isMesh) {
      obj.receiveShadow = true;
      obj.castShadow = shadowMeshes.has(obj);
    }
  });
  return group;
}

function createPlayer() {
  const group = makeCharacter({
    robe: materials.israelBlue,
    sash: materials.gold,
    scale: 1.17,
    spear: true,
    shield: true,
    faction: "israel",
    playerAvatar: true
  });
  group.position.copy(player.position);
  group.position.y = groundY(player.position.x, player.position.z);
  group.rotation.y = player.yaw;
  group.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  player.group = group;
  player.body = group.userData.body;
  player.spear = group.userData.spear;
  player.mantle = null;
  group.visible = false;
  group.traverse(obj => {
    obj.visible = false;
    obj.layers.disable(0);
  });
  groups.units.add(group);
  const cursor = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xf3d47a,
    emissive: 0xb7811d,
    emissiveIntensity: .55,
    transparent: true,
    opacity: .86,
    roughness: .5
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, .055, 8, 54), ringMat);
  ring.rotation.x = Math.PI / 2;
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(.34, 1.05, 3), ringMat);
  arrow.position.set(0, .08, -1.55);
  arrow.rotation.x = Math.PI / 2;
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, .035, 36), new THREE.MeshStandardMaterial({
    color: 0xffe4a2,
    emissive: 0xd19a2e,
    emissiveIntensity: .32,
    transparent: true,
    opacity: .22,
    depthWrite: false
  }));
  glow.position.y = .025;
  cursor.add(glow, ring, arrow);
  cursor.visible = false;
  player.cursor = cursor;
  groups.markers.add(cursor);
}

function createCaptain(x, z, name, homeTent = null) {
  const group = makeCharacter({ robe: materials.israelDeep, sash: materials.gold, scale: 1.08, spear: true, shield: true, faction: "israel" });
  const y = homeTent ? homeTent.position.y + 0.09 : groundY(x, z);
  group.position.set(x, y, z);
  group.rotation.y = homeTent ? homeTent.rotation.y + Math.PI : Math.random() * TAU;
  group.userData.name = name;
  group.userData.collected = false;
  group.userData.baseY = group.position.y;
  group.userData.interactRange = CAPTAIN_INTERACT_RANGE;
  group.userData.hiddenInTent = !!homeTent;
  group.userData.homeTent = homeTent || null;
  if (homeTent) {
    group.visible = false;
    homeTent.userData.captain = group;
  }
  const haloMat = materials.marker.clone();
  haloMat.opacity = .28;
  haloMat.emissiveIntensity = .18;
  const halo = new THREE.Mesh(new THREE.TorusGeometry(group.userData.interactRange, .05, 8, 32), haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.visible = !homeTent;
  halo.frustumCulled = true;
  halo.userData.captainRef = group;
  group.userData.halo = halo;
  groups.markers.add(halo);
  groups.units.add(group);
  captains.push(group);
  return group;
}

function createAlly(x, z, ambush = false) {
  const group = makeCharacter({ robe: ambush ? materials.israelDeep : materials.israelBlue, sash: materials.bronze, scale: .88 + Math.random() * .12, spear: true, shield: true, faction: "israel" });
  group.position.set(x, groundY(x, z), z);
  group.rotation.y = Math.random() * TAU;
  group.userData = {
    ...group.userData,
    type: ambush ? "ambusher" : "ally",
    home: new THREE.Vector3(x, 0, z),
    state: ambush ? "hidden" : "idle",
    speed: 7.5 + Math.random() * 2,
    offset: new THREE.Vector3((Math.random() - .5) * 5, 0, (Math.random() - .5) * 5),
    bob: Math.random() * TAU,
    attackTimer: 0
  };
  if (ambush) group.visible = false;
  groups.units.add(group);
  if (ambush) ambushers.push(group);
  else allies.push(group);
  return group;
}

function createEnemy(x, z, state = "guard") {
  const group = makeCharacter({ robe: Math.random() > .45 ? materials.aiRed : materials.aiDark, sash: materials.darkBronze, scale: .87 + Math.random() * .12, spear: true, shield: true, headdress: Math.random() > .28, faction: "ai" });
  group.position.set(x, groundY(x, z), z);
  group.rotation.y = Math.random() * TAU;
  group.userData = {
    ...group.userData,
    type: "enemy",
    state,
    hp: 3,
    speed: 8.3 + Math.random() * 2.2,
    base: new THREE.Vector3(x, 0, z),
    target: new THREE.Vector3(x, 0, z),
    bob: Math.random() * TAU,
    hitFlash: 0,
    damageTimer: 0,
    lured: false,
    routed: false,
    defeated: false
  };
  groups.units.add(group);
  enemies.push(group);
  return group;
}

function createUnits() {
  const captainNames = ["שר האלף מן יהודה", "נושא הדגל", "שר המשמר"];
  for (let i = 0; i < 3; i++) {
    const tent = captainTents[i];
    if (!tent) continue;
    const d = tent.userData.tentDepth || 6.9 * (tent.userData.tentScale || 1);
    const inward = new THREE.Vector3(0, 0, -d * 0.38);
    inward.applyAxisAngle(new THREE.Vector3(0, 1, 0), tent.rotation.y);
    const wx = tent.position.x + inward.x;
    const wz = tent.position.z + inward.z;
    createCaptain(wx, wz, captainNames[i], tent);
  }

  const campCx = 0;
  const campCz = 50.4;
  const ringCount = 14;
  for (let i = 0; i < ringCount; i++) {
    const t = (i / ringCount) * TAU + 0.12;
    const rx = 20.5 + (i % 5) * 0.55;
    const rz = 14.8 + (i % 4) * 0.45;
    const ax = campCx + Math.cos(t) * rx;
    const az = campCz + Math.sin(t) * rz;
    createAlly(ax, az, false);
  }

  for (let i = 0; i < 14; i++) {
    createAlly(-56 + Math.random() * 20, -61 + Math.random() * 24, true);
  }

  for (let i = 0; i < 10; i++) {
    createEnemy(34 + Math.random() * 8, -51 + Math.random() * 14, "guard");
  }
  for (let i = 0; i < 12; i++) {
    createEnemy(12 + Math.random() * 17, -70 + Math.random() * 18, "city");
  }
}

function createMarker(name, x, z, radius = 3, color = palette.marker) {
  const group = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: .35,
    transparent: true,
    opacity: .65,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .065, 8, 56), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = .08;
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.12, .55, 4.8, 16, 1, true), new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: .5,
    transparent: true,
    opacity: .22,
    side: THREE.DoubleSide,
    depthWrite: false
  }));
  pillar.position.y = 2.35;
  group.add(ring, pillar);
  group.position.set(x, groundY(x, z) + .05, z);
  group.visible = false;
  group.userData = { ring, pillar, radius, name };
  groups.markers.add(group);
  markers[name] = group;
  return group;
}

function createMarkers() {
  createMarker("ridge", 17, -24, 6.2, 0xf2c66a);
  createMarker("valley", 3, 20, 8.6, 0x74c4af);
  createMarker("signal", 7, 10, 5.6, 0xe0b240);
  createMarker("victory", 20, -45, 5.2, 0xd4a338);
}

export function createSmokeColumn(x, z, amount = 18) {
  for (let i = 0; i < amount; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1.5 + Math.random() * 2.6, 8, 6), materials.smoke.clone());
    puff.material.opacity = 0;
    puff.position.set(x + (Math.random() - .5) * 8, groundY(x, z) + 4 + Math.random() * 5, z + (Math.random() - .5) * 8);
    puff.scale.set(1.2 + Math.random(), .65 + Math.random() * .45, 1 + Math.random());
    puff.userData = {
      baseOpacity: .18 + Math.random() * .2,
      rise: .45 + Math.random() * .45,
      drift: new THREE.Vector3((Math.random() - .5) * .08, 0, (Math.random() - .5) * .1),
      phase: Math.random() * TAU
    };
    puff.visible = false;
    groups.effects.add(puff);
    smokePuffs.push(puff);
  }
}

export function createDust(x, z, count = 5) {
  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd7b574,
      transparent: true,
      opacity: .38,
      roughness: 1,
      depthWrite: false
    });
    const puff = new THREE.Mesh(new THREE.SphereGeometry(.35 + Math.random() * .55, 6, 4), mat);
    puff.position.set(x + (Math.random() - .5) * 2.2, groundY(x, z) + .45, z + (Math.random() - .5) * 2.2);
    puff.scale.set(1.4, .45, 1.2);
    puff.userData = {
      life: .65 + Math.random() * .35,
      maxLife: 1,
      drift: new THREE.Vector3((Math.random() - .5) * 2, .4 + Math.random(), (Math.random() - .5) * 2)
    };
    groups.effects.add(puff);
    dustPuffs.push(puff);
  }
}

export function createHitSpark(position, color = 0xffdf7b) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, roughness: .4 });
  for (let i = 0; i < 7; i++) {
    const shard = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .75), mat);
    shard.position.copy(position);
    shard.rotation.set(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU);
    shard.userData = {
      velocity: new THREE.Vector3((Math.random() - .5) * 8, Math.random() * 5, (Math.random() - .5) * 8),
      life: .35 + Math.random() * .25
    };
    group.add(shard);
  }
  groups.effects.add(group);
  hitEffects.push(group);
  return group;
}

export const hitEffects = [];

export function buildWorld() {
  createTerrain();
  createCity();
  createCamp();
  createPlayer();
  createUnits();
  createMarkers();
  createSmokeColumn(18, -56, 14);
}
