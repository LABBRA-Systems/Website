// LABBRA Systems - Our Story Page Animations

function initTimelineAnimations() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(
    ".timeline-item, .sd-member-card"
  ).forEach(function (el) {
    observer.observe(el);
  });
}

onDOMReady(initTimelineAnimations);
