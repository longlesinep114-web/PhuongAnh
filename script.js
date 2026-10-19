/**
 * ROMANTIC 20/10 INTERACTIVE EXPERIENCE FOR PHƯƠNG ANH
 * High performance, ultra smooth canvas animations, typing effect & Web Audio synthesis
 */

// --- CONFIG & STORY DATA ---
// --- CONFIG & STORY DATA (8 CÂU CẢM XÚC 20/10 TỪNG CÂU MỘT) ---
const STORY_CONFIG = {
  girlName: "Phương Anh",
  nickname: "Phanh",
  storyFlow: [
    {
      lines: ["Phanh àa..."],
      holdTime: 3800 // Câu gọi mở đầu nhẹ nhàng, lắng đọng
    },
    {
      lines: ["Hôm nay là ngày 20/10, ngày Phụ nữ Việt Nam."],
      holdTime: 4800 // Đủ thời gian đọc thong thả
    },
    {
      lines: ["Anh mong em luôn vui vẻ, bình an và được yêu thương thật nhiều."],
      holdTime: 5500 // Giữ 5.5 giây để cảm nhận trọn vẹn lời chúc
    },
    {
      lines: ["Mong rằng dù thời gian có trôi qua..."],
      holdTime: 4200 // Khoảng lắng nhẹ nhàng
    },
    {
      lines: ["Chúng ta vẫn luôn dành cho nhau sự quan tâm..."],
      holdTime: 4600 // Dịu dàng, chân thành
    },
    {
      lines: ["Kiên nhẫn và chân thành như những ngày đầu gặp gỡ."],
      holdTime: 5500 // Giữ 5.5 giây sâu sắc
    },
    {
      lines: ["Lời cuối, anh xin gửi tặng đến mẹ và chị của Phanh."],
      holdTime: 5000 // Tôn trọng, ấm áp
    },
    {
      lines: ["Cháu chúc bác và chị ngày 20/10 ngập tràn tình thương và niềm hạnh phúc."],
      holdTime: 6200 // Câu chúc gia đình trọn vẹn trước khi chuyển sang trái tim
    }
  ]
};

// --- DOM ELEMENTS ---
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const heartCanvas = document.getElementById('heart-canvas');
const heartCtx = heartCanvas.getContext('2d');

const introScreen = document.getElementById('intro-screen');
const storyScreen = document.getElementById('story-screen');
const climaxScreen = document.getElementById('climax-screen');

const startBtn = document.getElementById('start-btn');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

const narrativeTextEl = document.getElementById('narrative-text');

const proposalWrapper = document.getElementById('proposal-wrapper');
const finalLeadNameEl = document.getElementById('final-lead-name');
const finalProposalTextEl = document.getElementById('final-proposal-text');

// State variables
let currentSentenceIndex = 0;
let isTyping = false;
let audioStarted = false;
let isAudioMuted = false;
let webAudioSynthesizer = null;

// ===================================================
// CANVAS & RESIZE HANDLING (TỐI ƯU MƯỢT MÀ CHUẨN MÀN HÌNH DỌC)
// ===================================================
function getActiveDimensions() {
  return { w: window.innerWidth, h: window.innerHeight };
}

// Dynamic re-centering of climax heart
function updateClimaxCoords(w, h) {
  const centerX = w / 2;
  const centerY = h * 0.48;
  const minDim = Math.min(w, h);
  let heartScale = minDim / 38;

  heartOutlineParticles = [];
  const outlineSteps = 260;
  for (let i = 0; i < outlineSteps; i++) {
    const t = (i / outlineSteps) * Math.PI * 2 - Math.PI / 2;
    const pt = getHeartCoord(t, heartScale, centerX, centerY);
    heartOutlineParticles.push(pt);
  }

  if (flyingHearts && flyingHearts.length > 0) {
    for (let i = 0; i < flyingHearts.length; i++) {
      const angle = (i / flyingHearts.length) * Math.PI * 2;
      const r = Math.sqrt((i % 100) / 100) * 0.92;
      const newPt = getHeartCoord(angle, heartScale * r, centerX, centerY);
      flyingHearts[i].targetX = newPt.x;
      flyingHearts[i].targetY = newPt.y;
      if (flyingHearts[i].arrived) {
        flyingHearts[i].x = newPt.x;
        flyingHearts[i].y = newPt.y;
      }
    }
  }
}

