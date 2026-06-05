require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

const DB_PATH  = path.join(__dirname, 'db.json');
const TPL_DIR  = path.join(__dirname, 'templates');
const PORT     = process.env.PORT || 3000;

// لیست قالب‌های موجود
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

// ── توابع کمکی دیتابیس ───────────────────────────────────────────────────────

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return { sites: [], inventory: [], transactions: [] };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { sites: [], inventory: [], transactions: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    throw new Error('خطا در ذخیره داده: ' + e.message);
  }
}

// شناسه یکتای کوتاه
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── تشخیص زبان بر اساس IP ────────────────────────────────────────────────────

app.get('/api/detect-lang', async (req, res) => {
  try {
    const ip      = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = ip?.split(',')[0].trim();
    const response = await fetch(`https://ipapi.co/${cleanIp}/json/`);
    if (!response.ok) throw new Error('ipapi error');
    const data = await response.json();
    const lang = data.languages?.split(',')[0].split('-')[0] || 'fa';
    res.json({ country: data.country_code || 'IR', language: lang });
  } catch {
    res.json({ country: 'IR', language: 'fa' });
  }
});

// ── ترجمه متن با Google Translate رایگان ─────────────────────────────────────

app.post('/api/translate', async (req, res) => {
  const { texts, targetLang } = req.body;

  if (!Array.isArray(texts)) {
    return res.status(400).json({ error: 'texts باید آرایه باشد' });
  }

  // فارسی نیاز به ترجمه ندارد
  if (!targetLang || targetLang === 'fa') {
    return res.json({ translations: texts });
  }

  try {
    const translated = [];
    for (const text of texts) {
      if (!text || text.trim() === '') { translated.push(text); continue; }
      const url      = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fa&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (!response.ok) { translated.push(text); continue; }
      const data = await response.json();
      translated.push(data[0]?.map(item => item[0]).join('') || text);
    }
    res.json({ translations: translated });
  } catch {
    // در صورت خطا متن اصلی برگردانده می‌شود
    res.json({ translations: texts });
  }
});

// ── لیست قالب‌ها ──────────────────────────────────────────────────────────────

app.get('/api/templates', (_req, res) => {
  res.json(TEMPLATES);
});

// ── ساخت سایت و ذخیره در دیتابیس ────────────────────────────────────────────

