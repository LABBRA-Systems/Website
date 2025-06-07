// LABBRA Systems - Who is LABBRA Page Specific JavaScript
// Interactive letter column expansion/collapse system

// Note: This file depends on utils.js for shared utility functions

// ===== STATE MANAGEMENT =====
let currentExpanded = null;

// ===== UTILITY FUNCTIONS =====

/**
 * Check if click target should be ignored
 * @param {Event} event - Click event
 * @param {Array} ignoredClasses - Array of class names to ignore
 * @returns {boolean} True if click should be ignored
 */
function shouldIgnoreClick(event, ignoredClasses = ['close-button']) {
  return ignoredClasses.some(className =>
    event.target.classList.contains(className)
  );
}

// ===== STORY MANAGEMENT FUNCTIONS =====

/**
 * Close currently expanded story if it exists
 */
function closeCurrentStory() {
  if (currentExpanded) {
    toggleClasses(currentExpanded, "expanded", false);
    currentExpanded = null;
  }
}

/**
 * Toggle page header visibility
 * @param {boolean} show - Whether to show the header
 */
function togglePageHeader(show) {
  toggleClasses("#pageHeader", "hidden", !show);
}

/**
 * Expand a story column
 * @param {Element} column - Column element to expand
 */
function expandStory(column) {
  if (!column) return;
  
  // Close any currently expanded story that's different
  if (currentExpanded && currentExpanded !== column) {
    closeCurrentStory();
  }

  // Expand the clicked column
  toggleClasses(column, "expanded", true);
  currentExpanded = column;

  // Hide the page header
  togglePageHeader(false);
}

/**
 * Close the currently expanded story
 */
function closeStory() {
  closeCurrentStory();
  togglePageHeader(true);
}

// ===== EVENT HANDLERS =====

/**
 * Handle letter column click
 * @param {Event} event - Click event
 */
function handleColumnClick(event) {
  // Don't expand if clicking on ignored elements
  if (shouldIgnoreClick(event)) {
    return;
  }
  
  const column = event.currentTarget;
  expandStory(column);
}

/**
 * Handle close button click
 * @param {Event} event - Click event
 */
function handleCloseClick(event) {
  event.stopPropagation(); // Prevent event bubbling
  closeStory();
}

/**
 * Handle outside click to close story
 * @param {Event} event - Click event
 */
function handleOutsideClick(event) {
  if (currentExpanded && !currentExpanded.contains(event.target)) {
    closeStory();
  }
}

/**
 * Handle keyboard navigation
 * @param {Event} event - Keyboard event
 */
function handleKeyboardNav(event) {
  if (event.key === "Escape") {
    closeStory();
  }
}

// ===== EVENT LISTENER SETUP =====

/**
 * Add event listeners to letter columns
 */
function setupColumnListeners() {
  safeSelectAll(".letter-column").forEach(column => {
    safeAddListener(column, "click", handleColumnClick);
  });
}

/**
 * Add event listeners to close buttons
 */
function setupCloseButtonListeners() {
  safeSelectAll(".close-button").forEach(button => {
    safeAddListener(button, "click", handleCloseClick);
  });
}

/**
 * Add global event listeners
 */
function setupGlobalListeners() {
  // Close story when clicking outside
  safeAddListener(document, "click", handleOutsideClick);
  
  // Keyboard navigation
  safeAddListener(document, "keydown", handleKeyboardNav);
}

// ===== INITIALIZATION =====

/**
 * Initialize all who-is-labbra page functionality
 */
function initLabbraPage() {
  setupColumnListeners();
  setupCloseButtonListeners();
  setupGlobalListeners();
}

// Initialize when DOM is ready
onDOMReady(initLabbraPage);