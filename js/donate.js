// LABBRA Systems - Donate Page Specific JavaScript
// Countdown, miles tracking, donation processing, and progress animations

// Note: This file depends on utils.js for shared utility functions

// ===== CONFIGURATION =====
const DONATE_CONFIG = {
  miles: {
    goal: 500,
    completed: 450.49, // Easy to change - update this value to reflect current progress
  },
  fundraising: {
    totalRaised: 818, // Easy to change - update this value to reflect current donations
  },
  countdown: {
    targetDate: "August 18, 2025 00:00:00",
  }
};

// ===== CALCULATION FUNCTIONS =====

/**
 * Calculate derived values from configuration
 * @returns {Object} Calculated values
 */
function calculateValues() {
  const { goal, completed } = DONATE_CONFIG.miles;
  return {
    milesLeft: +(goal - completed).toFixed(2),
    completionPercentage: +((completed / goal) * 100).toFixed(2),
    milesCompleted: +completed.toFixed(2),
    totalRaised: +DONATE_CONFIG.fundraising.totalRaised.toFixed
      ? +DONATE_CONFIG.fundraising.totalRaised.toFixed(2)
      : DONATE_CONFIG.fundraising.totalRaised
  };
}

/**
 * Update progress bar width
 * @param {string} selector - CSS selector for progress bar
 * @param {number} percentage - Percentage width (0-100)
 */
function updateProgressBar(selector, percentage) {
  applyStyles(selector, { width: `${formatNumber(percentage)}%` });
}

// ===== DISPLAY UPDATE FUNCTIONS =====

/**
 * Update all miles-related displays
 */
function updateMilesDisplay() {
  const values = calculateValues();
  
  updateElement(".miles-completed-display", values.milesCompleted);
  updateElement(".miles-left-display", values.milesLeft);
  updateElement(".completion-percentage", `${formatNumber(values.completionPercentage)}% Complete`);
  updateProgressBar("#milesBar", values.completionPercentage);
}

/**
 * Update total raised display
 */
function updateTotalRaised() {
  const values = calculateValues();
  updateElement(".total-raised-display", formatCurrency(values.totalRaised, '$', 0));
}

/**
 * Update countdown display
 */
function updateCountdown() {
  const daysLeft = daysUntil(DONATE_CONFIG.countdown.targetDate);
  updateElement("#countdown", daysLeft);
}

/**
 * Update all displays at once
 */
function updateAllDisplays() {
  updateMilesDisplay();
  updateTotalRaised();
  updateCountdown();
}

// ===== DONATION PROCESSING =====

/**
 * Get custom donation amount from user
 * @returns {number|null} Valid amount or null if cancelled/invalid
 */
function getCustomDonationAmount() {
  const customAmount = prompt("Enter your donation amount:");
  return customAmount ? validateNumber(customAmount, 0.01) : null;
}

/**
 * Process donation with given amount
 * @param {string|number} amount - Donation amount or "custom"
 */
function donate(amount) {
  let finalAmount = amount;
  
  // Handle custom amount input
  if (amount === "custom") {
    finalAmount = getCustomDonationAmount();
    if (!finalAmount) return; // User cancelled or entered invalid amount
  }
  
  // Validate final amount
  const validAmount = validateNumber(finalAmount, 0.01);
  if (!validAmount) {
    alert("Please enter a valid donation amount.");
    return;
  }

  // Show confirmation message
  alert(
    `Thank you for your ${formatCurrency(validAmount)} donation! You will be redirected to our secure payment processor.\n\nYour contribution helps save lives and honors the memory of the six students we remember.`
  );

  // Log for development/debugging
  console.log(`Processing donation of ${formatCurrency(validAmount)}`);
  
  // In production, this would redirect to payment processor
  // window.location.href = `https://payment-processor.com/donate?amount=${validAmount}`;
}

// ===== ANIMATION FUNCTIONS =====

/**
 * Animate progress bars with delay
 * @param {number} delay - Delay in milliseconds
 */
function animateProgressBars(delay = 1000) {
  setTimeout(updateAllDisplays, delay);
}

// ===== INITIALIZATION =====

/**
 * Initialize donate page functionality
 */
function initDonatePage() {
  updateAllDisplays();
}

/**
 * Initialize animations after page load
 */
function initDonateAnimations() {
  updateAllDisplays();
  animateProgressBars();
}

// ===== GOFUNDME WIDGET RESPONSIVE HANDLING =====

/**
 * Update GoFundMe widget size based on screen size
 */
function updateGoFundMeWidget() {
  const gfmEmbed = document.querySelector('.gfm-embed');
  if (!gfmEmbed) return;

  const isMobile = window.innerWidth <= 768;
  const baseUrl = 'https://www.gofundme.com/f/skating-500-miles-for-pedestrian-safety/widget/';
  const attribution = '&attribution_id=sl:8f0bfc79-1ece-4e55-966a-f56cf7980f65';
  
  let newUrl;
  if (isMobile) {
    // Medium widget for mobile
    newUrl = baseUrl + 'medium?sharesheet=manage hero' + attribution;
  } else {
    // Large widget for desktop
    newUrl = baseUrl + 'large?sharesheet=fundraiser sidebar' + attribution;
  }
  
  // Only update if URL has changed
  if (gfmEmbed.getAttribute('data-url') !== newUrl) {
    gfmEmbed.setAttribute('data-url', newUrl);
    
    // Clear existing content and reload the embed
    gfmEmbed.innerHTML = '';
    
    // Trigger GoFundMe embed reload if the script is available
    if (window.gfm && window.gfm.embed) {
      window.gfm.embed.reload();
    }
  }
}

/**
 * Initialize GoFundMe widget with proper size
 */
function initGoFundMeWidget() {
  updateGoFundMeWidget();
  
  // Update widget on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateGoFundMeWidget, 250);
  });
}

// Initialize when DOM is ready
onDOMReady(initDonatePage);
onDOMReady(initGoFundMeWidget);

// Initialize animations when page is fully loaded
onPageLoad(initDonateAnimations);