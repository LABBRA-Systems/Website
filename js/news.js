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

function isInternalNewsUrl(url) {
  if (typeof url !== "string") return false;
  return (
    url.startsWith("mailto:") ||
    url.startsWith("#") ||
    url.startsWith("solution.html") ||
    url.startsWith("story.html") ||
    url.startsWith("home.html") ||
    url.startsWith("../pages/")
  );
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
  const internal = isInternalNewsUrl(item.url || "");
  const relAttr = internal ? "" : ' rel="noopener noreferrer"';
  const targetAttr = internal ? "" : ' target="_blank"';
  const ctaRaw =
    item.ctaLabel ||
    (item.type === "video" ? "Watch" : internal ? "Open" : "Read more");
  const ctaLabel = escapeHtml(ctaRaw);
  const videoBadge = item.type === "video" ? '<span class="news-video-badge">Video</span>' : "";
  const imgHtml = safeThumbnail
    ? `<img src="${safeThumbnail}" alt="" loading="lazy" />`
    : `<div class="news-card-synthetic" aria-hidden="true"></div>`;

  const mediaHtml = `
      <a class="news-card-media"${targetAttr} href="${safeUrl}"${relAttr} aria-label="${ctaLabel}: ${safeTitle}">
        ${imgHtml}
        ${videoBadge}
        <div class="news-card-overlay">
          <h3 class="news-card-title">${safeTitle}</h3>
          <p class="news-card-source">${safeSource}</p>
          <span class="news-card-link">${ctaLabel}</span>
        </div>
      </a>
    `;

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
      renderNewsList(homeList, items.slice(0, 4));
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
