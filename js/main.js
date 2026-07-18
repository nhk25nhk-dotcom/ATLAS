/* =========================================================
   ATLAS — main.js
   Lenis (سريع الاستجابة) + GSAP + ScrollTrigger + مؤشر مخصص + Preloader
   ملاحظة: تمت إزالة Three.js/WebGL بالكامل لتخفيف الأداء
   ========================================================= */

/* ---------- تخزين آمن للسلة (بديل عند تعذّر localStorage) ---------- */
const AtlasStore = (() => {
  let memory = { cart: [] };
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };

  return {
    getCart() {
      const raw = safe(() => localStorage.getItem("atlas_cart"), null);
      if (raw) return safe(() => JSON.parse(raw), []);
      return memory.cart;
    },
    setCart(cart) {
      memory.cart = cart;
      safe(() => localStorage.setItem("atlas_cart", JSON.stringify(cart)), null);
    },
    addToCart(productId, qty = 1) {
      const cart = this.getCart();
      const found = cart.find(i => i.id === productId);
      if (found) found.qty += qty; else cart.push({ id: productId, qty });
      this.setCart(cart);
      return cart;
    },
    removeFromCart(productId) {
      const cart = this.getCart().filter(i => i.id !== productId);
      this.setCart(cart);
      return cart;
    },
    updateQty(productId, qty) {
      const cart = this.getCart();
      const found = cart.find(i => i.id === productId);
      if (found) found.qty = Math.max(1, qty);
      this.setCart(cart);
      return cart;
    },
    count() {
      return this.getCart().reduce((s, i) => s + i.qty, 0);
    }
  };
})();

/* ---------- تشغيل عام بعد تحميل DOM ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  if (typeof ScrollTrigger !== "undefined") {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
  }

  initPreloader(() => {
    initLenis();
    initCursor();
    initNav();
    initMagnetic();
    initMarquee();
    initHeroKinetic();
    initHeroParallax();
    initSectionStagger();
    initSectionReveal();
    initRevealAnimations();
    initImageReveal();
    initCardParallax();
    initCounters();
    initTilt();
    initStory();
    initHscroll();
    initQuickAdd();
    initNewsletter();
    updateCartBadge();
  });
});

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = AtlasStore.count(); });
}

/* ---------- Preloader ---------- */
function initPreloader(done) {
  const pre = document.getElementById("preloader");
  if (!pre) { done(); return; }
  const bar = pre.querySelector(".pl-bar span");
  const pct = pre.querySelector(".pl-pct");
  let n = { v: 0 };
  gsap.to(n, {
    v: 100, duration: 1.4, ease: "power2.inOut",
    onUpdate: () => {
      const val = Math.round(n.v);
      if (bar) bar.style.width = val + "%";
      if (pct) pct.textContent = val + "٪";
    },
    onComplete: () => {
      gsap.to(pre, {
        yPercent: -100, duration: .8, ease: "power4.inOut", delay: .1,
        onComplete: () => { pre.style.display = "none"; done(); }
      });
    }
  });
}

/* ---------- Lenis smooth scroll (سريع الاستجابة، Lerp منخفض) ---------- */
let lenis;
function initLenis() {
  if (typeof Lenis === "undefined") { document.documentElement.style.scrollBehavior = "smooth"; return; }
  lenis = new Lenis({
    duration: 0.7,               // مدة أقصر = استجابة أسرع
    smoothWheel: true,
    wheelMultiplier: 1.15,
    touchMultiplier: 1.6,
    easing: (t) => 1 - Math.pow(1 - t, 2.2) // Ease-out أخف من قبل (كان مكعبًا الآن تربيعي تقريبًا)
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -20 });
      }
    });
  });
}

