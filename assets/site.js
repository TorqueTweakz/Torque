/* TORQUE site scripts */

// Set your Discord invite here (e.g. "https://discord.gg/abc123"). Every Discord button on the
// site reads this value. While it is empty, those buttons point to the Community page instead.
const DISCORD_INVITE = "";

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
