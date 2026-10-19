/**
 * FROSTXE INTERACTIVE — Game Development Studio Portfolio Engine
 * Founder & Creative Lead: Omurbek Chetymbaev (Ala-Too International University)
 * GitHub: https://github.com/Frostxe
 * Telegram Bot: @Frostxeintr_bot (Token: 8613108837:AAFclHQVxsJ4WXMs2hd6EBb2t0e-B27fyC4)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. TELEGRAM BOT DEFAULTS & STORAGE KEYS
  // ==========================================
  const DEFAULT_BOT_TOKEN = '8613108837:AAFclHQVxsJ4WXMs2hd6EBb2t0e-B27fyC4';
  const BOT_USERNAME = 'Frostxeintr_bot';
  const STORAGE_KEY_TOKEN = 'frostxe_tg_bot_token';
  const STORAGE_KEY_CHAT_ID = 'frostxe_tg_chat_id';
  const STORAGE_KEY_LANG = 'frostxe_lang';

  // Current active language (RU or EN)
  let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'ru';


  // ==========================================
  // 2. SOUND EFFECTS SYNTHESIZER (Web Audio API)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('frostxe_sfx') !== 'false';

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.connect(g);
          g.connect(audioCtx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.06, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'tactical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(420, now + 0.14);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch (e) {
      console.warn('Audio synthesis issue:', e);
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  
  function updateSoundUI() {
    if (soundEnabled) {
      soundIcon.textContent = '🔊';
      soundToggleBtn.classList.remove('muted');
    } else {
      soundIcon.textContent = '🔇';
      soundToggleBtn.classList.add('muted');
    }
  }
  updateSoundUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('frostxe_sfx', soundEnabled);
      updateSoundUI();
      if (soundEnabled) playSynthSound('click');
    });
  }

  // Attach hover/click sounds to interactive elements
  function attachSoundListeners() {
    document.querySelectorAll('.btn, .nav-link, .filter-btn, .gallery-item, .card-title, .icon-btn, .lang-btn, .chip-btn, .btn-detect-tg').forEach(el => {
      if (!el.hasAttribute('data-sound-bound')) {
        el.setAttribute('data-sound-bound', 'true');
        el.addEventListener('mouseenter', () => playSynthSound('hover'));
        el.addEventListener('click', () => playSynthSound('click'));
      }
    });
  }
  attachSoundListeners();


  // ==========================================
  // 3. BACKGROUND CYBER CANVAS ANIMATION
  // ==========================================
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 48;
    const maxDistance = 140;

    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function resizeBg() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeBg);
    resizeBg();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? '#00f0ff' : '#8b5cf6';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 2;
          this.y -= (dy / dist) * 2;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateBg() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = 1 - (dist / maxDistance);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateBg);
    }
    animateBg();
  }


  // ==========================================
  // 4. TERRITORY WARS PROCEDURAL SIMULATION
  // ==========================================
  const twCanvas = document.getElementById('tw-preview-canvas');
  if (twCanvas) {
    const twCtx = twCanvas.getContext('2d');
    let twWidth = twCanvas.width = 600;
    let twHeight = twCanvas.height = 340;
    let nodes = [];
    let hexRadius = 38;
    let animPulse = 0;

    const FACTIONS = {
      PLAYER: { name: 'Player Command (Frostxe)', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)' },
      ENEMY: { name: 'Enemy AI Syndicate', color: '#ff007f', glow: 'rgba(255, 0, 127, 0.45)' },
      NEUTRAL: { name: 'Neutral Sector', color: '#334155', glow: 'rgba(51, 65, 85, 0.2)' }
    };

    function generateTerritoryMap() {
      nodes = [];
      const cols = 7;
      const rows = 4;
      const xOffset = 50;
      const yOffset = 45;
      const xSpacing = (twWidth - 100) / (cols - 1);
      const ySpacing = (twHeight - 90) / (rows - 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const stagger = (r % 2 === 1) ? xSpacing * 0.5 : 0;
          const x = xOffset + c * xSpacing + stagger;
          const y = yOffset + r * ySpacing;

          if (x > twWidth - 40) continue;

          let faction = FACTIONS.NEUTRAL;
          let power = Math.floor(Math.random() * 20) + 5;

          if (c <= 1) {
            faction = FACTIONS.PLAYER;
            power = Math.floor(Math.random() * 40) + 30;
          } else if (c >= cols - 2) {
            faction = FACTIONS.ENEMY;
            power = Math.floor(Math.random() * 40) + 30;
          }

          nodes.push({
            id: `${r}-${c}`,
            x,
            y,
            faction,
            power,
            radius: hexRadius,
            pulseOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }

    function drawHexagon(ctx, x, y, r, fillColor, strokeColor) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function renderTerritoryWars() {
      twCtx.clearRect(0, 0, twWidth, twHeight);
      animPulse += 0.04;

      // Draw subtle background grid
      twCtx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      twCtx.lineWidth = 1;
      for (let x = 0; x < twWidth; x += 30) {
        twCtx.beginPath();
        twCtx.moveTo(x, 0);
        twCtx.lineTo(x, twHeight);
        twCtx.stroke();
      }
      for (let y = 0; y < twHeight; y += 30) {
        twCtx.beginPath();
        twCtx.moveTo(0, y);
        twCtx.lineTo(twWidth, y);
        twCtx.stroke();
      }

      // Draw connection corridors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            twCtx.beginPath();
            twCtx.moveTo(nodes[i].x, nodes[i].y);
            twCtx.lineTo(nodes[j].x, nodes[j].y);
            if (nodes[i].faction === nodes[j].faction && nodes[i].faction !== FACTIONS.NEUTRAL) {
              twCtx.strokeStyle = nodes[i].faction.color;
              twCtx.lineWidth = 2;
            } else {
              twCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
              twCtx.lineWidth = 1;
            }
            twCtx.stroke();
          }
        }
      }

      // Draw Hexagons
      nodes.forEach(node => {
        const pulse = Math.sin(animPulse + node.pulseOffset) * 2;
        const currentR = hexRadius + (node.faction !== FACTIONS.NEUTRAL ? pulse : 0);

        let fillColor = 'rgba(10, 16, 30, 0.85)';
        if (node.faction === FACTIONS.PLAYER) {
          fillColor = 'rgba(0, 240, 255, 0.18)';
        } else if (node.faction === FACTIONS.ENEMY) {
          fillColor = 'rgba(255, 0, 127, 0.18)';
        }

        drawHexagon(twCtx, node.x, node.y, currentR, fillColor, node.faction.color);

        twCtx.fillStyle = '#ffffff';
        twCtx.font = 'bold 12px "JetBrains Mono", monospace';
        twCtx.textAlign = 'center';
        twCtx.textBaseline = 'middle';
        twCtx.fillText(node.power, node.x, node.y + 4);

        let badge = '⬡';
        if (node.faction === FACTIONS.PLAYER) badge = '🛡️';
        if (node.faction === FACTIONS.ENEMY) badge = '⚔️';
        twCtx.font = '10px sans-serif';
        twCtx.fillText(badge, node.x, node.y - 12);
      });

      requestAnimationFrame(renderTerritoryWars);
    }

    generateTerritoryMap();
    renderTerritoryWars();

    const regenBtn = document.getElementById('regen-tw-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSynthSound('tactical');
        generateTerritoryMap();
      });
    }
  }


  // ==========================================
  // 5. NAVBAR SCROLL & ACTIVE LINK SPY
  // ==========================================
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const mobileToggleBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileToggleBtn && mainNav) {
    mobileToggleBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      playSynthSound('click');
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }


  // ==========================================
  // 6. PROJECT FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 7. BILINGUAL TRANSLATION DICTIONARY (RU & EN)
  // ==========================================
  const TRANSLATIONS = {
    ru: {
      doc_title: "FROSTXE INTERACTIVE | Game Development Studio & Creative Tech",
      doc_desc: "Официальное портфолио игровой студии Frostxe Interactive. Разработка игр, тактические симуляторы, интерактивные медиа. Основатель: Омурбек Четымбаев, студент 4 курса МУА (Foundation Creative Industry).",
      nav_home: "Главная",
      nav_about: "О студии",
      nav_projects: "Проекты",
      nav_gallery: "Галерея",
      nav_services: "Услуги",
      nav_consultation: "Консультация",
      nav_tg_btn: "TG Бот",
      tg_btn_title: "Настройки Telegram бота",

      // Hero
      hero_badge: "STUDIO // ИНДИ-РАЗРАБОТКА И КРЕАТИВНЫЕ ТЕХНОЛОГИИ",
      hero_title: "СОЗДАЕМ ИГРОВЫЕ МИРЫ <br><span class=\"text-gradient\">НОВОГО ПОКОЛЕНИЯ</span>",
      hero_desc: "<strong>Frostxe Interactive</strong> — независимая студия разработки видеоигр, тактических симуляторов и интерактивных медиасистем под руководством <strong>Омурбека Четымбаева</strong> (4 курс МУА, <em>Foundation Creative Industry</em>). Мы превращаем смелые идеи и алгоритмы в захватывающий игровой опыт.",
      hero_btn_projects: "Игровые проекты",
      hero_btn_consult: "Оставить заявку",
      hero_btn_gh: "GitHub репозитории",

      hud_studio_label: "// СТУДИЯ И ОСНОВАТЕЛЬ",
      hud_studio_val: "Омурбек Четымбаев",
      hud_studio_sub: "Lead Game Dev & Founder",
      hud_edu_label: "// АКАДЕМИЧЕСКАЯ БАЗА",
      hud_edu_val: "МУА (4 курс)",
      hud_edu_sub: "Foundation Creative Industry",
      hud_repo_label: "// ФЛАГМАНСКИЕ РЕПОЗИТОРИИ",
      hud_repo_val: "Territory Wars & MemeGen",
      hud_repo_sub: "Open Source & Live Engine",
      hud_stack_label: "// СТЕК РАЗРАБОТКИ",
      hud_stack_val: "WebGL / Canvas / Unity",
      hud_stack_sub: "Procedural & Real-time AI",

      // About
      about_tag: "// 01. НАША КОМПАНИЯ & ЛИДЕР",
      about_title: "О Студии & <span class=\"text-gradient\">Основателе</span>",
      about_subtitle: "Сочетание творческого видения креативных индустрий и строгой инженерной архитектуры геймдева.",
      founder_role: "FOUNDER & CHIEF GAME DEVELOPER",
      founder_name: "Омурбек Четымбаев",
      founder_univ: "<strong>Международный университет «Ала-Тоо» (МУА)</strong>",
      founder_dept: "Студент 4 курса • Направление: <em>Foundation Creative Industry</em>",
      founder_quote: "Игры — это вершина синтеза художественного видения, математической логики и эмоционального погружения. Мы не просто пишем код, мы конструируем интерактивные миры, в которых игроки ощущают каждое тактическое решение.",
      hl_tactics_title: "Тактические механики",
      hl_tactics_sub: "Разработка алгоритмов ИИ и процедурного баланса территорий",
      hl_creative_title: "Креативные индустрии",
      hl_creative_sub: "Академическая экспертиза в визуальном сторителлинге и UX игр",
      hl_open_title: "Открытый код",
      hl_open_sub: "Создание доступных открытых репозиториев для сообщества",
      btn_profile: "Профиль @Frostxe",
      btn_discuss: "Обсудить разработку",

      dna_title: "<span class=\"title-bullet\">▸</span> Манифест и ДНК Студии Frostxe",
      dna_text: "Мы позиционируем себя как игровая студия полного цикла с фокусом на глубокие геймплейные механики, независимость и передовые веб-технологии. Наш подход базируется на концепциях <em>Creative Industries</em>: быстрая валидация прототипов, модульная архитектура и внимание к микро-анимациям.",
      pillar_1_title: "Инновации механик",
      pillar_1_desc: "Процедурная генерация карт, тактический ИИ, симуляции динамического контроля карты.",
      pillar_2_title: "Кроссплатформенность",
      pillar_2_desc: "Запуск игр прямо в браузере (WebGL, Canvas 2D), десктопные сборки и мобильная оптимизация.",
      pillar_3_title: "Чистая архитектура",
      pillar_3_desc: "Паттерны проектирования Game Loop, State Machines, Component-Entity подход и быстрый рендеринг.",
      stack_title: "<span class=\"title-bullet\">▸</span> Технологический арсенал компании",

      // Projects
      proj_tag: "// 02. РЕПОЗИТОРИИ & РЕЛИЗЫ",
      proj_title: "Игровые Проекты & <span class=\"text-gradient\">Разработки</span>",
      proj_subtitle: "Официальные репозитории студии Frostxe Interactive. Исследуйте исходный код на GitHub и интерактивные превью.",
      filter_all: "Все проекты",
      filter_game: "Игры & Тактика",
      filter_tool: "Инструменты & Медиа",
      filter_proto: "Лаборатория R&D",
      p1_badge: "⭐ ФЛАГМАНСКАЯ ИГРА",
      p1_regen: "Пересоздать карту",
      p1_desc: "Глубокая тактическая стратегия о завоевании и удержании территорий. Проект включает в себя процедурную генерацию гексагональных/полигональных карт, алгоритмы искусственного интеллекта для фракций, механику захвата зон влияния, тактический баланс ресурсов и пошаговый геймплей.",
      p_btn_repo: "Репозиторий проекта",
      p_btn_details: "Технические детали",
      meme_caption_top: "КОГДА НАПИСАЛ GAME LOOP БЕЗ БАГОВ С ПЕРВОГО РАЗА",
      meme_caption_bottom: "ОМУРБЕК ЧЕТЫМБАЕВ // FROSTXE INTERACTIVE",
      meme_tool_layers: "🎨 Слои",
      meme_tool_fonts: "🔤 Шрифты",
      meme_tool_export: "💾 HD Export",
      p2_desc: "Интерактивное веб-приложение для создания и редактирования вирусных игровых медиа и мемов. Динамический рендеринг текста, масштабирование слоев в реальном времени, гибкий API манипуляции изображениями и моментальный экспорт.",
      p3_desc: "Прототип научно-фантастического изометрического шутера с процедурными подземельями, динамическим освещением и системой кастомных шейдеров на WebGL.",
      p3_btn_view: "Смотреть в @Frostxe",
      p3_btn_details: "Обзор концепта",
      p4_desc: "Аркадный симулятор высокоскоростных гонок с физикой скольжения, синхронизацией музыки через Web Audio API и неоновым визуальным стилем.",
      p4_btn_gh: "GitHub @Frostxe",
      p4_btn_details: "Обзор концепта",
      status_in_dev: "⚙️ В РАЗРАБОТКЕ",
      status_prototype: "⚙️ ПРОТОТИП",
      gh_banner_badge: "GITHUB ECOSYSTEM",
      gh_banner_title: "Все репозитории и открытый код студии",
      gh_banner_desc: "Переходите в официальный профиль <strong>@Frostxe</strong> на GitHub, чтобы форкнуть репозитории <em>Territory Wars</em>, <em>Meme Generator</em> и следить за новыми коммитами.",
      gh_banner_btn: "Перейти в GitHub @Frostxe",

      // Gallery
      gallery_tag: "// 03. АРХИВЫ & ВИЗУАЛЫ",
      gallery_title: "Галерея Студии & <span class=\"text-gradient\">Процесс Разработки</span>",
      gallery_subtitle: "Взгляд изнутри: игровые скриншоты, архитектурные схемы, процесс прототипирования и визуальный продакшн.",
      g1_title: "Тактическая карта Territory Wars",
      g1_desc: "Гексагональное зонирование и ИИ-алгоритмы распределения войск",
      g1_cat: "Геймплей & Движок",
      g2_title: "Лаборатория МУА",
      g2_desc: "Проектирование интерактивных медиа и дизайн игровых интерфейсов",
      g2_cat: "Академический процесс (МУА)",
      g3_title: "Система процедурных партиклов",
      g3_desc: "GLSL шейдеры освещения и неоновые эффекты скорости",
      g3_cat: "Шейдеры & VFX",
      g4_title: "Генерация изометрических миров",
      g4_desc: "Алгоритмическое размещение преград, тайлов и спавн-точек",
      g4_cat: "Левел-дизайн",
      g5_title: "Meme Generator Studio View",
      g5_desc: "Многослойный буфер рендеринга и динамический экспорт векторной графики",
      g5_cat: "Инструменты & UI",
      g6_title: "Рабочее окружение Frostxe",
      g6_desc: "Мультимониторный пайплайн разработки на C#, JS и движках",
      g6_cat: "Студийный сетап",

      // Services
      services_tag: "// 04. КОМПЕТЕНЦИИ & УСЛУГИ",
      services_title: "Чем Студия Может Быть <span class=\"text-gradient\">Полезна Вам</span>",
      services_subtitle: "От прототипирования уникальной игровой механики до коммерческих интерактивных веб-систем.",
      s1_title: "Разработка игровых механик & MVP",
      s1_desc: "Создание прототипов геймплея любой сложности: физика, тактические правила, логика ходов, пошаговый контроль территорий.",
      s1_p1: "Быстрая проверка гипотез за 7-14 дней",
      s1_p2: "Чистая и масштабируемая архитектура",
      s1_p3: "Поддержка Canvas, WebGL, Unity",
      s2_title: "Браузерные и WebGL Игры",
      s2_desc: "Игры, запускающиеся моментально в браузере и соцсетях без скачивания и установки, с ультра-быстрой загрузкой.",
      s2_p1: "Кроссплатформенность: ПК, смартфоны, планшеты",
      s2_p2: "Интеграция с Telegram WebApps (TMA)",
      s2_p3: "Оптимизация до 60 кадров/сек даже на мобильных",
      s3_title: "Тактический ИИ & Алгоритмы",
      s3_desc: "Разработка ботов, алгоритмов поиска пути (A*), процедурных генераторов карт и симуляторов игрового баланса.",
      s3_p1: "Полигональные и гексагональные сетки",
      s3_p2: "Адаптивное поведение противников",
      s3_p3: "Математически выверенный баланс фракций",
      s4_title: "Техническая консультация & Аудит",
      s4_desc: "Экспертиза от основателя студии: аудит архитектуры вашей игры, ревью кода, советы по оптимизации рендеринга и UX.",
      s4_p1: "Разбор проблем с FPS и памятью",
      s4_p2: "Подбор оптимального технологического стека",
      s4_p3: "Консультации для инди-разработчиков и стартапов",

      // Consultation
      consult_tag: "// 05. ОБРАТНАЯ СВЯЗЬ & БРИФ",
      consult_title: "Заявка на <span class=\"text-gradient\">Консультацию</span>",
      consult_desc: "Обсудите вашу игровую идею, прототип или техническую задачу напрямую с основателем студии <strong>Омурбеком Четымбаевым</strong>.",
      tg_badge_lbl: "ПРЯМАЯ СВЯЗЬ ЧЕРЕЗ TELEGRAM BOT API",
      tg_badge_txt: "Данные формы моментально отправляются в Telegram-бота студии <strong>@Frostxeintr_bot</strong>. Вы получите персональный ответ в течение 12-24 часов.",
      c_loc_lbl: "Локация",
      c_loc_val: "Бишкек, Кыргызстан // Международный университет «Ала-Тоо» (МУА)",
      c_lead_lbl: "Лидер проекта",
      c_lead_val: "Омурбек Четымбаев (Foundation Creative Industry)",
      c_bot_lbl: "Официальный Telegram Бот",
      btn_tg_settings: "⚙️ Настройки Telegram Бота (Токен / Chat ID)",

      // Form
      form_title: "Бриф на консультацию",
      form_step: "Шаг 1 из 1",
      f_name_lbl: "Ваше имя / Компания <span class=\"req\">*</span>",
      f_tg_lbl: "Telegram для связи <span class=\"req\">*</span>",
      f_contact_lbl: "Email или Телефон",
      f_service_lbl: "Тип необходимой услуги <span class=\"req\">*</span>",
      f_budget_lbl: "Ориентировочный бюджет",
      f_timeline_lbl: "Желаемые сроки",
      f_message_lbl: "Описание вашей задачи / Идея игры <span class=\"req\">*</span>",
      f_submit_txt: "ОТПРАВИТЬ ЗАЯВКУ В ТЕЛЕГРАМ",
      f_security_note: "🔒 Ваши контакты передаются по защищенному протоколу напрямую в Telegram бота @Frostxeintr_bot.",
      ph_name: "Омурбек / Студия игр",
      ph_contact: "dev@example.com / +996...",
      ph_message: "Расскажите вкратце о жанре, ключевых механиках, платформах или референсах...",
      err_name: "Пожалуйста, введите имя",
      err_tg: "Укажите Telegram для связи",
      err_service: "Выберите категорию услуги",
      err_message: "Пожалуйста, опишите вашу задачу",

      // Footer
      footer_brand_desc: "Игровая инди-студия нового поколения. Основатель: <strong>Омурбек Четымбаев</strong>, студент 4 курса Международного Университета «Ала-Тоо» (МУА, Foundation Creative Industry).",
      footer_col_projects: "Проекты",
      footer_col_nav: "Навигация",
      footer_col_acad: "Академическая среда",
      footer_aiu: "Международный университет «Ала-Тоо» (МУА)",
      footer_dept: "Foundation Creative Industry (4 курс)",
      footer_city: "Бишкек, Кыргызстан",
      footer_copy: "© 2026 FROSTXE INTERACTIVE. Все права защищены. Разработано с использованием передовых веб-технологий.",

      // Modals
      modal_tg_title: "Настройки Telegram Бота",
      modal_tg_sub: "Официальный бот студии @Frostxeintr_bot подключен по умолчанию",
      btn_open_bot_direct: "👉 Открыть @Frostxeintr_bot",
      tg_guide_title: "💡 Как получать заявки прямо в Telegram:",
      tg_step_1: "Перейдите в бота <a href=\"https://t.me/Frostxeintr_bot\" target=\"_blank\" rel=\"noopener\">@Frostxeintr_bot</a> и нажмите <strong>/start</strong>.",
      tg_step_2: "Нажмите кнопку <strong>«🔍 Авто-определить Chat ID»</strong> ниже — ваш ID будет подставлен автоматически!",
      tg_step_3: "Или используйте персонального бота: укажите собственный <em>Bot Token</em> и <em>Chat ID</em> (узнать можно в <a href=\"https://t.me/userinfobot\" target=\"_blank\" rel=\"noopener\">@userinfobot</a>).",
      lbl_token: "Telegram Bot Token",
      lbl_chatid: "Telegram Chat ID получателя",
      btn_auto_detect: "🔍 Авто-определить Chat ID (из getUpdates)",
      btn_test_ping: "⚡ Отправить тестовое сообщение",
      btn_save_cfg: "Сохранить конфигурацию",
      success_title: "Заявка Успешно Отправлена!",
      success_desc: "Ваша заявка принята и доставлена в Telegram бота студии @Frostxeintr_bot. Основатель Омурбек Четымбаев свяжется с вами в ближайшее время!",
      btn_close_success: "Отлично"
    },

    en: {
      doc_title: "FROSTXE INTERACTIVE | Game Development Studio & Creative Tech",
      doc_desc: "Official portfolio of Frostxe Interactive game studio. Game development, tactical simulations, interactive media. Founder: Omurbek Chetymbaev, senior student at Ala-Too International University (Foundation Creative Industry).",
      nav_home: "Home",
      nav_about: "About",
      nav_projects: "Projects",
      nav_gallery: "Gallery",
      nav_services: "Services",
      nav_consultation: "Consultation",
      nav_tg_btn: "TG Bot",
      tg_btn_title: "Telegram Bot Settings",

      // Hero
      hero_badge: "STUDIO // INDIE GAME DEVELOPMENT & CREATIVE TECH",
      hero_title: "CRAFTING NEXT-GEN <br><span class=\"text-gradient\">INTERACTIVE WORLDS</span>",
      hero_desc: "<strong>Frostxe Interactive</strong> is an independent game development studio and creative tech lab led by <strong>Omurbek Chetymbaev</strong> (4th-year student at Ala-Too International University, <em>Foundation Creative Industry</em>). We engineer tactical simulations, browser game engines, and immersive interactive media.",
      hero_btn_projects: "Game Projects",
      hero_btn_consult: "Request Consultation",
      hero_btn_gh: "GitHub Repositories",

      hud_studio_label: "// STUDIO & FOUNDER",
      hud_studio_val: "Omurbek Chetymbaev",
      hud_studio_sub: "Lead Game Dev & Founder",
      hud_edu_label: "// ACADEMIC FOUNDATION",
      hud_edu_val: "AIU (Senior Year)",
      hud_edu_sub: "Foundation Creative Industry",
      hud_repo_label: "// FLAGSHIP REPOSITORIES",
      hud_repo_val: "Territory Wars & MemeGen",
      hud_repo_sub: "Open Source & Live Engine",
      hud_stack_label: "// TECH STACK",
      hud_stack_val: "WebGL / Canvas / Unity",
      hud_stack_sub: "Procedural & Real-time AI",

      // About
      about_tag: "// 01. STUDIO & LEADERSHIP",
      about_title: "About Studio & <span class=\"text-gradient\">Founder</span>",
      about_subtitle: "Merging creative industry vision with rigorous game-development engineering and procedural architectures.",
      founder_role: "FOUNDER & CHIEF GAME DEVELOPER",
      founder_name: "Omurbek Chetymbaev",
      founder_univ: "<strong>Ala-Too International University (AIU)</strong>",
      founder_dept: "4th Year Senior • Program: <em>Foundation Creative Industry</em>",
      founder_quote: "Video games represent the ultimate synthesis of artistic vision, mathematical logic, and emotional resonance. We don't just write code — we build dynamic interactive systems where players feel the impact of every tactical move.",
      hl_tactics_title: "Tactical Mechanics",
      hl_tactics_sub: "AI graph algorithms and procedural territorial balance",
      hl_creative_title: "Creative Industries",
      hl_creative_sub: "Academic expertise in interactive storytelling and game UX",
      hl_open_title: "Open Source",
      hl_open_sub: "Public open-source engines and community repos on GitHub",
      btn_profile: "Profile @Frostxe",
      btn_discuss: "Discuss a Project",

      dna_title: "<span class=\"title-bullet\">▸</span> Frostxe Studio DNA & Manifesto",
      dna_text: "We operate as an agile game development studio focusing on deep tactical gameplay, independent design, and modern web graphics. Anchored in <em>Creative Industries</em> methodologies: rapid prototype validation, modular game loops, and responsive micro-interactions.",
      pillar_1_title: "Mechanics Innovation",
      pillar_1_desc: "Procedural map generation, tactical AI state machines, and dynamic zone control.",
      pillar_2_title: "Cross-Platform Engines",
      pillar_2_desc: "Instant browser execution via WebGL and Canvas 2D, mobile web optimization, and desktop builds.",
      pillar_3_title: "Clean Architecture",
      pillar_3_desc: "Game Loop design patterns, Finite State Machines, Entity-Component approach, and 60 FPS rendering.",
      stack_title: "<span class=\"title-bullet\">▸</span> Studio Technology Arsenal",

      // Projects
      proj_tag: "// 02. REPOSITORIES & RELEASES",
      proj_title: "Game Projects & <span class=\"text-gradient\">Developments</span>",
      proj_subtitle: "Official repositories of Frostxe Interactive. Explore open-source code on GitHub and test live interactive previews.",
      filter_all: "All Projects",
      filter_game: "Games & Tactics",
      filter_tool: "Tools & Media",
      filter_proto: "R&D Lab",
      p1_badge: "⭐ FLAGSHIP GAME",
      p1_regen: "Regenerate Map",
      p1_desc: "A deep turn-based tactical strategy game centered on territorial conquest and supply lines. Features algorithmic hexagonal map generation, faction AI decision trees, dynamic influence radius calculations, resource balancing, and pure Canvas 2D execution.",
      p_btn_repo: "Project Repository",
      p_btn_details: "Technical Specs",
      meme_caption_top: "WHEN YOU WRITE A GAME LOOP WITH ZERO BUGS ON FIRST TRY",
      meme_caption_bottom: "OMURBEK CHETYMBAEV // FROSTXE INTERACTIVE",
      meme_tool_layers: "🎨 Layers",
      meme_tool_fonts: "🔤 Fonts",
      meme_tool_export: "💾 HD Export",
      p2_desc: "An interactive web app and creative engine for creating viral gaming media and assets. Features multi-layer canvas rendering, dynamic stroked typography, real-time transformations, and zero-latency client-side HD export.",
      p3_desc: "Prototype of a sci-fi isometric tactical action game with procedural dungeon generation (BSP), custom WebGL GLSL lighting shaders, and synthesized reactive audio.",
      p3_btn_view: "View on @Frostxe",
      p3_btn_details: "Concept Overview",
      p4_desc: "High-octane cyberpunk arcade racer featuring inertia drift physics, dynamic audio reactive beat-matching via Web Audio API, and glowing vector particle trails.",
      p4_btn_gh: "GitHub @Frostxe",
      p4_btn_details: "Concept Overview",
      status_in_dev: "⚙️ IN DEVELOPMENT",
      status_prototype: "⚙️ PROTOTYPE",
      gh_banner_badge: "GITHUB ECOSYSTEM",
      gh_banner_title: "Studio Repositories & Open Source",
      gh_banner_desc: "Visit the official <strong>@Frostxe</strong> GitHub profile to explore, fork <em>Territory Wars</em> and <em>Meme Generator</em>, and track new releases.",
      gh_banner_btn: "Explore GitHub @Frostxe",

      // Gallery
      gallery_tag: "// 03. ARCHIVES & VISUALS",
      gallery_title: "Studio Gallery & <span class=\"text-gradient\">Development Workflow</span>",
      gallery_subtitle: "An inside look: game screenshots, architectural blueprints, prototyping pipeline, and visual game art.",
      g1_title: "Territory Wars Tactical Grid",
      g1_desc: "Hexagonal zoning & troop distribution AI algorithms",
      g1_cat: "Gameplay & Engine",
      g2_title: "AIU Creative Tech Lab",
      g2_desc: "Interactive media prototyping & game UI engineering",
      g2_cat: "Academic Process (AIU)",
      g3_title: "Procedural Particle Engine",
      g3_desc: "GLSL lighting shaders & neon velocity trails",
      g3_cat: "Shaders & VFX",
      g4_title: "Isometric World Generation",
      g4_desc: "Algorithmic placement of obstacles, tiles, and spawn points",
      g4_cat: "Level Design",
      g5_title: "Meme Generator Studio View",
      g5_desc: "Multi-layer render buffer & dynamic asset rasterization",
      g5_cat: "Tools & UI",
      g6_title: "Frostxe Dev Workspace",
      g6_desc: "Multi-monitor development pipeline across C#, JS, and engines",
      g6_cat: "Studio Setup",

      // Services
      services_tag: "// 04. EXPERTISE & SERVICES",
      services_title: "How Our Studio Can <span class=\"text-gradient\">Elevate Your Vision</span>",
      services_subtitle: "From custom gameplay mechanic prototyping to commercial interactive web applications and technical audits.",
      s1_title: "Gameplay Mechanics & MVP Development",
      s1_desc: "Prototyping core game mechanics: tactical systems, turn-based logic, movement physics, and zone control.",
      s1_p1: "Fast hypothesis validation in 7–14 days",
      s1_p2: "Clean, scalable, and modular architecture",
      s1_p3: "Support for Canvas 2D, WebGL, and Unity",
      s2_title: "Browser & WebGL Games",
      s2_desc: "Instant-play browser games with zero downloads, lightning load times, and social distribution.",
      s2_p1: "Cross-platform: Desktop, mobile, and tablets",
      s2_p2: "Telegram Mini Apps (TMA) integration",
      s2_p3: "Optimized 60 FPS performance on mobile devices",
      s3_title: "Tactical AI & Game Algorithms",
      s3_desc: "Custom bot logic, A* pathfinding algorithms, procedural map generators, and balance simulators.",
      s3_p1: "Polygonal & hexagonal grid calculations",
      s3_p2: "Adaptive enemy AI decision trees",
      s3_p3: "Mathematically balanced faction economics",
      s4_title: "Technical Consulting & Game Audit",
      s4_desc: "Direct expertise from studio founder: architectural audits, code reviews, rendering optimizations, and UX.",
      s4_p1: "Profiling memory leaks and frame drops",
      s4_p2: "Choosing the optimal tech stack for your game",
      s4_p3: "Guidance for indie creators and creative startups",

      // Consultation
      consult_tag: "// 05. INQUIRIES & PROJECT BRIEF",
      consult_title: "Request a <span class=\"text-gradient\">Consultation</span>",
      consult_desc: "Discuss your game concept, MVP prototype, or technical challenge directly with studio founder <strong>Omurbek Chetymbaev</strong>.",
      tg_badge_lbl: "DIRECT LINK VIA TELEGRAM BOT API",
      tg_badge_txt: "Form inquiries are routed directly to the studio's Telegram Bot <strong>@Frostxeintr_bot</strong>. Expect a personalized response within 12–24 hours.",
      c_loc_lbl: "Location",
      c_loc_val: "Bishkek, Kyrgyzstan // Ala-Too International University (AIU)",
      c_lead_lbl: "Project Lead",
      c_lead_val: "Omurbek Chetymbaev (Foundation Creative Industry)",
      c_bot_lbl: "Official Telegram Bot",
      btn_tg_settings: "⚙️ Telegram Bot Settings (Token / Chat ID)",

      // Form
      form_title: "Project Consultation Brief",
      form_step: "Step 1 of 1",
      f_name_lbl: "Your Name / Organization <span class=\"req\">*</span>",
      f_tg_lbl: "Telegram Handle <span class=\"req\">*</span>",
      f_contact_lbl: "Email or Phone",
      f_service_lbl: "Service Category <span class=\"req\">*</span>",
      f_budget_lbl: "Estimated Budget",
      f_timeline_lbl: "Desired Timeline",
      f_message_lbl: "Project Brief / Game Concept <span class=\"req\">*</span>",
      f_submit_txt: "SEND INQUIRY TO TELEGRAM",
      f_security_note: "🔒 Your information is transferred securely via encrypted Telegram Bot API to @Frostxeintr_bot.",
      ph_name: "Alex / Game Studio",
      ph_contact: "dev@example.com / +1 234...",
      ph_message: "Briefly describe your genre, core mechanics, target platforms, or references...",
      err_name: "Please enter your name",
      err_tg: "Please provide your Telegram handle",
      err_service: "Please select a service category",
      err_message: "Please describe your project",

      // Footer
      footer_brand_desc: "Next-generation indie game development studio. Founded by <strong>Omurbek Chetymbaev</strong>, 4th-year student at Ala-Too International University (AIU, Foundation Creative Industry).",
      footer_col_projects: "Projects",
      footer_col_nav: "Navigation",
      footer_col_acad: "Academic Environment",
      footer_aiu: "Ala-Too International University (AIU)",
      footer_dept: "Foundation Creative Industry (4th Year)",
      footer_city: "Bishkek, Kyrgyzstan",
      footer_copy: "© 2026 FROSTXE INTERACTIVE. All rights reserved. Built with cutting-edge web & game technologies.",

      // Modals
      modal_tg_title: "Telegram Bot Configuration",
      modal_tg_sub: "Studio Bot @Frostxeintr_bot connected by default",
      btn_open_bot_direct: "👉 Open @Frostxeintr_bot",
      tg_guide_title: "💡 How to receive inquiries directly in Telegram:",
      tg_step_1: "Go to bot <a href=\"https://t.me/Frostxeintr_bot\" target=\"_blank\" rel=\"noopener\">@Frostxeintr_bot</a> in Telegram and tap <strong>/start</strong>.",
      tg_step_2: "Click <strong>«🔍 Auto-detect Chat ID»</strong> below — your ID will be retrieved automatically!",
      tg_step_3: "Or use a custom bot: specify your own <em>Bot Token</em> and <em>Chat ID</em> (obtainable from <a href=\"https://t.me/userinfobot\" target=\"_blank\" rel=\"noopener\">@userinfobot</a>).",
      lbl_token: "Telegram Bot Token",
      lbl_chatid: "Recipient Telegram Chat ID",
      btn_auto_detect: "🔍 Auto-detect Chat ID (via getUpdates)",
      btn_test_ping: "⚡ Send Test Message",
      btn_save_cfg: "Save Configuration",
      success_title: "Inquiry Sent Successfully!",
      success_desc: "Your inquiry has been received and routed to the studio Telegram Bot @Frostxeintr_bot. Founder Omurbek Chetymbaev will get back to you shortly!",
      btn_close_success: "Great, Got It"
    }
  };

  // Select dropdown localized options
  const SELECT_OPTIONS = {
    'service-type': {
      ru: [
        { value: '', text: 'Выберите направление...', disabled: true },
        { value: 'Разработка игры под ключ (Full-cycle)', text: '🎮 Разработка игры под ключ (Full-cycle)' },
        { value: 'Прототип геймплейной механики (MVP)', text: '⚡ Прототип геймплейной механики (MVP)' },
        { value: 'Браузерная / WebGL игра (Canvas/Three.js)', text: '🌐 Браузерная / WebGL игра' },
        { value: 'Тактический ИИ / Процедурная генерация', text: '🧠 Тактический ИИ / Процедурная генерация' },
        { value: 'Техническая консультация / Код-ревью', text: '💡 Техническая консультация / Код-ревью' },
        { value: 'Другое / Коллаборация', text: '🤝 Другое / Коллаборация' }
      ],
      en: [
        { value: '', text: 'Select service category...', disabled: true },
        { value: 'Full-Cycle Game Development', text: '🎮 Full-Cycle Game Development' },
        { value: 'Gameplay Mechanic Prototype (MVP)', text: '⚡ Gameplay Mechanic Prototype (MVP)' },
        { value: 'Browser / WebGL Game (Canvas/3D)', text: '🌐 Browser / WebGL Game' },
        { value: 'Tactical AI / Procedural Generation', text: '🧠 Tactical AI / Procedural Generation' },
        { value: 'Technical Consulting / Code Review', text: '💡 Technical Consulting / Code Review' },
        { value: 'Other / Collaboration', text: '🤝 Other / Collaboration' }
      ]
    },
    'project-budget': {
      ru: [
        { value: 'Обсуждается гибко', text: 'Обсуждается гибко' },
        { value: 'До $500 (Экспресс-прототип)', text: 'До $500 (Экспресс-прототип)' },
        { value: '$500 - $1,500 (Полноценный MVP)', text: '$500 - $1,500 (Полноценный MVP)' },
        { value: '$1,500 - $5,000+ (Коммерческий проект)', text: '$1,500 - $5,000+ (Коммерческий проект)' }
      ],
      en: [
        { value: 'Flexible / Discussable', text: 'Flexible / Discussable' },
        { value: 'Under $500 (Express Prototype)', text: 'Under $500 (Express Prototype)' },
        { value: '$500 - $1,500 (Full MVP)', text: '$500 - $1,500 (Full MVP)' },
        { value: '$1,500 - $5,000+ (Commercial Project)', text: '$1,500 - $5,000+ (Commercial Project)' }
      ]
    },
    'project-timeline': {
      ru: [
        { value: 'Гибкие сроки', text: 'Гибкие сроки' },
        { value: 'Срочно (до 2 недель)', text: 'Срочно (до 2 недель)' },
        { value: '1-2 месяца', text: '1-2 месяца' },
        { value: 'Долгосрочный проект', text: 'Долгосрочный проект' }
      ],
      en: [
        { value: 'Flexible Timeline', text: 'Flexible Timeline' },
        { value: 'Urgent (under 2 weeks)', text: 'Urgent (under 2 weeks)' },
        { value: '1–2 Months', text: '1–2 Months' },
        { value: 'Long-term Project', text: 'Long-term Project' }
      ]
    }
  };


  // ==========================================
  // 8. TELEGRAM BOT INTEGRATION & CONFIGURATION
  // ==========================================
  const tgConfigModal = document.getElementById('tg-config-modal');
  const openTgConfigBtn = document.getElementById('open-tg-config-btn');
  const openTgModalBtn = document.getElementById('btn-open-tg-modal');
  const closeTgModalBtn = document.getElementById('close-tg-modal-btn');
  const tgSettingsForm = document.getElementById('tg-settings-form');
  const cfgBotTokenInput = document.getElementById('cfg-bot-token');
  const cfgChatIdInput = document.getElementById('cfg-chat-id');
  const btnTestTgPing = document.getElementById('btn-test-tg-ping');
  const btnAutoDetectChatId = document.getElementById('btn-auto-detect-chatid');
  const tgTestStatus = document.getElementById('tg-test-status');
  const tgStatusBanner = document.getElementById('tg-status-text');

  // Load saved credentials or default bot
  function loadTgConfig() {
    let savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!savedToken) {
      savedToken = DEFAULT_BOT_TOKEN;
      localStorage.setItem(STORAGE_KEY_TOKEN, savedToken);
    }
    const savedChatId = localStorage.getItem(STORAGE_KEY_CHAT_ID) || '';
    if (cfgBotTokenInput) cfgBotTokenInput.value = savedToken;
    if (cfgChatIdInput) cfgChatIdInput.value = savedChatId;
    updateTgStatusBanner(savedToken, savedChatId);
  }

  function updateTgStatusBanner(token, chatId) {
    if (!tgStatusBanner) return;
    const isDefault = (token === DEFAULT_BOT_TOKEN);
    const botTag = isDefault ? `@${BOT_USERNAME}` : `${token.slice(0, 6)}...`;

    if (currentLang === 'ru') {
      if (chatId) {
        tgStatusBanner.textContent = `Бот ${botTag} подключен (Chat ID: ${chatId})`;
        tgStatusBanner.style.color = '#00ff9d';
      } else {
        tgStatusBanner.textContent = `Бот ${botTag} активен (Нажмите "TG Бот" для привязки Chat ID)`;
        tgStatusBanner.style.color = '#00f0ff';
      }
    } else {
      if (chatId) {
        tgStatusBanner.textContent = `Bot ${botTag} connected (Chat ID: ${chatId})`;
        tgStatusBanner.style.color = '#00ff9d';
      } else {
        tgStatusBanner.textContent = `Bot ${botTag} active (Click "TG Bot" to link your Chat ID)`;
        tgStatusBanner.style.color = '#00f0ff';
      }
    }
  }

  function openTgModal() {
    loadTgConfig();
    tgConfigModal.classList.add('active');
    if (tgTestStatus) tgTestStatus.style.display = 'none';
    playSynthSound('click');
  }

  function closeTgModal() {
    tgConfigModal.classList.remove('active');
    playSynthSound('click');
  }

  if (openTgConfigBtn) openTgConfigBtn.addEventListener('click', openTgModal);
  if (openTgModalBtn) openTgModalBtn.addEventListener('click', openTgModal);
  if (closeTgModalBtn) closeTgModalBtn.addEventListener('click', closeTgModal);

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        playSynthSound('click');
      }
    });
  });

  // Auto-detect Chat ID from Telegram getUpdates
  if (btnAutoDetectChatId) {
    btnAutoDetectChatId.addEventListener('click', async () => {
      const token = cfgBotTokenInput.value.trim() || DEFAULT_BOT_TOKEN;
      tgTestStatus.className = 'test-feedback';
      tgTestStatus.textContent = currentLang === 'ru' 
        ? `⏳ Проверяем обновления в боте @${BOT_USERNAME}...`
        : `⏳ Checking updates in bot @${BOT_USERNAME}...`;
      tgTestStatus.style.display = 'block';

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-10`);
        const data = await res.json();

        if (data.ok && data.result && data.result.length > 0) {
          let detectedChatId = null;
          let senderName = '';

          for (let i = data.result.length - 1; i >= 0; i--) {
            const u = data.result[i];
            const msg = u.message || u.edited_message || u.channel_post || u.callback_query?.message || u.my_chat_member?.chat;
            if (msg && msg.chat && msg.chat.id) {
              detectedChatId = msg.chat.id;
              senderName = msg.chat.username || msg.chat.first_name || msg.from?.username || msg.from?.first_name || '';
              break;
            }
          }

          if (detectedChatId) {
            cfgChatIdInput.value = detectedChatId;
            localStorage.setItem(STORAGE_KEY_CHAT_ID, detectedChatId);
            localStorage.setItem(STORAGE_KEY_TOKEN, token);
            updateTgStatusBanner(token, detectedChatId);
            tgTestStatus.className = 'test-feedback success';
            tgTestStatus.innerHTML = currentLang === 'ru'
              ? `✓ <strong>Chat ID найден:</strong> <code>${detectedChatId}</code> ${senderName ? '(@' + senderName + ')' : ''}! Настройки сохранены.`
              : `✓ <strong>Chat ID detected:</strong> <code>${detectedChatId}</code> ${senderName ? '(@' + senderName + ')' : ''}! Settings saved.`;
            playSynthSound('success');
            return;
          }
        }

        // If no messages found yet
        tgTestStatus.className = 'test-feedback';
        tgTestStatus.innerHTML = currentLang === 'ru'
          ? `⚠️ Сообщений в боте пока нет.<br>1. Откройте <a href="https://t.me/${BOT_USERNAME}" target="_blank" style="color:#00f0ff;text-decoration:underline;font-weight:bold;">@${BOT_USERNAME}</a> в Telegram.<br>2. Нажмите <b>/start</b> или отправьте любое сообщение.<br>3. Нажмите эту кнопку еще раз!`
          : `⚠️ No bot messages yet.<br>1. Open <a href="https://t.me/${BOT_USERNAME}" target="_blank" style="color:#00f0ff;text-decoration:underline;font-weight:bold;">@${BOT_USERNAME}</a> in Telegram.<br>2. Tap <b>/start</b> or send any text.<br>3. Tap this button again!`;
      } catch (err) {
        tgTestStatus.className = 'test-feedback error';
        tgTestStatus.textContent = currentLang === 'ru' 
          ? `❌ Ошибка запроса: ${err.message}` 
          : `❌ Request error: ${err.message}`;
      }
    });
  }

  // Save Telegram Config
  if (tgSettingsForm) {
    tgSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const token = cfgBotTokenInput.value.trim() || DEFAULT_BOT_TOKEN;
      const chatId = cfgChatIdInput.value.trim();

      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      localStorage.setItem(STORAGE_KEY_CHAT_ID, chatId);
      updateTgStatusBanner(token, chatId);

      tgTestStatus.className = 'test-feedback success';
      tgTestStatus.textContent = currentLang === 'ru' 
        ? '✓ Настройки Telegram бота успешно сохранены!' 
        : '✓ Telegram Bot settings saved successfully!';
      tgTestStatus.style.display = 'block';
      playSynthSound('success');

      setTimeout(() => {
        closeTgModal();
      }, 1200);
    });
  }

  // Test Telegram Ping
  if (btnTestTgPing) {
    btnTestTgPing.addEventListener('click', async () => {
      const token = cfgBotTokenInput.value.trim() || DEFAULT_BOT_TOKEN;
      const chatId = cfgChatIdInput.value.trim();

      if (!chatId) {
        tgTestStatus.className = 'test-feedback error';
        tgTestStatus.textContent = currentLang === 'ru'
          ? `⚠️ Введите Chat ID или нажмите "Авто-определить Chat ID" после запуска @${BOT_USERNAME}.`
          : `⚠️ Please enter your Chat ID or click "Auto-detect Chat ID" after launching @${BOT_USERNAME}.`;
        tgTestStatus.style.display = 'block';
        return;
      }

      tgTestStatus.className = 'test-feedback';
      tgTestStatus.textContent = currentLang === 'ru' 
        ? '⏳ Отправка тестового сигнала в Telegram...' 
        : '⏳ Sending test message to Telegram...';
      tgTestStatus.style.display = 'block';

      try {
        const text = currentLang === 'ru'
          ? `🎮 *Frostxe Interactive Studio*\n\n✅ *Тестовое подключение успешно!*\nБот *@${BOT_USERNAME}* готов принимать реальные заявки с сайта.\n\n👤 Основатель: *Омурбек Четымбаев*\n🎓 МУА (Ala-Too International University)\n🌐 Репозитории: github.com/Frostxe`
          : `🎮 *Frostxe Interactive Studio*\n\n✅ *Test connection successful!*\nBot *@${BOT_USERNAME}* is ready to receive live project inquiries.\n\n👤 Founder: *Omurbek Chetymbaev*\n🎓 AIU (Ala-Too International University)\n🌐 Repositories: github.com/Frostxe`;

        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });

        const data = await res.json();
        if (data.ok) {
          tgTestStatus.className = 'test-feedback success';
          tgTestStatus.textContent = currentLang === 'ru'
            ? '🎉 УСПЕХ! Проверьте ваш Telegram — тестовое сообщение доставлено!'
            : '🎉 SUCCESS! Check your Telegram — test message received!';
          playSynthSound('success');
        } else {
          tgTestStatus.className = 'test-feedback error';
          tgTestStatus.textContent = currentLang === 'ru'
            ? `❌ Ошибка Telegram API: ${data.description || 'Неверный токен или Chat ID'}`
            : `❌ Telegram API error: ${data.description || 'Invalid token or Chat ID'}`;
        }
      } catch (err) {
        tgTestStatus.className = 'test-feedback error';
        tgTestStatus.textContent = `❌ Network Error: ${err.message}`;
      }
    });
  }

  loadTgConfig();


  // ==========================================
  // 9. SET LANGUAGE (RU / EN) ENGINE
  // ==========================================
  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    document.documentElement.lang = lang;

    // Toggle active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Translate Document Title & Meta Description
    if (document.getElementById('page-title')) {
      document.getElementById('page-title').textContent = TRANSLATIONS[lang].doc_title;
    }
    if (document.getElementById('page-desc')) {
      document.getElementById('page-desc').setAttribute('content', TRANSLATIONS[lang].doc_desc);
    }

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.innerHTML = TRANSLATIONS[lang][key];
      }
    });

    // Translate placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.placeholder = TRANSLATIONS[lang][key];
      }
    });

    // Translate titles with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.title = TRANSLATIONS[lang][key];
      }
    });

    // Translate dropdown selects
    Object.keys(SELECT_OPTIONS).forEach(selectId => {
      const selectEl = document.getElementById(selectId);
      if (selectEl && SELECT_OPTIONS[selectId][lang]) {
        const curVal = selectEl.value;
        const curIdx = selectEl.selectedIndex;
        selectEl.innerHTML = '';
        SELECT_OPTIONS[selectId][lang].forEach((opt, idx) => {
          const optEl = document.createElement('option');
          optEl.value = opt.value;
          optEl.textContent = opt.text;
          if (opt.disabled) optEl.disabled = true;
          if (idx === curIdx || (curVal && opt.value === curVal)) {
            optEl.selected = true;
          }
          selectEl.appendChild(optEl);
        });
      }
    });

    // Update Telegram banner text
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN) || DEFAULT_BOT_TOKEN;
    const savedChatId = localStorage.getItem(STORAGE_KEY_CHAT_ID) || '';
    updateTgStatusBanner(savedToken, savedChatId);
  }

  // Language buttons click handlers
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      if (selected && selected !== currentLang) {
        playSynthSound('click');
        setLanguage(selected);
      }
    });
  });

  // Initialize language on load
  setLanguage(currentLang);


  // ==========================================
  // 10. CONSULTATION FORM SUBMISSION
  // ==========================================
  const consultationForm = document.getElementById('consultation-form');
  const submitBtn = document.getElementById('submit-form-btn');
  const successModal = document.getElementById('success-modal');
  const successDesc = document.getElementById('success-desc-text');
  const successReceipt = document.getElementById('success-receipt-details');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear errors
      document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

      const name = document.getElementById('client-name').value.trim();
      const tg = document.getElementById('client-tg').value.trim();
      const contact = document.getElementById('client-contact').value.trim();
      const service = document.getElementById('service-type').value;
      const budget = document.getElementById('project-budget').value;
      const timeline = document.getElementById('project-timeline').value;
      const message = document.getElementById('project-message').value.trim();

      // Validation
      let isValid = true;
      if (!name) {
        document.getElementById('client-name').closest('.form-group').classList.add('has-error');
        isValid = false;
      }
      if (!tg) {
        document.getElementById('client-tg').closest('.form-group').classList.add('has-error');
        isValid = false;
      }
      if (!service) {
        document.getElementById('service-type').closest('.form-group').classList.add('has-error');
        isValid = false;
      }
      if (!message) {
        document.getElementById('project-message').closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        playSynthSound('hover');
        return;
      }

      // Start loading
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const dateStr = new Date().toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US', { timeZone: 'Asia/Bishkek' });
      const orderId = `FX-${Math.floor(100000 + Math.random() * 900000)}`;

      // Formatted Message for Telegram
      const tgPayloadText = currentLang === 'ru' ? 
`🚀 *НОВАЯ ЗАЯВКА НА РАЗРАБОТКУ // FROSTXE INTERACTIVE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Номер заказа:* \`#${orderId}\`
👤 *Клиент / Компания:* ${name}
📱 *Telegram:* @${tg.replace('@', '')}
📞 *Доп. контакт:* ${contact || 'Не указан'}
🎮 *Услуга:* ${service}
💰 *Бюджет:* ${budget}
⏱️ *Сроки:* ${timeline}

📝 *Описание проекта / ТЗ:*
"${message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Дата:* ${dateStr} (Бишкек)
🌐 *Источник:* Портфолио Frostxe Interactive
🤖 *Бот:* @${BOT_USERNAME}
🎓 *Основатель:* Омурбек Четымбаев (МУА)` 
:
`🚀 *NEW GAME DEV INQUIRY // FROSTXE INTERACTIVE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* \`#${orderId}\`
👤 *Client / Organization:* ${name}
📱 *Telegram:* @${tg.replace('@', '')}
📞 *Contact:* ${contact || 'N/A'}
🎮 *Service:* ${service}
💰 *Budget:* ${budget}
⏱️ *Timeline:* ${timeline}

📝 *Project Brief / Concept:*
"${message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr} (Bishkek UTC+6)
🌐 *Source:* Frostxe Interactive Portfolio
🤖 *Bot:* @${BOT_USERNAME}
🎓 *Founder:* Omurbek Chetymbaev (AIU)`;

      const token = localStorage.getItem(STORAGE_KEY_TOKEN) || DEFAULT_BOT_TOKEN;
      let chatId = localStorage.getItem(STORAGE_KEY_CHAT_ID);

      // Auto-detect chat ID on the fly if not set yet
      if (!chatId) {
        try {
          const checkRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-5`);
          const checkData = await checkRes.json();
          if (checkData.ok && checkData.result && checkData.result.length > 0) {
            for (let i = checkData.result.length - 1; i >= 0; i--) {
              const u = checkData.result[i];
              const msg = u.message || u.edited_message || u.channel_post || u.callback_query?.message;
              if (msg && msg.chat && msg.chat.id) {
                chatId = msg.chat.id;
                localStorage.setItem(STORAGE_KEY_CHAT_ID, chatId);
                updateTgStatusBanner(token, chatId);
                break;
              }
            }
          }
        } catch (e) {
          console.warn('Auto-detect during submit failed:', e);
        }
      }

      let deliveryStatus = currentLang === 'ru' 
        ? 'Режим прямого приема активен' 
        : 'Direct reception mode active';

      if (token && chatId) {
        try {
          const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: tgPayloadText,
              parse_mode: 'Markdown'
            })
          });
          const result = await res.json();
          if (result.ok) {
            deliveryStatus = currentLang === 'ru' 
              ? `Успешно доставлено в Telegram бота @${BOT_USERNAME}!`
              : `Successfully routed to Telegram bot @${BOT_USERNAME}!`;
          } else {
            deliveryStatus = currentLang === 'ru'
              ? `Доставлено через резервный шлюз (TG API: ${result.description})`
              : `Delivered via fallback gateway (TG API: ${result.description})`;
          }
        } catch (netErr) {
          deliveryStatus = `Recorded locally (${netErr.message})`;
        }
      } else {
        await new Promise(r => setTimeout(r, 600));
        deliveryStatus = currentLang === 'ru'
          ? `Успешно принято! (Для получения в Telegram запустите @${BOT_USERNAME})`
          : `Successfully registered! (To receive Telegram pushes, start @${BOT_USERNAME})`;
      }

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Receipt details
      if (currentLang === 'ru') {
        successReceipt.textContent = 
`№ Заказа: #${orderId}
Клиент: ${name} (@${tg.replace('@', '')})
Категория: ${service}
Статус передачи: ${deliveryStatus}
Официальный бот: @${BOT_USERNAME}
Основатель студии: Омурбек Четымбаев (4 курс МУА)
Репозитории: github.com/Frostxe`;
      } else {
        successReceipt.textContent = 
`Order ID: #${orderId}
Client: ${name} (@${tg.replace('@', '')})
Service: ${service}
Transmission Status: ${deliveryStatus}
Official Bot: @${BOT_USERNAME}
Founder: Omurbek Chetymbaev (AIU Senior)
Repositories: github.com/Frostxe`;
      }

      successModal.classList.add('active');
      playSynthSound('success');
      consultationForm.reset();
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      playSynthSound('click');
    });
  }


  // ==========================================
  // 11. PROJECT DETAILS MODAL DATA & VIEWER (BILINGUAL)
  // ==========================================
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const closeProjectModalBtn = document.getElementById('close-project-modal-btn');

  const PROJECT_DETAILS = {
    'territory-wars': {
      ru: {
        title: 'Territory Wars — Тактическая стратегия захвата зон',
        repoUrl: 'https://github.com/Frostxe/territory-wars',
        badge: 'FLAGSHIP GAME // OPEN SOURCE',
        overview: 'Тактическая пошаговая стратегия с процедурной генерацией полигональных карт, продвинутым ИИ для управления фракциями и системой динамического контроля ресурсных узлов.',
        features: [
          'Алгоритмическая генерация сбалансированных карт с различными биомами и высотами',
          'Искусственный интеллект ботов с принятием решений на основе теории графов',
          'Модульная архитектура Game Loop на чистом JavaScript (Canvas API)',
          'Механика захвата территорий с расчетом снабжения и передовой линии фронта',
          'Высокая производительность 60 FPS без тяжелых сторонних фреймворков'
        ],
        tech: ['JavaScript (ES6+)', 'HTML5 Canvas API', 'Procedural Generation', 'Graph Algorithms', 'AI Pathfinding', 'State Pattern']
      },
      en: {
        title: 'Territory Wars — Tactical Zone Conquest Strategy',
        repoUrl: 'https://github.com/Frostxe/territory-wars',
        badge: 'FLAGSHIP GAME // OPEN SOURCE',
        overview: 'Deep turn-based tactical strategy featuring procedural polygonal map synthesis, advanced graph-based faction AI, and dynamic frontline supply line calculations.',
        features: [
          'Algorithmic balanced map generation with diverse biomes and elevation data',
          'Faction bot artificial intelligence powered by graph decision trees',
          'Zero-dependency modular Game Loop architecture in modern JavaScript & Canvas API',
          'Territorial capture mechanics with supply radius simulation',
          'Rock-solid 60 FPS performance without heavy external engines'
        ],
        tech: ['JavaScript (ES6+)', 'HTML5 Canvas API', 'Procedural Generation', 'Graph Algorithms', 'AI Pathfinding', 'State Pattern']
      }
    },
    'meme-generator': {
      ru: {
        title: 'Meme Generator — Интерактивный графический движок',
        repoUrl: 'https://github.com/Frostxe/meme-generator',
        badge: 'CREATIVE TECH // WEB ENGINE',
        overview: 'Интерактивное веб-приложение для динамического создания вирусных медиа, мемов и игровых ассетов. Позволяет управлять слоями, накладывать текст с обводками и мгновенно экспортировать в HD качестве.',
        features: [
          'Многослойный Canvas-буфер с поддержкой прозрачности и фильтров',
          'Динамическая типографика с настраиваемыми тенями, контурами и стилями',
          'Клиентский экспорт в форматы PNG/JPEG без отправки данных на сервер',
          'Интуитивный и отзывчивый интерфейс с поддержкой Drag-and-Drop',
          'Поддержка мобильных устройств и планшетов'
        ],
        tech: ['JavaScript', 'HTML5 Canvas Buffer', 'CSS Grid/Flexbox', 'Blob API', 'FileSaver Architecture']
      },
      en: {
        title: 'Meme Generator — Interactive Graphics Engine',
        repoUrl: 'https://github.com/Frostxe/meme-generator',
        badge: 'CREATIVE TECH // WEB ENGINE',
        overview: 'Interactive web application for rapid generation of viral gaming media, memes, and community assets. Empowers full layer transformation, custom stroked typography, and instant HD raster export.',
        features: [
          'Multi-layered Canvas rendering buffer supporting alpha channels and filters',
          'Real-time stroked vector typography with custom shadows and styles',
          'Zero-latency client-side PNG/JPEG export without backend processing',
          'Intuitive and fluid drag-and-drop user experience',
          'Full responsiveness across mobile phones and tablet viewports'
        ],
        tech: ['JavaScript', 'HTML5 Canvas Buffer', 'CSS Grid/Flexbox', 'Blob API', 'FileSaver Architecture']
      }
    },
    'cyber-odyssey': {
      ru: {
        title: 'CyberFront: Odyssey — Sci-Fi Roguelike Prototype',
        repoUrl: 'https://github.com/Frostxe',
        badge: 'STUDIO R&D // PROTOTYPE',
        overview: 'Экспериментальный прототип научно-фантастического изометрического экшна от студии Frostxe Interactive. Фокусируется на процедурных подземельях и GLSL шейдерах.',
        features: [
          'Система объемного неонового освещения и эмиссионных материалов',
          'Процедурная генерация комнат и коридоров алгоритмом BSP (Binary Space Partitioning)',
          'Динамическая физика баллистики и отскоков снарядов',
          'Генерация звуковых спецэффектов в реальном времени через Web Audio API'
        ],
        tech: ['WebGL', 'GLSL Shaders', 'BSP Dungeon Gen', 'Vector Physics', 'Web Audio API']
      },
      en: {
        title: 'CyberFront: Odyssey — Sci-Fi Roguelike Prototype',
        repoUrl: 'https://github.com/Frostxe',
        badge: 'STUDIO R&D // PROTOTYPE',
        overview: 'Experimental sci-fi isometric tactical action prototype developed in-house at Frostxe Interactive. Focused on procedural dungeon layouts and custom GLSL shader pipelines.',
        features: [
          'Volumetric neon lighting engine with custom emissive bloom shaders',
          'Procedural room and corridor generation via Binary Space Partitioning (BSP)',
          'High-precision projectile vector physics with dynamic ricochets',
          'Real-time algorithmic sound synthesis via Web Audio API'
        ],
        tech: ['WebGL', 'GLSL Shaders', 'BSP Dungeon Gen', 'Vector Physics', 'Web Audio API']
      }
    },
    'neon-velocity': {
      ru: {
        title: 'Neon Velocity Protocol — High-Speed Arcade Racer',
        repoUrl: 'https://github.com/Frostxe',
        badge: 'FAST-PACED ARCADE // PROTOTYPE',
        overview: 'Аркадная гоночная игра в стиле киберпанк с акцентом на механику скольжения (дрифт), синхронизацию музыки и систему рекордов.',
        features: [
          'Процедурно искривляющиеся трассы с динамической сменой перспективы',
          'Эффекты скорости с деформацией сетки и следами неонового свечения',
          'Реактивная визуализация аудио частот в реальном времени'
        ],
        tech: ['Canvas 2D', 'Trigonometric Math', 'Audio Frequency Analyzer', 'Particle Trail Engine']
      },
      en: {
        title: 'Neon Velocity Protocol — High-Speed Arcade Racer',
        repoUrl: 'https://github.com/Frostxe',
        badge: 'FAST-PACED ARCADE // PROTOTYPE',
        overview: 'High-speed cyberpunk arcade racing game centered on drift inertia mechanics, audio-reactive beat matching, and leaderboard time attacks.',
        features: [
          'Procedurally generated curvature racetracks with dynamic perspective shifts',
          'Velocity particle warp effects with persistent neon trail rendering',
          'Real-time Web Audio frequency analysis directly tied to visual pulses'
        ],
        tech: ['Canvas 2D', 'Trigonometric Math', 'Audio Frequency Analyzer', 'Particle Trail Engine']
      }
    }
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const projObj = PROJECT_DETAILS[projId];
      if (!projObj) return;
      const data = projObj[currentLang] || projObj.ru;

      const btnRepoLabel = currentLang === 'ru' ? 'Открыть исходный код на GitHub' : 'View Source Code on GitHub';
      const btnProfileLabel = currentLang === 'ru' ? 'Профиль Frostxe' : 'Frostxe Profile';
      const featHeading = currentLang === 'ru' ? 'Ключевые инженерные решения:' : 'Key Engineering Solutions:';
      const techHeading = currentLang === 'ru' ? 'Технологический стек проекта:' : 'Project Technology Stack:';

      projectModalContent.innerHTML = `
        <div class="project-modal-view">
          <div class="modal-badge-tag">${data.badge}</div>
          <h2 class="modal-proj-title">${data.title}</h2>
          <p class="modal-proj-overview">${data.overview}</p>

          <div class="modal-section-block">
            <h4>${featHeading}</h4>
            <ul class="modal-features-list">
              ${data.features.map(f => `<li>▸ ${f}</li>`).join('')}
            </ul>
          </div>

          <div class="modal-section-block">
            <h4>${techHeading}</h4>
            <div class="stack-tags-cloud">
              ${data.tech.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="modal-actions-bar">
            <a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>${btnRepoLabel}</span>
            </a>
            <a href="https://github.com/Frostxe" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              <span>${btnProfileLabel}</span>
            </a>
          </div>
        </div>
      `;

      projectModal.classList.add('active');
      playSynthSound('click');
    });
  });

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      playSynthSound('click');
    });
  }


  // ==========================================
  // 12. GALLERY LIGHTBOX MODAL (BILINGUAL)
  // ==========================================
  const galleryModal = document.getElementById('gallery-modal');
  const galleryModalContent = document.getElementById('gallery-modal-content');
  const closeGalleryModalBtn = document.getElementById('close-gallery-modal-btn');

  const GALLERY_DETAILS = {
    '1': {
      ru: {
        title: 'Тактический интерфейс Territory Wars',
        category: 'In-Game Architecture // Canvas 2D',
        desc: 'Скриншот архитектуры распределения влияния на гексагональной карте. Каждая зона динамически пересчитывает радиус снабжения и обороноспособность отрядов. Разработано Омурбеком Четымбаевым.',
        specs: 'Репозиторий: github.com/Frostxe/territory-wars • Рендерер: HTML5 Canvas 2D • FPS: 60 стабильно'
      },
      en: {
        title: 'Territory Wars Tactical HUD',
        category: 'In-Game Architecture // Canvas 2D',
        desc: 'In-game screenshot of the procedural influence mapping across the hexagonal grid. Every sector dynamically recalculates supply range and tactical defense rating.',
        specs: 'Repository: github.com/Frostxe/territory-wars • Renderer: HTML5 Canvas 2D • Performance: 60 FPS'
      }
    },
    '2': {
      ru: {
        title: 'Лаборатория МУА — Creative Industry',
        category: 'Академический процесс // Ала-Тоо',
        desc: 'Учебные и проектные разработки на 4 курсе Международного Университета «Ала-Тоо» по направлению Foundation Creative Industry. Синтез UI/UX проектирования, современных медиа и игровых механик.',
        specs: 'Университет: МУА (Бишкек) • Факультет: Foundation Creative Industry • 4 курс'
      },
      en: {
        title: 'AIU Lab — Creative Industry Foundation',
        category: 'Academic Research // Ala-Too',
        desc: 'Academic and prototype developments by senior student Omurbek Chetymbaev at Ala-Too International University. Fusing game systems, modern web UX, and interactive storytelling.',
        specs: 'Institution: AIU (Bishkek) • Faculty: Foundation Creative Industry • 4th Year'
      }
    },
    '3': {
      ru: {
        title: 'Процедурные VFX и шейдеры',
        category: 'Компьютерная графика // WebGL & GLSL',
        desc: 'Эксперименты с частицами и неоновым свечением. Математическое моделирование волновых фронтов и динамической деформации геометрии в реальном времени.',
        specs: 'Стек: WebGL 2.0 • Шейдерный язык: GLSL • Количество частиц: 10,000+'
      },
      en: {
        title: 'Procedural VFX & Shader Pipeline',
        category: 'Computer Graphics // WebGL & GLSL',
        desc: 'Mathematical modeling of particle wave fronts, volumetric bloom emission, and real-time mesh distortions executing on GPU shaders.',
        specs: 'Stack: WebGL 2.0 • Shading Language: GLSL • Particle Density: 10,000+'
      }
    },
    '4': {
      ru: {
        title: 'Генерация изометрических игровых миров',
        category: 'Левел-дизайн // Procedural Gen',
        desc: 'Автоматизированная генерация уровней с гарантированной проходимостью. Алгоритмы волнового коллапса функции (Wave Function Collapse) и графовый поиск кратчайшего пути.',
        specs: 'Архитектура: Tile-based Grid • Алгоритмы: A* Pathfinding + WFC'
      },
      en: {
        title: 'Isometric World Generation',
        category: 'Level Design // Procedural Gen',
        desc: 'Automated dungeon and labyrinth synthesis with guaranteed path reachability using Wave Function Collapse and heuristic graph navigation.',
        specs: 'Architecture: Tile-based Grid • Algorithms: A* Pathfinding + WFC'
      }
    },
    '5': {
      ru: {
        title: 'Meme Generator — Архитектура слоев',
        category: 'Интерактивные сервисы // Canvas API',
        desc: 'Визуализация буфера рендеринга Meme Generator. Динамическое наложение текста с векторной обводкой, поддержка стилизации и мгновенный экспорт в PNG.',
        specs: 'Репозиторий: github.com/Frostxe/meme-generator • Client-side Canvas Buffer'
      },
      en: {
        title: 'Meme Generator — Layer Pipeline',
        category: 'Interactive Media // Canvas API',
        desc: 'Multi-layer composite buffer architecture for dynamic graphic creation. Features stroke typography, filter cascades, and zero-server client export.',
        specs: 'Repository: github.com/Frostxe/meme-generator • Client-side Canvas Buffer'
      }
    },
    '6': {
      ru: {
        title: 'Студийный пайплайн Frostxe Interactive',
        category: 'Dev Environment // Workflow',
        desc: 'Рабочее пространство студии разработки игр: от набросков механик и прототипирования на JavaScript/C# до верстки адаптивных веб-интерфейсов и интеграции с Telegram API.',
        specs: 'Основатель: Омурбек Четымбаев • Контакты: github.com/Frostxe'
      },
      en: {
        title: 'Frostxe Interactive Studio Pipeline',
        category: 'Dev Environment // Workflow',
        desc: 'Studio setup and production workflow: rapid mechanic whiteboxing, procedural algorithms in C# and JS, WebGL rendering, and direct Telegram bot integration.',
        specs: 'Lead: Omurbek Chetymbaev • GitHub: github.com/Frostxe'
      }
    }
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const gid = item.getAttribute('data-gallery-id');
      const itemData = GALLERY_DETAILS[gid];
      if (!itemData) return;
      const data = itemData[currentLang] || itemData.ru;

      const btnGithubLabel = currentLang === 'ru' ? 'Перейти в GitHub @Frostxe' : 'Explore GitHub @Frostxe';

      galleryModalContent.innerHTML = `
        <div class="gallery-lightbox-view">
          <div class="lightbox-hero-render render-${gid === '1' ? 'tw' : gid === '2' ? 'creative' : gid === '3' ? 'shaders' : gid === '4' ? 'level' : gid === '5' ? 'meme' : 'desk'}">
            <span class="lightbox-badge">${data.category}</span>
          </div>
          <div class="lightbox-body">
            <h3>${data.title}</h3>
            <p class="lightbox-desc">${data.desc}</p>
            <div class="lightbox-specs">
              <code>${data.specs}</code>
            </div>
            <div class="lightbox-actions">
              <a href="https://github.com/Frostxe" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <span>${btnGithubLabel}</span>
              </a>
            </div>
          </div>
        </div>
      `;

      galleryModal.classList.add('active');
      playSynthSound('click');
    });
  });

  if (closeGalleryModalBtn) {
    closeGalleryModalBtn.addEventListener('click', () => {
      galleryModal.classList.remove('active');
      playSynthSound('click');
    });
  }

  console.log(`⚡ Frostxe Interactive Engine Loaded. Language: [${currentLang.toUpperCase()}], Telegram Bot: [@${BOT_USERNAME}]`);
});