/* ---------- مؤشر مخصص: دائرة تكبر وتُظهر نصًا "استكشف / انظر" فوق المنتجات ---------- */
function initCursor() {
  if (window.matchMedia("(max-width:900px)").matches || window.matchMedia("(pointer:coarse)").matches) {
    document.body.classList.add("no-custom-cursor");
    return;
  }
  const dot = document.createElement("div"); dot.className = "cursor-dot";
  const ring = document.createElement("div"); ring.className = "cursor-ring";
  const label = document.createElement("div"); label.className = "cursor-label";
  document.body.append(dot, ring, label);

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    label.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  });

  // تكبير بسيط فوق أي رابط أو زر
  document.querySelectorAll("a,button,.magnetic,input,select").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });

  // نص "استكشف / انظر" فوق عناصر المنتجات والمعرض تحديدًا
  document.querySelectorAll(".cursor-view").forEach(el => {
    const text = el.dataset.cursor || "استكشف";
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-view");
      label.textContent = text;
      label.classList.add("show");
      dot.classList.add("hidden");
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-view");
      label.classList.remove("show");
      dot.classList.remove("hidden");
    });
  });
}

/* ---------- Nav + morphing menu ---------- */
function initNav() {
  const nav = document.querySelector(".site-nav");
  if (nav) {
    ScrollTrigger.create({
      start: 40, end: 99999,
      onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 40)
    });
  }
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".menu-overlay");
  if (burger && overlay) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      overlay.classList.toggle("open");
      if (lenis) overlay.classList.contains("open") ? lenis.stop() : lenis.start();
    });
    overlay.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      burger.classList.remove("active"); overlay.classList.remove("open");
      if (lenis) lenis.start();
    }));
    // النقر على الخلفية المعتمة خارج اللوحة (وليس على اللوحة نفسها) يُغلق القائمة
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        burger.classList.remove("active"); overlay.classList.remove("open");
        if (lenis) lenis.start();
      }
    });
  }
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.45, duration: .4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,0.4)" }));
  });
}

/* ---------- Marquee (infinite, duplicated for seamless loop) ---------- */
function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach(track => {
    if (!track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "1";
    }

    let tween;
    const start = () => {
      const distance = track.scrollWidth / 2;
      if (!distance) return; // العنصر غير مرئي بعد (مثلاً display:none)، لا داعي للبدء الآن
      if (tween) tween.kill();
      gsap.set(track, { x: 0 });
      tween = gsap.to(track, { x: -distance, duration: distance / 60, ease: "none", repeat: -1 });
    };

    /* هام: ننتظر اكتمال تحميل الخط الفعلي (document.fonts.ready) قبل قياس عرض الشريط.
       القياس المبكر بخط بديل مؤقت ينتج مسافة أصغر من الحقيقية، فيظهر فراغ فارغ متكرر
       كل دورة إلى أن "يقفز" الشريط فجأة — وهو ما كان يبدو وكأن الشريط "يظهر مرة كل مدة" */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    // إعادة الحساب عند تغيير حجم الشاشة (تدوير الجوال، تكبير/تصغير النافذة) حتى لا يفقد الشريط تزامنه
    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(start, 200);
    });
  });
}

/* ---------- Hero kinetic typography (على مستوى الكلمة كاملة، لا الحرف — يحافظ على اتصال الحروف العربية) ---------- */
function initHeroKinetic() {
  const hero = document.querySelector(".hero-kinetic");
  if (!hero) return;
  const words = hero.querySelectorAll(".word-inner");
  gsap.set(words, { yPercent: 115 });
  gsap.timeline({ delay: .2 })
    .to(words, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.14 })
    .to(".hero-sub", { opacity: 1, y: 0, duration: .9, ease: "power3.out" }, "-=0.55")
    .to(".hero-scroll", { opacity: 1, duration: .6 }, "-=0.5");
}

/* ---------- Parallax للصور الطبقية في الـ Hero (بديل الـ 3D) ---------- */
function initHeroParallax() {
  const layers = document.querySelectorAll(".hero-media .h-layer");
  if (!layers.length) return;
  layers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed || "10");
    gsap.to(layer, {
      yPercent: speed, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  });
}

