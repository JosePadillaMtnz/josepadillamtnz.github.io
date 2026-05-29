// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
html.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ─────────────────────────────────────────────
// LANGUAGE — reads ?lang=en or localStorage
// ─────────────────────────────────────────────
const LANG = localStorage.getItem('lang') || new URLSearchParams(location.search).get('lang') || 'es';

// Language toggle button
const langToggle = document.getElementById('langToggle');
langToggle.textContent = LANG === 'es' ? 'EN' : 'ES';   // show the OTHER language (what you'll switch to)
langToggle.addEventListener('click', () => {
  const next = LANG === 'es' ? 'en' : 'es';
  localStorage.setItem('lang', next);
  location.reload();
});

function t(obj) {
  // Helper: resolve a translatable field {es:"...", en:"..."}
  return (obj && obj[LANG]) ? obj[LANG] : (obj && obj['es']) ? obj['es'] : (obj || '');
}

// ─────────────────────────────────────────────
// NAV SCROLL + HAMBURGER
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

document.getElementById('hamburger').addEventListener('click', () => {
  const isOpen = document.getElementById('mobileMenu').classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
});

// ─────────────────────────────────────────────
// REVEAL ON SCROLL
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
    setTimeout(() => e.target.classList.add('visible'), siblings.indexOf(e.target) * 80);
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