function resizeCanvases() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;

  bgCanvas.width = w * dpr;
  bgCanvas.height = h * dpr;
  bgCtx.setTransform(1, 0, 0, 1, 0, 0);
  bgCtx.scale(dpr, dpr);

  heartCanvas.width = w * dpr;
  heartCanvas.height = h * dpr;
  heartCtx.setTransform(1, 0, 0, 1, 0, 0);
  heartCtx.scale(dpr, dpr);

  if (climaxStarted) {
    updateClimaxCoords(w, h);
  }
}

window.addEventListener('resize', resizeCanvases);

// ===================================================
// PROCEDURAL ROMANTIC WEB AUDIO SYNTHESIZER
// Creates a soothing, emotional, cinematic piano & music box melody
// Plays seamlessly if external audio fails or as companion melody
// ===================================================
class RomanticAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    // Pentatonic romantic notes in Hz (Eb major / C minor romantic progression)
    // C4, D4, Eb4, G4, Bb4, C5, D5, Eb5, G5, Bb5, C6
    this.scale = [261.63, 293.66, 311.13, 392.00, 466.16, 523.25, 587.33, 622.25, 783.99, 932.33, 1046.50];
    this.melody = [
      // Canon-like romantic motif
      { note: 2, dur: 0.6 }, { note: 4, dur: 0.6 }, { note: 5, dur: 1.2 },
      { note: 7, dur: 0.6 }, { note: 6, dur: 0.6 }, { note: 5, dur: 1.2 },
      { note: 4, dur: 0.6 }, { note: 3, dur: 0.6 }, { note: 2, dur: 1.4 },
      { note: 3, dur: 0.6 }, { note: 4, dur: 0.6 }, { note: 5, dur: 1.8 },
      { note: 7, dur: 0.6 }, { note: 8, dur: 0.8 }, { note: 7, dur: 0.6 },
      { note: 5, dur: 1.4 }, { note: 4, dur: 0.8 }, { note: 5, dur: 2.2 }
    ];
    this.step = 0;
  }

  init() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    } catch(e) {
      console.log('Web Audio not supported', e);
    }
  }

  playNote(freq, dur) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm bell / warm electric piano tone using triangle wave
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Envelope: soft attack, gentle decay
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08); // soft volume
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + dur + 0.9);
  }

  start() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.step = 0;
    this.scheduleNext();
  }

  scheduleNext() {
    if (!this.isPlaying) return;
    const item = this.melody[this.step % this.melody.length];
    const freq = this.scale[item.note % this.scale.length];
    this.playNote(freq, item.dur);

    // Also gentle soft bass pad every 4 notes
    if (this.step % 4 === 0) {
      this.playNote(freq / 2, item.dur * 1.8);
    }

    this.step++;
    const nextTime = (item.dur * 1000) * 0.95;
    this.timer = setTimeout(() => this.scheduleNext(), nextTime);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

// Audio management
function startAudioExperience() {
  audioStarted = true;
  musicToggle.classList.remove('hide');

  // Play user's mp3 audio file
  bgMusic.volume = 0.65;
  bgMusic.loop = true;
  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      // mp3 loaded & playing successfully!
      console.log('Background music playing successfully.');
    }).catch(error => {
      console.warn('MP3 play error or file missing, falling back to romantic procedural audio synthesizer:', error);
      // Fallback: Romantic Web Audio synthesizer
      if (!webAudioSynthesizer) {
        webAudioSynthesizer = new RomanticAudioSynthesizer();
      }
      webAudioSynthesizer.start();
    });
  }
}

musicToggle.addEventListener('click', () => {
  isAudioMuted = !isAudioMuted;
  const icon = musicToggle.querySelector('.music-icon');

  if (isAudioMuted) {
    bgMusic.pause();
    if (webAudioSynthesizer) webAudioSynthesizer.stop();
    icon.classList.remove('spinning');
    icon.textContent = '🔇';
  } else {
    if (bgMusic.src && !bgMusic.error) {
      bgMusic.play().catch(() => {
        if (webAudioSynthesizer) webAudioSynthesizer.start();
      });
    } else if (webAudioSynthesizer) {
      webAudioSynthesizer.start();
    }
    icon.classList.add('spinning');
    icon.textContent = '🎵';
  }
});

// ===================================================
// BACKGROUND AMBIENT CANVAS (PETALS, SPARKS, HEARTS)
// ===================================================
class Petal {
  constructor(w, h) {
    this.reset(w, h, true);
  }