/* ---------- Stagger ناعم لعناصر رأس كل قسم (Eyebrow / العنوان / الوصف) ---------- */
function initSectionStagger() {
  document.querySelectorAll(".section-head").forEach(head => {
    const items = head.querySelectorAll(".eyebrow, h2, .section-desc");
    gsap.from(items, {
      opacity: 0, y: 26, duration: .9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: head, start: "top 85%" }
    });
  });
}

/* ---------- كشف كل قسم بالكامل بسلاسة عند الوصول إليه بالتمرير ---------- */
function initSectionReveal() {
  document.querySelectorAll(".section").forEach(section => {
    gsap.from(section, {
      opacity: 0, y: 46, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 82%" }
    });
  });
}

/* ---------- Generic scroll reveal + stagger ---------- */
function initRevealAnimations() {
  document.querySelectorAll(".reveal").forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });
  document.querySelectorAll(".stagger-group").forEach(group => {
    gsap.from(group.children, {
      opacity: 0, y: 40, duration: .9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 85%" }
    });
  });
  document.querySelectorAll(".fade-in").forEach(el => {
    gsap.to(el, { opacity: 1, duration: 1.2, scrollTrigger: { trigger: el, start: "top 90%" } });
  });
}

/* ---------- كشف الصور (Image Reveal) بـ clip-path عند التمرير ---------- */
function initImageReveal() {
  const groups = {};
  document.querySelectorAll(".reveal-img").forEach(el => {
    const key = el.closest(".bento") ? "bento" : el.closest(".hscroll-track") ? "hscroll" : "single-" + Math.random();
    (groups[key] = groups[key] || []).push(el);
  });
  Object.values(groups).forEach(elements => {
    gsap.to(elements, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.out", stagger: 0.08,
      scrollTrigger: { trigger: elements[0], start: "top 90%" }
    });
  });
}

/* ---------- Parallax خفيف جدًا للصور داخل الكروت (عمق بصري) ---------- */

function initCardParallax() {
  document.querySelectorAll(".bento-card .bc-img, .bento-card .bc-img-hover, .cat-card .cat-img").forEach(img => {
    gsap.to(img, {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: img.closest(".bento-card, .cat-card"), start: "top bottom", end: "bottom top", scrub: true }
    });
  });

}

/* ---------- Animated counters ---------- */
function initCounters() {
  document.querySelectorAll("[data-counter]").forEach(el => {
    const target = parseFloat(el.dataset.counter);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(obj, {
        v: target, duration: 2, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("ar-DZ"); }
      })
    });
  });
}

/* ---------- Tilt خفيف عند الـ Hover (بطاقات) ---------- */
function initTilt() {
  document.querySelectorAll(".tilt-el").forEach(card => {
    card.style.transform = "perspective(900px)";
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, duration: .5, ease: "power2.out", transformPerspective: 900 });
    });
    card.addEventListener("mouseleave", () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .7, ease: "power3.out" }));
  });
}