// ─────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────
const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  kaggle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>`,
};

// ─────────────────────────────────────────────
// SKILLS (tech stack)
// ─────────────────────────────────────────────
const SKILLS = [
  { icon: '🧠', title: 'AI / ML', pills: ['PyTorch', 'TensorFlow', 'ONNX', 'TensorRT', 'OpenVINO', 'scikit-learn', 'Keras', 'XGBoost'] },
  { icon: '👁️', title: 'Visión Artificial', pills: ['OpenCV', 'YOLO', 'CNN', 'MobileNetV2', 'Transfer Learning', 'Segmentación', 'Clasificación'] },
  { icon: '📊', title: 'Data Science', pills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'EDA', 'Big Data', 'Data Engineering'] },
  { icon: '🤖', title: 'Agentes & LLMs', pills: ['Google ADK', 'Gemini', 'Multi-agent Systems', 'Agent-based Modeling', 'RAG', 'Tool calling'] },
  { icon: '🛠️', title: 'Backend & DevOps', pills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'MySQL', 'SQL', 'Linux', 'Bash', 'Git'] },
  { icon: '☁️', title: 'Otros', pills: ['Cloud Computing', 'R&D', 'Java', 'JavaScript', 'IoT', 'Redes y Telemática', 'SDN'] },
];

// ─────────────────────────────────────────────
// PROJECT CATEGORIES
// ─────────────────────────────────────────────
const PROJ_CATEGORIES = [
  { id: 'all', es: '✦ Todos', en: '✦ All' },
  { id: 'agents', es: '🤖 Agentes', en: '🤖 Agents' },
  { id: 'cv', es: '👁️ Visión Artificial', en: '👁️ Computer Vision' },
  { id: 'ml', es: '📊 Machine Learning', en: '📊 Machine Learning' },
  { id: 'apps', es: '📱 Aplicaciones', en: '📱 Applications' },
  { id: 'web', es: '🌐 Web', en: '🌐 Web' },
];

// ─────────────────────────────────────────────
// LOAD ALL DATA
// ─────────────────────────────────────────────
Promise.all([
  fetch('data/ui.json').then(r => r.json()),
  fetch('data/profile.json').then(r => r.json()),
  fetch('data/experience.json').then(r => r.json()),
  fetch('data/projects.json').then(r => r.json()),
  fetch('data/notes.json').then(r => r.json()),
]).then(([ui, profile, experience, projects, notes]) => {
  const s = ui[LANG] || ui['es'];   // active strings

  applyUI(s, profile);
  renderProfile(s, profile);
  renderExperience(s, experience);
  renderProjects(s, projects, 'all');
  renderNotes(s, notes, 'all');
  renderSkills(s);
  renderContact(s, profile);
  initExperienceTabs(s);
  initProjectFilters(s, projects);
  initNotesFilters(s, notes);
  observeReveal();
}).catch(err => console.error('Error cargando datos:', err));

// ─────────────────────────────────────────────
// APPLY UI STRINGS
// ─────────────────────────────────────────────
function applyUI(s, profile) {
  // Aria
  themeToggle.setAttribute('aria-label', s.aria.theme_toggle);
  document.getElementById('hamburger').setAttribute('aria-label', s.aria.open_menu);

  // Nav logo
  document.getElementById('navLogo').textContent = s.nav.logo;
  document.getElementById('navCnn').textContent = s.nav.cnn;
  const mobileNavCnn = document.getElementById('mobileNavCnn');
  if (mobileNavCnn) mobileNavCnn.textContent = s.nav.cnn;
  const navLlm = document.getElementById('navLlm');
  if (navLlm) navLlm.textContent = s.nav.llm;
  const mobileNavLlm = document.getElementById('mobileNavLlm');
  if (mobileNavLlm) mobileNavLlm.textContent = s.nav.llm;
  const navPlayground = document.getElementById('navPlayground');
  if (navPlayground) navPlayground.textContent = s.nav.playground;
  const mobileNavPlayground = document.getElementById('mobileNavPlayground');
  if (mobileNavPlayground) mobileNavPlayground.textContent = s.nav.playground;
  // Nav page links
  document.querySelectorAll('[data-nav]').forEach(el => {
    const key = el.dataset.nav;
    const text = (s.nav[key] || s.subnav?.[key] || '');
    if (text) el.textContent = text;
  });

  // Nav buttons in about section
  const ptabDefs = [
    { id: 'ptabExp', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>', label: s.nav.experience },
    { id: 'ptabProjects', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>', label: s.nav.projects },
    { id: 'ptabNotes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', label: s.subnav.notes },
  ];
  ptabDefs.forEach(({ id, icon, label }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = icon + ' ' + label;
  });

  // About

  // Experience section header
  document.getElementById('expLabel').textContent = s.experience.label;
  document.getElementById('expTitle').textContent = s.experience.title;
  document.getElementById('expSubtitle').textContent = s.experience.subtitle;

  // Projects section header
  document.getElementById('projLabel').textContent = s.projects.label;
  document.getElementById('projTitle').textContent = s.projects.title;
  document.getElementById('projSubtitle').textContent = s.projects.subtitle;

  // Notes section header
  document.getElementById('notesLabel').textContent = s.notes.label;
  document.getElementById('notesTitle').textContent = s.notes.title;
  document.getElementById('notesSubtitle').textContent = s.notes.subtitle;

  // Contact
  document.getElementById('contactLabel').textContent = s.contact.label;
  document.getElementById('contactTitle').textContent = s.contact.title;
  document.getElementById('contactBody').textContent = s.contact.body;

  // Footer
  const name = profile.name;
  const gh = profile.social.github;
  document.getElementById('footerText').innerHTML =
    `${s.footer.made_by} <strong>${name}</strong>`;
  const fl = document.getElementById('footerLink');
  fl.href = gh;
  fl.textContent = '@' + gh.split('/').pop();
}

// ─────────────────────────────────────────────
// RENDER: PROFILE
// ─────────────────────────────────────────────
function renderProfile(s, p) {
  // Header
  document.getElementById('heroGreeting').textContent = s.hero.greeting;
  document.getElementById('heroName').textContent = p.name;
  document.getElementById('heroSubtitle').innerHTML = `<strong>${t(p.title)}</strong> · ${t(p.subtitle)}`;

  // Tagline (from profile.json)
  document.getElementById('aboutTagline').textContent = t(p.tagline) || '';

  // Avatar (cartoon + real crossfade)
  const avatar = document.getElementById('aboutAvatar');
  avatar.src = p.avatar;
  avatar.alt = p.name;
  const avatarReal = document.getElementById('aboutAvatarReal');
  if (avatarReal && p.avatar_real) {
    avatarReal.src = p.avatar_real;
    avatarReal.alt = p.name;
  }
  // Tap toggle for mobile
  const avatarWrap = document.getElementById('aboutAvatarWrap');
  if (avatarWrap) {
    avatarWrap.addEventListener('click', () => avatarWrap.classList.toggle('reveal-real'));
  }

  // Stats
  document.getElementById('aboutStats').innerHTML = p.stats
    .map(st => `
      <div class="stat-card${st.wide ? ' wide' : ''}">
        <div class="stat-value">${t(st.value) || st.value}</div>
        <div class="stat-label">${t(st.label) || st.label}</div>
      </div>`).join('');

  // Socials (below stats, includes email)
  const socialsMap = [
    { key: 'github', icon: ICONS.github, href: p.social.github },
    { key: 'linkedin', icon: ICONS.linkedin, href: p.social.linkedin },
    { key: 'kaggle', icon: ICONS.kaggle, href: p.social.kaggle },
    { key: 'email', icon: ICONS.email, href: p.social.email ? `mailto:${p.social.email}` : null },
  ];
  document.getElementById('aboutSocials').innerHTML = socialsMap
    .filter(sc => sc.href)
    .map(sc => `
      <a href="${sc.href}" target="_blank" rel="noopener" class="social-link">
        ${sc.icon} ${s.socials[sc.key] || sc.key}
      </a>`).join('');

  // Bio
  const bioArr = Array.isArray(p.bio) ? p.bio : (p.bio[LANG] || p.bio.es || []);
  document.getElementById('aboutBio').innerHTML = bioArr
    .map(para => `<p>${para}</p>`).join('');

  // Tags
  const tagsArr = Array.isArray(p.tags) ? p.tags : (p.tags[LANG] || p.tags.es || []);
  document.getElementById('aboutTags').innerHTML = tagsArr
    .map(tag => `<span class="tag">${tag}</span>`).join('');
}

// ─────────────────────────────────────────────
// RENDER: EXPERIENCE TIMELINE
// ─────────────────────────────────────────────
function renderExperience(s, exp) {
  renderTimeline('panel-academic', exp.academic, 'academic', s);
  renderTimeline('panel-professional', exp.professional, 'professional', s);
  renderTimeline('panel-training', exp.training, 'training', s);
}

function renderTimeline(containerId, entries, type, s) {
  const container = document.getElementById(containerId);
  if (!entries || !entries.length) {
    container.innerHTML = `<p style="color:var(--text-muted);padding:32px 0;">${s.experience.empty}</p>`;
    return;
  }
  container.innerHTML = entries.map((e, i) => `
    <div class="tl-entry reveal">
      <div class="tl-left">
        <div class="tl-dot"></div>
        ${i < entries.length - 1 ? '<div class="tl-line"></div>' : ''}
      </div>
      <div class="tl-card">
        <div class="tl-header" onclick="toggleEntry(this)">
          <div class="tl-header-left">
            <span class="tl-period">${t(e.period) || e.period}</span>
            <h3 class="tl-title">${t(e.title)}</h3>
            <span class="tl-sub">${e.institution || e.company || e.provider || ''}</span>
          </div>
          <div class="tl-chevron">${ICONS.chevron}</div>
        </div>
        <p class="tl-short">${t(e.shortDesc)}</p>
        <div class="tl-detail" style="display:none;">
          ${buildDetail(e, type, s)}
        </div>
      </div>
    </div>`).join('');
}

function buildDetail(e, type, s) {
  const d = s.experience.detail;
  let html = '';

  // Badge (specialty / type / provider)
  const specialty = t(e.specialty) || e.specialty || '';
  const entryType = t(e.type) || e.type || '';
  const badge = specialty || (entryType ? `${entryType}${e.location ? ' · ' + e.location : ''}` : '') || e.provider || '';
  if (badge) html += `<div class="tl-detail-badge">${badge}</div>`;

  // Description
  const descText = t(e.description) || e.description || '';
  if (descText && !descText.startsWith('TODO')) {
    html += `<div class="tl-detail-section">
      <h4>${d.personal_exp}</h4>
      <p>${descText.replace(/\n/g, '<br>')}</p>
    </div>`;
  }

  // Learned
  const learnedText = t(e.learned) || e.learned || '';
  if (learnedText && !learnedText.startsWith('TODO')) {
    html += `<div class="tl-detail-section">
      <h4>${d.learned}</h4>
      <p>${learnedText.replace(/\n/g, '<br>')}</p>
    </div>`;
  }

  // Tech pills
  if (e.tech && e.tech.length) {
    html += `<div class="tl-tech">${e.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>`;
  }

  // Document / certificate button
  if (e.document) {
    html += `<a href="${e.document}" target="_blank" class="tl-doc-btn">${ICONS.pdf} ${d.view_document}</a>`;
  }
  if (e.certificate) {
    html += `<a href="${e.certificate}" target="_blank" class="tl-doc-btn">${ICONS.pdf} ${d.view_cert}</a>`;
  }
  if (e.recommendation) {
    html += `<a href="${e.recommendation}" target="_blank" class="tl-doc-btn">${ICONS.pdf} ${d.view_recommendation}</a>`;
  }

  return html || `<p style="color:var(--text-muted);font-size:0.9rem;">Próximamente.</p>`;
}

function toggleEntry(header) {
  const card = header.closest('.tl-card');
  const detail = card.querySelector('.tl-detail');
  const isOpen = card.classList.contains('open');

  card.closest('.exp-panel').querySelectorAll('.tl-card.open').forEach(c => {
    c.classList.remove('open');
    c.querySelector('.tl-detail').style.display = 'none';
  });

  if (!isOpen) {
    card.classList.add('open');
    detail.style.display = 'block';
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
}

// ─────────────────────────────────────────────
// RENDER: SKILLS
// ─────────────────────────────────────────────
function renderSkills() {
  document.getElementById('skillsGrid').innerHTML = SKILLS.map(cat => `
    <div class="skill-category reveal">
      <div class="skill-cat-icon">${cat.icon}</div>
      <div class="skill-cat-title">${cat.title}</div>
      <div class="skill-pills">
        ${cat.pills.map(p => `<span class="skill-pill">${p}</span>`).join('')}
      </div>
    </div>`).join('');
}

// ─────────────────────────────────────────────
// RENDER: PROJECTS
// ─────────────────────────────────────────────
function renderProjects(s, projects, filter) {
  const visible = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  document.getElementById('projectsGrid').innerHTML = visible.map(p => `
    <div class="project-card ${p.featured ? 'featured' : ''} reveal">
      <div class="project-header">
        <div class="project-icon">${p.icon}</div>
        <div class="project-header-right">
          ${p.featured ? `<span class="featured-badge">${s.projects.featured}</span>` : ''}
          <div class="project-links">
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="project-link" title="GitHub">${ICONS.github}</a>` : ''}
            ${p.demo ? `<a href="${p.demo}"   target="_blank" rel="noopener" class="project-link" title="Demo">${ICONS.external}</a>` : ''}
          </div>
        </div>
      </div>
      <span class="proj-category-label">${t(p.categoryLabel)}</span>
      <h3 class="project-name">${t(p.name)}</h3>
      <p class="project-description">${t(p.description)}</p>
      <div class="project-tech">${p.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}</div>
      ${p.period ? `<div class="proj-period">${typeof p.period === 'object' ? t(p.period) : p.period}</div>` : ''}
    </div>`).join('');
  observeReveal();
}