  reset(w, h, randomY = false) {
    this.x = Math.random() * w;
    this.y = randomY ? Math.random() * h : -20;
    this.size = Math.random() * 9 + 6;
    this.speedY = Math.random() * 0.9 + 0.6;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.03;
    this.oscillation = Math.random() * 20;
    this.oscSpeed = Math.random() * 0.02 + 0.01;
    this.oscStep = Math.random() * Math.PI * 2;
    this.alpha = Math.random() * 0.45 + 0.45;
    // Cánh hoa anh đào tươi tắn và rực rỡ nổi bật trên nền đen
    this.color = Math.random() > 0.4 ? '#ff7597' : '#ffaec0';
  }

  update(w, h) {
    this.y += this.speedY;
    this.oscStep += this.oscSpeed;
    this.x += this.speedX + Math.sin(this.oscStep) * 0.6;
    this.angle += this.angleSpeed;

    if (this.y > h + 25 || this.x < -30 || this.x > w + 30) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.shadowColor = 'rgba(255, 117, 151, 0.4)';
    ctx.shadowBlur = 6;
    
    // Draw cherry blossom petal shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.3);
    ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

class Sparkle {
  constructor(w, h) {
    this.reset(w, h);
  }

  reset(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2.5 + 1;
    this.maxAlpha = Math.random() * 0.6 + 0.2;
    this.alpha = 0;
    this.speed = Math.random() * 0.03 + 0.015;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(w, h) {
    this.phase += this.speed;
    this.alpha = ((Math.sin(this.phase) + 1) / 2) * this.maxAlpha;
    if (this.phase > Math.PI * 2 * 10) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffe3ec';
    
    // Star sparkle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Background particle system init
const ambientPetals = [];
const ambientSparkles = [];
const NUM_PETALS = 32;
const NUM_SPARKLES = 45;

function initBgParticles() {
  const { w, h } = getActiveDimensions();
  for (let i = 0; i < NUM_PETALS; i++) ambientPetals.push(new Petal(w, h));
  for (let i = 0; i < NUM_SPARKLES; i++) ambientSparkles.push(new Sparkle(w, h));
}

function animateBg() {
  const { w, h } = getActiveDimensions();
  bgCtx.clearRect(0, 0, w, h);

  // Vẽ nền đen dạ khúc huyền ảo trực tiếp lên Canvas (đảm bảo 100% hiển thị nền đen)
  const bgGrad = bgCtx.createRadialGradient(w / 2, h * 0.35, 10, w / 2, h * 0.5, Math.max(w, h));
  bgGrad.addColorStop(0, '#1a0c16');  // Điểm sáng tím than huyền ảo rất nhẹ ở trung tâm
  bgGrad.addColorStop(0.5, '#0c050a'); // Đen than nhung
  bgGrad.addColorStop(1, '#020102');   // Đen tuyền sang trọng
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, w, h);

  for (let i = 0; i < ambientSparkles.length; i++) {
    ambientSparkles[i].update(w, h);
    ambientSparkles[i].draw(bgCtx);
  }

  for (let i = 0; i < ambientPetals.length; i++) {
    ambientPetals[i].update(w, h);
    ambientPetals[i].draw(bgCtx);
  }

  requestAnimationFrame(animateBg);
}

// ===================================================
// STAGE NAVIGATION & TYPING LOGIC
// ===================================================
startBtn.addEventListener('click', () => {
  startAudioExperience();

  // Transition from Intro to Story Screen
  introScreen.classList.remove('active');
  setTimeout(() => {
    introScreen.classList.add('hide');
    storyScreen.classList.add('active');
    startStorySequence();
  }, 700);
});

function startStorySequence() {
  currentSentenceIndex = 0;
  displayNextSentence();
}

/**
 * Hiển thị câu chuyện tình cảm liên tục (8 đoạn cảm xúc ngắn)
 * - Reveal theo cụm từ (35-45ms/ký tự)
 * - Giữ lại 2.5 - 4s tùy độ dài
 * - Fade out nhẹ nhàng trong 750ms
 * - Không có nút Next, nhạc và cánh hoa không dừng
 */
function displayNextSentence() {
  if (currentSentenceIndex >= STORY_CONFIG.storyFlow.length) {
    // Sau đoạn số 8: Giữ im lặng về mặt chữ 1.2 giây rồi chuyển sang animation trái tim cuối
    setTimeout(transitionToClimax, 1200);
    return;
  }

  const currentItem = STORY_CONFIG.storyFlow[currentSentenceIndex];
  narrativeTextEl.innerHTML = "";

  // Tạo các dòng của ý cảm xúc (cả câu nguyên vẹn)
  const lineEls = [];
  currentItem.lines.forEach((lineText) => {
    const lineEl = document.createElement("div");
    lineEl.className = "narrative-line";
    lineEl.textContent = lineText;
    narrativeTextEl.appendChild(lineEl);
    lineEls.push(lineEl);
  });

  // Xuất hiện cả câu nguyên vẹn từ mờ sương (blur) sang rõ dần (clear)
  // Nếu có nhiều dòng, dòng 2 xuất hiện nối tiếp mềm mại sau dòng 1 khoảng 350ms
  lineEls.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add("revealed");
    }, 150 + idx * 350);
  });

