/* TORQUE site scripts */

// Set your Discord invite here (e.g. "https://discord.gg/abc123"). Every Discord button on the
// site reads this value. While it is empty, those buttons point to the Community page instead.
const DISCORD_INVITE = "https://discord.gg/BY3MgZftgC";

document.documentElement.classList.add("js");

// Discord links
document.querySelectorAll("[data-discord]").forEach((el) => {
  if (DISCORD_INVITE) {
    el.href = DISCORD_INVITE;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  } else {
    el.href = "community.html";
  }
});
document.querySelectorAll("[data-discord-missing]").forEach((el) => {
  el.hidden = !!DISCORD_INVITE;
});

// Mobile navigation
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && reveals.length) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Copy buttons: <button data-copy="#element-id">
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const target = document.querySelector(btn.dataset.copy);
    if (!target) return;
    const text = target.textContent.trim();
    const label = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      btn.textContent = "Press Ctrl+C";
    }
    setTimeout(() => (btn.textContent = label), 2000);
  });
});

// Tweak table filter
const chips = document.querySelectorAll("[data-filter]");
const rows = document.querySelectorAll("#tweak-rows tr");
const counter = document.getElementById("tweak-count");
if (chips.length && rows.length) {
  const apply = (level) => {
    let n = 0;
    rows.forEach((r) => {
      const show = level === "all" || r.dataset.level === level;
      r.hidden = !show;
      if (show) n++;
    });
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === level)));
    if (counter) counter.textContent = `Showing ${n} of ${rows.length} tweaks`;
  };
  chips.forEach((c) => c.addEventListener("click", () => apply(c.dataset.filter)));
  apply("all");
}

// Beta announcement bar — shown on every page until dismissed (persists via localStorage)
(function initAnnounce() {
  try {
    if (localStorage.getItem("torqueAnnounceDismissed") === "1") return;
  } catch (e) {}
  const link = DISCORD_INVITE || "community.html";
  const attrs = DISCORD_INVITE ? ' target="_blank" rel="noopener noreferrer"' : "";
  const bar = document.createElement("div");
  bar.className = "announce";
  bar.setAttribute("role", "note");
  bar.innerHTML =
    'TORQUE is currently in free public beta. For support and the latest updates, ' +
    '<a href="' + link + '"' + attrs + '>join our Discord</a>.' +
    '<button type="button" class="close" aria-label="Dismiss this message">&times;</button>';
  bar.querySelector(".close").addEventListener("click", () => {
    bar.remove();
    try { localStorage.setItem("torqueAnnounceDismissed", "1"); } catch (e) {}
  });
  document.body.insertBefore(bar, document.body.firstChild);
})();

// Discord join prompt: shows once per browser session, then collapses into a floating widget
(function initDiscordPrompt() {
  const link = DISCORD_INVITE || "community.html";
  const attrs = DISCORD_INVITE ? ' target="_blank" rel="noopener noreferrer"' : "";
  const discordIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';

  const widget = document.createElement("button");
  widget.type = "button";
  widget.className = "discord-widget";
  widget.setAttribute("aria-label", "Join the TORQUE Discord server");
  widget.innerHTML = discordIcon + "<span>Join Discord</span>";
  document.body.appendChild(widget);

  const overlay = document.createElement("div");
  overlay.className = "discord-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Join the TORQUE Discord server");
  overlay.innerHTML =
    '<div class="discord-modal">' +
      '<button type="button" class="close" aria-label="Close">&times;</button>' +
      '<div class="mark">' + discordIcon + '</div>' +
      '<h3>Join the TORQUE community</h3>' +
      '<p>TORQUE is in free public beta. Our Discord is the fastest way to get support, share benchmark results and hear about new releases first.</p>' +
      '<div class="actions">' +
        '<a class="btn btn-discord" href="' + link + '"' + attrs + ' data-join>' + discordIcon + 'Join our Discord</a>' +
        '<button type="button" class="btn btn-secondary" data-dismiss>Not now</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function openModal() {
    overlay.classList.add("show");
    widget.classList.remove("show");
    document.body.style.overflow = "hidden";
  }
  function closeModal(toWidget) {
    overlay.classList.remove("show");
    document.body.style.overflow = "";
    if (toWidget) widget.classList.add("show");
  }

  overlay.querySelector(".close").addEventListener("click", () => closeModal(true));
  overlay.querySelector("[data-dismiss]").addEventListener("click", () => closeModal(true));
  overlay.querySelector("[data-join]").addEventListener("click", () => closeModal(true));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(true); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("show")) closeModal(true);
  });
  widget.addEventListener("click", openModal);

  let alreadyPrompted = false;
  try { alreadyPrompted = sessionStorage.getItem("torqueDiscordPrompted") === "1"; } catch (e) {}

  if (alreadyPrompted) {
    widget.classList.add("show");
  } else {
    setTimeout(() => {
      openModal();
      try { sessionStorage.setItem("torqueDiscordPrompted", "1"); } catch (e) {}
    }, 1600);
  }
})();
