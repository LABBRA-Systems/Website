// LABBRA Systems - Component Loader
// Handles loading and managing reusable HTML components

// Note: This file depends on utils.js for shared utility functions

// ===== COMPONENT TEMPLATES =====

/**
 * Get navbar component HTML template
 * @returns {string} Navbar HTML
 */
function getNavbarTemplate() {
  // Detect if the user is on a mobile device (basic check)
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

  return `
    <!-- Navigation Component -->
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
          <li><a href="who-is-labbra.html" data-page="who-is-labbra">Who is LABBRA</a></li>
          <li><a href="problem.html" data-page="problem">The Problem</a></li>
          <li><a href="solution.html" data-page="solution">Our Solution</a></li>
          <li><a href="team.html" data-page="team">Team</a></li>
          ${isMobile ? `<li><a href="donate.html" data-page="donate">Donate</a></li>` : ''}
        </ul>
        <div class="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <a href="donate.html" class="cta-button" id="navbar-donate-btn">Donate</a>
      </div>
    </nav>
  `;
}

// ===== COMPONENT CONFIGURATION =====
const COMPONENT_CONFIG = {
  navbar: {
    template: getNavbarTemplate,
    target: '#navbar-container',
    postLoad: initNavbarComponent
  }
};

// ===== COMPONENT LOADING =====

/**
 * Insert component HTML into target element
 * @param {string} targetSelector - CSS selector for target element
 * @param {string} html - HTML content to insert
 */
function insertComponent(targetSelector, html) {
  const target = safeSelect(targetSelector);
  if (target) {
    target.innerHTML = html;
  } else {
    console.warn(`Component target not found: ${targetSelector}`);
  }
}

/**
 * Load and insert a component
 * @param {string} componentName - Name of the component to load
 * @param {string} targetSelector - Optional target selector override
 */
function loadAndInsertComponent(componentName, targetSelector = null) {
  const config = COMPONENT_CONFIG[componentName];
  if (!config) {
    console.error(`Component configuration not found: ${componentName}`);
    return;
  }

  const target = targetSelector || config.target;
  const html = config.template();
  
  if (html) {
    insertComponent(target, html);
    
    // Run post-load initialization if defined
    if (config.postLoad && typeof config.postLoad === 'function') {
      config.postLoad();
    }
  }
}

// ===== NAVBAR COMPONENT LOGIC =====

/**
 * Get current page name from URL
 * @returns {string} Current page name
 */
function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  // Handle different filename patterns
  if (filename === '' || filename === 'index.html') {
    return 'home'; // Changed from 'index' to 'home'
  }
  
  // Remove .html extension and return
  return filename.replace('.html', '');
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = getCurrentPageName();
  
  // Remove active class from all nav links
  safeSelectAll('.nav-links a').forEach(link => {
    removeClasses(link, 'active');
  });
  
  // Add active class to current page link
  const currentLink = safeSelect(`[data-page="${currentPage}"]`);
  if (currentLink) {
    addClasses(currentLink, 'active');
  }
}

/**
 * Set active state for donate button
 */
function setActiveDonateButton() {
  const currentPage = getCurrentPageName();
  const donateBtn = safeSelect('#navbar-donate-btn');
  
  if (donateBtn) {
    if (currentPage === 'donate') {
      addClasses(donateBtn, 'active');
    } else {
      removeClasses(donateBtn, 'active');
    }
  }
}

/**
 * Handle logo link behavior for index page
 */
function handleLogoLink() {
  const currentPage = getCurrentPageName();
  const logo = safeSelect('#navbar-logo');
  
  if (logo && currentPage === 'home') {
    // On home page, logo should not be a link
    logo.removeAttribute('href');
    logo.style.cursor = 'default';
  }
}

/**
 * Initialize navbar component after loading
 */
function initNavbarComponent() {
  setActiveNavLink();
  setActiveDonateButton();
  handleLogoLink();
  
  // Re-initialize mobile menu functionality for the new navbar
  if (typeof initMobileMenu === 'function') {
    initMobileMenu();
  }
}

// ===== COMPONENT INITIALIZATION =====

/**
 * Load all components for the current page
 */
function loadAllComponents() {
  // Load navbar component
  loadAndInsertComponent('navbar');
}

/**
 * Initialize component system
 */
function initComponents() {
  // Check if we have a navbar container
  const navbarContainer = safeSelect('#navbar-container');
  if (navbarContainer) {
    loadAllComponents();
  } else {
    console.warn('No navbar container found. Components will not be loaded.');
  }
}

// ===== AUTO-INITIALIZATION =====

// Initialize components when DOM is ready
onDOMReady(initComponents);

// ===== EXPORT FOR MODULE SYSTEMS (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadComponent,
    insertComponent,
    loadAndInsertComponent,
    loadAllComponents,
    initComponents,
    getCurrentPageName,
    setActiveNavLink,
    setActiveDonateButton
  };
}