/* ---------- Storytelling horizontal-pin section ---------- */
function initStory() {
  const section = document.querySelector(".story");
  const sticky  = document.querySelector(".story-sticky");
  const track   = document.querySelector(".story-track");
  if (!section || !sticky || !track) return;

  const panels = gsap.utils.toArray(".story-panel", track);
  const bar = document.querySelector(".story-progress span");
  if (!panels.length) return;

  // تنظيف أي تداخلات قديمة تماماً (مهم عند استدعاء initStory أكثر من مرة، مثلاً بعد HMR)
  gsap.killTweensOf(track);
  const oldST = ScrollTrigger.getById("atlasStory");
  if (oldST) oldST.kill();

  /*
    نُحقن عرض اللوحة كقيمة بكسل حقيقية (وليس 100vw) عبر متغير CSS --panel-w
    المُعرَّف على .story نفسها. هذا يقيس عرض .story-sticky الفعلي (الذي يستثني
    شريط التمرير العمودي)، فتتطابق أبعاد اللوحات تماماً مع مسافة التمرير المحسوبة
    ولا يتراكم أي فارق بكسل يسبب "القفزات" عند حدود اللوحات.
  */
  let panelWidth = 0;
  const measure = () => {
    panelWidth = Math.round(sticky.getBoundingClientRect().width);
    section.style.setProperty("--panel-w", panelWidth + "px");
    return panelWidth;
  };
  measure();

  // مسافة التمرير الأفقي الكلية = عدد اللوحات ناقص واحد × عرض اللوحة (قيمة حتمية، بلا كسور)
  const getDistance = () => panelWidth * (panels.length - 1);

  // التأكد من أن كل النصوص ظاهرة وثابتة في مكانها الأصلي داخل كل لوحة
  panels.forEach(panel => {
    gsap.set(panel.querySelectorAll(".sp-text > *"), { opacity: 1, y: 0, clearProps: "willChange" });
  });

  // التثبيت والتمرير الأفقي الصافي
  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      id: "atlasStory",
      trigger: section,
      start: "top top",
      end: () => "+=" + getDistance(),
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,       // يمنع الوميض/القفزة اللحظية عند الوصول إلى نقطة التثبيت
      invalidateOnRefresh: true,
      onRefreshInit: measure, // إعادة القياس قبل كل إعادة حساب من GSAP، لا تعتمد فقط على window resize
      onUpdate: (self) => {
        if (bar) bar.style.width = (self.progress * 100) + "%";
      }
    }
  });

  // إعادة قياس فورية عند تغيّر مقاس النافذة (تدوير الجوال، تغيير حجم المتصفح)
  let resizeRAF;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
      measure();
      ScrollTrigger.refresh();
    });
  });
}
/* ---------- زر إضافة سريعة للسلة على بطاقات المنتجات (Bento + الكاروسيل) ---------- */
function initQuickAdd() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-add");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = btn.dataset.id;
    if (!id) return;
    AtlasStore.addToCart(id, 1);
    updateCartBadge();
    const name = btn.dataset.name || "المنتج";
    showToast(`تمت إضافة «${name}» إلى السلة`, 2400);
    btn.classList.add("bumped");
    gsap.fromTo(btn, { scale: 1 }, { scale: 1.15, duration: .18, yoyo: true, repeat: 1, ease: "power1.inOut" });
    gsap.fromTo(".cart-count", { scale: 1.6 }, { scale: 1, duration: .4, ease: "back.out(3)" });
    setTimeout(() => btn.classList.remove("bumped"), 700);
  });
}

/* ---------- نشرة بريدية: كشف حقل البريد بدون أي اتصال بخادم ---------- */
function initNewsletter() {
  const toggleBtn = document.getElementById("newsletterToggle");
  const form = document.getElementById("newsletterForm");
  if (!toggleBtn || !form) return;
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.classList.add("open");
    toggleBtn.style.display = "none";
    form.querySelector("input")?.focus();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("شكرًا لاشتراككِ — هذا عرض تجريبي بدون خادم فعلي", 3200);
    form.reset();
  });
}
function initHscroll() {
  document.querySelectorAll(".hscroll-wrap").forEach(wrap => {
    const track = wrap.querySelector(".hscroll-track");
    if (!track) return;
    let isDown = false, startX, scrollLeft;
    wrap.style.overflowX = "auto";
    wrap.style.cursor = "grab";
    wrap.style.scrollbarWidth = "none";
    wrap.addEventListener("mousedown", (e) => { isDown = true; wrap.classList.add("grabbing"); startX = e.pageX; scrollLeft = wrap.scrollLeft; });
    window.addEventListener("mouseup", () => isDown = false);
    wrap.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = (e.pageX - startX) * 1.2;
      wrap.scrollLeft = scrollLeft - walk;
    });
    wrap.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        wrap.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });
}

/* ---------- Toast أنيق في أعلى الصفحة، متحرك بـ GSAP بالكامل ---------- */
function showToast(msg, duration = 4000) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="dot"></span><span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-msg").textContent = msg;

  if (typeof gsap === "undefined") { toast.style.opacity = 1; return; }

  gsap.killTweensOf(toast);
  gsap.fromTo(toast, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out" });
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    gsap.to(toast, { y: -50, opacity: 0, duration: .5, ease: "power2.in" });
  }, duration);
}