app.post('/api/build', (req, res) => {
  const { template, config } = req.body;

  if (!template || typeof template !== 'string') {
    return res.status(400).json({ error: 'فیلد template الزامی است' });
  }
  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'فیلد config الزامی است' });
  }

  // جلوگیری از path traversal
  const safeId  = template.replace(/[^a-z]/g, '');
  const tplPath = path.join(TPL_DIR, `${safeId}.html`);
  if (!fs.existsSync(tplPath)) {
    return res.status(404).json({ error: `قالب «${safeId}» یافت نشد` });
  }

  try {
    let html = fs.readFileSync(tplPath, 'utf8');

    // جایگزینی placeholder ها
    Object.entries(config).forEach(([key, val]) => {
      html = html.split(`{{${key}}}`).join(val ?? '');
    });

    const db   = readDB();
    const site = {
      id:        uid(),
      template:  safeId,
      brandName: config.BRAND_NAME || config.NAME || '',
      createdAt: new Date().toISOString(),
      config
    };
    db.sites.push(site);

    // همگام‌سازی موجودی محصولات با دیتابیس انبار
    [1, 2, 3].forEach(n => {
      const name = config[`ITEM${n}`];
      if (!name || typeof name !== 'string' || !name.trim()) return;
      const price    = config[`PRICE${n}`] || '0';
      const stock    = parseInt(config[`STOCK${n}`]) || 0;
      const existing = db.inventory.find(i => i.name === name.trim());
      if (existing) {
        existing.price     = price;
        existing.stock     = stock;
        existing.updatedAt = new Date().toISOString();
      } else {
        db.inventory.push({
          id: uid(), name: name.trim(), price, stock,
          lowStockThreshold: 5,
          updatedAt: new Date().toISOString()
        });
      }
    });

    writeDB(db);
    res.json({ siteId: site.id, html });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── مدیریت انبار ──────────────────────────────────────────────────────────────

app.get('/api/inventory', (_req, res) => {
  const db = readDB();
  res.json(db.inventory);
});

app.post('/api/inventory', (req, res) => {
  const { action, item } = req.body;

  if (!action) return res.status(400).json({ error: 'فیلد action الزامی است' });
  if (!item)   return res.status(400).json({ error: 'فیلد item الزامی است' });

  try {
    const db = readDB();

    if (action === 'add') {
      if (!item.name?.trim()) return res.status(400).json({ error: 'نام محصول الزامی است' });
      const newItem = {
        id:                uid(),
        name:              item.name.trim(),
        price:             item.price || '0',
        stock:             Math.max(0, parseInt(item.stock) || 0),
        lowStockThreshold: Math.max(0, parseInt(item.lowStockThreshold) || 5),
        updatedAt:         new Date().toISOString()
      };
      db.inventory.push(newItem);
      writeDB(db);
      return res.json({ success: true, item: newItem });
    }

    if (action === 'update') {
      if (!item.id) return res.status(400).json({ error: 'id محصول الزامی است' });
      const idx = db.inventory.findIndex(i => i.id === item.id);
      if (idx === -1) return res.status(404).json({ error: 'محصول یافت نشد' });
      db.inventory[idx] = {
        ...db.inventory[idx],
        name:              item.name?.trim() || db.inventory[idx].name,
        price:             item.price        ?? db.inventory[idx].price,
        stock:             item.stock != null ? Math.max(0, parseInt(item.stock)) : db.inventory[idx].stock,
        lowStockThreshold: item.lowStockThreshold != null ? Math.max(0, parseInt(item.lowStockThreshold)) : db.inventory[idx].lowStockThreshold,
        updatedAt:         new Date().toISOString()
      };
      writeDB(db);
      return res.json({ success: true, item: db.inventory[idx] });
    }

    if (action === 'delete') {
      if (!item.id) return res.status(400).json({ error: 'id محصول الزامی است' });
      const before = db.inventory.length;
      db.inventory  = db.inventory.filter(i => i.id !== item.id);
      if (db.inventory.length === before) return res.status(404).json({ error: 'محصول یافت نشد' });
      writeDB(db);
      return res.json({ success: true });
    }

    res.status(400).json({ error: `action نامعتبر: ${action}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── مدیریت حسابداری ───────────────────────────────────────────────────────────

app.get('/api/accounting', (_req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post('/api/accounting', (req, res) => {
  const { action, transaction } = req.body;
  if (!action) return res.status(400).json({ error: 'فیلد action الزامی است' });

  try {
    const db = readDB();

    if (action === 'add') {
      if (!transaction) return res.status(400).json({ error: 'فیلد transaction الزامی است' });
      const amount = parseFloat(transaction.amount);
      if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'مبلغ باید عدد مثبت باشد' });
      if (!['income', 'expense'].includes(transaction.type)) {
        return res.status(400).json({ error: 'نوع تراکنش باید income یا expense باشد' });
      }
      const newTx = {
        id:          uid(),
        type:        transaction.type,
        amount,
        description: transaction.description?.trim() || '',
        category:    transaction.category?.trim()    || 'عمومی',
        date:        transaction.date || new Date().toISOString().split('T')[0]
      };
      db.transactions.push(newTx);
      writeDB(db);
      return res.json({ success: true, transaction: newTx });
    }

    if (action === 'delete') {
      if (!transaction?.id) return res.status(400).json({ error: 'id تراکنش الزامی است' });
      const before      = db.transactions.length;
      db.transactions   = db.transactions.filter(t => t.id !== transaction.id);
      if (db.transactions.length === before) return res.status(404).json({ error: 'تراکنش یافت نشد' });
      writeDB(db);
      return res.json({ success: true });
    }

    res.status(400).json({ error: `action نامعتبر: ${action}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── سلامت سرور ───────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', uptime: Math.floor(process.uptime()) });
});

// ── صفحه پیش‌فرض ─────────────────────────────────────────────────────────────

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Petros Web Builder — http://localhost:${PORT}`);
  console.log(`📦 انبار:      http://localhost:${PORT}/inventory.html`);
  console.log(`💰 حسابداری:   http://localhost:${PORT}/accounting.html\n`);
});
