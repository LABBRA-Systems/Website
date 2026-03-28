// LABBRA Systems - Component Loader

function getNavbarTemplate() {
  return `
    <nav class="navbar">
      <div class="nav-container">
        <a href="../index.html" class="logo" id="navbar-logo">
          <div class="logo-icon">
            <img src="../media/LABBRA.png" alt="LABBRA Logo" />
          </div>
          LABBRA Systems
        </a>
        <ul class="nav-links">
          <li><a href="home.html" data-page="home">Home</a></li>
          <li><a href="problem.html" data-page="problem">The Problem</a></li>
          <li><a href="solution.html" data-page="solution">Our Solution</a></li>
          <li><a href="team.html" data-page="team">Team</a></li>
          <li><a href="story.html" data-page="story">Our Story</a></li>
        </ul>
        <div class="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  `;
}

const COMPONENT_CONFIG = {
  navbar: {
    template: getNavbarTemplate,
    target: '#navbar-container',
    postLoad: initNavbarComponent
  }
};

function insertComponent(targetSelector, html) {
  const target = safeSelect(targetSelector);
  if (target) {
    target.innerHTML = html;
  }
}

function loadAndInsertComponent(componentName, targetSelector) {
  const config = COMPONENT_CONFIG[componentName];
  if (!config) return;

  const target = targetSelector || config.target;
  const html = config.template();

  if (html) {
    insertComponent(target, html);
    if (config.postLoad && typeof config.postLoad === 'function') {
      config.postLoad();
    }
  }
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  if (filename === '' || filename === 'index.html') return 'home';
  return filename.replace('.html', '');
}

function setActiveNavLink() {
  const currentPage = getCurrentPageName();
  safeSelectAll('.nav-links a').forEach(link => {
    removeClasses(link, 'active');
  });
  const currentLink = safeSelect(`[data-page="${currentPage}"]`);
  if (currentLink) {
    addClasses(currentLink, 'active');
  }
}

function handleLogoLink() {
  const currentPage = getCurrentPageName();
  const logo = safeSelect('#navbar-logo');
  if (logo && currentPage === 'home') {
    logo.removeAttribute('href');
    logo.style.cursor = 'default';
  }
}

function initNavbarComponent() {
  setActiveNavLink();
  handleLogoLink();
  if (typeof initMobileMenu === 'function') {
    initMobileMenu();
  }
}

function loadAllComponents() {
  loadAndInsertComponent('navbar');
}

function initComponents() {
  const navbarContainer = safeSelect('#navbar-container');
  if (navbarContainer) {
    loadAllComponents();
  }
}

onDOMReady(initComponents);