  // Sau khi xuất hiện hoàn chỉnh, giữ lại đúng thời gian cảm xúc (2.5 - 4s)
  const totalRevealTime = 150 + lineEls.length * 350;
  setTimeout(() => {
    // Tan biến từ từ (fade-out + blur lại)
    lineEls.forEach((el) => {
      el.classList.remove("revealed");
      el.classList.add("fade-out");
    });

    setTimeout(() => {
      currentSentenceIndex++;
      displayNextSentence();
    }, 850);
  }, totalRevealTime + currentItem.holdTime);
}

// ===================================================
// FINAL SCENE: VORTEX SUCTION & HEART FORMATION
// ===================================================
let climaxStarted = false;
let outlineProgress = 0; // Bước 1: 0 -> 1 vẽ outline trong 1.2s
let outlineDuration = 1200;
let outlineStartTime = 0;
let heartOutlineParticles = [];
let flyingHearts = [];
let fillProgress = 0;
let heartBeatPhase = 0;
const TOTAL_FILL_HEARTS = 360;
let proposalTriggered = false;

class SuctionMiniHeart {
  constructor(startX, startY, targetX, targetY, delay = 0) {
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = startX;
    this.y = startY;
    this.delay = delay;
    
    // Kích thước lấp lánh đa dạng (4px - 9px)
    this.size = Math.random() * 5.5 + 4;
    
    // Bảng màu tình yêu rực rỡ từ hồng phấn đến đỏ ngọc ruby
    const colors = ['#ff1744', '#ff2a5f', '#ff477e', '#f50057', '#ff5252', '#ff7597', '#ff8da1'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Độ xoáy uốn lượn khi bị lực hút kéo vào trung tâm
    this.swirlFactor = (Math.random() - 0.5) * 140;
    
    this.progress = 0;
    // Tốc độ hút gia tốc
    this.speed = Math.random() * 0.014 + 0.018;
    this.arrived = false;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.delay > 0) {
      this.delay--;
      return;
    }

    if (!this.arrived) {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.progress = 1;
        this.arrived = true;
      }

      // Gia tốc hút mạnh dần vào tâm (vortex acceleration)
      const p = this.progress;
      const easeP = p * p * (3 - 2 * p); // smooth step
      
      // Độ cong uốn lượn xoắn ốc khi bị lực hấp dẫn kéo vào
      const swirl = Math.sin(p * Math.PI) * this.swirlFactor * (1 - p);
      const dx = this.targetX - this.startX;
      const dy = this.targetY - this.startY;
      const dist = Math.hypot(dx, dy) || 1;
      const perpX = -dy / dist;
      const perpY = dx / dist;

      this.x = this.startX + dx * easeP + perpX * swirl;
      this.y = this.startY + dy * easeP + perpY * swirl;
    } else {
      // Khi đã hội tụ vào lòng trái tim lớn, rung rinh nhịp đập dịu dàng
      this.pulsePhase += 0.04;
      this.x = this.targetX + Math.sin(this.pulsePhase) * 1.2;
      this.y = this.targetY + Math.cos(this.pulsePhase) * 1.2;
    }
  }

  draw(ctx) {
    if (this.delay > 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.arrived ? 8 : 16;
    ctx.globalAlpha = this.arrived ? 0.78 : 0.95;

    const scaleMult = this.arrived ? (0.85 + Math.sin(this.pulsePhase) * 0.12) : 1;
    const s = (this.size / 10) * scaleMult;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5 * s, -5 * s, -10 * s, 2 * s, 0, 10 * s);
    ctx.bezierCurveTo(10 * s, 2 * s, 5 * s, -5 * s, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function getHeartCoord(t, scale, centerX, centerY) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return {
    x: centerX + x * scale,
    y: centerY + y * scale
  };
}

function transitionToClimax() {
  storyScreen.classList.remove('active');
  setTimeout(() => {
    storyScreen.classList.add('hide');
    climaxScreen.classList.add('active');
    initClimaxFinalScene();
  }, 800);
}

function initClimaxFinalScene() {
  climaxStarted = true;
  proposalTriggered = false;
  fillProgress = 0;
  flyingHearts = [];

  const { w, h } = getActiveDimensions();
  const centerX = w / 2;
  const centerY = h * 0.48;

  const minDim = Math.min(w, h);
  let heartScale = minDim / 38;
  if (w > h) { // landscape
    heartScale = h / 34;
  }

  // 1. Tạo tập hợp điểm outline trái tim lớn
  heartOutlineParticles = [];
  const outlineSteps = 260;
  for (let i = 0; i < outlineSteps; i++) {
    const t = (i / outlineSteps) * Math.PI * 2 - Math.PI / 2;
    const pt = getHeartCoord(t, heartScale, centerX, centerY);
    heartOutlineParticles.push(pt);
  }

  // 2. Tạo tọa độ đích lấp đầy bên trong trái tim lớn
  const innerTargets = [];
  while (innerTargets.length < TOTAL_FILL_HEARTS) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.92;
    const basePt = getHeartCoord(angle, heartScale * r, centerX, centerY);
    innerTargets.push({
      x: basePt.x + (Math.random() - 0.5) * 8,
      y: basePt.y + (Math.random() - 0.5) * 8
    });
  }

  // BƯỚC 1: Vẽ đường viền outline phát sáng
  outlineStartTime = performance.now();
  requestAnimationFrame(animateClimax);

  // BƯỚC 2: HÚT HÀNG TRĂM TRÁI TIM NHỎ TỪ BỐN PHƯƠNG TÁM HƯỚNG MÀN HÌNH VÀO TÂM ĐỂ HÌNH THÀNH TRÁI TIM TO
  const maxDim = Math.max(w, h);
  for (let i = 0; i < TOTAL_FILL_HEARTS; i++) {
    // Vị trí xuất phát: Xung quanh toàn bộ viền và các góc màn hình
    const spawnAngle = Math.random() * Math.PI * 2;
    const spawnDist = maxDim * (0.55 + Math.random() * 0.55);
    const startX = centerX + Math.cos(spawnAngle) * spawnDist;
    const startY = centerY + Math.sin(spawnAngle) * spawnDist;

    // Các đợt sóng hút nối tiếp nhau trong ~2.5 giây tạo cảm giác bão tình yêu hội tụ
    const delay = Math.floor(Math.random() * 110);

    const mini = new SuctionMiniHeart(startX, startY, innerTargets[i].x, innerTargets[i].y, delay);
    flyingHearts.push(mini);
  }
}

