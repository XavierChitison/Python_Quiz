import { problems, levels, levelTopics } from './data/curriculum.js';
import { progressSnapshot, saveProgress } from './services/storage.js';
import { createIcons, icons } from 'lucide';

const nav = [
  { group: 'Overview', items: [
    ['dashboard','LayoutDashboard','Dashboard'], ['roadmap','Map','Learning Roadmap'], ['daily','Flame','Daily Challenge']
  ]},
  { group: 'Practice', items: [
    ['problems','Code2','Problem Library'], ['generator','Sparkles','Generate Problem'], ['interview','Timer','Interview Practice'],
    ['debugging','Bug','Debugging Challenges'], ['prediction','BrainCircuit','Code Prediction'], ['playground','TerminalSquare','Python Playground']
  ]},
  { group: 'Learning', items: [
    ['lessons','BookOpen','Python Lessons'], ['guided','Route','Guided Learning'], ['review','RotateCcw','Review Practice'], ['mistakes','NotebookTabs','Mistake Notebook']
  ]},
  { group: 'Progress', items: [
    ['analytics','ChartNoAxesCombined','Analytics'], ['history','History','Submission History'], ['achievements','Award','Achievements']
  ]},
  { group: 'Preferences', items: [['settings','Settings','Settings'], ['help','CircleHelp','Help and Documentation'], ['about','Info','About']] }
];

export class App {
  constructor(root) {
    this.root = root;
    this.progress = progressSnapshot();
    this.progress.profile ||= { name: 'Learner', level: 1, xp: 0, streak: 0 };
    this.progress.profile.started ||= false;
    this.progress.solved ||= [];
    this.progress.submissions ||= [];
    this.progress.settings ||= { theme: 'dark', defaultFormat: 'stdin', fontSize: 14 };
    this.state = { sidebarCollapsed: false, route: this.getRoute() };
    this.renderShell();
    this.renderRoute();
    window.addEventListener('hashchange', () => {
      this.state.route = this.getRoute();
      this.renderShell();
      this.renderRoute();
    });
  }

  getRoute() {
    return location.hash.slice(1).split('/')[0] || 'dashboard';
  }

  renderShell() {
    const routeTitle = nav.flatMap(g => g.items).find(i => i[0] === this.state.route)?.[2] || 'Dashboard';
    this.root.innerHTML = `
      <div class="app-shell ${this.state.sidebarCollapsed ? 'sidebar-collapsed' : ''}">
        <aside class="sidebar" aria-label="Primary navigation">
          <a class="brand" href="#dashboard" aria-label="XPC - Xavier's Python Challenge dashboard">
            <img class="brand-logo" src="./xpc-logo.svg" alt="" />
            <span class="brand-name">XPC</span>
          </a>
          <nav class="nav-scroll">
            ${nav.map(group => `<div class="nav-group"><div class="nav-label">${group.group}</div>${group.items.map(item => `
              <a class="nav-item ${this.state.route === item[0] ? 'active' : ''}" href="#${item[0]}" ${this.state.route === item[0] ? 'aria-current="page"' : ''}>
                <i data-lucide="${item[1]}"></i><span>${item[2]}</span>
              </a>`).join('')}</div>`).join('')}
          </nav>
          <div class="sidebar-progress">
            <div class="progress-row"><span>Level ${this.progress.profile.level}</span><span>${this.progress.profile.xp} XP</span></div>
            <div class="progress-track"><span style="width:${Math.min(100, this.progress.profile.level)}%"></span></div>
          </div>
        </aside>
        <div class="app-main">
          <header class="topbar">
            <button class="icon-button sidebar-toggle" id="sidebar-toggle" aria-label="Collapse sidebar"><i data-lucide="PanelLeft"></i></button>
            <div class="breadcrumb">${routeTitle}</div>
            <label class="global-search"><i data-lucide="Search"></i><input id="global-search" type="search" placeholder="Search problems..." aria-label="Search problems"></label>
            <div class="top-actions">
              <span class="level-pill">Level ${this.progress.profile.level}</span>
              <span class="xp-pill">${this.progress.profile.xp} XP</span>
              <button class="icon-button" id="theme-toggle" aria-label="Toggle theme"><i data-lucide="${this.progress.settings.theme === 'dark' ? 'Sun' : 'Moon'}"></i></button>
              <button class="icon-button" id="share-site" aria-label="Share Xavier's Python Challenge" title="Share website"><i data-lucide="Share2"></i></button>
              <button class="avatar" id="profile-button" aria-label="Open profile">${(this.progress.profile.name || 'L')[0].toUpperCase()}</button>
            </div>
          </header>
          <main id="main-content" tabindex="-1"></main>
          <footer class="app-footer">
            <div><strong>Xavier's Python Challenge</strong><span>Start Simple. Think Better. Code Confidently.</span></div>
            <div><span>Created by Xavier Chitison.</span><a href="#about">About</a><a href="#help">Help</a><a href="#privacy">Privacy</a><a href="#help">Keyboard shortcuts</a></div>
          </footer>
        </div>
      </div>`;
    this.bindShell();
  }

