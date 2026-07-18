/* =========================================================
   ATLAS — product.js
   صفحة عرض المنتج + نموذج الطلب (واجهة أمامية فقط)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  let qty = 1;
  let deliveryType = "home"; // home | desk

  renderProduct(product);
  renderWilayas();
  bindGallery(product);
  bindQty();
  bindDeliveryToggle();
  bindForm(product);
  updateSummary(product, qty, deliveryType);

  function renderProduct(p) {
    document.title = `${p.name} — ATLAS`;
    document.getElementById("crumbName").textContent = p.name;
    document.getElementById("pCategory").textContent = p.category;
    document.getElementById("pName").textContent = p.name;
    document.getElementById("pPriceNow").textContent = p.price.toLocaleString("ar-DZ") + " دج";
    const oldEl = document.getElementById("pPriceOld");
    if (p.oldPrice) { oldEl.textContent = p.oldPrice.toLocaleString("ar-DZ") + " دج"; oldEl.style.display = "inline"; }
    else { oldEl.style.display = "none"; }
    document.getElementById("pDesc").textContent = p.desc;
    document.getElementById("pMaterial").textContent = p.material;
    document.getElementById("pColor").textContent = p.colorway;
    document.getElementById("osProductName").textContent = p.name;
  }

  function bindGallery(p) {
    const sharp = document.getElementById("gallerySharp");
    const blur = document.getElementById("galleryBlur");
    const thumbs = document.getElementById("galleryThumbs");
    thumbs.innerHTML = "";
    p.gallery.forEach((src, i) => {
      const b = document.createElement("button");
      b.className = "cursor-view";
      b.dataset.cursor = "انظر";
      b.style.backgroundImage = `url('${src}')`;
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => setImage(src, b));
      thumbs.appendChild(b);
    });
    setImage(p.gallery[0], thumbs.children[0]);

    function setImage(src, activeBtn) {
      gsap.to([sharp, blur], { opacity: 0, duration: .2, onComplete: () => {
        sharp.style.backgroundImage = `url('${src}')`;
        blur.style.backgroundImage = `url('${src}')`;
        gsap.to([sharp, blur], { opacity: 1, duration: .35 });
      }});
      [...thumbs.children].forEach(c => c.classList.remove("active"));
      activeBtn.classList.add("active");
    }

    // Layered parallax on mouse move (depth effect)
    const galleryMain = document.querySelector(".gallery-main");
    galleryMain.addEventListener("mousemove", (e) => {
      const r = galleryMain.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(sharp, { x: px * -14, y: py * -14, duration: .6, ease: "power2.out" });
      gsap.to(blur, { x: px * 18, y: py * 18, duration: .8, ease: "power2.out" });
    });
    galleryMain.addEventListener("mouseleave", () => {
      gsap.to([sharp, blur], { x: 0, y: 0, duration: .8, ease: "power3.out" });
    });
  }

  function bindQty() {
    const display = document.getElementById("qtyDisplay");
    document.getElementById("qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); display.textContent = qty; updateSummary(product, qty, deliveryType); });
    document.getElementById("qtyPlus").addEventListener("click", () => { qty = Math.min(9, qty + 1); display.textContent = qty; updateSummary(product, qty, deliveryType); });

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      AtlasStore.addToCart(product.id, qty);
      updateCartBadge();
      showToast(`تمت إضافة «${product.name}» إلى السلة`);
      gsap.fromTo(".cart-count", { scale: 1.6 }, { scale: 1, duration: .4, ease: "back.out(3)" });
    });
  }

  function renderWilayas() {
    const sel = document.getElementById("wilayaSelect");
    sel.innerHTML = `<option value="">اختر الولاية</option>` + WILAYAS.map(w => `<option value="${w.code}">${w.code} — ${w.name}</option>`).join("");
    sel.addEventListener("change", () => {
      const w = WILAYAS.find(x => x.code === sel.value);
      const communeSel = document.getElementById("communeSelect");
      if (!w) {
        communeSel.innerHTML = `<option value="">اختر البلدية</option>`;
        communeSel.disabled = true;
      } else {
        communeSel.disabled = false;
        communeSel.innerHTML = `<option value="">اختر البلدية</option>` + w.communes.map(c => `<option value="${c}">${c}</option>`).join("");
      }
      clearFieldError("wilayaSelect");
      updateSummary(product, qty, deliveryType);
    });
    document.getElementById("communeSelect").addEventListener("change", () => clearFieldError("communeSelect"));
  }

  function bindDeliveryToggle() {
    document.querySelectorAll('input[name="deliveryType"]').forEach(r => {
      r.addEventListener("change", () => { deliveryType = r.value; updateSummary(product, qty, deliveryType); });
    });
  }

  function selectedWilaya() {
    const code = document.getElementById("wilayaSelect").value;
    return WILAYAS.find(w => w.code === code) || null;
  }

  function updateSummary(p, q, dType) {
    const w = selectedWilaya();
    const subtotal = p.price * q;
    const deliveryPrice = w ? (dType === "home" ? w.homePrice : w.deskPrice) : 0;
    document.getElementById("osQty").textContent = q;
    document.getElementById("osSubtotal").textContent = subtotal.toLocaleString("ar-DZ") + " دج";
    document.getElementById("osDelivery").textContent = w ? deliveryPrice.toLocaleString("ar-DZ") + " دج" : "—";
    document.getElementById("osTotal").textContent = (subtotal + deliveryPrice).toLocaleString("ar-DZ") + " دج";
  }

  function clearFieldError(inputId) {
    const el = document.getElementById(inputId);
    el.closest(".field").classList.remove("error");
    el.closest(".field").querySelector(".err-msg").textContent = "";
  }
  function setFieldError(inputId, msg) {
    const el = document.getElementById(inputId);
    el.closest(".field").classList.add("error");
    el.closest(".field").querySelector(".err-msg").textContent = msg;
  }

  function bindForm(p) {
    const form = document.getElementById("orderForm");
    ["fullName", "phone", "wilayaSelect", "communeSelect"].forEach(id => {
      document.getElementById(id).addEventListener("input", () => clearFieldError(id));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const wilaya = document.getElementById("wilayaSelect").value;
      const commune = document.getElementById("communeSelect").value;
      const phoneRegex = /^0[5-7][0-9]{8}$/;

      if (name.length < 3) { setFieldError("fullName", "الرجاء إدخال الاسم الكامل"); valid = false; }
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) { setFieldError("phone", "رقم هاتف جزائري غير صحيح (مثال: 0555123456)"); valid = false; }
      if (!wilaya) { setFieldError("wilayaSelect", "الرجاء اختيار الولاية"); valid = false; }
      if (!commune) { setFieldError("communeSelect", "الرجاء اختيار البلدية"); valid = false; }

      if (!valid) {
        gsap.fromTo(form, { x: -6 }, { x: 0, duration: .4, ease: "elastic.out(1,0.3)" });
        return;
      }

      AtlasStore.addToCart(p.id, qty);
      updateCartBadge();
      showToast("تم إرسال طلبكِ بنجاح! سنتصل بكِ هاتفياً لتأكيد الشحن.", 4000);
      form.reset();
      document.getElementById("communeSelect").innerHTML = `<option value="">اختر البلدية</option>`;
      document.getElementById("communeSelect").disabled = true;
      qty = 1; document.getElementById("qtyDisplay").textContent = 1;
      updateSummary(p, 1, deliveryType);
    });
  }
});