/**
 * BƯỚC 4: Hiển thị câu "Làm người yêu anh nhé ❤️" chính giữa trái tim đỏ
 * Trái tim đỏ làm nền, chữ trắng phát sáng nổi bật nhất toàn bộ website
 */
function revealStep4Proposal() {
  const mainLine = document.querySelector('.prop-main-line');
  const heartIcon = document.querySelector('.prop-heart-icon');
  const actionsEl = document.getElementById('proposal-actions');

  if (mainLine) mainLine.classList.add('revealed');
  setTimeout(() => {
    if (heartIcon) heartIcon.classList.add('revealed');
  }, 800);

  // Sau khi câu chữ xuất hiện trọn vẹn, 2 nút "Em đồng ý" & "Dạ vâng ạ" hiện lên thật ngọt ngào
  setTimeout(() => {
    if (actionsEl) actionsEl.classList.add('show');
  }, 1600);
}

// Bắt sự kiện khi Phương Anh chạm vào "Em đồng ý" hoặc "Dạ vâng ạ"
function celebrateLove() {
  const actionsEl = document.getElementById('proposal-actions');
  const acceptedMessage = document.getElementById('accepted-message');
  if (actionsEl) actionsEl.classList.add('hide');
  if (acceptedMessage) acceptedMessage.classList.remove('hide');

  // Bùng nổ thêm hàng loạt trái tim lấp lánh hạnh phúc từ tâm tỏa ra
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 300 + 50;
    const burstHeart = new SuctionMiniHeart(
      w / 2, 
      h * 0.48, 
      w / 2 + Math.cos(angle) * dist,
      h * 0.48 + Math.sin(angle) * dist,
      0
    );
    burstHeart.speed = 0.035;
    flyingHearts.push(burstHeart);
  }
}

