/**
 * ROMANTIC 20/10 INTERACTIVE EXPERIENCE FOR PHƯƠNG ANH
 * High performance, ultra smooth canvas animations, typing effect & Web Audio synthesis
 */

// --- CONFIG & STORY DATA ---
// --- CONFIG & STORY DATA (8 Ý CẢM XÚC LIÊN TỤC THEO ĐÚNG YÊU CẦU) ---
const STORY_CONFIG = {
  girlName: "Phương Anh",
  storyFlow: [
    {
      lines: ["Phương Anh à..."],
      holdTime: 3800 // Câu mở đầu lắng đọng
    },
    {
      lines: ["Có một điều anh đã muốn nói với em từ khá lâu rồi."],
      holdTime: 5000 // Đủ thời gian đọc thong thả
    },
    {
      lines: [
        "Ngay từ lần đầu nhìn thấy em, anh đã có một cảm giác rất khác.",
        "Em là người con gái đầu tiên khiến anh có cảm giác ấy."
      ],
      holdTime: 6200 // 2 dòng: giữ 6.2 giây để cảm nhận trọn vẹn
    },
    {
      lines: [
        "Anh thích nụ cười của em.",
        "Thích cả cách em làm việc...",
        "và chính những điều đó khiến anh muốn biết về em nhiều hơn."
      ],
      holdTime: 6800 // 3 dòng: giữ 6.8 giây đọc chậm rãi
    },
    {
      lines: [
        "Càng tiếp xúc với em, anh càng nhận ra...",
        "em là một cô gái rất tinh tế."
      ],
      holdTime: 5500 // Giữ 5.5 giây
    },
    {
      lines: [
        "Anh thích cách em quan sát mọi thứ,",
        "cách em thương mọi người và cả tình yêu em dành cho động vật."
      ],
      holdTime: 6200 // Giữ 6.2 giây
    },
    {
      lines: [
        "Và rồi anh nhận ra...",
        "anh không chỉ muốn tìm hiểu em thêm nữa."
      ],
      holdTime: 5200 // Giữ 5.2 giây
    },
    {
      lines: [
        "Anh muốn được đồng hành cùng em,",
        "quan tâm đến em,",
        "và chăm sóc em thật lâu."
      ],
      holdTime: 6500 // Câu chốt trước màn tỏ tình: giữ 6.5 giây sâu lắng
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
const orientationHint = document.getElementById('orientation-hint');

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

// --- RESIZE HANDLING ---
function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  bgCanvas.width = w * dpr;
  bgCanvas.height = h * dpr;
  bgCtx.scale(dpr, dpr);

  heartCanvas.width = w * dpr;
  heartCanvas.height = h * dpr;
  heartCtx.scale(dpr, dpr);

  checkOrientation();
}

window.addEventListener('resize', resizeCanvases);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvases, 250);
});

// Orientation Hint Logic
function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  // Show hint only on mobile devices in portrait mode
  if (isPortrait && window.innerWidth <= 768 && !audioStarted) {
    orientationHint.classList.add('show');
  } else {
    orientationHint.classList.remove('show');
  }
}

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
  orientationHint.classList.remove('show');

  // Try playing user's mp3 audio file
  bgMusic.volume = 0.5;
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
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < NUM_PETALS; i++) ambientPetals.push(new Petal(w, h));
  for (let i = 0; i < NUM_SPARKLES; i++) ambientSparkles.push(new Sparkle(w, h));
}

