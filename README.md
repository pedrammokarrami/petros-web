# 🌐 Petros Web Builder

سازنده وبسایت هوشمند با ترجمه خودکار — ساخته‌شده با Node.js + Express

---

## معرفی

**Petros Web Builder** یک ابزار وب‌محور است که به کسب‌وکارهای کوچک و متوسط امکان می‌دهد در چند دقیقه یک وبسایت حرفه‌ای بسازند.

ویژگی منحصربه‌فرد آن **ترجمه خودکار** است: وبسایت ساخته‌شده، زبان بازدیدکننده را از روی IP تشخیص می‌دهد و محتوا را بلافاصله ترجمه می‌کند — بدون هیچ تنظیم اضافه‌ای.

---

## امکانات

### سازنده سایت
- ۸ قالب حرفه‌ای آماده (فروشگاه، رستوران، کلینیک، مشاور املاک، ...)
- فرم کامل: نام برند، لوگو، رنگ سازمانی، محصولات با قیمت و موجودی
- پشتیبانی از درگاه پرداخت (زرین‌پال، Stripe، PayPal و هر لینک دیگر)
- لینک‌های اینستاگرام و تلگرام در footer قالب
- پیش‌نمایش زنده در iframe
- دانلود فایل HTML آماده برای آپلود
- ذخیره در سرور با sync خودکار موجودی

### ترجمه خودکار
- تشخیص زبان از روی IP بازدیدکننده
- پشتیبانی از ۸۰+ زبان زنده دنیا
- کش LocalStorage با TTL 24 ساعته
- پشتیبانی از زبان‌های RTL (عربی، عبری، اردو)

### پنل انبار
- نمایش موجودی تمام محصولات
- هشدار خودکار برای کمبود موجودی
- افزودن، ویرایش، و حذف محصول
- تعیین حد هشدار برای هر محصول جداگانه

### پنل حسابداری
- ثبت درآمدها و هزینه‌ها
- نمودار میله‌ای ماهانه (Chart.js)
- نمودار donut نسبت درآمد/هزینه
- خلاصه مالی: کل درآمد، کل هزینه، سود خالص

---

## نصب و اجرا

### پیش‌نیازها
- Node.js نسخه ۱۸ یا بالاتر
- npm

### نصب

```bash
git clone https://github.com/YOUR_USERNAME/petros-web.git
cd petros-web
npm install
```

### اجرا

```bash
npm start
```

سرور روی پورت `3000` راه‌اندازی می‌شود:

```
http://localhost:3000              ← سازنده سایت
http://localhost:3000/inventory.html   ← پنل انبار
http://localhost:3000/accounting.html  ← پنل حسابداری
```

### متغیرهای محیطی (اختیاری)

```bash
cp .env.example .env
```

| متغیر | پیش‌فرض | توضیح |
|-------|---------|-------|
| `PORT` | `3000` | پورت سرور |

---

## ساختار پروژه

```
petros-web/
├── server.js           # سرور Express + تمام API ها
├── builder.js          # منطق سمت کلاینت سازنده
├── translator.js       # موتور ترجمه خودکار
├── index.html          # رابط کاربری سازنده
├── inventory.html      # پنل مدیریت انبار
├── accounting.html     # پنل حسابداری
├── templates/          # ۸ قالب HTML آماده
│   ├── ecommerce.html
│   ├── restaurant.html
│   ├── portfolio.html
│   ├── landing.html
│   ├── agency.html
│   ├── blog.html
│   ├── medical.html
│   └── realestate.html
├── API.md              # مستندات کامل API
├── package.json
└── .env.example
```

---

## قالب‌های موجود

| قالب | کاربرد |
|------|---------|
| 🛒 E-Commerce | فروشگاه آنلاین با سبد خرید |
| 🍽️ Restaurant | رستوران با منو دیجیتال و رزرو میز |
| 💼 Portfolio | نمایش حرفه‌ای آثار و مهارت‌ها |
| 🚀 Landing Page | صفحه فروش با pricing و testimonial |
| 🏢 Agency | آژانس دیجیتال و نمونه کارها |
| ✍️ Blog | مجله و وبلاگ با sidebar |
| 🏥 Medical | کلینیک با رزرو نوبت آنلاین |
| 🏠 Real Estate | مشاور املاک با لیست ملک‌ها |

### Placeholder های قالب‌ها

هر قالب از این placeholder ها پشتیبانی می‌کند:

| Placeholder | توضیح |
|-------------|-------|
| `{{BRAND_NAME}}` | نام برند |
| `{{PRIMARY_COLOR}}` | رنگ اصلی (hex) |
| `{{LOGO}}` | تصویر یا متن لوگو |
| `{{PRODUCTS_GRID}}` | گرید محصولات |
| `{{PAYMENT_LINK}}` | لینک درگاه پرداخت |
| `{{TAGLINE}}` | شعار کسب‌وکار |
| `{{PHONE}}` | شماره تماس |
| `{{EMAIL}}` | ایمیل |
| `{{CITY}}` | شهر |
| `{{ADDRESS}}` | آدرس |
| `{{SOCIAL_LINKS}}` | لینک‌های شبکه اجتماعی |

---

## API

مستندات کامل در فایل [API.md](./API.md) موجود است.

خلاصه endpoint ها:

```
GET  /api/templates      ← لیست قالب‌ها
POST /api/build          ← ساخت سایت
GET  /api/inventory      ← موجودی انبار
POST /api/inventory      ← مدیریت انبار (add/update/delete)
GET  /api/accounting     ← تراکنش‌های مالی
POST /api/accounting     ← مدیریت تراکنش (add/delete)
GET  /api/health         ← سلامت سرور
```

---

## فناوری‌های استفاده‌شده

- **Backend:** Node.js + Express
- **Database:** JSON file (db.json)
- **Frontend:** Vanilla JS + HTML + CSS
- **ترجمه:** Google Translate API (رایگان)
- **نمودار:** Chart.js
- **فونت:** Vazirmatn

---

## مشارکت

Pull Request ها و گزارش باگ歡 歡 خوش‌آمد هستند.

---

## لایسنس

MIT
