function formatNewsDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getNewsTypeLabel(type) {
  if (type === "video") return "Video";
  return "Article";
}

function sortNewsByDate(items) {
  return [...items].sort((a, b) => {
    const left = new Date(`${a.date}T00:00:00`).getTime();
    const right = new Date(`${b.date}T00:00:00`).getTime();
    return right - left;
  });
}

function escapeHtml(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildNewsCard(item) {
  const safeTitle = escapeHtml(item.title);
  const safeSource = escapeHtml(item.sourceLabel || item.source || "Unknown source");
  const safeUrl = escapeHtml(item.url || "#");
  const safeThumbnail = escapeHtml(item.thumbnail || "");
  const ctaLabel = item.type === "video" ? "Watch more" : "Read more";
  const mediaHtml = safeThumbnail
    ? `
      <a class="news-card-media" href="${safeUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open coverage: ${safeTitle}">
        <img src="${safeThumbnail}" alt="${safeTitle}" loading="lazy" />
        ${item.type === "video" ? '<span class="news-video-badge">Video</span>' : ""}
        <div class="news-card-overlay">
          <h3 class="news-card-title">${safeTitle}</h3>
          <p class="news-card-source">${safeSource}</p>
          <span class="news-card-link">${ctaLabel}</span>
        </div>
      </a>
    `
    : "";

  return `
    <article class="news-card">
      ${mediaHtml}
    </article>
  `;
}

function renderNewsList(target, items) {
  if (!target) return;

  if (!Array.isArray(items) || items.length === 0) {
    target.innerHTML = `
      <p class="news-empty-state">
        No coverage has been added yet. Check back soon.
      </p>
    `;
    return;
  }

  target.innerHTML = items.map(buildNewsCard).join("");
}

function renderNewsError(target, message) {
  if (!target) return;
  target.innerHTML = `
    <p class="news-empty-state">${escapeHtml(message)}</p>
  `;
}

async function loadNews() {
  const response = await fetch("../data/news.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load newsroom data.");
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

async function initNewsSections() {
  const homeList = document.getElementById("home-news-list");
  const newsPageList = document.getElementById("news-page-list");

  if (!homeList && !newsPageList) return;

  try {
    const items = sortNewsByDate(await loadNews());

    if (homeList) {
      const featuredItems = items.filter(item => item.featured).slice(0, 2);
      const fallbackItems = items.slice(0, 2);
      renderNewsList(homeList, featuredItems.length > 0 ? featuredItems : fallbackItems);
    }

    if (newsPageList) {
      renderNewsList(newsPageList, items);
    }
  } catch (error) {
    const message = "News is temporarily unavailable. Please try again later.";
    renderNewsError(homeList, message);
    renderNewsError(newsPageList, message);
  }
}

document.addEventListener("DOMContentLoaded", initNewsSections);