function initProjectFilters(s, projects) {
  document.getElementById('projectFilters').innerHTML = PROJ_CATEGORIES.map(c => `
    <button class="filter-pill ${c.id === 'all' ? 'active' : ''}" data-filter="${c.id}">
      ${t(c)}
    </button>`).join('');

  document.getElementById('projectFilters').addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    document.querySelectorAll('#projectFilters .filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderProjects(s, projects, pill.dataset.filter);
  });
}

// ─────────────────────────────────────────────
// RENDER: NOTES
// ─────────────────────────────────────────────
const NOTE_COLORS = {
  all: '249,115,22',
  hitos: '245,158,11',
  academico: '239,68,68',
  profesional: '6,182,212',
  formacion: '59,130,246',
  proyectos: '16,185,129',
  reflexiones: '168,85,247',
  curiosidades: '236,72,153',
};

function noteColor(note, activeFilter) {
  if (activeFilter !== 'all') return NOTE_COLORS[activeFilter] || NOTE_COLORS.all;
  const cat = note.categories?.[0];
  return NOTE_COLORS[cat] || NOTE_COLORS.all;
}

function dotStyle(note) {
  const cats = note.categories || [];
  const c1 = NOTE_COLORS[cats[0]] || NOTE_COLORS.all;
  const c2 = cats[1] ? (NOTE_COLORS[cats[1]] || NOTE_COLORS.all) : null;
  if (c2) {
    return `--dot-color:${c1}; background: linear-gradient(135deg, rgb(${c1}) 50%, rgb(${c2}) 50%);`;
  }
  return `--dot-color:${c1};`;
}

