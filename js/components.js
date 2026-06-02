// LABBRA Systems - Component Loader

const CALENDLY_URL = "https://calendly.com/bmingst-labbrasystems/30min";

function getNavbarTemplate() {
  return `
    <nav class="navbar">
      <div class="nav-container">
        <a href="../index.html" class="logo" id="navbar-logo">
          <div class="logo-icon logo-icon--bare">
            <img src="../media/cross heart.png" alt="LABBRA Systems logo" />
          </div>
          LABBRA Systems
        </a>
        <ul class="nav-links">
          <li><a href="home.html" data-page="home">Home</a></li>
          <li><a href="problem.html" data-page="problem">The Problem</a></li>
          <li><a href="solution.html" data-page="solution">Our Solution</a></li>
          <li><a href="news.html" data-page="news">News</a></li>
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

function getSocialLinksTemplate() {
  return `
    <a href="https://www.linkedin.com/company/labbra-systems/" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LABBRA Systems on LinkedIn">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
    <a href="https://www.youtube.com/@labbra-systems" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LABBRA Systems on YouTube">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </a>
    <a href="https://www.instagram.com/labbrasystems/" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LABBRA Systems on Instagram">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    </a>
  `;
}

function getFooterTemplate() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="section-container">
        <div class="site-footer-top">
          <div class="site-footer-cta">
            <p class="site-footer-cta-text">Stop waiting. Make prevention possible.</p>
            <a href="${CALENDLY_URL}" class="btn btn-primary site-footer-btn" target="_blank" rel="noopener noreferrer">Schedule a meeting</a>
          </div>
          <div class="site-footer-social" aria-label="LABBRA Systems social media">
            ${getSocialLinksTemplate()}
          </div>
        </div>
        <div class="site-footer-content">
          <p class="site-footer-copyright">Copyright 2026 LABBRA Systems. All rights reserved.</p>
          <nav class="site-footer-links" aria-label="Legal">
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms of Use</a>
          </nav>
        </div>
      </div>
    </footer>
  `;
}

const COMPONENT_CONFIG = {
  navbar: {
    template: getNavbarTemplate,
    target: '#navbar-container',
    postLoad: initNavbarComponent
  },
  footer: {
    template: getFooterTemplate,
    target: '#footer-container'
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
  loadAndInsertComponent('footer');
}

function initComponents() {
  const navbarContainer = safeSelect('#navbar-container');
  const footerContainer = safeSelect('#footer-container');
  if (navbarContainer || footerContainer) loadAllComponents();
}

onDOMReady(initComponents);