// Gắn sự kiện click cho 2 nút
document.addEventListener('DOMContentLoaded', () => {
  const btnAgree = document.getElementById('btn-agree');
  const btnShy = document.getElementById('btn-shy');
  if (btnAgree) btnAgree.addEventListener('click', celebrateLove);
  if (btnShy) btnShy.addEventListener('click', celebrateLove);
});

function animateClimax(now) {
  if (!climaxStarted) return;
  const { w, h } = getActiveDimensions();
  heartCtx.clearRect(0, 0, w, h);

  // Tính tiến trình vẽ outline (1.2s)
  if (outlineProgress < 1) {
    const elapsed = now - outlineStartTime;
    outlineProgress = Math.min(1, elapsed / outlineDuration);
  }

  // Cập nhật và vẽ các trái tim nhỏ bị hút vào trung tâm
  let arrivedCount = 0;
  for (let i = 0; i < flyingHearts.length; i++) {
    flyingHearts[i].update();
    flyingHearts[i].draw(heartCtx);
    if (flyingHearts[i].arrived) arrivedCount++;
  }

  // Tỷ lệ lấp đầy của trái tim lớn hình thành theo số lượng hạt đã tụ về
  const targetFill = flyingHearts.length > 0 ? (arrivedCount / flyingHearts.length) : 0;
  fillProgress += (targetFill - fillProgress) * 0.08;

  // Heartbeat nhẹ nhàng cho trái tim to
  heartBeatPhase += 0.025;
  const beatScale = 1 + Math.sin(heartBeatPhase) * 0.015;

  // Lớp nền đỏ nhung của trái tim lớn hình thành dần và bừng sáng
  if (heartOutlineParticles.length > 0 && fillProgress > 0.04) {
    heartCtx.save();
    heartCtx.beginPath();
    heartCtx.moveTo(heartOutlineParticles[0].x, heartOutlineParticles[0].y);
    for (let i = 1; i < heartOutlineParticles.length; i++) {
      heartCtx.lineTo(heartOutlineParticles[i].x, heartOutlineParticles[i].y);
    }
    heartCtx.closePath();

    const centerY = h * 0.48;
    const heartGrad = heartCtx.createRadialGradient(w / 2, centerY - 15, 20, w / 2, centerY, Math.min(w, h) * 0.45);
    heartGrad.addColorStop(0, '#ff1a53');
    heartGrad.addColorStop(0.65, '#e60039');
    heartGrad.addColorStop(1, '#a60026');

    heartCtx.globalAlpha = Math.min(0.96, fillProgress * 1.15);
    heartCtx.fillStyle = heartGrad;
    heartCtx.shadowColor = 'rgba(230, 0, 57, 0.75)';
    heartCtx.shadowBlur = 35;
    heartCtx.fill();
    heartCtx.restore();
  }

  // Vẽ outline trái tim màu trắng phát sáng
  heartCtx.save();
  heartCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  heartCtx.lineWidth = 4;
  heartCtx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  heartCtx.shadowBlur = 20;

  heartCtx.beginPath();
  const currentDrawCount = Math.floor(heartOutlineParticles.length * outlineProgress);
  if (currentDrawCount > 0) {
    heartCtx.moveTo(heartOutlineParticles[0].x, heartOutlineParticles[0].y);
    for (let i = 1; i < currentDrawCount; i++) {
      heartCtx.lineTo(heartOutlineParticles[i].x, heartOutlineParticles[i].y);
    }
    if (outlineProgress >= 1) heartCtx.closePath();
    heartCtx.stroke();
  }
  heartCtx.restore();

  // BƯỚC 3 & 4: Khi trái tim to đã hút đủ và thành hình trọn vẹn (>= 75%), hiện chữ tỏ tình
  if (fillProgress >= 0.75 && !proposalTriggered) {
    proposalTriggered = true;
    if (finalLeadNameEl) finalLeadNameEl.classList.add('show');
    setTimeout(revealStep4Proposal, 1000);
  }

  requestAnimationFrame(animateClimax);
}

// ===================================================
// INITIALIZATION
// ===================================================
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvases();
  initBgParticles();
  animateBg();
});