// Notes pagination state
let _notesCtx = { s: null, notes: null, filter: 'all', page: 0, sorted: [] };
const NOTES_PER_PAGE = 5;

function renderNotesTimeline(sorted, filter, allEntries) {
  const container = document.getElementById('notesTimeline');
  if (!container) return;
  if (!sorted.length) { container.innerHTML = ''; return; }

  const toNum = d => { const [y, m] = d.split('-').map(Number); return y * 12 + m; };

  // Range always covers full history regardless of active filter
  const allNums = allEntries.map(n => toNum(n.dateSort));
  const minN = Math.min(...allNums);
  const maxN = Math.max(...allNums);
  const range = maxN - minN || 1;

  const minYear = allEntries.reduce((a, b) => a.dateSort < b.dateSort ? a : b).dateSort.slice(0, 4);
  const maxYear = allEntries.reduce((a, b) => a.dateSort > b.dateSort ? a : b).dateSort.slice(0, 4);

  const dots = sorted.map((note, feedIdx) => {
    const pct = ((toNum(note.dateSort) - minN) / range * 100).toFixed(1);
    const title = t(note.title);
    const date = t(note.date);
    const edge = pct < 12 ? 'ntl-left' : pct > 88 ? 'ntl-right' : '';
    return `<div class="ntl-dot ${edge}" style="left:${pct}%;${dotStyle(note)}" data-idx="${feedIdx}">
      <div class="ntl-tip">
        <span class="ntl-tip-title">${title}</span>
        <span class="ntl-tip-date">${date}</span>
      </div>
    </div>`;
  }).join('');

  // Vertical version: group by year descending
  const byYear = {};
  sorted.forEach((note, feedIdx) => {
    const year = note.dateSort.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push({ note, feedIdx });
  });
  const verticalHTML = Object.keys(byYear).sort((a, b) => b - a).map(year => {
    const items = byYear[year].map(({ note, feedIdx }) =>
      `<div class="ntlv-item" data-idx="${feedIdx}">
        <div class="ntlv-dot" style="${dotStyle(note)}"></div>
        <div class="ntlv-content">
          <span class="ntlv-title">${t(note.title)}</span>
          <span class="ntlv-date">${t(note.date)}</span>
        </div>
      </div>`
    ).join('');
    return `<div class="ntlv-group"><div class="ntlv-year">${year}</div>${items}</div>`;
  }).join('');

  container.innerHTML = `
    <div class="ntl-horizontal">
      <div class="ntl-track"><div class="ntl-axis"></div>${dots}</div>
      <div class="ntl-years"><span>${minYear}</span><span>${maxYear}</span></div>
    </div>
    <div class="ntl-vertical">
      <button class="ntlv-toggle" aria-expanded="false">
        <span>${LANG === 'en' ? 'Notes index' : 'Índice de notas'}</span>
        ${ICONS.chevron}
      </button>
      <div class="ntlv-body">${verticalHTML}</div>
    </div>`;

  const ntlvToggle = container.querySelector('.ntlv-toggle');
  const ntlvBody = container.querySelector('.ntlv-body');
  ntlvToggle?.addEventListener('click', () => {
    const expanded = ntlvToggle.getAttribute('aria-expanded') === 'true';
    ntlvToggle.setAttribute('aria-expanded', String(!expanded));
    ntlvBody.classList.toggle('open');
  });

  container.querySelectorAll('[data-idx]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.classList.contains('ntl-dot')) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && !el.classList.contains('tapped')) {
          container.querySelectorAll('.ntl-dot.tapped').forEach(d => d.classList.remove('tapped'));
          el.classList.add('tapped');
          e.stopPropagation();
          return;
        }
      }
      const globalIdx = parseInt(el.dataset.idx);
      const targetPage = Math.floor(globalIdx / NOTES_PER_PAGE);
      if (targetPage !== _notesCtx.page) {
        const { s, notes, filter } = _notesCtx;
        renderNotes(s, notes, filter, targetPage);
        setTimeout(() => {
          const art = document.getElementById(`note-entry-${globalIdx}`);
          if (!art) return;
          art.querySelector('.thread-content')?.classList.remove('collapsed');
          const navH = document.getElementById('navbar')?.offsetHeight || 64;
          window.scrollTo({ top: art.getBoundingClientRect().top + scrollY - navH - 12, behavior: 'smooth' });
        }, 50);
      } else {
        const article = document.getElementById(`note-entry-${globalIdx}`);
        if (!article) return;
        article.querySelector('.thread-content')?.classList.remove('collapsed');
        if (el.classList.contains('ntlv-item')) {
          const navH = document.getElementById('navbar')?.offsetHeight || 64;
          const top = article.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        } else {
          article.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  if (!window._ntlDocListenerAdded) {
    window._ntlDocListenerAdded = true;
    document.addEventListener('click', () => {
      document.querySelectorAll('.ntl-dot.tapped').forEach(d => d.classList.remove('tapped'));
    });
  }
}

function renderNotes(s, notes, filter, page) {
  if (page === undefined) page = 0;

  const entries = filter === 'all'
    ? notes.entries
    : notes.entries.filter(n => n.categories && n.categories.includes(filter));

  const sorted = [...entries].sort((a, b) => b.dateSort.localeCompare(a.dateSort));
  _notesCtx = { s, notes, filter, page, sorted };

  const totalPages = Math.ceil(sorted.length / NOTES_PER_PAGE);
  const pageEntries = sorted.slice(page * NOTES_PER_PAGE, (page + 1) * NOTES_PER_PAGE);

  const feed = document.getElementById('notesFeed');
  feed.innerHTML = pageEntries.length
    ? pageEntries.map((note, i) => {
      const globalIdx = page * NOTES_PER_PAGE + i;
      return `
        <article class="thread-entry reveal" id="note-entry-${globalIdx}">
          <div class="thread-left">
            <div class="thread-dot" style="${dotStyle(note)}"></div>
            ${i < pageEntries.length - 1 ? '<div class="thread-line thread-visible"></div>' : ''}
          </div>
          <div class="thread-content collapsed">
            <div class="thread-meta">
              <span class="thread-date">${t(note.date)}</span>
              <span class="thread-chevron" aria-hidden="true"></span>
            </div>
            <h3 class="thread-title">${t(note.title)}</h3>
            <p class="thread-body">${t(note.body)}</p>
            ${note.image ? `<img src="${note.image}" alt="" class="note-image" />` : ''}
            <div class="thread-footer">
              ${(Array.isArray(note.tags) ? note.tags : (note.tags[LANG] || note.tags.es || [])).map(tg => `<span class="thread-tag-pill">${tg}</span>`).join('')}
              ${note.links.map(l => `
                <a href="${l.url}" target="_blank" rel="noopener" class="thread-link">
                  ${ICONS.external}
                  ${typeof l.label === 'object' ? t(l.label) : l.label}
                </a>`).join('')}
            </div>
          </div>
        </article>`;
    }).join('')
    : `<p style="color:var(--text-muted);text-align:center;padding:40px 0;">${LANG === 'en' ? 'No notes in this category.' : 'Sin notas en esta categoría.'}</p>`;

  feed.querySelectorAll('.thread-content').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      card.classList.toggle('collapsed');
    });
  });

  document.getElementById('notesPagination')?.remove();
  if (totalPages > 1) {
    const pag = document.createElement('div');
    pag.id = 'notesPagination';
    pag.className = 'notes-pagination';
    const firstLabel = LANG === 'en' ? '«' : '«';
    const prevLabel  = LANG === 'en' ? 'Prev' : 'Anterior';
    const nextLabel  = LANG === 'en' ? 'Next' : 'Siguiente';
    const lastLabel  = LANG === 'en' ? '»' : '»';
    pag.innerHTML = `
      <button class="notes-page-btn notes-page-edge" ${page === 0 ? 'disabled' : ''} data-page="0">${firstLabel}</button>
      <button class="notes-page-btn" ${page === 0 ? 'disabled' : ''} data-page="${page - 1}">${prevLabel}</button>
      <span class="notes-page-info">${page + 1} / ${totalPages}</span>
      <button class="notes-page-btn" ${page >= totalPages - 1 ? 'disabled' : ''} data-page="${page + 1}">${nextLabel}</button>
      <button class="notes-page-btn notes-page-edge" ${page >= totalPages - 1 ? 'disabled' : ''} data-page="${totalPages - 1}">${lastLabel}</button>
    `;
    pag.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newPage = parseInt(btn.dataset.page);
        renderNotes(s, notes, filter, newPage);
        const navH = document.getElementById('navbar')?.offsetHeight || 64;
        const notesEl = document.getElementById('notas');
        window.scrollTo({ top: notesEl.getBoundingClientRect().top + scrollY - navH - 16, behavior: 'smooth' });
      });
    });
    feed.after(pag);
  }

  renderNotesTimeline(sorted, filter, notes.entries);
  observeReveal();
}

