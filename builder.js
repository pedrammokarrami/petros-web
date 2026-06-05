(function () {
  'use strict';

  // لیست قالب‌های موجود — باید با TEMPLATES در server.js همگام باشد
  const TEMPLATES = [
    { id: 'ecommerce',  name: 'فروشگاه آنلاین', nameEn: 'E-Commerce',   icon: '🛒', color: '#2563EB', desc: 'فروشگاه اینترنتی با سبد خرید' },
    { id: 'restaurant', name: 'رستوران',          nameEn: 'Restaurant',   icon: '🍽️', color: '#EA580C', desc: 'منو دیجیتال و رزرو آنلاین' },
    { id: 'portfolio',  name: 'پورتفولیو',         nameEn: 'Portfolio',    icon: '💼', color: '#7C3AED', desc: 'نمایش حرفه‌ای آثار و مهارت‌ها' },
    { id: 'landing',    name: 'لندینگ پیج',        nameEn: 'Landing Page', icon: '🚀', color: '#0891B2', desc: 'صفحه فروش و تبدیل مشتری' },
    { id: 'agency',     name: 'آژانس دیجیتال',     nameEn: 'Agency',       icon: '🏢', color: '#4F46E5', desc: 'شرکت طراحی و توسعه وب' },
    { id: 'blog',       name: 'وبلاگ',            nameEn: 'Blog',         icon: '✍️', color: '#0D9488', desc: 'مجله و وبلاگ محتوا' },
    { id: 'medical',    name: 'کلینیک پزشکی',      nameEn: 'Medical',      icon: '🏥', color: '#0284C7', desc: 'رزرو نوبت و پروفایل پزشکان' },
    { id: 'realestate', name: 'مشاور املاک',       nameEn: 'Real Estate',  icon: '🏠', color: '#059669', desc: 'نمایش آگهی‌های ملکی' }
  ];

  let selectedId = null;

  // ── نمایش گالری قالب‌ها ───────────────────────────────────────────────────

  function renderGallery() {
    const gallery = document.getElementById('template-gallery');
    if (!gallery) return;
    gallery.innerHTML = TEMPLATES.map(t => `
      <div class="tpl-card" data-id="${t.id}" onclick="Builder.select('${t.id}')">
        <div class="tpl-thumb" style="background:linear-gradient(135deg,${t.color},#0f172a)">
          <span class="tpl-icon">${t.icon}</span>
        </div>
        <div class="tpl-meta">
          <strong>${t.name}</strong>
          <small>${t.nameEn}</small>
          <p>${t.desc}</p>
        </div>
      </div>
    `).join('');
  }

  function select(id) {
    selectedId = id;
    document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[data-id="${id}"]`)?.classList.add('selected');

    const tpl   = TEMPLATES.find(t => t.id === id);
    const label = document.getElementById('selected-label');
    if (label) label.textContent = `${tpl?.icon} ${tpl?.name}`;

    // رنگ پیش‌فرض قالب را در فرم اعمال می‌کند
    const colorInput = document.getElementById('f-color');
    if (colorInput && tpl) {
      colorInput.value = tpl.color;
      document.getElementById('f-color-text').value = tpl.color;
    }

    document.getElementById('config-panel').style.display = 'block';
    document.getElementById('config-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── خواندن مقادیر فرم ────────────────────────────────────────────────────

  function val(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function getFormData() {
    const name    = val('f-name')    || 'برند من';
    const color   = val('f-color')   || '#2563EB';
    const logoUrl = val('f-logo');
    const item1   = val('f-item1')   || 'محصول اول';
    const item2   = val('f-item2')   || 'محصول دوم';
    const item3   = val('f-item3')   || 'محصول سوم';
    const price1  = val('f-price1')  || '۱۹۹,۰۰۰';
    const price2  = val('f-price2')  || '۲۹۹,۰۰۰';
    const price3  = val('f-price3')  || '۳۹۹,۰۰۰';
    const payment = val('f-payment');
    const insta   = val('f-instagram');
    const tg      = val('f-telegram');

    // تولید HTML لوگو: اگر URL داده شده تصویر، وگرنه نام برند
    const logoHtml = logoUrl
      ? `<img src="${logoUrl}" alt="${name}" style="height:40px;object-fit:contain">`
      : name;

    // تولید گرید محصولات
    const payHref      = payment || '#';
    const productsGrid = [
      { name: item1, price: price1, icon: '🛍️' },
      { name: item2, price: price2, icon: '📦' },
      { name: item3, price: price3, icon: '⭐' }
    ].map(p => `
      <div class="p-card">
        <div class="p-img">${p.icon}</div>
        <div class="p-body">
          <div class="p-name">${p.name}</div>
          <p class="p-desc" data-i18n>کیفیت بالا — ارسال سریع</p>
          <div class="p-foot">
            <span class="p-price">${p.price} <span data-i18n>تومان</span></span>
            <a href="${payHref}" class="add-btn" target="_blank" rel="noopener" data-i18n>خرید</a>
          </div>
        </div>
      </div>`).join('');

    // تولید لینک‌های شبکه اجتماعی
    const socialLinks = [
      insta ? `<a href="${insta.startsWith('http') ? insta : 'https://instagram.com/' + insta.replace('@', '')}" target="_blank" rel="noopener" style="color:#e1306c;text-decoration:none;font-weight:600">📸 اینستاگرام</a>` : '',
      tg    ? `<a href="${tg.startsWith('http')    ? tg    : 'https://t.me/'          + tg.replace('@', '')}"    target="_blank" rel="noopener" style="color:#0088cc;text-decoration:none;font-weight:600">✈️ تلگرام</a>`    : ''
    ].filter(Boolean).join('  ');

    return {
      // اطلاعات پایه برند
      NAME:       name,
      BRAND_NAME: name,
      TAGLINE:    val('f-tagline') || 'بهترین انتخاب شما',
      PHONE:      val('f-phone')   || '۰۲۱-۱۲۳۴۵۶۷۸',
      EMAIL:      val('f-email')   || 'info@example.com',
      CITY:       val('f-city')    || 'تهران',
      ADDRESS:    val('f-address') || 'خیابان اصلی، پلاک ۱',
      // رنگ و ظاهر
      PRIMARY:       color,
      PRIMARY_COLOR: color,
      LOGO:          logoHtml,
      // محصولات
      ITEM1: item1,  ITEM2: item2,  ITEM3: item3,
      PRICE1: price1, PRICE2: price2, PRICE3: price3,
      STOCK1: val('f-stock1') || '0',
      STOCK2: val('f-stock2') || '0',
      STOCK3: val('f-stock3') || '0',
      PRODUCTS_GRID: productsGrid,
      // پرداخت و شبکه اجتماعی
      PAYMENT_LINK: payment || '#',
      INSTAGRAM:    insta,
      TELEGRAM:     tg,
      SOCIAL_LINKS: socialLinks
    };
  }

  // جایگزینی تمام placeholder های {{KEY}} با مقادیر واقعی
  function replacePlaceholders(html, data) {
    return Object.entries(data).reduce(
      (acc, [key, val]) => acc.split(`{{${key}}}`).join(val ?? ''),
      html
    );
  }

  // ── پیش‌نمایش در iframe ───────────────────────────────────────────────────

  async function preview() {
    if (!selectedId) return alert('لطفاً یک قالب انتخاب کنید');

    const data = getFormData();
    setBusy(true);

    try {
      const [tplRes, transRes] = await Promise.all([
        fetch(`/templates/${selectedId}.html`),
        fetch('/translator.js')
      ]);
      if (!tplRes.ok) throw new Error(`قالب یافت نشد: ${selectedId}.html`);

      const [tplHtml, transJs] = await Promise.all([tplRes.text(), transRes.text()]);

      // مترجم را inline می‌کند تا در blob iframe کار کند
      let processed = replacePlaceholders(tplHtml, data);
      processed = processed.replace(
        '<script src="/translator.js"></script>',
        `<script>${transJs}<\/script>`
      );

      const blob = new Blob([processed], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);

      const frame = document.getElementById('preview-frame');
      if (frame._prevUrl) URL.revokeObjectURL(frame._prevUrl);
      frame._prevUrl = url;
      frame.src = url;

      document.getElementById('preview-section').style.display = 'block';
      frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      alert('خطا در بارگذاری قالب: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  // ── دانلود فایل HTML ──────────────────────────────────────────────────────

  async function download() {
    if (!selectedId) return alert('لطفاً یک قالب انتخاب کنید');

    const data = getFormData();
    setBusy(true);

    try {
      const [tplRes, transRes] = await Promise.all([
        fetch(`/templates/${selectedId}.html`),
        fetch('/translator.js')
      ]);
      if (!tplRes.ok) throw new Error(`قالب یافت نشد: ${selectedId}.html`);

      const [tplHtml, transJs] = await Promise.all([tplRes.text(), transRes.text()]);

      let processed = replacePlaceholders(tplHtml, data);
      // مترجم را برای استفاده standalone inline می‌کند
      processed = processed.replace(
        '<script src="/translator.js"></script>',
        `<script>${transJs}<\/script>`
      );

      const blob     = new Blob([processed], { type: 'text/html' });
      const filename = `${selectedId}-${data.NAME.replace(/\s+/g, '-')}.html`;
      const a        = Object.assign(document.createElement('a'), {
        href:     URL.createObjectURL(blob),
        download: filename
      });
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      alert('خطا در دانلود: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  // ── ذخیره در سرور ────────────────────────────────────────────────────────

  async function saveToServer() {
    if (!selectedId) return alert('لطفاً یک قالب انتخاب کنید');

    const data = getFormData();
    setBusy(true);

    try {
      const res = await fetch('/api/build', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ template: selectedId, config: data })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'خطای سرور');
      alert(`✅ سایت ذخیره شد!\nشناسه: ${result.siteId}\nموجودی محصولات در پنل انبار بروزرسانی شد.`);
    } catch (err) {
      alert('خطا در ذخیره: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  // ── توابع کمکی ───────────────────────────────────────────────────────────

  function setBusy(busy) {
    document.querySelectorAll('#btn-preview, #btn-download, #btn-save').forEach(b => {
      b.disabled     = busy;
      b.style.opacity = busy ? '0.6' : '1';
    });
    const spin = document.getElementById('builder-spinner');
    if (spin) spin.style.display = busy ? 'inline-block' : 'none';
  }

  function init() {
    renderGallery();
    document.getElementById('btn-preview')?.addEventListener('click', preview);
    document.getElementById('btn-download')?.addEventListener('click', download);
    document.getElementById('btn-save')?.addEventListener('click', saveToServer);
    document.getElementById('config-panel').style.display    = 'none';
    document.getElementById('preview-section').style.display = 'none';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Builder = { select, preview, download, saveToServer };
})();
