/* =========================================================
   Muhammad Qayyum — Amazon VA Expert
   Vanilla JS: nav, scroll progress, reveals, 3D tilt,
   magnetic buttons, parallax, counters, form handling.
   ========================================================= */
/* =========================================================
   PRELOADER — animate counter, reveal on load, safe fallback
   ========================================================= */
(function () {
  "use strict";
  const pre = document.getElementById("preloader");
  const body = document.body;
  if (!pre) { body.classList.remove("is-loading"); return; }

  const fill = document.getElementById("preloaderFill");
  const pctEl = document.getElementById("preloaderPct");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minDur = reduce ? 400 : 1300;
  const start = performance.now();
  let progress = 0, done = false, rafId = null;

  function paint(v) {
    const s = Math.round(v);
    if (fill) fill.style.width = s + "%";
    if (pctEl) pctEl.textContent = s;
  }

  function tick(now) {
    // Ease toward 90% over minDur; final 10% reserved for actual load.
    const target = Math.min(90, ((now - start) / minDur) * 90);
    progress += (target - progress) * 0.14;
    paint(progress);
    if (!done) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function finish() {
    if (done) return;
    done = true;
    if (rafId) cancelAnimationFrame(rafId);
    paint(100);
    setTimeout(() => {
      pre.classList.add("hide");
      body.classList.remove("is-loading");
      setTimeout(() => pre.remove(), 950);
    }, reduce ? 120 : 300);
  }

  function ready() {
    const elapsed = performance.now() - start;
    setTimeout(finish, Math.max(0, minDur - elapsed));
  }

  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
  // Hard fallback so the site is never blocked by the preloader.
  setTimeout(finish, 4500);
})();

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Current year ---- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================
     NAV: scrolled state, scroll progress, mobile menu
     ======================================================= */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  // Backdrop for mobile menu
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    backdrop.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMenu() {
    navLinks.classList.add("open");
    navToggle.classList.add("active");
    backdrop.classList.add("show");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  if (navToggle) {
    navToggle.addEventListener("click", () =>
      navLinks.classList.contains("open") ? closeMenu() : openMenu()
    );
  }
  backdrop.addEventListener("click", closeMenu);
  $$(".nav__link, .nav__cta", navLinks).forEach((a) =>
    a.addEventListener("click", closeMenu)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* =======================================================
     SCROLL REVEAL (Intersection Observer)
     ======================================================= */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* =======================================================
     ANIMATED COUNTERS
     ======================================================= */
  const counters = $$(".rcard[data-count]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => {
      const numEl = $(".rcard__num", c);
      if (numEl) numEl.textContent = c.dataset.count + (c.dataset.suffix || "");
    });
  }
  function animateCount(card) {
    const target = parseInt(card.dataset.count, 10) || 0;
    const suffix = card.dataset.suffix || "";
    const numEl = $(".rcard__num", card);
    if (!numEl) return;
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* =======================================================
     3D TILT on cards (desktop, non-reduced)
     ======================================================= */
  if (!isTouch && !prefersReduced) {
    $$(".tilt").forEach((card) => {
      let raf = null;
      const strength = card.classList.contains("dash") ? 6 : 9;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          // dashboard keeps a base isometric angle; cards tilt from flat
          const baseY = card.classList.contains("dash") ? -12 : 0;
          card.style.transform =
            `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) ` +
            `rotateY(${(px * strength + baseY).toFixed(2)}deg) translateY(-4px)`;
        });
      });
      card.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* =======================================================
     MAGNETIC BUTTONS (desktop, non-reduced)
     ======================================================= */
  if (!isTouch && !prefersReduced) {
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* =======================================================
     PARALLAX orbs in hero
     ======================================================= */
  const parallaxEls = $$(".parallax");
  if (parallaxEls.length && !prefersReduced && !isTouch) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxEls.forEach((el) => {
            const d = parseFloat(el.dataset.depth) || 0.15;
            el.style.transform = `translate3d(0, ${(y * d).toFixed(1)}px, 0)`;
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* Hero scene subtle pointer rotation */
  const scene = $("#heroScene");
  if (scene && !isTouch && !prefersReduced) {
    const hero = $(".hero");
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      scene.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 5}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      scene.style.transform = "";
    });
  }

  /* =======================================================
     FORM HANDLING (validation + Formspree AJAX)
     ======================================================= */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    const input = $("input, select, textarea", field);
    if (!input || !input.hasAttribute("required")) {
      // still validate optional email if present & filled
      if (input && input.type === "email" && input.value.trim() && !emailRe.test(input.value.trim())) {
        field.classList.add("invalid");
        return false;
      }
      field.classList.remove("invalid");
      return true;
    }
    let ok = input.value.trim() !== "";
    if (ok && input.type === "email") ok = emailRe.test(input.value.trim());
    field.classList.toggle("invalid", !ok);
    return ok;
  }

  function setupForm(form) {
    if (!form) return;
    const status = $(".form__status", form);
    const submitBtn = $("button[type=submit]", form);
    const fields = $$(".field", form);

    // Live-clear errors while typing
    fields.forEach((f) => {
      const input = $("input, select, textarea", f);
      if (!input) return;
      input.addEventListener("input", () => {
        if (f.classList.contains("invalid")) validateField(f);
      });
      input.addEventListener("blur", () => validateField(f));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((f) => {
        if (!validateField(f)) valid = false;
      });
      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form__status error";
        const firstBad = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form);
        if (firstBad) firstBad.focus();
        return;
      }

      // Guard: unconfigured Formspree endpoint
      if (form.action.includes("YOUR_")) {
        status.textContent = "⚠ Form not configured yet — add your Formspree ID in the code.";
        status.className = "form__status error";
        return;
      }

      submitBtn.classList.add("is-loading");
      status.textContent = "";
      status.className = "form__status";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.textContent = "✅ Thank you! Your message has been sent. I'll reply shortly.";
          status.className = "form__status success";
        } else {
          const data = await res.json().catch(() => ({}));
          status.textContent =
            data && data.errors ? data.errors.map((x) => x.message).join(", ")
                                 : "Something went wrong. Please try again.";
          status.className = "form__status error";
        }
      } catch (err) {
        status.textContent = "Network error. Please check your connection and try again.";
        status.className = "form__status error";
      } finally {
        submitBtn.classList.remove("is-loading");
      }
    });
  }

  setupForm($("#bookingForm"));
  setupForm($("#contactForm"));

  /* =======================================================
     Smooth active-link highlight (optional nicety)
     ======================================================= */
  const sections = $$("main section[id]");
  const linkMap = {};
  $$(".nav__link").forEach((l) => {
    linkMap[l.getAttribute("href").slice(1)] = l;
  });
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap[entry.target.id];
          if (link && entry.isIntersecting) {
            $$(".nav__link").forEach((l) => l.style.removeProperty("color"));
            link.style.color = "var(--orange)";
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => sio.observe(s));
  }
})();