function initNotesFilters(s, notes) {
  document.getElementById('notesFilters').innerHTML = notes.categories.map(c => {
    const color = NOTE_COLORS[c.id] || NOTE_COLORS.all;
    return `<button class="filter-pill ${c.id === 'all' ? 'active' : ''}" data-filter="${c.id}" style="--pill-color:${color}">
      ${t(c)}
    </button>`;
  }).join('');

  document.getElementById('notesFilters').addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    document.querySelectorAll('#notesFilters .filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderNotes(s, notes, pill.dataset.filter, 0);
  });
}

// ─────────────────────────────────────────────
// RENDER: CONTACT
// ─────────────────────────────────────────────
function renderContact(s, p) {
  document.getElementById('contactActions').innerHTML = `
    <a href="mailto:${p.social.email}" class="btn btn-primary">
      ${ICONS.email} ${s.contact.btn_email}
    </a>
    <a href="${p.social.linkedin}" target="_blank" rel="noopener" class="btn btn-linkedin">
      ${ICONS.linkedin} ${s.contact.btn_linkedin}
    </a>`;
}

// ─────────────────────────────────────────────
// EXPERIENCE TABS
// ─────────────────────────────────────────────
function initExperienceTabs(s) {
  const tabs = [
    { key: 'academic', label: s.experience.tabs.academic },
    { key: 'professional', label: s.experience.tabs.professional },
    { key: 'training', label: s.experience.tabs.training },
    { key: 'stack', label: s.experience.tabs.stack },
  ];

  document.getElementById('expTabs').innerHTML = tabs.map((tab, i) => `
    <button class="exp-tab ${i === 0 ? 'active' : ''}" data-tab="${tab.key}">
      ${tab.label}
    </button>`).join('');

  document.getElementById('expTabs').addEventListener('click', e => {
    const btn = e.target.closest('.exp-tab');
    if (!btn) return;
    document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
    observeReveal();
  });
}



// ─────────────────────────────────────────────
// VISITOR COUNTER
// ─────────────────────────────────────────────
(function () {
  fetch('https://api.counterapi.dev/v1/josepadillamtnz/portfolio/up')
    .then(r => r.json())
    .then(d => {
      const el = document.getElementById('visitorCount');
      if (!el || !d.count) return;
      const locale = LANG === 'en' ? 'en-GB' : 'es-ES';
      const label = LANG === 'en' ? 'visits' : 'visitas';
      el.textContent = ' · ' + d.count.toLocaleString(locale) + ' ' + label;
    })
    .catch(() => { });
})();
