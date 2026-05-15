import * as THREE from "three";
import {
  buildWorld,
  scene,
  camera,
  renderer,
  materials,
  groups,
  player,
  captains,
  allies,
  enemies,
  ambushers,
  smokePuffs,
  dustPuffs,
  markers,
  cityFlames,
  captainTents,
  hitEffects,
  groundY,
  inCampClearZone,
  tentPadBaseY,
  createDust,
  createHitSpark,
  clamp,
  lerp,
  TAU,
  WORLD_HALF,
  CAPTAIN_INTERACT_RANGE,
  palette,
  MAX_PIXEL_RATIO
} from "./world.js";
import { SOUND_DATA } from "./sounds.js"; // audio Base64 lives in sounds.js — not for AI context

const app = document.getElementById("app");
const startOverlay = document.getElementById("startOverlay");
const startGameButton = document.getElementById("startGame");
const startStoryButton = document.getElementById("startStory");
const continueStoryButton = document.getElementById("continueStory");
const hideStoryButton = document.getElementById("hideStory");
const storyCard = document.getElementById("storyCard");
const storyTitle = document.getElementById("storyTitle");
const storySceneCanvas = document.getElementById("storySceneCanvas");
const storyCaptionEl = document.getElementById("storyCaption");
const storyBodySr = document.getElementById("storyBodySr");
const storyCinematic = document.getElementById("storyCinematic");
const storyKicker = document.getElementById("storyKicker");
const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");
const missionSeal = document.getElementById("missionSeal");
const missionText = document.getElementById("missionText");
const healthBar = document.getElementById("healthBar");
const healthValue = document.getElementById("healthValue");
const moraleBar = document.getElementById("moraleBar");
const moraleValue = document.getElementById("moraleValue");
const progressBar = document.getElementById("progressBar");
const progressValue = document.getElementById("progressValue");
const chapterStrip = document.getElementById("chapterStrip");
const toastEl = document.getElementById("toast");
const damageFlash = document.getElementById("damageFlash");
const fadeCurtain = document.getElementById("fadeCurtain");
const gameOver = document.getElementById("gameOver");
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverText = document.getElementById("gameOverText");
const restartGameButton = document.getElementById("restartGame");
const miniMap = document.getElementById("miniMap");
const titleCanvas = document.getElementById("titleCanvas");
const miniCtx = miniMap.getContext("2d");
const titleCtx = titleCanvas.getContext("2d");

const storyBeats = [
  {
    kicker: "פתיחה | אחרי הכישלון הראשון",
    title: "שיבה אל העי",
    body: "לאחר הכאב והבירור במחנה, יהושע מקבל הוראה לשוב אל העי. הפעם הקרב אינו מסתער ישר אל החומה: הוא נבנה סביב מארב, תזמון ואות ברור בכידון.",
    cinemaLines: [
      "אחרי הכישלון — חוזרים אל העי, לא באותה צעדה.",
      "הפעם: מארב, תזמון, ואות ברור בכידון.",
      "המחנה מתארגן סביב שלושת שרי המחנה."
    ],
    phaseTitle: "מחנה ישראל מול העי",
    phaseText: "שלושה אוהלי מפקדים בשורה, מוקפים בחיל. בכל אוהל ממתין שר — פתח (F), התקרב ולחץ רווח לצירוף.",
    mission: "פתח כל אוהל מפקד (F), התקרב לשלושת השרים ולחץ רווח כדי לצרף אותם.",
    seal: "א"
  },
  {
    kicker: "שלב א׳ | המארב מתארגן",
    title: "לוחמים בין הסלעים",
    body: "כוח נבחר נע בחשאי אל מאחורי העיר. יהושע נשאר גלוי מול העי, כדי שאנשי העיר יחשבו שישראל שוב נסוגים כמו בפעם הראשונה.",
    cinemaLines: [
      "כוח נבחר מתגלגל מאחורי חומות העיר.",
      "יהושע נשאר גלוי — כמו נסיגה מהפעם הראשונה.",
      "בעיני העי זה נראה כמו חזרה על אותה טעות."
    ],
    phaseTitle: "אל הרכס שמול העיר",
    phaseText: "המארב כבר מסתתר מאחורי העי. על יהושע להופיע מול השער, בלי להיכנס לעיר מוקדם מדי.",
    mission: "עלה אל הסמן שעל הרכס, מול שער העי.",
    seal: "ב"
  },
  {
    kicker: "שלב ב׳ | הפיתוי",
    title: "נסיגה מחושבת",
    body: "אנשי העי יוצאים מן העיר ורודפים אחרי יהושע והעם. זה נראה כמו נסיגה, אבל זו מלכודת: צריך למשוך אותם רחוק מספיק מן החומה.",
    cinemaLines: [
      "שערי העי נפתחים — מרדף אחרי ישראל.",
      "זה נראה כמו נסיגה; בפועל זו מלכודת.",
      "צריך למשוך אותם רחוק מהחומה."
    ],
    phaseTitle: "משוך את אנשי העי",
    phaseText: "האויב רודף. שמור מרחק, השתמש בריצה קצרה, והובל אותם אל הבקעה שסומנה.",
    mission: "משוך לפחות שמונה לוחמי העי אל הבקעה הדרומית.",
    seal: "ג"
  },
  {
    kicker: "שלב ג׳ | אות הכידון",
    title: "הכידון מורם",
    body: "יהושע נוטה את הכידון אשר בידו אל העיר. זהו האות לכוח המסתתר: לצאת מן המארב, לרוץ אל העי ולהעלות בה עשן.",
    cinemaLines: [
      "הכידון נטוי אל העיר — רגע שקט לפני הסערה.",
      "זה האות לכוח המסתתר: לצאת מהמארב.",
      "ברגע הנכון — ריצה אל העי ועשן מעל הגגות."
    ],
    phaseTitle: "אות למארב",
    phaseText: "העיר כמעט ריקה. עכשיו צריך לתת סימן חד וברור ללוחמים שמסתתרים מאחור.",
    mission: "עמוד בסמן הזהב ולחץ E כדי להרים את הכידון.",
    seal: "ד"
  },
  {
    kicker: "שלב ד׳ | העיר עולה בעשן",
    title: "המרדף מתהפך",
    body: "כשאנשי העי רואים את העשן מן העיר, ליבם נחלש. ישראל פונה אליהם מן הבקעה, והמארב יוצא מאחור. הקרב מוכרע בתנועה משני כיוונים.",
    cinemaLines: [
      "עשן מעל העיר — הלב נשבר לרודפים.",
      "ישראל פונה מהבקעה; המארב יוצא מאחור.",
      "הקרב נסגר משני כיוונים בבת אחת."
    ],
    phaseTitle: "היפוך הקרב",
    phaseText: "העשן עולה מן העי. כעת יהושע וחיילי ישראל פונים בחזרה ומכניעים את הרודפים.",
    mission: "הגן על המחנה והכנע את לוחמי העי שנותרו.",
    seal: "ה"
  },
  {
    kicker: "סיום | זיכרון על ההר",
    title: "הקרב הושלם",
    body: "העי נכבשה במארב ובמשמעת. יהושע אינו רק לוחם בחזית: הוא מנהיג שמקשיב, מתכנן, מסמן בזמן הנכון ומוביל את העם עד הסוף.",
    cinemaLines: [
      "העי נכבשה במארב ובמשמעת.",
      "מנהיגות: להקשיב, לתכנן, לסמן בזמן.",
      "השדה נשאר חי — רגע לנשום לפני ההמשך."
    ],
    phaseTitle: "ניצחון ישראל",
    phaseText: "הקרב הסתיים. אפשר להסתובב בשדה ולראות את העיר, המחנה והמארב.",
    mission: "ניצחון. לחץ R כדי לאפס מצלמה או התחל מחדש מהמסך הסופי.",
    seal: "ו"
  }
];