  bindShell() {
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
      this.root.querySelector('.app-shell').classList.toggle('sidebar-collapsed', this.state.sidebarCollapsed);
    });
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
    document.getElementById('profile-button')?.addEventListener('click', () => location.hash = 'settings');
    document.getElementById('share-site')?.addEventListener('click', () => this.shareSite());
    document.getElementById('global-search')?.addEventListener('keydown', event => {
      if (event.key === 'Enter') location.hash = `problems?q=${encodeURIComponent(event.currentTarget.value)}`;
    });
  }

  toggleTheme() {
    this.progress.settings.theme = this.progress.settings.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = this.progress.settings.theme;
    saveProgress(this.progress);
    this.renderShell();
    this.renderRoute();
  }

  async shareSite() {
    const url = location.origin + location.pathname;
    const shareData = {title:"Xavier's Python Challenge", text:'Practice Python completely free.', url};
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(url);
      this.notify(navigator.share ? 'Share menu opened.' : 'Website link copied.');
    } catch (error) {
      if (error?.name !== 'AbortError') this.notify('Could not share the website.');
    }
  }

  notify(message) {
    const notification = document.createElement('div');
    notification.className = 'toast';
    notification.setAttribute('role','status');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  async renderRoute() {
    document.documentElement.dataset.theme = this.progress.settings.theme || 'dark';
    const main = document.getElementById('main-content');
    if (!main) return;
    const route = location.hash.slice(1).split('?')[0];
    if (route.startsWith('workspace')) {
      const id = route.split('/')[1];
      const { WorkspacePage } = await import('./pages/workspace/workspace.js');
      main.innerHTML = await WorkspacePage(id, problems, this.progress);
      this.bindProblemPage(id);
      return;
    }
    const pages = {
      dashboard: () => this.dashboard(),
      roadmap: () => this.roadmap(),
      problems: () => this.problemLibrary(),
      daily: () => this.dailyChallenge(),
      generator: () => this.generator(),
      interview: () => this.interview(),
      debugging: () => this.debugging(),
      prediction: () => this.prediction(),
      playground: () => this.playground(),
      lessons: () => this.lessons(),
      guided: () => this.guided(),
      review: () => this.review(),
      mistakes: () => this.mistakes(),
      analytics: () => this.analytics(),
      history: () => this.history(),
      achievements: () => this.achievements(),
      settings: () => this.settings(),
      help: () => this.help(),
      about: () => this.about(),
      privacy: () => this.privacy()
    };
    main.innerHTML = (pages[route] || pages.dashboard)();
    this.refreshIcons();
    this.bindProblemPage();
    if (route === 'playground') this.initPlayground();
  }

  refreshIcons() {
    try { createIcons({ icons }); } catch {}
  }

  dashboard() {
    const solved = this.progress.solved.length;
    const accuracy = this.progress.submissions.length ? Math.round(this.progress.submissions.filter(s => s.accepted).length / this.progress.submissions.length * 100) : 0;
    const level = this.progress.profile.level;
    const current = levels[level - 1];
    const onboarding = !this.progress.profile.started ? `<section class="card onboarding-card"><div><p class="eyebrow">GET STARTED</p><h2>Personalize your learning</h2><p>Choose an experience level and a primary goal. All fields are optional.</p></div><form id="onboarding-form" class="onboarding-form"><label>Name<input name="name" maxlength="40" value="${this.escape(this.progress.profile.name==='Learner'?'':this.progress.profile.name)}" placeholder="Optional display name"></label><label>Experience<select name="experience"><option>Completely new to Python</option><option>Know basic syntax</option><option>Comfortable with basic Python</option><option>Preparing for coding interviews</option></select></label><label>Goal<select name="goal"><option>Learn Python fundamentals</option><option>Improve problem-solving</option><option>Prepare for internship assessments</option><option>Prepare for technical interviews</option></select></label><div class="onboarding-actions"><button class="button primary" type="submit">Start Learning</button><button class="button secondary" type="button" id="skip-onboarding">Skip and Start Practicing</button></div></form></section>` : '';
    return `
      <div class="page dashboard-page">
        ${onboarding}
        <div class="free-banner">100% free. Learn at your own pace.</div>
        <section class="welcome-row"><div><p class="eyebrow">YOUR PYTHON JOURNEY</p><h1>Welcome back, ${this.escape(this.progress.profile.name)}</h1><p>Keep building toward confident, independent problem solving.</p></div><div class="welcome-actions"><a class="button secondary" href="#problems">Quick Practice</a><a class="button primary" href="#workspace/${current.problems[0].id}">Continue Learning</a></div></section>
        <section class="stats-grid">
          ${this.statCard('CircleCheck','Problems Solved',String(solved),'Start with your next challenge','purple')}
          ${this.statCard('Layers','Current Level',`${level} / 100`,current.topic,'blue')}
          ${this.statCard('Zap','Total XP',String(this.progress.profile.xp),'Earn XP on accepted solutions','gold')}
          ${this.statCard('Target','Accuracy',`${accuracy}%`,this.progress.submissions.length ? 'Across submissions' : 'No submissions yet','green')}
        </section>
        <section class="dashboard-grid">
          <article class="card continue-card"><div class="card-heading"><div><p class="eyebrow">CONTINUE LEARNING</p><h2>${current.topic}</h2></div><span class="level-badge">Level ${level}</span></div><p>${current.description}</p><div class="progress-row"><span>${solved % 5} of 5 challenges</span><span>${Math.min(100, (solved % 5) * 20)}%</span></div><div class="progress-track"><span style="width:${Math.min(100, (solved % 5) * 20)}%"></span></div><a class="button primary" href="#workspace/${current.problems[0].id}">Continue</a></article>
          <article class="card daily-card"><div class="card-heading"><div><p class="eyebrow">DAILY CHALLENGE</p><h2>Count the Vowels</h2></div><span class="difficulty easy">Beginner</span></div><p>Strings · 15 XP bonus</p><div class="daily-meter"><span></span></div><a class="button secondary" href="#workspace/level-31-problem-1">Start Challenge</a></article>
        </section>
        <section class="dashboard-grid lower">
          <article class="card mastery-card"><div class="card-heading"><div><p class="eyebrow">SKILL MASTERY</p><h2>Foundations</h2></div></div>${[['Input & output',20],['Conditions',12],['Loops',8],['Strings',4],['Lists',2],['Functions',0]].map(s => `<div class="mastery-row"><div><span>${s[0]}</span><strong>${s[1]}%</strong></div><div class="progress-track"><span style="width:${s[1]}%"></span></div></div>`).join('')}</article>
          <article class="card activity-card"><div class="card-heading"><div><p class="eyebrow">WEEKLY ACTIVITY</p><h2>Practice activity</h2></div></div><div class="activity-bars">${[18,38,24,55,42,68,30].map((v,i) => `<div><span style="height:${v}%"></span><small>${['M','T','W','T','F','S','S'][i]}</small></div>`).join('')}</div></article>
        </section>
        <section class="dashboard-grid lower"><article class="card"><div class="card-heading"><h2>Recent Submissions</h2></div>${this.recentSubmissions()}</article><article class="card"><div class="card-heading"><h2>Recommended Practice</h2></div>${this.recommendations()}</article></section>
      </div>`;
  }

  statCard(icon,title,value,description,color) {
    return `<article class="stat-card ${color}"><div class="stat-icon"><i data-lucide="${icon}"></i></div><div><p>${title}</p><strong>${value}</strong><small>${description}</small></div></article>`;
  }

  recentSubmissions() {
    if (!this.progress.submissions.length) return '<div class="empty-state"><i data-lucide="History"></i><p>No submissions yet</p><small>Accepted attempts will appear here.</small></div>';
    return `<div class="submission-list">${this.progress.submissions.slice(-4).reverse().map(s => `<a href="#workspace/${s.problemId}"><span>${s.title}</span><strong class="${s.accepted?'accepted':'failed'}">${s.accepted?'Accepted':'Retry'}</strong></a>`).join('')}</div>`;
  }

  recommendations() {
    return problems.slice(0,5).map(p => `<a class="recommendation" href="#workspace/${p.id}"><span class="difficulty ${p.difficulty.toLowerCase().replaceAll(' ','-')}">${p.difficulty}</span><div><strong>${p.title}</strong><small>${p.topic} · ${p.estimatedMinutes} min</small></div><i data-lucide="ChevronRight"></i></a>`).join('');
  }

  roadmap() {
    return `<div class="page"><div class="page-heading"><div><p class="eyebrow">100-LEVEL CURRICULUM</p><h1>Learning Roadmap</h1></div></div><div class="roadmap-grid">${levels.map(level => `<article class="level-card ${level.number <= this.progress.profile.level ? 'available':'locked'}"><div class="level-number">${level.number}</div><div><p>${level.stageTitle}</p><h3>${level.title}</h3><small>${level.requiredSolved} of 5 challenges required</small></div><a aria-label="Open level ${level.number}" href="#${level.number <= this.progress.profile.level?'problems':'roadmap'}"><i data-lucide="${level.number <= this.progress.profile.level?'ArrowRight':'Lock'}"></i></a></article>`).join('')}</div></div>`;
  }

  problemLibrary() {
    const query = new URLSearchParams(location.hash.split('?')[1]).get('q')?.toLowerCase() || '';
    const filtered = problems.filter(p => !query || `${p.title} ${p.topic}`.toLowerCase().includes(query));
    return `<div class="page"><div class="page-heading"><div><p class="eyebrow">PROBLEM LIBRARY</p><h1>Practice Problems</h1></div><div class="toolbar"><label><span class="sr-only">Search</span><input id="problem-search" type="search" value="${this.escape(query)}" placeholder="Search problems"></label><select id="difficulty-filter"><option value="">All difficulties</option><option>Very Easy</option><option>Beginner</option><option>Easy</option><option>Intermediate</option></select></div></div><div class="problem-table"><div class="table-header"><span>Status</span><span>Problem</span><span>Level</span><span>Difficulty</span><span>Topic</span><span>Time</span><span>XP</span></div>${filtered.slice(0,100).map(p => `<a class="table-row" href="#workspace/${p.id}"><span><i data-lucide="${this.progress.solved.includes(p.id)?'CircleCheck':'Circle'}"></i></span><strong>${p.title}</strong><span>${p.level}</span><span class="difficulty">${p.difficulty}</span><span>${p.topic}</span><span>${p.estimatedMinutes} min</span><span>${p.xpReward}</span></a>`).join('') || '<div class="empty-state"><p>No problems match this search.</p></div>'}</div></div>`;
  }

  dailyChallenge() { return this.placeholder('Daily Challenge', 'Count the Vowels · Today', 'CalendarCheck'); }
  generator() { return `<div class="page"><div class="page-heading"><div><p class="eyebrow">DETERMINISTIC GENERATOR</p><h1>Generate a Problem</h1></div></div><form class="generator card" id="generator-form"><label>Level<select name="level">${levels.map(l=>`<option value="${l.number}">Level ${l.number} — ${l.title}</option>`).join('')}</select></label><label>Topic<select name="topic">${levelTopics.map(t=>`<option>${t}</option>`).join('')}</select></label><label>Difficulty<select name="difficulty"><option>Very Easy</option><option>Beginner</option><option>Easy</option><option>Intermediate</option></select></label><label>Coding format<select name="format"><option value="stdin">stdin / stdout</option><option value="function">Function</option></select></label><button class="button primary" type="submit">Generate & Open</button></form></div>`; }
  debugging() { const challenges=['Print should be lowercase','Missing colon','Off-by-one range','Undefined variable','Incorrect indentation','Missing return']; return `<div class="page"><div class="page-heading"><h1>Debugging Challenges</h1></div><div class="card-grid">${challenges.map((title,i)=>`<article class="card"><span class="difficulty">Beginner</span><h3>${title}</h3><pre><code>number = int(input())\nprint(number * ${i+2})</code></pre><a class="button secondary" href="#workspace/level-01-problem-${i+1}">Open Challenge</a></article>`).join('')}</div></div>`; }
  playground() { return `<div class="page playground-page"><div class="page-heading"><div><p class="eyebrow">PYTHON PLAYGROUND</p><h1>Experiment freely</h1></div></div><div class="playground-grid"><div id="playground-editor" class="editor-panel"></div><aside class="console-panel"><label>Custom input<textarea id="playground-input" rows="7"></textarea></label><button id="playground-run" class="button primary">Run Code</button><pre id="playground-output" aria-live="polite">Ready</pre></aside></div></div>`; }
  lessons() { const lessons=['What Python is','Variables','print()','input()','Arithmetic','if statements','For loops','Lists','Dictionaries','Functions','Recursion','Big O notation']; return `<div class="page"><div class="page-heading"><h1>Python Lessons</h1></div><div class="lesson-grid">${lessons.map((l,i)=>`<article class="lesson-card"><span>${String(i+1).padStart(2,'0')}</span><h3>${l}</h3><p>Plain-language explanation, syntax example, common mistakes, and a runnable exercise.</p><button class="text-button" data-lesson="${i}">Open lesson <i data-lucide="ArrowRight"></i></button></article>`).join('')}</div></div>`; }
  guided() { return this.placeholder('Guided Learning', 'Follow one step at a time with behavioral feedback.', 'Route'); }
  review() { return this.placeholder('Review Practice', 'Previously learned concepts scheduled for spaced review.', 'RotateCcw'); }
  mistakes() {
    const mistakes = this.progress.mistakes || [];
    return `<div class="page"><div class="page-heading"><h1>Mistake Notebook</h1></div>${mistakes.length ? `<div class="mistake-list">${mistakes.slice().reverse().map(m=>`<article class="card mistake-card"><div><span class="difficulty">${m.difficulty}</span><h3>${m.title}</h3><small>${new Date(m.date).toLocaleString()} · ${m.topic}</small></div><p>${m.error || 'Incorrect solution output'}</p><a class="button secondary" href="#workspace/${m.problemId}">Retry Problem</a></article>`).join('')}</div>` : `<article class="card feature-placeholder"><div class="placeholder-icon"><i data-lucide="NotebookTabs"></i></div><h2>No mistakes yet</h2><p>Failed submissions will appear here automatically.</p></article>`}</div>`;
  }
  interview() {
    return `<div class="page"><div class="page-heading"><div><p class="eyebrow">MOCK ASSESSMENT</p><h1>Interview Practice</h1></div></div><form class="generator card" id="interview-form"><label>Preset<select name="preset"><option>Absolute Beginner Assessment</option><option>Entry-Level Assessment Practice</option><option>Entry-Level Internship Assessment</option><option>String and List Assessment</option></select></label><label>Duration<select name="duration"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label><label>Questions<select name="questions"><option value="3">3 questions</option><option value="5">5 questions</option><option value="10">10 questions</option></select></label><button class="button primary" type="submit">Start Assessment</button></form></div>`;
  }
  prediction() {
    return `<div class="page"><div class="page-heading"><h1>Code Prediction</h1></div><article class="card prediction-card"><h2>What will this program print?</h2><pre><code>numbers = [2, 4, 6]\nprint(len(numbers))</code></pre><label><span class="sr-only">Expected output</span><input id="prediction-answer" type="text" placeholder="Enter the expected output"></label><button class="button primary" id="check-prediction">Submit Prediction</button><div id="prediction-result" aria-live="polite"></div></article></div>`;
  }
  analytics() { return `<div class="page"><div class="page-heading"><h1>Analytics</h1></div><section class="stats-grid">${this.statCard('Target','Accuracy','0%','No submissions yet','green')}${this.statCard('Timer','Practice Time','0 min','Across this device','blue')}${this.statCard('TrendingUp','Problems Attempted','0','Real submissions only','purple')}</section><article class="card chart-empty"><i data-lucide="ChartNoAxesCombined"></i><h2>Insufficient data</h2><p>Complete coding challenges to generate analytics.</p></article></div>`; }
  history() { return `<div class="page"><div class="page-heading"><h1>Submission History</h1></div>${this.recentSubmissions()}</div>`; }
  achievements() {
    const achievements=[
      ['Hello, Python!','Run your first program',false],
      ['First Accepted Solution','Solve one challenge',this.progress.solved.length>0],
      ['Five Problems Solved','Solve five challenges',this.progress.solved.length>=5],
      ['Three-Day Streak','Practice for three days',false],
      ['Algorithm Explorer','Reach level 71',this.progress.profile.level>=71],
      ['Level 100','Complete every level',this.progress.profile.level>=100]
    ];
    return `<div class="page"><div class="page-heading"><h1>Achievements</h1></div><div class="achievement-grid">${achievements.map(a=>`<article class="achievement ${a[2]?'unlocked':''}"><div class="achievement-icon">${a[2]?'✓':'◇'}</div><h3>${a[0]}</h3><p>${a[1]}</p><small>${a[2]?'Unlocked':'Locked'}</small></article>`).join('')}</div></div>`;
  }

  settings() {
    return `<div class="page"><div class="page-heading"><h1>Settings</h1></div><div class="settings-layout">
      <article class="card settings-card"><h2>Appearance</h2><label>Theme<select id="setting-theme"><option value="dark" ${this.progress.settings.theme==='dark'?'selected':''}>Dark</option><option value="light" ${this.progress.settings.theme==='light'?'selected':''}>Light</option></select></label><label>Editor font size<input id="setting-font" type="number" min="10" max="24" value="${this.progress.settings.fontSize || 14}"></label></article>
      <article class="card settings-card"><h2>Learning</h2><label>Default coding format<select id="setting-format"><option value="stdin" ${this.progress.settings.defaultFormat==='stdin'?'selected':''}>stdin / stdout</option><option value="function" ${this.progress.settings.defaultFormat==='function'?'selected':''}>Function</option></select></label><label>Daily goal<select><option>1 problem per day</option><option>3 problems per day</option><option>5 problems per day</option></select></label></article>
      <article class="card settings-card"><h2>Data management</h2><button class="button secondary" id="export-progress">Export Progress</button><label class="import-progress-label" for="import-progress">Import Progress</label><input id="import-progress" type="file" accept="application/json"><button class="button danger" id="reset-progress">Reset Progress</button></article>
      <article class="card settings-card"><h2>About</h2><p><strong>Xavier's Python Challenge</strong> · Version 1.0.0</p><p>Completely free. Browser-based Python powered by WebAssembly.</p></article>
    </div></div>`;
  }

  help() { return `<div class="page"><div class="page-heading"><h1>Help and Documentation</h1></div><article class="card prose"><h2>Keyboard shortcuts</h2><p><kbd>Ctrl/Cmd + Enter</kbd> Run code · <kbd>Ctrl/Cmd + S</kbd> Save draft · <kbd>Ctrl/Cmd + F</kbd> Find</p><h2>Python engine</h2><p>Xavier's Python Challenge runs real Python code in a Web Worker. Infinite loops can be stopped with the Stop button. Browser-based execution is not a hardened security sandbox.</p><h2>Progress</h2><p>Progress is stored locally in this browser. Export and import JSON backups in Settings.</p><h2>Hosting and network</h2><p>The core application is static and needs no backend. Pyodide assets are downloaded from jsDelivr the first time Python runs.</p></article></div>`; }

  about() {
    return `<div class="page"><div class="page-heading"><h1>About Xavier's Python Challenge</h1></div><article class="card prose"><p>Xavier's Python Challenge is a completely free Python learning and coding practice platform designed to help students, aspiring software engineers, and beginner programmers develop practical problem-solving skills.</p><h2>Our mission</h2><p>Make Python programming and technical interview preparation accessible to everyone, regardless of experience level or financial situation.</p><h2>Completely free</h2><p>All coding challenges, learning levels, practice tools, hints, lessons, and interview preparation features are available without subscriptions, advertisements, or payment requirements.</p><h2>Created by</h2><p><strong>Xavier Chitison</strong></p><h2>Built for</h2><ul><li>Beginner programmers</li><li>College and computer science students</li><li>Aspiring software engineers</li><li>Internship and technical interview candidates</li><li>Anyone improving their Python skills</li></ul></article></div>`;
  }

  privacy() {
    return `<div class="page"><div class="page-heading"><h1>Privacy</h1></div><article class="card prose"><p>There is no account system, advertising tracker, or payment collection. Learning progress and coding activity are stored locally in the current browser profile.</p><p>No cloud synchronization is automatic. Use Settings to export or import a JSON backup. Clearing browser data removes local progress.</p><p>Python runs in your browser. The application requests Pyodide assets from jsDelivr when first needed. Browser-hosted hidden tests can be inspected and are not secure competitive-assessment protection.</p></article></div>`;
  }

  placeholder(title, description, icon) {
    return `<div class="page"><div class="page-heading"><h1>${title}</h1></div><article class="card feature-placeholder"><div class="placeholder-icon"><i data-lucide="${icon}"></i></div><h2>${title}</h2><p>${description}</p><a class="button primary" href="#problems">Browse problems</a></article></div>`;
  }

  bindProblemPage(problemId) {
    document.getElementById('onboarding-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.progress.profile.name = String(data.get('name')).trim() || 'Learner';
      this.progress.profile.experience = String(data.get('experience'));
      this.progress.profile.goal = String(data.get('goal'));
      this.progress.profile.started = true;
      saveProgress(this.progress);
      this.renderShell();
      this.renderRoute();
    });
    document.getElementById('skip-onboarding')?.addEventListener('click', () => {
      this.progress.profile.started = true;
      saveProgress(this.progress);
      this.renderShell();
      this.renderRoute();
    });
    document.getElementById('check-prediction')?.addEventListener('click', () => {
      const answer = document.getElementById('prediction-answer')?.value.trim();
      const result = document.getElementById('prediction-result');
      if (!result) return;
      if (answer === '3') {
        result.innerHTML = '<strong class="accepted">Correct.</strong><p><code>len(numbers)</code> returns the number of items in the list.</p>';
      } else {
        result.innerHTML = '<strong class="failed">Not quite.</strong><p>Count the number of items in <code>numbers</code>, then try again.</p>';
      }
    });
    document.getElementById('problem-search')?.addEventListener('input', event => {
      const value = event.currentTarget.value;
      history.replaceState(null,'',`#problems?q=${encodeURIComponent(value)}`);
      this.renderRoute();
    });
    document.getElementById('setting-theme')?.addEventListener('change', event => {
      this.progress.settings.theme = event.currentTarget.value;
      saveProgress(this.progress);
      this.toggleTheme();
    });
    document.getElementById('setting-font')?.addEventListener('change', event => {
      this.progress.settings.fontSize = Number(event.currentTarget.value);
      saveProgress(this.progress);
    });
    document.getElementById('setting-format')?.addEventListener('change', event => {
      this.progress.settings.defaultFormat = event.currentTarget.value;
      saveProgress(this.progress);
    });
    document.getElementById('reset-progress')?.addEventListener('click', () => {
      if (confirm("Reset all local Xavier's Python Challenge progress?")) {
        localStorage.removeItem('pylevel-progress');
        localStorage.removeItem('xpc-progress');
        location.reload();
      }
    });
    document.getElementById('export-progress')?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({version:1,progress:this.progress},null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'xpc-progress.json'; a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById('import-progress')?.addEventListener('change', async event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        if (parsed.version !== 1 || !parsed.progress || typeof parsed.progress !== 'object') throw new Error('Invalid backup');
        if (!confirm('Replace your current local progress with this backup?')) return;
        saveProgress(parsed.progress);
        location.reload();
      } catch {
        alert("The selected file is not a valid Xavier's Python Challenge backup.");
      }
    });
    document.getElementById('generator-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const level = Number(new FormData(event.currentTarget).get('level'));
      location.hash = `workspace/${levels[level-1].problems[0].id}`;
    });
    document.getElementById('interview-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const duration = Number(data.get('duration'));
      const questionCount = Number(data.get('questions'));
      const assessment = {
        id: `assessment-${Date.now()}`,
        preset: String(data.get('preset')),
        durationMinutes: duration,
        questionCount,
        startedAt: Date.now(),
        endsAt: Date.now() + duration * 60000,
        questionIds: problems.slice(0, questionCount).map(problem => problem.id),
        answers: {}
      };
      this.progress.assessments ||= [];
      this.progress.assessments.push(assessment);
      saveProgress(this.progress);
      location.hash = `workspace/${assessment.questionIds[0]}`;
    });
  }

  async initPlayground() {
    const [{ default: monaco }] = await import('monaco-editor').then(m => [m]);
    if (!monaco.editor._pylevelTheme) {
      monaco.editor.defineTheme('pylevel-dark', {base:'vs-dark',inherit:true,rules:[],colors:{'editor.background':'#090e17'}});
      monaco.editor._pylevelTheme = true;
    }
    const playgroundEditor = monaco.editor.create(document.getElementById('playground-editor'), {
      value: 'print("Hello, Python!")\n',
      language: 'python',
      theme: 'pylevel-dark',
      automaticLayout: true,
      minimap: { enabled:false },
      fontSize: this.progress.settings?.fontSize || 14
    });
    document.getElementById('playground-run')?.addEventListener('click', () => {
      const output = document.getElementById('playground-output');
      const worker = new Worker(new URL('./workers/python.worker.js', import.meta.url));
      output.textContent = 'Executing...\n';
      worker.onmessage = event => {
        if (event.data.type === 'stdout') output.textContent += event.data.text + '\n';
        if (event.data.type === 'stderr') output.textContent += event.data.text + '\n';
        if (event.data.type === 'error') output.textContent += event.data.error;
      };
      worker.postMessage({id:'playground', code:playgroundEditor.getValue(), input:document.getElementById('playground-input')?.value || '', timeout:8000});
    });
  }

  escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }
}

