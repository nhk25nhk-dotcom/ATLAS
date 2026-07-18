/* =========================================================
   ATLAS — admin.js
   لوحة تحكم وهمية بالكامل — بدون أي اتصال بخادم حقيقي
   كل التعديلات تعمل بصريًا على نسخة محلية من البيانات فقط
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  let localProducts = JSON.parse(JSON.stringify(PRODUCTS)); // نسخة محلية قابلة للتعديل بصريًا فقط
  let localOrders = JSON.parse(JSON.stringify(DUMMY_ORDERS));
  let localCategories = JSON.parse(JSON.stringify(CATEGORIES)); // نسخة محلية قابلة للتعديل بصريًا فقط

  initTabs();
  renderKpis();
  renderProductsTable();
  renderOrdersTable();
  renderCategoriesTable();
  populateCategorySelect();
  bindAddProductForm();
  bindAddCategoryForm();
  bindImageUpload();

  let pendingImageDataUrl = null;

  /* ---------- قائمة الأصناف المنسدلة (تُستخدم في نموذج إضافة/تعديل منتج) ---------- */
  function populateCategorySelect() {
    const select = document.getElementById("apCategory");
    if (!select) return;
    const current = select.value;
    select.innerHTML = localCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
    if (current && localCategories.some(c => c.name === current)) select.value = current;
  }

  /* ---------- جدول الأصناف ---------- */
  function renderCategoriesTable() {
    const body = document.getElementById("categoriesTableBody");
    if (!body) return;
    body.innerHTML = localCategories.map(c => {
      const count = localProducts.filter(p => p.category === c.name).length;
      return `
      <tr data-cat="${c.name}">
        <td style="display:flex;align-items:center;gap:14px">
          <img src="${c.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop'}" alt="${c.name}" style="width:44px;height:44px;object-fit:cover;border-radius:50%">
          <strong>${c.name}</strong>
        </td>
        <td>${count.toLocaleString("ar-DZ")}</td>
        <td>
          <div class="row-actions">
            <button data-edit-cat="${c.name}">تعديل</button>
            <button class="danger" data-delete-cat="${c.name}">حذف</button>
          </div>
        </td>
      </tr>`;
    }).join("");

    body.querySelectorAll("[data-delete-cat]").forEach(b => b.addEventListener("click", () => {
      const name = b.dataset.deleteCat;
      const inUse = localProducts.some(p => p.category === name);
      if (inUse) {
        showToast(`لا يمكن حذف «${name}» لأن هناك منتجات تستخدمه — عدّلي فئة هذه المنتجات أولًا`);
        return;
      }
      localCategories = localCategories.filter(c => c.name !== name);
      renderCategoriesTable();
      populateCategorySelect();
      showToast(`تم حذف الصنف «${name}» (محليًا فقط — بدون حفظ حقيقي)`);
    }));

    body.querySelectorAll("[data-edit-cat]").forEach(b => b.addEventListener("click", () => {
      const c = localCategories.find(x => x.name === b.dataset.editCat);
      document.getElementById("acName").value = c.name;
      document.getElementById("acImage").value = c.image || "";
      document.getElementById("addCategoryForm").dataset.editing = c.name;
      document.getElementById("acName").focus();
      showToast("تم تحميل بيانات الصنف للتعديل — اضغطي «حفظ التعديل» بالأسفل");
    }));
  }

  /* ---------- نموذج إضافة/تعديل صنف ---------- */
  function bindAddCategoryForm() {
    const form = document.getElementById("addCategoryForm");
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const editingName = form.dataset.editing;
      const name = document.getElementById("acName").value.trim();
      const image = document.getElementById("acImage").value.trim();

      if (!name) { showToast("الرجاء إدخال اسم الصنف"); return; }

      const duplicate = localCategories.some(c => c.name === name && c.name !== editingName);
      if (duplicate) { showToast("هذا الصنف موجود بالفعل"); return; }

      if (editingName) {
        const c = localCategories.find(x => x.name === editingName);
        c.name = name;
        if (image) c.image = image;
        // تحديث كل المنتجات التي كانت تستخدم الاسم القديم حتى تبقى البيانات متسقة
        localProducts.forEach(p => { if (p.category === editingName) p.category = name; });
        showToast(`تم تحديث الصنف إلى «${name}» (محليًا فقط)`);
      } else {
        localCategories.push({ name, image: image || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop", count: 0 });
        showToast(`تمت إضافة الصنف «${name}» (محليًا فقط)`);
      }

      form.reset();
      delete form.dataset.editing;
      renderCategoriesTable();
      renderProductsTable();
      populateCategorySelect();
    });
  }
  function bindImageUpload() {
    const box = document.getElementById("uploadBox");
    const input = document.getElementById("apImageInput");
    if (!box || !input) return;

    box.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingImageDataUrl = e.target.result;
        box.classList.add("has-image");
        box.innerHTML = `
          <img src="${pendingImageDataUrl}" alt="معاينة الصورة">
          <button type="button" class="upload-remove" title="إزالة الصورة">×</button>`;
        box.querySelector(".upload-remove").addEventListener("click", (ev) => {
          ev.stopPropagation();
          resetUploadBox();
        });
        showToast("تم اختيار الصورة من جهازكِ (معاينة محلية فقط)");
      };
      reader.readAsDataURL(file);
    });

    function resetUploadBox() {
      pendingImageDataUrl = null;
      input.value = "";
      box.classList.remove("has-image");
      box.innerHTML = `<span class="upload-hint">اسحب صورة هنا أو انقر للاختيار من جهازكِ (تجريبي — بدون رفع فعلي لأي خادم)</span>`;
    }
    window.resetAtlasUploadBox = resetUploadBox;
  }

  /* ---------- تبديل الأقسام ---------- */
  function initTabs() {
    const links = document.querySelectorAll(".admin-nav a");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        document.querySelectorAll(".admin-panel").forEach(p => p.style.display = "none");
        const target = document.getElementById(link.dataset.tab);
        target.style.display = "block";
        gsap.from(target, { opacity: 0, y: 16, duration: .5, ease: "power3.out" });
      });
    });
  }

  /* ---------- KPI ---------- */
  function renderKpis() {
    const totalRevenue = localOrders.reduce((s, o) => s + o.total, 0);
    const kpis = [
      { label: "إجمالي الطلبات", value: localOrders.length.toLocaleString("ar-DZ"), delta: "+٣ هذا الأسبوع" },
      { label: "إجمالي الإيرادات", value: totalRevenue.toLocaleString("ar-DZ") + " دج", delta: "+١٢٪ عن الشهر الماضي" },
      { label: "المنتجات المنشورة", value: localProducts.length.toLocaleString("ar-DZ"), delta: "مستقرة" },
      { label: "معدل التحويل", value: "٣.٨٪", delta: "+٠.٤٪" }
    ];
    const wrap = document.getElementById("kpiWrap");
    wrap.innerHTML = kpis.map(k => `
      <div class="admin-kpi">
        <div class="k-label">${k.label}</div>
        <div class="k-value">${k.value}</div>
        <div class="k-delta">${k.delta}</div>
      </div>`).join("");
  }

  /* ---------- جدول المنتجات ---------- */
  function renderProductsTable() {
    const body = document.getElementById("productsTableBody");
    body.innerHTML = localProducts.map(p => `
      <tr data-id="${p.id}">
        <td style="display:flex;align-items:center;gap:14px">
          <img src="${p.gallery[0]}" alt="${p.name}" style="width:44px;height:52px;object-fit:cover;border-radius:2px">
          <div><strong>${p.name}</strong><div style="font-size:.75rem;color:var(--ink-faint)">${p.category}</div></div>
        </td>
        <td>${p.category}</td>
        <td>${p.price.toLocaleString("ar-DZ")} دج</td>
        <td>${p.badge ? `<span class="tag prep">${p.badge}</span>` : "—"}</td>
        <td>
          <div class="row-actions">
            <button data-edit="${p.id}">تعديل</button>
            <button class="danger" data-delete="${p.id}">حذف</button>
          </div>
        </td>
      </tr>`).join("");

    body.querySelectorAll("[data-delete]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.delete;
      const row = body.querySelector(`tr[data-id="${id}"]`);
      gsap.to(row, { opacity: 0, x: 30, duration: .35, onComplete: () => {
        localProducts = localProducts.filter(p => p.id !== id);
        renderProductsTable();
        renderKpis();
        renderCategoriesTable();
        showToast("تم حذف المنتج (محليًا فقط — بدون حفظ حقيقي)");
      }});
    }));
    body.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => {
      const p = localProducts.find(x => x.id === b.dataset.edit);
      document.querySelector('[data-tab="tab-add"]').click();
      document.getElementById("apName").value = p.name;
      document.getElementById("apCategory").value = p.category;
      document.getElementById("apPrice").value = p.price;
      document.getElementById("apDesc").value = p.desc;
      document.getElementById("addProductForm").dataset.editing = p.id;
      document.getElementById("addProductTitle").textContent = "تعديل المنتج (وهمي)";
      showToast("تم تحميل بيانات المنتج للتعديل — بدون حفظ حقيقي");
    }));
  }

  /* ---------- نموذج إضافة/تعديل منتج (بدون حفظ فعلي) ---------- */
  function bindAddProductForm() {
    const form = document.getElementById("addProductForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const editingId = form.dataset.editing;
      const name = document.getElementById("apName").value.trim();
      const category = document.getElementById("apCategory").value.trim() || "حقائب يد";
      const price = parseFloat(document.getElementById("apPrice").value) || 0;
      const desc = document.getElementById("apDesc").value.trim();

      if (!name || !price) { showToast("الرجاء إدخال اسم المنتج والسعر على الأقل"); return; }

      if (editingId) {
        const p = localProducts.find(x => x.id === editingId);
        Object.assign(p, { name, category, price, desc });
        if (pendingImageDataUrl) p.gallery = [pendingImageDataUrl, ...p.gallery.slice(1)];
        showToast("تم تحديث المنتج بصريًا (بدون حفظ فعلي في أي خادم)");
      } else {
        localProducts.unshift({
          id: "atl-" + Math.random().toString(36).slice(2, 7),
          name, category, price, oldPrice: null, material: "—", colorway: "—", badge: "جديد", desc,
          gallery: [pendingImageDataUrl || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop"]
        });
        showToast("تمت إضافة المنتج بصريًا (بدون حفظ فعلي في أي خادم)");
      }
      pendingImageDataUrl = null;
      if (window.resetAtlasUploadBox) window.resetAtlasUploadBox();

      form.reset();
      delete form.dataset.editing;
      document.getElementById("addProductTitle").textContent = "إضافة منتج جديد";
      renderProductsTable();
      renderKpis();
      renderCategoriesTable();
      document.querySelector('[data-tab="tab-products"]').click();
    });
  }

  /* ---------- جدول الطلبات ---------- */
  function renderOrdersTable() {
    const statusClass = { "قيد التحضير": "prep", "تم الشحن": "shipped", "تم التسليم": "delivered", "ملغى": "cancelled" };
    const body = document.getElementById("ordersTableBody");
    body.innerHTML = localOrders.map(o => `
      <tr data-id="${o.id}">
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}<div style="font-size:.75rem;color:var(--ink-faint)">${o.phone}</div></td>
        <td>${o.wilaya} — ${o.commune}</td>
        <td>${o.product}</td>
        <td>${o.total.toLocaleString("ar-DZ")} دج</td>
        <td><span class="tag ${statusClass[o.status]}">${o.status}</span></td>
        <td>
          <div class="row-actions">
            <button data-advance="${o.id}">تحديث الحالة</button>
          </div>
        </td>
      </tr>`).join("");

    const cycle = ["قيد التحضير", "تم الشحن", "تم التسليم"];
    body.querySelectorAll("[data-advance]").forEach(b => b.addEventListener("click", () => {
      const o = localOrders.find(x => x.id === b.dataset.advance);
      const idx = cycle.indexOf(o.status);
      o.status = idx === -1 || idx === cycle.length - 1 ? cycle[0] : cycle[idx + 1];
      renderOrdersTable();
      showToast(`تم تحديث حالة الطلب ${o.id} إلى «${o.status}» (محليًا فقط)`);
    }));
  }
});
