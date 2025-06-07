// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const menuOverlay = document.querySelector(".menu-overlay");
  let isAnimating = false;

  function toggleMenu(show) {
    if (isAnimating) return;
    isAnimating = true;

    if (show === undefined) {
      show = !navLinks.classList.contains("active");
    }

    if (show) {
      navLinks.classList.add("active");
      mobileToggle.classList.add("active");
      document.body.classList.add("menu-open");
      // Add initial transform to menu items for animation
      document.querySelectorAll('.nav-links li').forEach((item, index) => {
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';
        item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
      });
      // Force reflow
      navLinks.offsetHeight;
      // Animate in
      document.querySelectorAll('.nav-links li').forEach((item) => {
        item.style.transform = 'translateX(0)';
        item.style.opacity = '1';
      });
    } else {
      document.querySelectorAll('.nav-links li').forEach((item) => {
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';
      });
      navLinks.classList.remove("active");
      mobileToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    // Reset animation flag after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 400); // Match this with your CSS transition duration
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => toggleMenu());
  }
  if (menuOverlay) {
    menuOverlay.addEventListener("click", () => toggleMenu(false));
  }

  // Close menu when clicking on a link
  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      mobileToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      mobileToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});
