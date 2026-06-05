# مستندات API — Petros Web Builder

پایه URL: `http://localhost:3000`  
فرمت داده: JSON  
هدر الزامی برای POST: `Content-Type: application/json`

---

## فهرست Endpoint ها

| متد | مسیر | توضیح |
|-----|------|-------|
| GET | `/api/health` | بررسی سلامت سرور |
| GET | `/api/templates` | لیست قالب‌های موجود |
| POST | `/api/build` | ساخت سایت و ذخیره در دیتابیس |
| GET | `/api/inventory` | دریافت لیست موجودی انبار |
| POST | `/api/inventory` | افزودن / ویرایش / حذف محصول |
| GET | `/api/accounting` | دریافت لیست تراکنش‌های مالی |
| POST | `/api/accounting` | افزودن / حذف تراکنش |
| GET | `/api/detect-lang` | تشخیص زبان بازدیدکننده بر اساس IP |
| POST | `/api/translate` | ترجمه متن با Google Translate |

---

## GET `/api/health`

بررسی اینکه سرور آنلاین است.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 42
}
```

---

## GET `/api/templates`

لیست کامل ۸ قالب HTML موجود را برمی‌گرداند.

**Response:**
```json
[
  {
    "id": "ecommerce",
    "name": "فروشگاه آنلاین",
    "nameEn": "E-Commerce",
    "icon": "🛒",
    "color": "#2563EB",
    "desc": "فروشگاه اینترنتی با سبد خرید"
  },
  {
    "id": "restaurant",
    "name": "رستوران",
    "nameEn": "Restaurant",
    "icon": "🍽️",
    "color": "#EA580C",
    "desc": "منو دیجیتال و رزرو آنلاین"
  }
]
```

مقادیر معتبر برای `id`: `ecommerce` · `restaurant` · `portfolio` · `landing` · `agency` · `blog` · `medical` · `realestate`

---

## POST `/api/build`

قالب HTML را با داده‌های فرم ادغام می‌کند، نتیجه را در `db.json` ذخیره می‌کند، و موجودی انبار را به‌روز می‌کند.

**Request Body:**
```json
{
  "template": "ecommerce",
  "config": {
    "BRAND_NAME":    "فروشگاه پدرام",
    "NAME":          "فروشگاه پدرام",
    "TAGLINE":       "بهترین قیمت، سریع‌ترین ارسال",
    "PHONE":         "۰۲۱-۸۸۸۸۸۸۸۸",
    "EMAIL":         "info@pedram.com",
    "CITY":          "تهران",
    "ADDRESS":       "خیابان ولیعصر، پلاک ۱۲",
    "PRIMARY_COLOR": "#6366f1",
    "PRIMARY":       "#6366f1",
    "LOGO":          "فروشگاه پدرام",
    "ITEM1":         "کفش ورزشی",
    "ITEM2":         "کیف چرمی",
    "ITEM3":         "عینک آفتابی",
    "PRICE1":        "۴۵۰,۰۰۰",
    "PRICE2":        "۸۹۰,۰۰۰",
    "PRICE3":        "۲۲۰,۰۰۰",
    "STOCK1":        "15",
    "STOCK2":        "8",
    "STOCK3":        "3",
    "PRODUCTS_GRID": "<div class=\"p-card\">...</div>",
    "PAYMENT_LINK":  "https://zarinpal.com/pg/StartPay/xxx",
    "INSTAGRAM":     "@pedramshop",
    "TELEGRAM":      "@pedramshop",
    "SOCIAL_LINKS":  "<a href=\"...\">📸 اینستاگرام</a>"
  }
}
```

**Response موفق (200):**
```json
{
  "siteId": "mq1abc3xyz",
  "html": "<!DOCTYPE html>..."
}
```

**Response خطا (400):**
```json
{ "error": "فیلد template الزامی است" }
```

**Response خطا (404):**
```json
{ "error": "قالب «xyz» یافت نشد" }
```

> **نکته:** پس از فراخوانی موفق، محصولات در `/api/inventory` نیز به‌روزرسانی می‌شوند.

---

## GET `/api/inventory`

لیست کامل محصولات انبار را برمی‌گرداند.

**Response:**
```json
[
  {
    "id": "mq1abc",
    "name": "کفش ورزشی",
    "price": "۴۵۰,۰۰۰",
    "stock": 15,
    "lowStockThreshold": 5,
    "updatedAt": "2026-06-05T10:00:00.000Z"
  }
]
```

وقتی `stock <= lowStockThreshold` هشدار کمبود فعال می‌شود.

---

## POST `/api/inventory`

### افزودن محصول

```json
{
  "action": "add",
  "item": {
    "name":              "کفش ورزشی",
    "price":             "۴۵۰,۰۰۰",
    "stock":             15,
    "lowStockThreshold": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "item": {
    "id":                "mq1abc",
    "name":              "کفش ورزشی",
    "price":             "۴۵۰,۰۰۰",
    "stock":             15,
    "lowStockThreshold": 5,
    "updatedAt":         "2026-06-05T10:00:00.000Z"
  }
}
```

### ویرایش محصول

```json
{
  "action": "update",
  "item": {
    "id":    "mq1abc",
    "stock": 20
  }
}
```

**Response:**
```json
{ "success": true, "item": { "id": "mq1abc", "stock": 20, "..." } }
```

### حذف محصول

```json
{
  "action": "delete",
  "item": { "id": "mq1abc" }
}
```

**Response:**
```json
{ "success": true }
```

**خطاهای احتمالی:**

| کد | پیام |
|----|------|
| 400 | `فیلد action الزامی است` |
| 400 | `نام محصول الزامی است` |
| 400 | `action نامعتبر: xyz` |
| 404 | `محصول یافت نشد` |

---

## GET `/api/accounting`

لیست کامل تراکنش‌های مالی را برمی‌گرداند.

**Response:**
```json
[
  {
    "id":          "mq2def",
    "type":        "income",
    "amount":      500000,
    "description": "فروش کفش ورزشی",
    "category":    "فروش",
    "date":        "2026-06-05"
  }
]
```

مقادیر معتبر `type`: `income` (درآمد) · `expense` (هزینه)

---

## POST `/api/accounting`

### افزودن تراکنش

```json
{
  "action": "add",
  "transaction": {
    "type":        "income",
    "amount":      500000,
    "description": "فروش کفش ورزشی",
    "category":    "فروش",
    "date":        "2026-06-05"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id":          "mq2def",
    "type":        "income",
    "amount":      500000,
    "description": "فروش کفش ورزشی",
    "category":    "فروش",
    "date":        "2026-06-05"
  }
}
```

### حذف تراکنش

```json
{
  "action": "delete",
  "transaction": { "id": "mq2def" }
}
```

**Response:**
```json
{ "success": true }
```

**خطاهای احتمالی:**

| کد | پیام |
|----|------|
| 400 | `مبلغ باید عدد مثبت باشد` |
| 400 | `نوع تراکنش باید income یا expense باشد` |
| 404 | `تراکنش یافت نشد` |

---

## GET `/api/detect-lang`

زبان بازدیدکننده را بر اساس IP تشخیص می‌دهد. برای قالب‌های وبسایت استفاده می‌شود.

**Response:**
```json
{ "country": "IR", "language": "fa" }
```

---

## POST `/api/translate`

متن‌های فارسی را به زبان مقصد ترجمه می‌کند.

**Request Body:**
```json
{
  "texts":      ["سلام دنیا", "خرید کنید"],
  "targetLang": "en"
}
```

**Response:**
```json
{
  "translations": ["Hello World", "Buy Now"]
}
```

> اگر `targetLang` برابر `fa` باشد یا ارسال نشود، متن‌های اصلی بدون تغییر برمی‌گردند.

---

## ساختار `db.json`

```json
{
  "sites": [
    {
      "id":        "mq1abc",
      "template":  "ecommerce",
      "brandName": "فروشگاه پدرام",
      "createdAt": "2026-06-05T10:00:00.000Z",
      "config":    {}
    }
  ],
  "inventory": [
    {
      "id":                "mq2def",
      "name":              "کفش ورزشی",
      "price":             "۴۵۰,۰۰۰",
      "stock":             15,
      "lowStockThreshold": 5,
      "updatedAt":         "2026-06-05T10:00:00.000Z"
    }
  ],
  "transactions": [
    {
      "id":          "mq3ghi",
      "type":        "income",
      "amount":      500000,
      "description": "فروش محصول",
      "category":    "فروش",
      "date":        "2026-06-05"
    }
  ]
}
```
