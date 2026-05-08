async function loadTimeline() {
  try {
    const scripts = document.getElementsByTagName("script");
    let jsonFile = "/timeline/timeline.json";

    for (let s of scripts) {
      if (s.src.includes("/timeline/timeline.js")) {
        jsonFile = s.getAttribute("data-json") || jsonFile;
        break;
      }
    }

    const response = await fetch(jsonFile);
    const events = await response.json();

    const filterBar = document.getElementById("timeline-filters");
    const categories = [
      { key: "all", label: "All" },
      { key: "official", label: "Official" },
      { key: "fan", label: "Fan Projects" },
      { key: "community", label: "Community" }
    ];

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "tl-filter-btn" + (cat.key === "all" ? " active" : "");
      btn.textContent = cat.label;
      btn.dataset.filter = cat.key;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tl-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterTimeline(cat.key);
      });
      filterBar.appendChild(btn);
    });

    const container = document.getElementById("timeline-container");
    container.innerHTML = '';

    events.forEach((event, index) => {
      const side = event.side || (index % 2 === 0 ? "right" : "left");
      const cat  = event.category || "official";
      const hasLink = event.link && event.link.trim() !== "";

      const cardContent = `
        <div class="tl-img-wrap">
          <img src="${event.image}" alt="${event.title}" onerror="this.style.display='none'">
        </div>
        <div class="tl-card-body">
          <div class="tl-meta">
            <span class="tl-date">${event.date}</span>
            <span class="tl-category tl-cat-${cat}">${cat}</span>
          </div>
          <h3 class="tl-title">${event.title}</h3>
          <p class="tl-desc">${event.description}</p>
          ${hasLink ? '<span class="tl-cta">View page</span>' : ''}
        </div>
      `;

      const cardEl = hasLink
        ? `<a class="tl-card tl-card-link" href="${event.link}">${cardContent}</a>`
        : `<div class="tl-card">${cardContent}</div>`;

      const entryHTML = `
        <div class="tl-entry tl-${side}" data-category="${cat}">
          <div class="tl-connector">
            <div class="tl-dot tl-dot-${cat}"></div>
            <div class="tl-line"></div>
          </div>
          ${cardEl}
        </div>
      `;
      container.innerHTML += entryHTML;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("tl-visible");
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".tl-entry").forEach(el => observer.observe(el));

  } catch (err) {
    console.error("Failed to load timeline:", err);
  }
}

function filterTimeline(category) {
  document.querySelectorAll(".tl-entry").forEach(el => {
    const match = category === "all" || el.dataset.category === category;
    el.style.display = match ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", loadTimeline);