const game = {
  started: false,
  phase: 0,
  storyOpen: false,
  visualTime: 0,
  storyCaptionIdx: 0,
  storyCaptionTimer: 0,
  health: 100,
  morale: 92,
  progress: 0,
  captainsCollected: 0,
  luredCount: 0,
  enemiesDefeated: 0,
  signalGiven: false,
  battleWon: false,
  isGameOver: false,
  attackCooldown: 0,
  interactCooldown: 0,
  tentInteractCooldown: 0,
  sprintEnergy: 100,
  markerPulse: 0,
  time: 0,
  toastTimer: 0,
  mouseActive: false,
  dragLook: false,
  lastPointerX: 0,
  lastPointerY: 0,
  cameraYaw: 0,
  cameraPitch: 0,
  targetCameraYaw: 0,
  targetCameraPitch: 0
};

const keys = new Set();
const touchKeys = new Map();
const tmpVec = new THREE.Vector3();
const tmpVec2 = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpEuler = new THREE.Euler();


function initWorld() {
  buildWorld();
  setupChapters();
  drawTitleArt();
  setPhase(0, true);
  updateHud(true);
  drawMiniMap(true);
}

    function setupChapters() {
      chapterStrip.innerHTML = "";
      storyBeats.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "chapterDot";
        dot.textContent = String(i + 1);
        chapterStrip.appendChild(dot);
      });
    }

    function setPhase(phase, showStory = true) {
      game.phase = clamp(phase, 0, storyBeats.length - 1);
      const beat = storyBeats[game.phase];
      phaseTitle.textContent = beat.phaseTitle;
      phaseText.textContent = beat.phaseText;
      missionText.textContent = beat.mission;
      missionSeal.textContent = beat.seal;
      updateMarkerVisibility();
      updateChapterDots();
      game.progress = (game.phase / (storyBeats.length - 1)) * 100;
      if (showStory) showStoryBeat(game.phase);
      markHudDirty();
      updateHud(true);
    }

    function updateMarkerVisibility() {
      Object.values(markers).forEach(marker => marker.visible = false);
      if (game.phase === 1) markers.ridge.visible = true;
      if (game.phase === 2) markers.valley.visible = true;
      if (game.phase === 3) markers.signal.visible = true;
      if (game.phase >= 5) markers.victory.visible = true;
    }

    function updateChapterDots() {
      const dots = [...chapterStrip.children];
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === game.phase);
        dot.classList.toggle("done", i < game.phase);
      });
    }

    function layoutStoryCanvas() {
      if (!storySceneCanvas || !storyCinematic) return;
      const rect = storyCinematic.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.max(2, Math.floor(rect.width * dpr));
      const ph = Math.max(2, Math.floor(rect.height * dpr));
      if (storySceneCanvas.width !== pw || storySceneCanvas.height !== ph) {
        storySceneCanvas.width = pw;
        storySceneCanvas.height = ph;
      }
    }

    function paintStoryScene(rawDt) {
      if (!storySceneCanvas || !storyCinematic || !game.storyOpen) return;
      const ctx = storySceneCanvas.getContext("2d");
      const rect = storyCinematic.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;
      if (cssW < 4 || cssH < 4) return;

      const beat = storyBeats[game.phase];
      const lines = beat.cinemaLines || [beat.title];
      game.storyCaptionTimer += rawDt;
      if (game.storyCaptionTimer > 4.6) {
        game.storyCaptionTimer = 0;
        game.storyCaptionIdx = (game.storyCaptionIdx + 1) % lines.length;
        storyCaptionEl.textContent = lines[game.storyCaptionIdx];
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.max(2, Math.floor(cssW * dpr));
      const ph = Math.max(2, Math.floor(cssH * dpr));
      if (storySceneCanvas.width !== pw || storySceneCanvas.height !== ph) {
        storySceneCanvas.width = pw;
        storySceneCanvas.height = ph;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = game.visualTime;
      const pha = game.phase;
      const cx = cssW * 0.5;
      const cy = cssH * 0.5;
      const kb = 1 + Math.sin(t * 0.38) * 0.018;

      ctx.save();
      ctx.translate(cx, cy * 0.92);
      ctx.scale(kb, kb);
      ctx.translate(-cx, -cy * 0.92);

      let skyTop; let skyBot; let sandTop; let sandBot;
      if (pha <= 0) {
        skyTop = "#2a5f8f"; skyBot = "#d9a066"; sandTop = "#c9a574"; sandBot = "#7a5c38";
      } else if (pha === 1) {
        skyTop = "#1e4a72"; skyBot = "#8cb4d4"; sandTop = "#b89a6a"; sandBot = "#5c4630";
      } else if (pha === 2) {
        skyTop = "#4a3a2c"; skyBot = "#a07850"; sandTop = "#9a7a52"; sandBot = "#4a3826";
      } else if (pha === 3) {
        skyTop = "#1a2040"; skyBot = "#e89848"; sandTop = "#8a6e48"; sandBot = "#3a2818";
      } else if (pha === 4) {
        skyTop = "#3a1510"; skyBot = "#cc5520"; sandTop = "#6a4030"; sandBot = "#1a0a08";
      } else {
        skyTop = "#3d5280"; skyBot = "#f0c890"; sandTop = "#b8a078"; sandBot = "#6a5840";
      }

      const gSky = ctx.createLinearGradient(0, 0, 0, cssH * 0.62);
      gSky.addColorStop(0, skyTop);
      gSky.addColorStop(1, skyBot);
      ctx.fillStyle = gSky;
      ctx.fillRect(-cssW, -cssH, cssW * 3, cssH * 2);

      const gSand = ctx.createLinearGradient(0, cssH * 0.48, 0, cssH * 1.4);
      gSand.addColorStop(0, sandTop);
      gSand.addColorStop(1, sandBot);
      ctx.fillStyle = gSand;
      ctx.fillRect(-cssW, cssH * 0.48, cssW * 3, cssH);

      ctx.fillStyle = "rgba(0,0,0,.12)";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const ox = Math.sin(t * 0.22 + i * 1.7) * 22;
        ctx.moveTo(-40 + ox + i * 60, cssH * 0.5);
        ctx.bezierCurveTo(
          80 + ox + i * 55, cssH * 0.42,
          160 + ox + i * 50, cssH * 0.55,
          cssW + 120 + ox + i * 45, cssH * 0.5
        );
        ctx.lineTo(cssW + 200, cssH * 0.62);
        ctx.lineTo(-cssW, cssH * 0.62);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = "rgba(20,12,8,.55)";
      if (pha === 0) {
        for (let i = 0; i < 3; i++) {
          const x = cssW * 0.28 + i * cssW * 0.18;
          const tw = 28 + i * 4;
          ctx.beginPath();
          ctx.moveTo(x, cssH * 0.72);
          ctx.lineTo(x - tw * 0.5, cssH * 0.52);
          ctx.lineTo(x + tw * 0.5, cssH * 0.52);
          ctx.closePath();
          ctx.fill();
        }
      }

      if (pha >= 1) {
        const cityX = cssW * 0.72 + Math.sin(t * 0.15) * 10;
        ctx.fillRect(cityX - 38, cssH * 0.52, 76, cssH * 0.22);
        ctx.fillRect(cityX - 52, cssH * 0.46, 104, cssH * 0.08);
      }

      if (pha === 2) {
        ctx.fillStyle = "rgba(160,120,80,.25)";
        for (let k = 0; k < 6; k++) {
          const px = ((t * 40 + k * 70) % (cssW + 80)) - 40;
          ctx.beginPath();
          ctx.ellipse(px, cssH * 0.65, 36, 12, 0, 0, TAU);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(30,20,14,.6)";
        ctx.beginPath();
        ctx.arc(cssW * 0.35 + Math.sin(t * 1.2) * 30, cssH * 0.68, 5, 0, TAU);
        ctx.arc(cssW * 0.42 + Math.sin(t * 1.2 + 0.5) * 30, cssH * 0.7, 4, 0, TAU);
        ctx.fill();
      }

      if (pha === 3) {
        ctx.strokeStyle = "rgba(255,210,120,.9)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cssW * 0.35, cssH * 0.85);
        ctx.lineTo(cssW * 0.62, cssH * 0.38);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,220,140,.35)";
        ctx.beginPath();
        ctx.arc(cssW * 0.62, cssH * 0.36, 22 + Math.sin(t * 3) * 4, 0, TAU);
        ctx.fill();
      }

      if (pha === 4) {
        ctx.fillStyle = "rgba(255,90,30,.18)";
        for (let s = 0; s < 8; s++) {
          const sy = cssH * 0.3 - (t * 22 + s * 35) % (cssH * 0.5);
          const sx = cssW * 0.55 + Math.sin(s + t) * 40;
          ctx.beginPath();
          ctx.arc(sx, sy, 16 + s * 2, 0, TAU);
          ctx.fill();
        }
      }

      if (pha >= 5) {
        ctx.fillStyle = "rgba(255,255,255,.1)";
        ctx.fillRect(0, cssH * 0.35, cssW, cssH * 0.15);
      }

      ctx.restore();

      const grd = ctx.createRadialGradient(cx, cy, cssW * 0.12, cx, cy, cssW * 0.88);
      grd.addColorStop(0, "rgba(0,0,0,0)");
      grd.addColorStop(1, "rgba(0,0,0,.32)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.fillStyle = "rgba(255,255,255,.035)";
      for (let n = 0; n < 36; n++) {
        const rx = (Math.sin(n * 12.3 + t) * 0.5 + 0.5) * cssW;
        const ry = (Math.cos(n * 9.1 + t * 0.7) * 0.5 + 0.5) * cssH;
        ctx.fillRect(rx, ry, 1.2, 1.2);
      }
    }

    function showStoryBeat(index) {
      const beat = storyBeats[index];
      storyKicker.textContent = beat.kicker;
      storyTitle.textContent = beat.title;
      storyBodySr.textContent = beat.body;
      const lines = beat.cinemaLines || [beat.title];
      game.storyCaptionIdx = 0;
      game.storyCaptionTimer = 0;
      storyCaptionEl.textContent = lines[0];
      storyCard.classList.add("show");
      fadeCurtain.classList.add("show");
      game.storyOpen = true;
      requestAnimationFrame(() => layoutStoryCanvas());
    }

    function hideStory() {
      storyCard.classList.remove("show");
      fadeCurtain.classList.remove("show");
      game.storyOpen = false;
      if (document.pointerLockElement !== renderer.domElement && game.started) {
        tryPointerLock();
      }
    }

    function showToast(message, ms = 2300) {
      toastEl.textContent = message;
      toastEl.classList.add("show");
      game.toastTimer = ms / 1000;
    }

    function tryPointerLock() {
      if (document.pointerLockElement === renderer.domElement || !renderer.domElement.requestPointerLock) return;
      try {
        const lockRequest = renderer.domElement.requestPointerLock();
        if (lockRequest && typeof lockRequest.catch === "function") lockRequest.catch(() => {});
      } catch {
        game.mouseActive = false;
      }
    }

    let hudDirty = true;
    let lastHudUpdate = 0;

    function markHudDirty() {
      hudDirty = true;
    }

    function updateHud(force = false) {
      const now = performance.now();
      if (!force && !hudDirty && now - lastHudUpdate < 120) return;
      lastHudUpdate = now;
      hudDirty = false;

      const healthScale = clamp(game.health / 100, 0, 1);
      healthBar.style.transform = `scaleX(${healthScale})`;
      healthValue.textContent = Math.max(0, Math.round(game.health));
      document.body.classList.toggle("lowHealth", game.health < 28 && game.started && !game.isGameOver);

      const moraleScale = clamp(game.morale / 100, 0, 1);
      moraleBar.style.transform = `scaleX(${moraleScale})`;
      moraleValue.textContent = game.morale > 70 ? "גבוה" : game.morale > 40 ? "מתוח" : "נמוך";

      const progress = clamp(game.progress, 0, 100);
      progressBar.style.transform = `scaleX(${progress / 100})`;
      progressValue.textContent = `${Math.round(progress)}%`;
    }

    function beginGame(showPrologue = false) {
      if (game.started) return;
      game.started = true;
      document.body.classList.add("gameRunning");
      if (player.group) {
        player.group.visible = false;
        player.group.traverse(obj => {
          if (obj.isMesh) {
            obj.visible = false;
          }
        });
      }
      startOverlay.style.display = "none";
      game.targetCameraYaw = player.yaw;
      game.cameraYaw = player.yaw;
      game.targetCameraPitch = -.12;
      game.cameraPitch = -.12;
      tryPointerLock();
      if (showPrologue) showStoryBeat(0);
      else hideStory();
      showToast("פתח כל אוהל מפקד (F), התקרב לשרים ולחץ רווח.");
    }

    function resetGame() {
      location.reload();
    }

    function distance2D(a, b) {
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      return Math.sqrt(dx * dx + dz * dz);
    }

    function moveToward(group, target, speed, dt, stopDistance = .2) {
      const pos = group.position;
      tmpVec.set(target.x - pos.x, 0, target.z - pos.z);
      const dist = tmpVec.length();
      if (dist > stopDistance) {
        tmpVec.normalize();
        pos.x += tmpVec.x * speed * dt;
        pos.z += tmpVec.z * speed * dt;
        pos.y = groundY(pos.x, pos.z);
        group.rotation.y = lerpAngle(group.rotation.y, Math.atan2(tmpVec.x, tmpVec.z), 1 - Math.exp(-dt * 9));
        return true;
      }
      return false;
    }

    function animateCharacterParts(group, dt, speedAmount = 0, attackAmount = 0) {
      if (!group || !group.userData) return;
      const data = group.userData;
      const moving = clamp(speedAmount / 10.5, 0, 1);
      data.walkPhase = (data.walkPhase || 0) + dt * (2.2 + moving * 9.8);
      const step = Math.sin(data.walkPhase);
      const counter = Math.cos(data.walkPhase);
      const softStep = Math.sin(data.walkPhase * 2);
      const attack = clamp(attackAmount, 0, 1);

      if (data.legL && data.legR) {
        data.legL.rotation.x = step * .54 * moving;
        data.legR.rotation.x = -step * .54 * moving;
        data.legL.rotation.z = -.035 - Math.abs(counter) * .025 * moving;
        data.legR.rotation.z = .035 + Math.abs(counter) * .025 * moving;
        const footL = data.legL.children[2];
        const footR = data.legR.children[2];
        if (footL) footL.rotation.x = .08 - Math.max(0, -step) * .28 * moving;
        if (footR) footR.rotation.x = .08 - Math.max(0, step) * .28 * moving;
      }

      if (data.armL && data.armR) {
        data.armL.rotation.x = -step * .34 * moving;
        data.armR.rotation.x = step * .34 * moving - attack * .75;
        data.armL.rotation.z = .32 + counter * .045 * moving;
        data.armR.rotation.z = -.32 - counter * .045 * moving - attack * .16;
      }

      if (data.body) {
        data.body.rotation.x = counter * .025 * moving;
        data.body.rotation.z = -step * .018 * moving;
      }

      if (data.robeSkirt) {
        data.robeSkirt.rotation.x = -counter * .035 * moving;
        data.robeSkirt.rotation.z = step * .018 * moving;
        data.robeSkirt.scale.y = 1 + Math.abs(softStep) * .025 * moving;
      }

      if (data.head) {
        data.head.rotation.x = -.02 + Math.abs(counter) * .018 * moving;
        data.head.rotation.y = step * .035 * moving;
      }

      if (data.shield) {
        data.shield.rotation.y = -step * .08 * moving;
        data.shield.rotation.x = attack * .18;
      }

      if (data.spear && group !== player.group) {
        data.spear.rotation.z = -.12 - attack * .5 + step * .045 * moving;
        data.spear.rotation.x = .04 + counter * .035 * moving;
      }
    }

    function updatePlayer(dt) {
      if (!game.started || game.storyOpen || game.isGameOver) return;

      let inputX = 0;
      let inputZ = 0;
      if (keys.has("KeyW") || keys.has("ArrowUp")) inputZ += 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) inputZ -= 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) inputX -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) inputX += 1;

      const moving = inputX !== 0 || inputZ !== 0;
      const yaw = game.cameraYaw;
      const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = new THREE.Vector3();
      move.addScaledVector(forward, inputZ);
      move.addScaledVector(right, inputX);
      if (move.lengthSq() > 0) move.normalize();

      const sprinting = keys.has("ShiftLeft") || keys.has("ShiftRight");
      let speed = player.speed;
      if (sprinting && game.sprintEnergy > 5 && moving) {
        speed *= 1.55;
        game.sprintEnergy = Math.max(0, game.sprintEnergy - dt * 28);
      } else {
        game.sprintEnergy = Math.min(100, game.sprintEnergy + dt * 18);
      }

      const desiredVelocity = move.multiplyScalar(speed);
      player.velocity.lerp(desiredVelocity, 1 - Math.exp(-dt * (moving ? 12 : 8)));
      if (!moving && player.velocity.lengthSq() < .018) player.velocity.set(0, 0, 0);
      player.position.addScaledVector(player.velocity, dt);
      player.position.x = clamp(player.position.x, -WORLD_HALF, WORLD_HALF);
      player.position.z = clamp(player.position.z, -WORLD_HALF, WORLD_HALF);
      player.position.y = groundY(player.position.x, player.position.z);

      if (player.velocity.lengthSq() > .08) {
        player.targetYaw = Math.atan2(player.velocity.x, player.velocity.z);
        player.bob += dt * player.velocity.length() * 1.2;
        if (Math.sin(player.bob * 2) > .92 && Math.random() < .3) createDust(player.position.x, player.position.z, 1);
      }

      player.yaw = lerpAngle(player.yaw, player.targetYaw, 1 - Math.exp(-dt * 10));
      player.group.position.copy(player.position);
      player.group.rotation.y = player.yaw;
      player.group.position.y += Math.abs(Math.sin(player.bob)) * .08;
      animateCharacterParts(player.group, dt, player.velocity.length(), player.attackSwing);
      if (player.cursor) {
        player.cursor.position.set(player.position.x, groundY(player.position.x, player.position.z) + .08, player.position.z);
        player.cursor.rotation.y = player.yaw;
        player.cursor.scale.setScalar(1 + Math.sin(game.time * 5.2) * .04);
        player.cursor.visible = false;
      }

      player.attackSwing = Math.max(0, player.attackSwing - dt * 5.5);
      player.spearRaised = lerp(player.spearRaised, game.signalGiven ? 1 : 0, 1 - Math.exp(-dt * 4));
      if (player.spear) {
        const attackTilt = Math.sin(player.attackSwing * Math.PI) * 1.1;
        player.spear.rotation.z = lerp(-.12, -1.42, player.spearRaised) - attackTilt;
        player.spear.rotation.x = Math.sin(game.time * 3) * .025;
      }

      if (player.mantle) {
        player.mantle.rotation.z = Math.sin(game.time * 3 + player.bob) * .025;
      }

      game.attackCooldown = Math.max(0, game.attackCooldown - dt);
      game.interactCooldown = Math.max(0, game.interactCooldown - dt);
      game.tentInteractCooldown = Math.max(0, game.tentInteractCooldown - dt);
    }

    function updateCampTents(dt) {
      for (const tent of captainTents) {
        const tp = tent.userData.tentParts;
        if (!tp) continue;
        const target = tent.userData.doorTargetOpen ? 1 : 0;
        tent.userData.doorAnim = lerp(tent.userData.doorAnim ?? 0, target, 1 - Math.exp(-dt * 9));
        const a = tent.userData.doorAnim;
        const cap = tent.userData.captain;
        if (cap && !cap.userData.collected && a > 0.48) {
          cap.visible = true;
          cap.userData.hiddenInTent = false;
        }
        tp.flapL.rotation.z = tp.flapLZ0 + a * -.62;
        tp.flapR.rotation.z = tp.flapRZ0 + a * .62;
        tp.flapL.position.z = tp.flapLZp0 + a * .42;
        tp.flapR.position.z = tp.flapRZp0 + a * .42;
        if (tp.doorShadow.material) tp.doorShadow.material.opacity = .28 + a * .38;
      }
    }

    function handleTentToggle() {
      if (!game.started || game.storyOpen || game.isGameOver) return;
      if (game.tentInteractCooldown > 0) return;
      game.tentInteractCooldown = .4;
      let best = null;
      let bestD = 99;
      for (const tent of captainTents) {
        const d = distance2D(player.position, tent.position);
        if (d < bestD) {
          bestD = d;
          best = tent;
        }
      }
      if (!best || bestD > 5.8) {
        showToast("התקרב לפתח אוהל ולחץ F כדי לפתוח או לסגור.");
        return;
      }
      best.userData.doorTargetOpen = !best.userData.doorTargetOpen;
      showToast(best.userData.doorTargetOpen ? "האוהל נפתח — הנה השר." : "סגרת את האוהל.");
    }

    function lerpAngle(a, b, t) {
      const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
      return a + diff * t;
    }

    function handleAction() {
      if (!game.started || game.storyOpen || game.isGameOver) return;
      if (game.interactCooldown > 0) return;
      game.interactCooldown = .28;

      if (game.phase === 0) {
        let collectedOne = false;
        let blockedByTent = false;
        for (const captain of captains) {
          const range = captain.userData.interactRange || CAPTAIN_INTERACT_RANGE;
          const d = distance2D(player.position, captain.position);
          if (!captain.userData.collected && captain.userData.hiddenInTent && d < range) {
            blockedByTent = true;
            continue;
          }
          if (!captain.userData.collected && d < range) {
            captain.userData.collected = true;
            captain.userData.hiddenInTent = false;
            game.captainsCollected++;
            collectedOne = true;
            if (captain.userData.halo) captain.userData.halo.visible = false;
            captain.traverse(obj => {
              if (obj.isMesh && obj.material && obj.material.emissive) obj.material.emissiveIntensity = .2;
            });
            createHitSpark(captain.position.clone().add(new THREE.Vector3(0, 2.2, 0)), 0x7ee0c7);
            showToast(`${captain.userData.name} מצטרף אליך (${game.captainsCollected}/3).`);
          }
        }
        if (!collectedOne) {
          if (blockedByTent) showToast("פתח קודם את אוהל המפקד (F) כדי שהשר יצא.");
          else showToast("התקרב לשר אחרי שפתחת את האוהל, ולחץ רווח.");
        }
        if (game.captainsCollected >= 3) {
          game.morale = Math.min(100, game.morale + 4);
          markHudDirty();
          setPhase(1, true);
          showToast("הכוח מוכן. עלה אל הרכס מול שער העי.");
        }
        return;
      }

      attackNearestEnemy();
    }

    function handleSignal() {
      if (!game.started || game.storyOpen || game.isGameOver) return;
      if (game.phase !== 3) {
        if (game.phase < 3) showToast("עוד מוקדם לאות הכידון. קודם צריך למשוך את אנשי העי.");
        return;
      }
      const marker = markers.signal;
      if (distance2D(player.position, marker.position) > marker.userData.radius + 3.6) {
        showToast("עמוד בתוך הסמן הזהוב כדי לתת אות ברור.");
        return;
      }
      if (game.signalGiven) return;
      game.signalGiven = true;
      player.spearRaised = 1;
      showToast("הכידון מורם. המארב יוצא אל העיר.");
      revealAmbush();
      igniteCity();
      setTimeout(() => {
        setPhase(4, true);
      }, 900);
    }

    function attackNearestEnemy() {
      if (game.attackCooldown > 0) return;
      game.attackCooldown = .62;
      player.attackSwing = 1;

      const camFx = Math.sin(game.cameraYaw);
      const camFz = Math.cos(game.cameraYaw);
      const coneCos = Math.cos(52 * Math.PI / 180);

      let inCone = null;
      let inConeDist = Infinity;
      let fallback = null;
      let fallbackDist = Infinity;

      for (const enemy of enemies) {
        if (enemy.userData.defeated || !enemy.visible) continue;
        const dx = enemy.position.x - player.position.x;
        const dz = enemy.position.z - player.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < fallbackDist) {
          fallbackDist = dist;
          fallback = enemy;
        }
        if (dist > 0.08 && dist <= 9.4) {
          const dot = (dx / dist) * camFx + (dz / dist) * camFz;
          if (dot >= coneCos && dist < inConeDist) {
            inConeDist = dist;
            inCone = enemy;
          }
        }
      }

      const nearest = inCone || (fallbackDist <= 7.4 ? fallback : null);
      const nearestDist = inCone ? inConeDist : (fallbackDist <= 7.4 ? fallbackDist : Infinity);

      if (nearest && nearestDist < (inCone ? 9.6 : 7.45)) {
        nearest.userData.hp -= 1;
        nearest.userData.hitFlash = .22;
        nearest.userData.routed = true;
        const dir = new THREE.Vector3().subVectors(nearest.position, player.position).setY(0).normalize();
        nearest.position.addScaledVector(dir, 1.1);
        createHitSpark(nearest.position.clone().add(new THREE.Vector3(0, 1.8, 0)), 0xffd66c);
        if (nearest.userData.hp <= 0) defeatEnemy(nearest);
      } else {
        showToast("אין אויב מספיק קרוב להנפה.");
      }
    }

    function defeatEnemy(enemy) {
      enemy.userData.defeated = true;
      enemy.userData.state = "defeated";
      enemy.visible = false;
      game.enemiesDefeated++;
      game.morale = Math.min(100, game.morale + 1);
      markHudDirty();
      createDust(enemy.position.x, enemy.position.z, 6);
      if (game.phase >= 4) {
        const remaining = enemies.filter(e => !e.userData.defeated && e.visible && e.userData.state !== "city").length;
        showToast(`אויב הוכנע. נותרו ${Math.max(0, remaining)} בשדה.`);
      }
    }

    function revealAmbush() {
      for (const soldier of ambushers) {
        soldier.visible = true;
        soldier.userData.state = "rushCity";
        createDust(soldier.position.x, soldier.position.z, 2);
      }
      markers.signal.visible = false;
    }

    function igniteCity() {
      for (const flame of cityFlames) {
        flame.visible = true;
      }
      for (const puff of smokePuffs) {
        puff.visible = true;
      }
      for (const enemy of enemies) {
        if (!enemy.userData.defeated) {
          enemy.userData.routed = true;
          if (enemy.userData.state === "guard" || enemy.userData.state === "chase") enemy.userData.state = "routed";
        }
      }
      game.morale = 96;
    }

    function updateCaptains(dt) {
      for (const captain of captains) {
        const tent = captain.userData.homeTent;
        const hidden = captain.userData.hiddenInTent && tent && !captain.userData.collected;
        if (hidden) {
          const d = tent.userData.tentDepth || 6.9;
          const inward = new THREE.Vector3(0, 0, -d * 0.38);
          inward.applyAxisAngle(new THREE.Vector3(0, 1, 0), tent.rotation.y);
          captain.position.x = tent.position.x + inward.x;
          captain.position.z = tent.position.z + inward.z;
          captain.position.y = tent.position.y + 0.09;
          captain.rotation.y = tent.rotation.y + Math.PI;
          captain.visible = false;
        } else {
          captain.position.y = groundY(captain.position.x, captain.position.z) + Math.sin(game.time * 2.1 + captain.position.x) * .035;
        }
        if (captain.userData.halo) {
          const halo = captain.userData.halo;
          const revealed = !captain.userData.hiddenInTent;
          const showRing = !captain.userData.collected && game.phase === 0 && revealed;
          halo.visible = showRing;
          if (showRing) {
            const cx = captain.position.x;
            const cz = captain.position.z;
            halo.position.set(cx, groundY(cx, cz) + .07, cz);
            halo.rotation.set(Math.PI / 2, 0, captain.userData.haloSpin || 0);
            const near = distance2D(player.position, captain.position) < (captain.userData.interactRange || CAPTAIN_INTERACT_RANGE);
            halo.material.opacity = near ? .42 : .2;
            captain.userData.haloSpin = (captain.userData.haloSpin || 0) + dt * (near ? 1.35 : .42);
          }
        }
        if (captain.userData.collected && game.phase >= 1) {
          const index = captains.indexOf(captain);
          const angle = player.yaw + Math.PI + (index - 1) * .56;
          const target = new THREE.Vector3(
            player.position.x + Math.sin(angle) * (6 + index),
            0,
            player.position.z + Math.cos(angle) * (6 + index)
          );
          target.x = clamp(target.x, -WORLD_HALF, WORLD_HALF);
          target.z = clamp(target.z, -WORLD_HALF, WORLD_HALF);
          moveToward(captain, target, 8.2, dt, 1.7);
        }
        const last = captain.userData.lastPosition;
        const moved = last ? distance2D(captain.position, last) / Math.max(dt, .001) : 0;
        captain.userData.visualSpeed = lerp(captain.userData.visualSpeed || 0, moved, 1 - Math.exp(-dt * 8));
        captain.userData.lastPosition = captain.position.clone();
        animateCharacterParts(captain, dt, captain.userData.visualSpeed || 0, 0);
      }
    }

    function updateAllies(dt) {
      for (let i = 0; i < allies.length; i++) {
        const ally = allies[i];
        ally.userData.bob += dt * 7;
        if (game.phase >= 1 && game.phase < 4) {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const target = new THREE.Vector3(
            player.position.x - 6 + col * 3.0,
            0,
            player.position.z + 7 + row * 2.7
          );
          moveToward(ally, target, ally.userData.speed, dt, 2.4);
        } else if (game.phase >= 4) {
          const enemy = nearestEnemyTo(ally.position, 18);
          if (enemy) {
            moveToward(ally, enemy.position, ally.userData.speed * 1.15, dt, 2.1);
            ally.userData.attackTimer -= dt;
            if (distance2D(ally.position, enemy.position) < 2.6 && ally.userData.attackTimer <= 0) {
              ally.userData.attackTimer = .9 + Math.random() * .4;
              enemy.userData.hp -= 1;
              enemy.userData.hitFlash = .2;
              createHitSpark(enemy.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xf4d184);
              if (enemy.userData.hp <= 0) defeatEnemy(enemy);
            }
          }
        }
        animateUnit(ally, dt, ally.userData.bob);
      }

      for (const soldier of ambushers) {
        if (!soldier.visible) continue;
        soldier.userData.bob += dt * 9;
        if (soldier.userData.state === "rushCity") {
          const target = new THREE.Vector3(12 + Math.random() * 13, 0, -58 + Math.random() * 14);
          if (!soldier.userData.cityTarget || distance2D(soldier.position, soldier.userData.cityTarget) < 2) {
            soldier.userData.cityTarget = target;
          }
          moveToward(soldier, soldier.userData.cityTarget, soldier.userData.speed * 1.35, dt, 1.1);
          if (distance2D(soldier.position, new THREE.Vector3(18, 0, -56)) < 18) {
            soldier.userData.state = "holdCity";
          }
        } else if (soldier.userData.state === "holdCity") {
          const enemy = nearestEnemyTo(soldier.position, 16);
          if (enemy) moveToward(soldier, enemy.position, soldier.userData.speed, dt, 2.3);
        }
        animateUnit(soldier, dt, soldier.userData.bob);
      }
    }

    function nearestEnemyTo(position, range = Infinity) {
      let nearest = null;
      let dist = range;
      for (const enemy of enemies) {
        if (enemy.userData.defeated || !enemy.visible) continue;
        if (enemy.userData.state === "city" && game.phase < 4) continue;
        const d = distance2D(position, enemy.position);
        if (d < dist) {
          dist = d;
          nearest = enemy;
        }
      }
      return nearest;
    }

    function updateEnemies(dt) {
      for (const enemy of enemies) {
        if (enemy.userData.defeated || !enemy.visible) continue;
        enemy.userData.bob += dt * 8.5;
        enemy.userData.hitFlash = Math.max(0, enemy.userData.hitFlash - dt);
        enemy.userData.damageTimer = Math.max(0, enemy.userData.damageTimer - dt);

        if (enemy.userData.state === "guard" || enemy.userData.state === "city") {
          const dToPlayer = distance2D(enemy.position, player.position);
          if ((game.phase >= 2 && dToPlayer < 37) || (game.phase >= 4 && dToPlayer < 55)) {
            enemy.userData.state = game.phase >= 4 ? "routed" : "chase";
          } else {
            const home = enemy.userData.base;
            const patrol = new THREE.Vector3(
              home.x + Math.sin(game.time * .55 + enemy.userData.bob) * 2.6,
              0,
              home.z + Math.cos(game.time * .48 + enemy.userData.bob) * 2.6
            );
            moveToward(enemy, patrol, enemy.userData.speed * .28, dt, .6);
          }
        }

        if (enemy.userData.state === "chase") {
          moveToward(enemy, player.position, enemy.userData.speed, dt, 2.1);
          const d = distance2D(enemy.position, player.position);
          if (d < 2.7 && enemy.userData.damageTimer <= 0) {
            enemy.userData.damageTimer = 1.0;
            damagePlayer(7 + Math.random() * 4);
          }
          if (!enemy.userData.lured && enemy.position.z > 11) {
            enemy.userData.lured = true;
            game.luredCount++;
            game.progress = 38 + game.luredCount * 4;
            showToast(`אחד מאנשי העי נמשך אל הבקעה (${game.luredCount}/8).`, 1200);
          }
        }

        if (enemy.userData.state === "routed") {
          const target = game.phase >= 4
            ? player.position
            : new THREE.Vector3(6, 0, 18);
          moveToward(enemy, target, enemy.userData.speed * .88, dt, 2.5);
          const d = distance2D(enemy.position, player.position);
          if (d < 2.7 && enemy.userData.damageTimer <= 0 && game.phase >= 4) {
            enemy.userData.damageTimer = 1.1;
            damagePlayer(5 + Math.random() * 3);
          }
        }

        animateUnit(enemy, dt, enemy.userData.bob);
      }
    }

    function animateUnit(group, dt, bob) {
      const data = group.userData;
      group.position.y = groundY(group.position.x, group.position.z) + Math.abs(Math.sin(bob)) * .035;
      const last = data.lastPosition;
      const moved = last ? distance2D(group.position, last) / Math.max(dt, .001) : 0;
      data.visualSpeed = lerp(data.visualSpeed || 0, moved, 1 - Math.exp(-dt * 8));
      data.lastPosition = group.position.clone();
      animateCharacterParts(group, dt, data.visualSpeed || 0, data.hitFlash > 0 ? 1 : 0);
      if (data.hitFlash > 0) {
        const base = data.baseScale || 1;
        group.scale.setScalar(base * (1 + Math.sin(game.time * 45) * .035));
      } else {
        const base = data.baseScale || 1;
        tmpVec.set(base, base, base);
        group.scale.lerp(tmpVec, dt * 8);
      }
    }

    function damagePlayer(amount) {
      if (game.isGameOver || game.phase >= 5) return;
      game.health = Math.max(0, game.health - amount);
      game.morale = Math.max(0, game.morale - amount * .18);
      damageFlash.classList.add("show");
      setTimeout(() => damageFlash.classList.remove("show"), 120);
      markHudDirty();
      updateHud(true);
      if (game.health <= 0) {
        endGame(false);
      }
    }

    function endGame(victory) {
      game.isGameOver = true;
      document.body.classList.remove("gameRunning");
      document.exitPointerLock?.();
      gameOver.classList.add("show");
      if (victory) {
        gameOverTitle.textContent = "העי נכבשה";
        gameOverText.textContent = "המארב הצליח, העיר עלתה בעשן והמרדף התהפך. יהושע הוביל את הקרב עד הסיום.";
      } else {
        gameOverTitle.textContent = "הקרב נעצר";
        gameOverText.textContent = "יהושע נפגע יותר מדי. נסה שוב: שמור מרחק בזמן הפיתוי והשתמש בריצה קצרה.";
      }
    }

    function updatePhaseLogic() {
      if (!game.started || game.storyOpen || game.isGameOver) return;
      if (game.phase === 1) {
        const marker = markers.ridge;
        if (distance2D(player.position, marker.position) < marker.userData.radius) {
          setPhase(2, true);
          for (const enemy of enemies) {
            if (enemy.userData.state === "guard") enemy.userData.state = "chase";
          }
          showToast("אנשי העי יצאו מן השער. הובל אותם אל הבקעה.");
        }
      }

      if (game.phase === 2) {
        const marker = markers.valley;
        const insideValley = distance2D(player.position, marker.position) < marker.userData.radius + 6.5;
        if (game.luredCount >= 8 && insideValley) {
          setPhase(3, true);
          showToast("הם רחוקים מן העיר. עכשיו הגיע הזמן לאות הכידון.");
        }
      }

      if (game.phase === 4) {
        const activeFieldEnemies = enemies.filter(e => !e.userData.defeated && e.visible && (e.userData.state === "chase" || e.userData.state === "routed" || distance2D(e.position, player.position) < 55));
        game.progress = 72 + clamp((game.enemiesDefeated / 16) * 26, 0, 26);
        if (activeFieldEnemies.length <= 2 || game.enemiesDefeated >= 16) {
          game.battleWon = true;
          setPhase(5, true);
          game.health = Math.min(100, game.health + 18);
          game.morale = 100;
          game.progress = 100;
          markHudDirty();
          updateHud(true);
          setTimeout(() => endGame(true), 1800);
        }
      }
    }

    function updateMarkers(dt) {
      game.markerPulse += dt;
      for (const marker of Object.values(markers)) {
        const pulse = 1 + Math.sin(game.markerPulse * 3.2) * .06;
        marker.scale.set(pulse, 1, pulse);
        const ring = marker.userData.ring;
        const pillar = marker.userData.pillar;
        ring.rotation.z += dt * .55;
        pillar.material.opacity = .18 + Math.sin(game.markerPulse * 2.4) * .04;
        marker.position.y = groundY(marker.position.x, marker.position.z) + .07;
      }
    }

    function updateEffects(dt) {
      let smokeActive = false;
      for (let i = smokePuffs.length - 1; i >= 0; i--) {
        const puff = smokePuffs[i];
        if (!puff.visible) continue;
        smokeActive = true;
        puff.userData.phase += dt;
        puff.position.y += puff.userData.rise * dt;
        puff.position.addScaledVector(puff.userData.drift, dt * 4);
        puff.material.opacity = puff.userData.baseOpacity + Math.sin(puff.userData.phase) * .04;
        puff.rotation.y += dt * .12;
        if (puff.position.y > 31) {
          puff.position.y = groundY(18, -56) + 5 + Math.random() * 4;
          puff.position.x = 18 + (Math.random() - .5) * 8;
          puff.position.z = -56 + (Math.random() - .5) * 8;
        }
      }

      if (cityFlames.length) {
        for (const flame of cityFlames) {
          if (!flame.visible) continue;
          const s = 1 + Math.sin(game.visualTime * 12 + flame.position.x) * .13;
          flame.userData.outer.scale.set(s, 1 + Math.sin(game.visualTime * 9 + flame.position.z) * .1, s);
          flame.userData.inner.scale.set(1 / s, 1 + Math.cos(game.visualTime * 11) * .08, 1 / s);
        }
      }

      if (!smokeActive && dustPuffs.length === 0 && hitEffects.length === 0) return;

      for (let i = dustPuffs.length - 1; i >= 0; i--) {
        const puff = dustPuffs[i];
        puff.userData.life -= dt;
        puff.position.addScaledVector(puff.userData.drift, dt);
        puff.scale.multiplyScalar(1 + dt * 1.7);
        puff.material.opacity = Math.max(0, puff.userData.life / puff.userData.maxLife) * .35;
        if (puff.userData.life <= 0) {
          groups.effects.remove(puff);
          puff.geometry.dispose();
          puff.material.dispose();
          dustPuffs.splice(i, 1);
        }
      }

      for (let i = hitEffects.length - 1; i >= 0; i--) {
        const group = hitEffects[i];
        let alive = false;
        for (const shard of group.children) {
          shard.userData.life -= dt;
          if (shard.userData.life > 0) alive = true;
          shard.position.addScaledVector(shard.userData.velocity, dt);
          shard.userData.velocity.y -= 9.8 * dt;
          shard.scale.setScalar(Math.max(.05, shard.userData.life * 2));
        }
        if (!alive) {
          groups.effects.remove(group);
          hitEffects.splice(i, 1);
        }
      }
    }

    function updateCamera(dt) {
      game.cameraYaw = lerpAngle(game.cameraYaw, game.targetCameraYaw, 1 - Math.exp(-dt * 14));
      game.cameraPitch = lerp(game.cameraPitch, game.targetCameraPitch, 1 - Math.exp(-dt * 14));

      const eyeHeight = 2.38;
      const headBob = player.velocity.lengthSq() > .08 ? Math.sin(player.bob * 2) * .04 : 0;
      const yBase = groundY(player.position.x, player.position.z) + eyeHeight + headBob;
      const desired = new THREE.Vector3(player.position.x, yBase, player.position.z);
      camera.position.lerp(desired, 1 - Math.exp(-dt * 20));

      const lookDir = new THREE.Vector3(
        Math.sin(game.cameraYaw) * Math.cos(game.cameraPitch),
        Math.sin(game.cameraPitch),
        Math.cos(game.cameraYaw) * Math.cos(game.cameraPitch)
      );
      tmpVec2.copy(camera.position).addScaledVector(lookDir, 10);
      camera.lookAt(tmpVec2);
    }

    let miniMapCooldown = 0;
    let lastMiniX = Infinity;
    let lastMiniZ = Infinity;

    function drawMiniMap(force = false, dt = 0.016) {
      miniMapCooldown -= dt;
      const moved =
        Math.abs(player.position.x - lastMiniX) > 0.45 ||
        Math.abs(player.position.z - lastMiniZ) > 0.45;
      if (!force && !moved && miniMapCooldown > 0) return;
      miniMapCooldown = 0.12;
      lastMiniX = player.position.x;
      lastMiniZ = player.position.z;

      const w = miniMap.width;
      const h = miniMap.height;
      miniCtx.clearRect(0, 0, w, h);
      const grd = miniCtx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "#d6b06c");
      grd.addColorStop(1, "#9d7242");
      miniCtx.fillStyle = grd;
      miniCtx.fillRect(0, 0, w, h);

      function mapX(x) { return ((x + WORLD_HALF) / (WORLD_HALF * 2)) * w; }
      function mapY(z) { return ((z + WORLD_HALF) / (WORLD_HALF * 2)) * h; }

      miniCtx.strokeStyle = "rgba(74,45,23,.35)";
      miniCtx.lineWidth = 5;
      miniCtx.beginPath();
      const road = [[0,68],[4,42],[1,18],[11,-8],[21,-33],[23,-58]];
      road.forEach(([x,z], i) => {
        if (i === 0) miniCtx.moveTo(mapX(x), mapY(z));
        else miniCtx.lineTo(mapX(x), mapY(z));
      });
      miniCtx.stroke();

      miniCtx.fillStyle = "#6b5943";
      miniCtx.fillRect(mapX(1), mapY(-70), 120, 70);
      miniCtx.strokeStyle = "#392719";
      miniCtx.lineWidth = 3;
      miniCtx.strokeRect(mapX(1), mapY(-70), 120, 70);

      miniCtx.fillStyle = "#2d6c69";
      miniCtx.fillRect(mapX(-30), mapY(48), 100, 34);

      miniCtx.fillStyle = "#17413f";
      for (const ally of allies) drawDot(ally.position.x, ally.position.z, 3);
      miniCtx.fillStyle = "#265b59";
      for (const amb of ambushers) if (amb.visible || game.phase >= 3) drawDot(amb.position.x, amb.position.z, 3);
      miniCtx.fillStyle = "#9c4435";
      for (const enemy of enemies) if (!enemy.userData.defeated && enemy.visible) drawDot(enemy.position.x, enemy.position.z, 3.4);
      miniCtx.fillStyle = "#ffe18b";
      drawDot(player.position.x, player.position.z, 7);

      miniCtx.strokeStyle = "#fff1c0";
      miniCtx.lineWidth = 2;
      miniCtx.beginPath();
      miniCtx.arc(mapX(player.position.x), mapY(player.position.z), 11, 0, TAU);
      miniCtx.stroke();

      function drawDot(x, z, r) {
        miniCtx.beginPath();
        miniCtx.arc(mapX(x), mapY(z), r, 0, TAU);
        miniCtx.fill();
      }
    }

    function drawTitleArt() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = titleCanvas.getBoundingClientRect();
      titleCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      titleCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      titleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      titleCtx.clearRect(0, 0, w, h);
      const sky = titleCtx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#e9b968");
      sky.addColorStop(.42, "#d0924e");
      sky.addColorStop(1, "#6e4327");
      titleCtx.fillStyle = sky;
      titleCtx.fillRect(0, 0, w, h);

      titleCtx.fillStyle = "rgba(255,226,141,.85)";
      titleCtx.beginPath();
      titleCtx.arc(w * .72, h * .22, Math.max(40, w * .12), 0, TAU);
      titleCtx.fill();

      titleCtx.fillStyle = "#8a623a";
      titleCtx.beginPath();
      titleCtx.moveTo(0, h * .68);
      for (let x = 0; x <= w; x += 34) {
        titleCtx.lineTo(x, h * .58 + Math.sin(x * .028) * 18);
      }
      titleCtx.lineTo(w, h);
      titleCtx.lineTo(0, h);
      titleCtx.fill();

      titleCtx.fillStyle = "#4f3520";
      const cityX = w * .57;
      const cityY = h * .5;
      titleCtx.fillRect(cityX, cityY, w * .32, h * .2);
      titleCtx.fillRect(cityX + w * .02, cityY - h * .1, w * .08, h * .3);
      titleCtx.fillRect(cityX + w * .24, cityY - h * .12, w * .08, h * .32);
      titleCtx.fillRect(cityX + w * .12, cityY - h * .05, w * .08, h * .25);

      titleCtx.fillStyle = "rgba(73,64,57,.55)";
      for (let i = 0; i < 7; i++) {
        titleCtx.beginPath();
        titleCtx.ellipse(cityX + w * (.08 + i * .03), cityY - h * (.08 + i * .02), w * (.03 + i * .01), h * (.08 + i * .025), -.35, 0, TAU);
        titleCtx.fill();
      }

      titleCtx.strokeStyle = "#f5dfad";
      titleCtx.lineWidth = 5;
      titleCtx.lineCap = "round";
      const jx = w * .3;
      const jy = h * .62;
      titleCtx.beginPath();
      titleCtx.moveTo(jx, jy);
      titleCtx.lineTo(jx, jy - h * .32);
      titleCtx.stroke();
      titleCtx.fillStyle = "#f5dfad";
      titleCtx.beginPath();
      titleCtx.moveTo(jx, jy - h * .38);
      titleCtx.lineTo(jx - 10, jy - h * .3);
      titleCtx.lineTo(jx + 10, jy - h * .3);
      titleCtx.closePath();
      titleCtx.fill();
      titleCtx.fillStyle = "#245b5c";
      titleCtx.fillRect(jx - 18, jy - h * .18, 36, h * .2);
      titleCtx.fillStyle = "#c9934a";
      titleCtx.beginPath();
      titleCtx.arc(jx, jy - h * .23, 15, 0, TAU);
      titleCtx.fill();

      titleCtx.strokeStyle = "rgba(255,238,190,.5)";
      titleCtx.lineWidth = 2;
      for (let i = 0; i < 18; i++) {
        const x = w * .13 + i * 12;
        titleCtx.beginPath();
        titleCtx.moveTo(x, h * .77);
        titleCtx.lineTo(x + 8, h * .66 + Math.sin(i) * 9);
        titleCtx.stroke();
      }
    }

    let lastTime = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const rawDt = Math.min(.05, (now - lastTime) / 1000);
      lastTime = now;
      game.visualTime += rawDt;
      const logicDt = game.storyOpen ? 0 : rawDt;
      game.time += logicDt;

      if (game.toastTimer > 0) {
        game.toastTimer -= logicDt;
        if (game.toastTimer <= 0) toastEl.classList.remove("show");
      }

      updatePlayer(logicDt);
      updateCampTents(logicDt);
      updateCaptains(logicDt);
      updateAllies(logicDt);
      updateEnemies(logicDt);
      updatePhaseLogic();
      updateMarkers(logicDt);
      const effectsDt = game.storyOpen ? rawDt * 0.55 : rawDt;
      updateEffects(effectsDt);
      updateCamera(logicDt);
      if (game.storyOpen) paintStoryScene(rawDt);
      updateHud();
      drawMiniMap(false, rawDt);
      renderer.render(scene, camera);
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(MAX_PIXEL_RATIO);
      renderer.setSize(window.innerWidth, window.innerHeight);
      drawTitleArt();
      if (game.storyOpen) layoutStoryCanvas();
    }

    function onKeyDown(event) {
      if (event.repeat && event.code !== "Space") return;
      if (event.code === "Enter" && game.storyOpen) {
        hideStory();
        return;
      }
      if (event.code === "Escape" && game.storyOpen) {
        hideStory();
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        handleAction();
      }
      if (event.code === "KeyE") {
        handleSignal();
      }
      if (event.code === "KeyF") {
        event.preventDefault();
        handleTentToggle();
      }
      if (event.code === "KeyR") {
        game.targetCameraYaw = player.yaw;
        game.targetCameraPitch = -.12;
        showToast("מבט אופס לכיוון ההליכה.", 1200);
      }
      keys.add(event.code);
    }

    function onKeyUp(event) {
      keys.delete(event.code);
    }

    function onMouseMove(event) {
      if (document.pointerLockElement === renderer.domElement) {
        game.targetCameraYaw -= event.movementX * .0032;
        game.targetCameraPitch = clamp(game.targetCameraPitch - event.movementY * .0023, -.68, .26);
      }
    }

    function onPointerDown(event) {
      if (!game.started || game.storyOpen || game.isGameOver) return;
      game.dragLook = true;
      game.lastPointerX = event.clientX;
      game.lastPointerY = event.clientY;
      tryPointerLock();
    }

    function onPointerMove(event) {
      if (!game.dragLook || document.pointerLockElement === renderer.domElement) return;
      const dx = event.clientX - game.lastPointerX;
      const dy = event.clientY - game.lastPointerY;
      game.lastPointerX = event.clientX;
      game.lastPointerY = event.clientY;
      game.targetCameraYaw -= dx * .004;
      game.targetCameraPitch = clamp(game.targetCameraPitch - dy * .003, -.68, .26);
    }

    function onPointerUp() {
      game.dragLook = false;
    }

    function bindTouchControls() {
      document.querySelectorAll(".touchBtn").forEach(button => {
        const code = button.dataset.key;
        const press = event => {
          event.preventDefault();
          keys.add(code);
          touchKeys.set(code, true);
          if (code === "Space") handleAction();
          if (code === "KeyE") handleSignal();
        };
        const release = event => {
          event.preventDefault();
          keys.delete(code);
          touchKeys.delete(code);
        };
        button.addEventListener("pointerdown", press);
        button.addEventListener("pointerup", release);
        button.addEventListener("pointerleave", release);
        button.addEventListener("pointercancel", release);
      });
    }

    startGameButton.addEventListener("click", () => beginGame(false));
    startStoryButton.addEventListener("click", () => beginGame(true));
    continueStoryButton.addEventListener("click", hideStory);
    hideStoryButton.addEventListener("click", hideStory);
    restartGameButton.addEventListener("click", resetGame);
    renderer.domElement.addEventListener("click", () => {
      if (game.started && !game.storyOpen && !game.isGameOver) tryPointerLock();
    });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

initWorld();
bindTouchControls();
requestAnimationFrame(animate);