function animateBg() {
  const w = window.innerWidth;
  const h = window.innerHeight;
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
// FINAL SCENE: EXACT 4-STEP SPECIFICATION
// ===================================================
let climaxStarted = false;
let outlineProgress = 0; // Bước 1: 0 -> 1 vẽ từ từ outline trong 1.5s
let outlineDuration = 1500;
let outlineStartTime = 0;
let heartOutlineParticles = [];
let flyingHearts = [];
let fillProgress = 0;
let heartBeatPhase = 0;
const TOTAL_FILL_HEARTS = 320;

class FlyingMiniHeart {
  constructor(startX, startY, targetX, targetY) {
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = startX;
    this.y = startY;
    this.size = Math.random() * 6 + 6;
    this.color = Math.random() > 0.4 ? '#ff2a5f' : '#ff477e';
    this.alpha = 0.9;
    this.progress = 0;
    this.speed = 0.045;
  }

  update() {
    if (this.progress < 1) {
      this.progress += this.speed;
      if (this.progress > 1) this.progress = 1;
      this.x = this.startX + (this.targetX - this.startX) * this.progress;
      this.y = this.startY + (this.targetY - this.startY) * this.progress;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.9;
    const s = this.size / 10;
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

// Quản lý trạng thái cánh tay và dòng chảy tình yêu
let handPourProgress = 0; // 0 -> 1 tiến trình cánh tay tiến vào rót tình yêu
let handPourPhase = 0;    // 0: chưa vào, 1: đang rót, 2: đã rút lui

function initClimaxFinalScene() {
  climaxStarted = true;
  const w = window.innerWidth;
  const h = window.innerHeight;
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

  // 2. Tạo tọa độ đích lấp đầy bên trong
  const innerTargets = [];
  while (innerTargets.length < TOTAL_FILL_HEARTS) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.90;
    const basePt = getHeartCoord(angle, heartScale * r, centerX, centerY);
    innerTargets.push({
      x: basePt.x + (Math.random() - 0.5) * 10,
      y: basePt.y + (Math.random() - 0.5) * 10
    });
  }

  // BƯỚC 1: Vẽ outline trái tim trắng phát sáng (1.5 giây)
  outlineStartTime = performance.now();
  requestAnimationFrame(animateClimax);

  // BƯỚC 2: Cánh tay yêu thương xuất hiện từ trên rót dòng chảy trái tim đỏ đổ đầy trái tim lớn
  setTimeout(() => {
    handPourPhase = 1; // Bắt đầu đưa cánh tay vào rót tình yêu
    let spawned = 0;

    const spawnInterval = setInterval(() => {
      if (spawned >= TOTAL_FILL_HEARTS) {
        clearInterval(spawnInterval);
        // Khi rót đầy xong: Cánh tay nhẹ nhàng thu về
        setTimeout(() => { handPourPhase = 2; }, 600);
        return;
      }

      // Mỗi đợt rót 4-5 hạt tim đỏ từ bàn tay đang rót phía trên đỉnh trái tim
      const handPourOriginX = centerX + (Math.random() - 0.5) * 20;
      const handPourOriginY = centerY - heartScale * 14 - 15;

      for (let k = 0; k < 5 && spawned < TOTAL_FILL_HEARTS; k++) {
        const startX = handPourOriginX + (Math.random() - 0.5) * 16;
        const startY = handPourOriginY + (Math.random() - 0.5) * 10;
        const mini = new FlyingMiniHeart(startX, startY, innerTargets[spawned].x, innerTargets[spawned].y);
        mini.speed = 0.055;
        flyingHearts.push(mini);
        spawned++;
      }
      fillProgress = spawned / TOTAL_FILL_HEARTS;

      // BƯỚC 3: Khi trái tim đỏ đã được đong đầy (85%), hiện nhẹ "Phương Anh..."
      if (fillProgress >= 0.85 && !finalLeadNameEl.classList.contains('show')) {
        finalLeadNameEl.classList.add('show');
        // Sau 1 giây hiện câu tỏ tình bừng sáng ở trung tâm
        setTimeout(revealStep4Proposal, 1000);
      }
    }, 45); // ~3.5 giây đổ đầy rực rỡ
  }, 1500);
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

  // Bùng nổ thêm hàng loạt trái tim lấp lánh hạnh phúc
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const mini = new FlyingMiniHeart(
      w / 2, 
      h * 0.48, 
      w / 2 + Math.cos(angle) * (Math.random() * 260 + 40),
      h * 0.48 + Math.sin(angle) * (Math.random() * 260 + 40)
    );
    mini.speed = 0.04;
    flyingHearts.push(mini);
  }
}

// Gắn sự kiện click cho 2 nút
document.addEventListener('DOMContentLoaded', () => {
  const btnAgree = document.getElementById('btn-agree');
  const btnShy = document.getElementById('btn-shy');
  if (btnAgree) btnAgree.addEventListener('click', celebrateLove);
  if (btnShy) btnShy.addEventListener('click', celebrateLove);
});

// Hàm vẽ cánh tay nghệ thuật rõ nét, nổi bật, vươn xuống rót đầy dòng tình yêu đỏ
function drawPouringHand(ctx, centerX, centerY, heartScale) {
  if (handPourPhase === 0) return;

  if (handPourPhase === 1 && handPourProgress < 1) {
    handPourProgress += 0.035;
    if (handPourProgress > 1) handPourProgress = 1;
  } else if (handPourPhase === 2 && handPourProgress > 0) {
    handPourProgress -= 0.025;
    if (handPourProgress < 0) handPourProgress = 0;
  }

  if (handPourProgress <= 0) return;

  ctx.save();
  ctx.globalAlpha = Math.min(1, handPourProgress * 1.1);

  // Vị trí cánh tay: Vươn từ mép trên màn hình xuống sát đỉnh lõm của trái tim
  const handX = centerX;
  const targetHandY = centerY - heartScale * 14 + 10;
  const startHandY = -40;
  const currentHandY = startHandY + (targetHandY - startHandY) * handPourProgress;

  ctx.translate(handX, currentHandY);

  // 1. Quầng sáng lãng mạn bao quanh bàn tay
  const handGlow = ctx.createRadialGradient(0, -10, 10, 0, 0, 70);
  handGlow.addColorStop(0, 'rgba(255, 180, 205, 0.45)');
  handGlow.addColorStop(0.7, 'rgba(255, 107, 139, 0.2)');
  handGlow.addColorStop(1, 'rgba(255, 107, 139, 0)');
  ctx.fillStyle = handGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();

  // 2. Nét vẽ cánh tay và bàn tay trắng phát sáng (Elegantly Styled Hand)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 16;

  // Cánh tay từ trên vươn xuống
  ctx.beginPath();
  ctx.moveTo(-28, -85);
  ctx.bezierCurveTo(-22, -45, -20, -20, -16, -5); // Cổ tay trái
  ctx.bezierCurveTo(-20, 12, -12, 26, 0, 30);    // Lòng bàn tay nghiêng rót
  ctx.bezierCurveTo(12, 26, 20, 12, 16, -5);     // Bàn tay phải
  ctx.bezierCurveTo(20, -20, 22, -45, 28, -85);  // Cổ tay phải
  ctx.stroke();

  // Ngón tay thon dài nâng niu
  ctx.beginPath();
  ctx.moveTo(-10, 16);
  ctx.quadraticCurveTo(-4, 35, 0, 38); // Ngón trỏ/giữa
  ctx.moveTo(-4, 20);
  ctx.quadraticCurveTo(4, 34, 7, 36);  // Ngón áp út
  ctx.stroke();

  // 3. Trái tim hồng ngọc rực rỡ trong lòng bàn tay đang rót
  ctx.fillStyle = '#ff1a53';
  ctx.shadowColor = '#ff1a53';
  ctx.shadowBlur = 22;
  ctx.beginPath();
  const s = 1.6;
  ctx.moveTo(0, 12);
  ctx.bezierCurveTo(-6 * s, 6 * s, -11 * s, 14 * s, 0, 24 * s);
  ctx.bezierCurveTo(11 * s, 14 * s, 6 * s, 6 * s, 0, 12);
  ctx.fill();

  // 4. Dòng chảy tia sáng & trái tim nhỏ đỏ tuôn trào xuống tim lớn
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffeef2';
  ctx.shadowBlur = 10;
  for (let d = 0; d < 4; d++) {
    const sparkY = 38 + d * 14 + (performance.now() * 0.08 + d * 10) % 25;
    const sparkX = Math.sin(performance.now() * 0.01 + d) * 6;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function animateClimax(now) {
  if (!climaxStarted) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  heartCtx.clearRect(0, 0, w, h);

  // Bước 1: Tính tiến trình vẽ outline (1.5s)
  if (outlineProgress < 1) {
    const elapsed = now - outlineStartTime;
    outlineProgress = Math.min(1, elapsed / outlineDuration);
  }

  // Heartbeat cực nhẹ nhàng cho trái tim lớn
  heartBeatPhase += 0.025;
  const beatScale = 1 + Math.sin(heartBeatPhase) * 0.015;

  // Lớp nền đỏ nhung lấp đầy dần bên trong
  if (heartOutlineParticles.length > 0 && fillProgress > 0) {
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

    heartCtx.globalAlpha = Math.min(0.96, fillProgress * 1.05);
    heartCtx.fillStyle = heartGrad;
    heartCtx.shadowColor = 'rgba(230, 0, 57, 0.7)';
    heartCtx.shadowBlur = 35;
    heartCtx.fill();
    heartCtx.restore();
  }

  // Vẽ outline trái tim màu trắng phát sáng (theo tiến trình Bước 1)
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

  // Vẽ các trái tim nhỏ đỏ bay vào & rung rinh nhẹ
  for (let i = 0; i < flyingHearts.length; i++) {
    flyingHearts[i].update();
    flyingHearts[i].draw(heartCtx);
  }

  // Vẽ cánh tay yêu thương xuất hiện rót đầy trái tim đỏ
  const minDim = Math.min(w, h);
  let heartScale = (w > h) ? (h / 34) : (minDim / 38);
  drawPouringHand(heartCtx, w / 2, h * 0.48, heartScale);

  requestAnimationFrame(animateClimax);
}

// ===================================================
// INITIALIZATION
// ===================================================
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvases();
  initBgParticles();
  animateBg();
  checkOrientation();
});
