/* =========================================================
   ATLAS — cart.js
   صفحة السلة + نموذج إتمام الشراء (بيانات محلية فقط، بدون خادم)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  let deliveryType = "home";

  /* ---------- حالة تتبّع العرض: لمعرفة ما هو "جديد فعلاً" بين كل نداء وآخر لـ render() ---------- */
  /* يجب تعريف هذه المتغيرات قبل أول استدعاء لـ render() تحديداً، وإلا يقع الكود في
     Temporal Dead Zone (let قبل تعريفها) فيرمي ReferenceError صامتاً، وتختفي السلة كاملة */
  let hasRenderedOnce = false; // يتحول لـ true بعد أول رسم للسلة (فتح الصفحة/المودال أول مرة)
  let knownIds = new Set();    // معرّفات العناصر التي كانت ظاهرة في آخر عرض سابق

  render();
  populateWilayas();
  bindWilayaCascade();
  bindDeliveryToggle();
  bindCheckoutToggle();
  bindCheckoutForm();

  /* ---------- عرض عناصر السلة ---------- */
  function render() {
    const cart = AtlasStore.getCart();
    const list = document.getElementById("cartList");
    const emptyState = document.getElementById("cartEmpty");
    const summaryBox = document.getElementById("cartSummaryBox");

    if (cart.length === 0) {
      list.innerHTML = "";
      emptyState.style.display = "block";
      summaryBox.style.display = "none";
      hideCheckout();
      knownIds = new Set();
      hasRenderedOnce = true;
      return;
    }
    emptyState.style.display = "none";
    summaryBox.style.display = "block";

    const currentIds = new Set(cart.map(i => i.id));
    // العناصر "الجديدة فعلاً" = موجودة الآن ولم تكن موجودة في آخر عرض سابق (أي أُضيفت للتو)
    // في أول عرض على الإطلاق نتركها فارغة لأن كل العناصر ستأخذ حركة الدخول الكاملة أدناه بدلاً منها
    const newlyAddedIds = hasRenderedOnce
      ? [...currentIds].filter(id => !knownIds.has(id))
      : [];

    const subtotal = computeSubtotal();
    list.innerHTML = "";
    cart.forEach(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.id = p.id;
      row.innerHTML = `
        <img src="${p.gallery[0]}" alt="${p.name}">
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          <div class="ci-meta">${p.material} · ${p.colorway}</div>
          <a href="#" class="ci-remove" data-remove="${p.id}">إزالة من السلة</a>
        </div>
        <div class="qty-box">
          <button type="button" data-minus="${p.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-plus="${p.id}">+</button>
        </div>
        <div class="ci-price">${(p.price * item.qty).toLocaleString("ar-DZ")} دج</div>
      `;
      list.appendChild(row);
    });

    document.getElementById("cartSubtotal").textContent = subtotal.toLocaleString("ar-DZ") + " دج";
    document.getElementById("cartTotal").textContent = subtotal.toLocaleString("ar-DZ") + " دج";

    updateCartBadge();
    updateCheckoutSummary();

    if (!hasRenderedOnce) {
      // أول فتح للسلة فقط: حركة دخول ناعمة متتابعة (stagger) لكل العناصر
      gsap.from("#cartList .cart-item", { opacity: 0, y: 24, stagger: .08, duration: .6, ease: "power3.out" });
    } else if (newlyAddedIds.length) {
      // تحديث لاحق (زر + / - أو إضافة منتج): فقط العنصر/العناصر الجديدة فعلاً تتحرك
      const newRows = newlyAddedIds
        .map(id => list.querySelector(`.cart-item[data-id="${id}"]`))
        .filter(Boolean);
      gsap.from(newRows, { opacity: 0, y: 24, duration: .5, ease: "power3.out" });
    }
    // ملاحظة مهمة: أي عنصر كان موجوداً مسبقاً لا يُمرَّر إطلاقاً إلى GSAP هنا،
    // لذا يبقى بحالته الافتراضية (opacity:1) التي ينشئه بها المتصفح دون أي وميض أو تأخير stagger.

    hasRenderedOnce = true;
    knownIds = currentIds;

    list.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.plus;
      const item = AtlasStore.getCart().find(i => i.id === id);
      AtlasStore.updateQty(id, item.qty + 1);
      render();
    }));
    list.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.minus;
      const item = AtlasStore.getCart().find(i => i.id === id);
      if (item.qty <= 1) return removeItem(id);
      AtlasStore.updateQty(id, item.qty - 1);
      render();
    }));
    list.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", (e) => {
      e.preventDefault();
      removeItem(b.dataset.remove);
    }));
  }

  function computeSubtotal() {
    return AtlasStore.getCart().reduce((sum, item) => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
  }

  function removeItem(id) {
    const row = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (row) {
      row.classList.add("removing");
      setTimeout(() => { AtlasStore.removeFromCart(id); render(); }, 380);
    } else {
      AtlasStore.removeFromCart(id); render();
    }
    showToast("تمت إزالة القطعة من السلة");
  }

  document.getElementById("promoBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("الكود غير صالح — هذا عرض تجريبي بدون خادم فعلي");
  });

  /* ---------- كشف/إخفاء نموذج إتمام الشراء ---------- */
  function bindCheckoutToggle() {
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
      if (AtlasStore.getCart().length === 0) return;
      const section = document.getElementById("checkoutSection");
      const wasHidden = section.style.display === "none" || !section.style.display;
      section.style.display = "block";
      updateCheckoutSummary();
      if (wasHidden) {
        gsap.fromTo(section, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: "power3.out" });
      }
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  function hideCheckout() {
    const section = document.getElementById("checkoutSection");
    if (section) section.style.display = "none";
  }

  /* ---------- الولايات الجزائرية الـ58 والبلديات المتحدّثة تلقائيًا ---------- */
  function populateWilayas() {
    const sel = document.getElementById("coWilaya");
    if (!sel) return;
    sel.innerHTML = `<option value="">اختر الولاية</option>` + WILAYAS.map(w => `<option value="${w.code}">${w.code} — ${w.name}</option>`).join("");
  }

  function bindWilayaCascade() {
    const wilayaSel = document.getElementById("coWilaya");
    const communeSel = document.getElementById("coCommune");
    if (!wilayaSel || !communeSel) return;
    wilayaSel.addEventListener("change", () => {
      const w = WILAYAS.find(x => x.code === wilayaSel.value);
      if (!w) {
        communeSel.innerHTML = `<option value="">اختر الولاية أولًا</option>`;
        communeSel.disabled = true;
      } else {
        communeSel.disabled = false;
        communeSel.innerHTML = `<option value="">اختر البلدية</option>` + w.communes.map(c => `<option value="${c}">${c}</option>`).join("");
      }
      clearFieldError("coWilaya");
      updateCheckoutSummary();
    });
    communeSel.addEventListener("change", () => clearFieldError("coCommune"));
  }

  function bindDeliveryToggle() {
    document.querySelectorAll('input[name="coDeliveryType"]').forEach(r => {
      r.addEventListener("change", () => { deliveryType = r.value; updateCheckoutSummary(); });
    });
  }

  function selectedWilaya() {
    const sel = document.getElementById("coWilaya");
    if (!sel) return null;
    return WILAYAS.find(w => w.code === sel.value) || null;
  }

  function updateCheckoutSummary() {
    const subtotalEl = document.getElementById("coSubtotal");
    const deliveryEl = document.getElementById("coDelivery");
    const totalEl = document.getElementById("coTotal");
    if (!subtotalEl) return;
    const subtotal = computeSubtotal();
    const w = selectedWilaya();
    const deliveryPrice = w ? (deliveryType === "home" ? w.homePrice : w.deskPrice) : 0;
    subtotalEl.textContent = subtotal.toLocaleString("ar-DZ") + " دج";
    deliveryEl.textContent = w ? deliveryPrice.toLocaleString("ar-DZ") + " دج" : "—";
    totalEl.textContent = (subtotal + deliveryPrice).toLocaleString("ar-DZ") + " دج";
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

  /* ---------- إرسال نموذج إتمام الشراء ---------- */
  function bindCheckoutForm() {
    const form = document.getElementById("checkoutForm");
    if (!form) return;
    ["coFullName", "coPhone", "coWilaya", "coCommune"].forEach(id => {
      document.getElementById(id).addEventListener("input", () => clearFieldError(id));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (AtlasStore.getCart().length === 0) return;

      let valid = true;
      const name = document.getElementById("coFullName").value.trim();
      const phone = document.getElementById("coPhone").value.trim();
      const wilaya = document.getElementById("coWilaya").value;
      const commune = document.getElementById("coCommune").value;
      const phoneRegex = /^0[5-7][0-9]{8}$/;

      if (name.length < 3) { setFieldError("coFullName", "الرجاء إدخال الاسم الكامل"); valid = false; }
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) { setFieldError("coPhone", "رقم هاتف جزائري غير صحيح (مثال: 0555123456)"); valid = false; }
      if (!wilaya) { setFieldError("coWilaya", "الرجاء اختيار الولاية"); valid = false; }
      if (!commune) { setFieldError("coCommune", "الرجاء اختيار البلدية"); valid = false; }

      if (!valid) {
        gsap.fromTo(form, { x: -6 }, { x: 0, duration: .4, ease: "elastic.out(1,0.3)" });
        return;
      }

      showToast("تم إرسال طلبكِ بنجاح! سنتصل بكِ هاتفياً لتأكيد الشحن.", 4000);
      AtlasStore.setCart([]);
      updateCartBadge();
      form.reset();
      document.getElementById("coCommune").innerHTML = `<option value="">اختر الولاية أولًا</option>`;
      document.getElementById("coCommune").disabled = true;
      deliveryType = "home";
      render();
    });
  }
});
