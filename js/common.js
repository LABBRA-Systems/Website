// LABBRA Systems - Common JavaScript Functionality
// Shared across all pages: mobile menu, smooth scrolling, navbar effects, scroll animations

// Note: This file depends on utils.js for shared utility functions

// ===== MOBILE MENU FUNCTIONALITY =====

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileToggle = safeSelect(".mobile-menu-toggle");
  const navLinks = safeSelect(".nav-links");
  const mobileClose = safeSelect(".mobile-close");

  // Toggle menu on hamburger click
  safeAddListener(mobileToggle, "click", () => {
    toggleClasses([navLinks, mobileToggle], "active");
  });

  // Close menu on close button click
  safeAddListener(mobileClose, "click", () => {
    toggleClasses([navLinks, mobileToggle], "active", false);
  });

  // Close menu when clicking on navigation links
  safeSelectAll(".nav-links a").forEach(link => {
    safeAddListener(link, "click", () => {
      toggleClasses([navLinks, mobileToggle], "active", false);
    });
  });
}

// ===== SMOOTH SCROLLING =====

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  safeSelectAll('a[href^="#"]').forEach(anchor => {
    safeAddListener(anchor, "click", (e) => {
      e.preventDefault();
      const target = safeSelect(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ===== NAVBAR SCROLL EFFECTS =====

/**
 * Initialize navbar scroll effects with throttling for performance
 */
function initNavbarScrollEffects() {
  const navbar = safeSelect(".navbar");
  if (!navbar) return;

  const scrollHandler = throttle(() => {
    const isScrolled = window.scrollY > 100;
    applyStyles(navbar, {
      background: isScrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)",
      boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none"
    });
  }, 16); // ~60fps

  safeAddListener(window, "scroll", scrollHandler);
}

// ===== SCROLL ANIMATIONS =====

/**
 * Create intersection observer for scroll animations
 * @param {Object} options - Observer options
 * @param {string} animation - Animation to apply
 * @returns {IntersectionObserver} - Configured observer
 */
function createScrollObserver(options = {}, animation = "fadeInUp 0.8s ease-out forwards") {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        applyStyles(entry.target, { animation });
      }
    });
  }, defaultOptions);
}

/**
 * Initialize scroll animations for common elements
 */
function initScrollAnimations() {
  const observer = createScrollObserver();
  const animatedElements = safeSelectAll(
    ".feature-card, .process-step, .spec-card, .data-card, .impact-card, .donation-card, .team-member"
  );
  
  animatedElements.forEach(element => observer.observe(element));
}

// ===== INITIALIZATION =====

/**
 * Initialize all common functionality
 */
function initCommonFeatures() {
  initMobileMenu();
  initSmoothScrolling();
  initNavbarScrollEffects();
  initScrollAnimations();
}

// Initialize when DOM is ready
onDOMReady(initCommonFeatures);