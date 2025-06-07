// LABBRA Systems - Shared Utility Functions
// Common utilities used across multiple JavaScript files

// ===== DOM UTILITIES =====

/**
 * Safely select a DOM element with optional error handling
 * @param {string} selector - CSS selector
 * @param {boolean} required - Whether element is required (logs warning if missing)
 * @returns {Element|null} - Selected element or null
 */
function safeSelect(selector, required = false) {
  const element = document.querySelector(selector);
  if (!element && required) {
    console.warn(`Required element not found: ${selector}`);
  }
  return element;
}

/**
 * Safely select multiple DOM elements
 * @param {string} selector - CSS selector
 * @returns {NodeList} - Selected elements (empty NodeList if none found)
 */
function safeSelectAll(selector) {
  return document.querySelectorAll(selector) || [];
}

/**
 * Add event listener with safety check
 * @param {Element|null} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 */
function safeAddListener(element, event, handler, options = {}) {
  if (element && typeof handler === 'function') {
    element.addEventListener(event, handler, options);
  }
}

/**
 * Remove event listener with safety check
 * @param {Element|null} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 */
function safeRemoveListener(element, event, handler, options = {}) {
  if (element && typeof handler === 'function') {
    element.removeEventListener(event, handler, options);
  }
}

// ===== CLASS MANIPULATION =====

/**
 * Toggle classes on multiple elements
 * @param {Element|NodeList|Array} elements - Element(s) to toggle
 * @param {string|Array} classes - Class(es) to toggle
 * @param {boolean} force - Force add (true) or remove (false)
 */
function toggleClasses(elements, classes, force = undefined) {
  const elementList = elements.length !== undefined ? Array.from(elements) : [elements];
  const classList = Array.isArray(classes) ? classes : [classes];
  
  elementList.forEach(element => {
    if (element && element.classList) {
      classList.forEach(className => {
        element.classList.toggle(className, force);
      });
    }
  });
}

/**
 * Add classes to elements
 * @param {Element|NodeList|Array} elements - Element(s) to modify
 * @param {string|Array} classes - Class(es) to add
 */
function addClasses(elements, classes) {
  toggleClasses(elements, classes, true);
}

/**
 * Remove classes from elements
 * @param {Element|NodeList|Array} elements - Element(s) to modify
 * @param {string|Array} classes - Class(es) to remove
 */
function removeClasses(elements, classes) {
  toggleClasses(elements, classes, false);
}

// ===== CONTENT MANIPULATION =====

/**
 * Update element content safely
 * @param {string|Element} target - CSS selector or element
 * @param {string} content - New content
 * @param {string} property - Property to update ('textContent', 'innerHTML', etc.)
 */
function updateElement(target, content, property = 'textContent') {
  const element = typeof target === 'string' ? safeSelect(target) : target;
  if (element) {
    element[property] = content;
  }
}

/**
 * Update multiple elements with the same content
 * @param {Array} selectors - Array of CSS selectors
 * @param {string} content - New content
 * @param {string} property - Property to update
 */
function updateElements(selectors, content, property = 'textContent') {
  selectors.forEach(selector => updateElement(selector, content, property));
}

// ===== STYLE MANIPULATION =====

/**
 * Apply styles to element safely
 * @param {string|Element} target - CSS selector or element
 * @param {Object} styles - Style properties to apply
 */
function applyStyles(target, styles) {
  const element = typeof target === 'string' ? safeSelect(target) : target;
  if (element && styles) {
    Object.assign(element.style, styles);
  }
}

/**
 * Apply styles to multiple elements
 * @param {Array} targets - Array of CSS selectors or elements
 * @param {Object} styles - Style properties to apply
 */
function applyStylesToMultiple(targets, styles) {
  targets.forEach(target => applyStyles(target, styles));
}

// ===== ANIMATION UTILITIES =====

/**
 * Create a throttled function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ===== VALIDATION UTILITIES =====

/**
 * Check if value is a valid number
 * @param {any} value - Value to check
 * @returns {boolean} True if valid number
 */
function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate and parse number with optional range check
 * @param {any} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number|null} Parsed number or null if invalid
 */
function validateNumber(value, min = -Infinity, max = Infinity) {
  const num = parseFloat(value);
  return (isValidNumber(num) && num >= min && num <= max) ? num : null;
}

// ===== FORMAT UTILITIES =====

/**
 * Format number with specified decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
function formatNumber(value, decimals = 2) {
  return isValidNumber(value) ? Number(value).toFixed(decimals) : '0';
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency symbol
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency
 */
function formatCurrency(value, currency = '$', decimals = 2) {
  return `${currency}${formatNumber(value, decimals)}`;
}

/**
 * Format percentage value
 * @param {number} value - Value to format (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
function formatPercentage(value, decimals = 2) {
  return `${formatNumber(value, decimals)}%`;
}

// ===== DATE UTILITIES =====

/**
 * Calculate days between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days
 */
function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Calculate days until a target date
 * @param {Date|string} targetDate - Target date
 * @returns {number} Number of days until target (0 if past)
 */
function daysUntil(targetDate) {
  const days = daysBetween(new Date(), targetDate);
  return Math.max(0, days);
}

// ===== INITIALIZATION UTILITIES =====

/**
 * Execute function when DOM is ready
 * @param {Function} callback - Function to execute
 */
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Execute function when page is fully loaded
 * @param {Function} callback - Function to execute
 */
function onPageLoad(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

// ===== EXPORT FOR MODULE SYSTEMS (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    safeSelect,
    safeSelectAll,
    safeAddListener,
    safeRemoveListener,
    toggleClasses,
    addClasses,
    removeClasses,
    updateElement,
    updateElements,
    applyStyles,
    applyStylesToMultiple,
    throttle,
    debounce,
    isValidNumber,
    validateNumber,
    formatNumber,
    formatCurrency,
    formatPercentage,
    daysBetween,
    daysUntil,
    onDOMReady,
    onPageLoad
  };
}