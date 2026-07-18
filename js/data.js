/* =========================================================
   ATLAS — بيانات وهمية بالكامل (Placeholder / Dummy Data)
   لا يوجد أي اتصال بخادم أو قاعدة بيانات حقيقية.
   ========================================================= */

/* ---------- المنتجات (وهمية ومربوطة بالصور المحددة بدقة) ---------- */
const PRODUCTS = [
  {
    id: "atl-01",
    name: "حقيبة النخبة — أوراس",
    category: "حقائب يد",
    price: 48500,
    oldPrice: 56000,
    material: "جلد بقري إيطالي كامل الحبيبة",
    colorway: "بني صحراوي",
    badge: "الأكثر طلبًا",
    desc: "قطعة تُصنع يدويًا على مدى اثنتي عشرة ساعة متواصلة، بخيوط مشمّعة وحواف مصقولة يدويًا، تحمل بصمة الحرفي في كل غرزة.",
    gallery: [
      "https://images.pexels.com/photos/35685402/pexels-photo-35685402.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/35685401/pexels-photo-35685401.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/35685398/pexels-photo-35685398.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]
  },
  {
    id: "atl-02",
    name: "محفظة السلطان",
    category: "محافظ",
    price: 14200,
    oldPrice: null,
    material: "جلد ماعز مدبوغ نباتيًا",
    colorway: "أسود عاجي",
    badge: null,
    desc: "محفظة نحيلة بثمانية جيوب للبطاقات، تحافظ على شكلها مهما طال الاستعمال بفضل تقنية حشو داخلي خاصة.",
    gallery: [
      "https://images.pexels.com/photos/4830927/pexels-photo-4830927.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/4830924/pexels-photo-4830924.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/4830923/pexels-photo-4830923.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]
  },
  {
    id: "atl-03",
    name: "حقيبة الظهر — تاسيلي",
    category: "حقائب ظهر",
    price: 39900,
    oldPrice: 44500,
    material: "جلد نوباك مع تقوية قماشية",
    colorway: "رملي",
    badge: "إصدار محدود",
    desc: "مستوحاة من كثبان الجنوب، بحزام ظهري مبطّن وفتحة علوية تُغلق بمشبك نحاسي مصقول.",
    gallery: [
      "https://images.pexels.com/photos/4830926/pexels-photo-4830926.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/4830928/pexels-photo-4830928.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/4830926/pexels-photo-4830926.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]  
  },
  {
    id: "atl-04",
    name: "حقيبة الكتف — قسنطينة",
    category: "حقائب يد",
    price: 33500,
    oldPrice: null,
    material: "جلد عجل مصقول",
    colorway: "نبيذي داكن",
    badge: null,
    desc: "خطوط هندسية مستوحاة من جسور المدينة المعلّقة، بحزام قابل للتعديل وبطانة حريرية داخلية.",
    gallery: [
      "https://images.pexels.com/photos/23223859/pexels-photo-23223859.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/23223854/pexels-photo-23223854.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/22434771/pexels-photo-22434771.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]
  },
  {
    id: "atl-05",
    name: "حزام السلطان",
    category: "إكسسوارات",
    price: 9800,
    oldPrice: null,
    material: "جلد جاموس مزدوج الطبقة",
    colorway: "بني عسلي",
    badge: null,
    desc: "إبزيم نحاسي مصبوب يدويًا يحمل شعار الدار، مقاس قابل للتفصيل حسب الطلب.",
    gallery: [
      "https://images.pexels.com/photos/9267587/pexels-photo-9267587.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/9267588/pexels-photo-9267588.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/9267595/pexels-photo-9267595.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]
  },
  {
    id: "atl-06",
    name: "حقيبة السفر — الأطلس الكبير",
    category: "حقائب سفر",
    price: 62000,
    oldPrice: 71000,
    material: "جلد بقري مشمّع + نحاس",
    colorway: "أخضر زيتوني",
    badge: "حصري",
    desc: "رفيق الرحلات الطويلة، بهيكل داخلي صلب وعجلات صامتة وجيب مخصص للوثائق.",
    gallery: [
      "https://images.pexels.com/photos/19539540/pexels-photo-19539540.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/19539541/pexels-photo-19539541.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/19539540/pexels-photo-19539540.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ]
  }
];

/* ---------- الأصناف (تُبنى تلقائياً من فئات المنتجات، لتبقى متزامنة دائماً معها) ---------- */
const CATEGORIES = (() => {
  const map = new Map();
  PRODUCTS.forEach(p => {
    if (!map.has(p.category)) {
      map.set(p.category, { name: p.category, image: p.gallery[0], count: 0 });
    }
    map.get(p.category).count++;
  });
  return Array.from(map.values());
})();

/* ---------- طلبات وهمية (للوحة التحكم) ---------- */
const DUMMY_ORDERS = [
  { id: "ORD-1042", customer: "ياسين بلقاسمي", phone: "0555 12 34 56", wilaya: "الجزائر", commune: "باب الزوار", product: "حقيبة النخبة — أوراس", total: 49700, status: "قيد التحضير", date: "2026-07-05" },
  { id: "ORD-1041", customer: "أمينة شريف", phone: "0661 98 22 10", wilaya: "وهران", commune: "بئر الجير", product: "محفظة السلطان", total: 15100, status: "تم الشحن", date: "2026-07-04" },
  { id: "ORD-1040", customer: "عبد الرزاق مرابط", phone: "0770 44 55 66", wilaya: "قسنطينة", commune: "الخروب", product: "حقيبة الظهر — تاسيلي", total: 40800, status: "تم التسليم", date: "2026-07-03" },
  { id: "ORD-1039", customer: "سارة بن عودة", phone: "0540 11 22 33", wilaya: "تيزي وزو", commune: "أزفون", product: "حزام السلطان", total: 10600, status: "ملغى", date: "2026-07-02" },
  { id: "ORD-1038", customer: "محمد الأمين قايد", phone: "0698 77 12 09", wilaya: "عنابة", commune: "الحجار", product: "حقيبة السفر — الأطلس الكبير", total: 63400, status: "قيد التحضير", date: "2026-07-01" },
  { id: "ORD-1037", customer: "خولة بوزيد", phone: "0552 30 40 50", wilaya: "سطيف", commune: "العلمة", product: "حقيبة الكتف — قسنطينة", total: 34700, status: "تم الشحن", date: "2026-06-30" }
];

/* ---------- الولايات الجزائرية الـ58 والبلديات والتوصيل ---------- */
const WILAYAS = (() => {
  const names = [
    "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة",
    "تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة",
    "سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة",
    "وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة",
    "سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار",
    "أولاد جلال","بني عباس","عين صالح","عين قزام","تقرت","جانت","المغير","المنيعة"
  ];

  const realCommunes = {
    "الجزائر": ["باب الوادي","حسين داي","باب الزوار","الحراش","بئر مراد رايس","الأبيار","بولوغين"],
    "وهران": ["السانية","بئر الجير","العناصر","حي الضاية","المدينة الجديدة"],
    "قسنطينة": ["الخروب","ديدوش مراد","حامة بوزيان","زيغود يوسف"],
    "عنابة": ["الحجار","سرايدي","برحال","الشرفة"],
    "سطيف": ["العلمة","عين ولمان","بابور","جميلة"],
    "تيزي وزو": ["أزفون","عزازقة","تيزي رشد","بوغني"],
    "بجاية": ["أقبو","تيشي","سيدي عيش","سوق الإثنين"],
    "البليدة": ["بوفاريك","موزاية","العفرون","الأربعاء"],
    "تلمسان": ["مغنية","ندرومة","الرمشي","غزوات"],
    "باتنة": ["بريكة","مروانة","عين التوتة","تازولت"],
    "بسكرة": ["طولقة","سيدي عقبة","أورلال","الحاجب"],
    "ورقلة": ["حاسي مسعود","تقرت","النزلة","الطيبات"],
    "غرداية": ["متليلي","بريان","المنيعة","القرارة"],
    "أدرار": ["رقان","تيميمون","أولف","زاوية كنتة"],
    "بشار": ["بني ونيف","القنادسة","تاغيت","العبادلة"],
    "تمنراست": ["عين صالح","عين قزام","إن غزام","تازروك"]
  };

  const genericSuffixes = ["المركز","الشرقية","الغربية","الشمالية","الجنوبية"];

  return names.map((name, i) => {
    const code = String(i + 1).padStart(2, "0");
    const communes = realCommunes[name]
      ? realCommunes[name]
      : genericSuffixes.map(s => `${name} — ${s}`);

    const base = 400 + ((i * 37) % 500);
    const homePrice = Math.round((base + 300) / 10) * 10;
    const deskPrice = Math.round((base) / 10) * 10;

    return { code, name, communes, homePrice, deskPrice };
  });
})();

const KEYWORDS_MARQUEE = ["جلد طبيعي 100%", "صناعة يدوية", "حرفية جزائرية", "دبغ نباتي", "قطع محدودة", "خياطة مزدوجة", "ضمان مدى الحياة", "تراث متجدد"];

const STATS = [
  { value: 58, suffix: "", label: "ولاية نصلها بطلباتنا مع خيار الفحص قبل الدفع" },
  { value: 100, suffix: "٪", label: "قطع أصلية ومستوردة تم اختيارها بعناية" },
  { value: 24, suffix: " سا", label: "متوسط مدة تجهيز طلبيتكِ وشحنها" },
  { value: "حصري", suffix: "", label: "مجموعات بأعداد محدودة لضمان تميزكِ", text: true }
];
