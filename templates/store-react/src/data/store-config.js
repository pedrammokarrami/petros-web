/* داده‌های فروشگاه — در production از window.STORE_DATA تزریق می‌شود */

const MOCK = {
  meta: {
    name:         'PETROS',
    tagline:      'کلکسیون جدید بهار ۱۴۰۴',
    logoUrl:      '',
    primaryColor: '#c9a96e',
    heroImage:    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
    paymentLink:  '#checkout',
    heroDiscount: 'تا ۴۰٪ تخفیف بهاره'
  },
  contact: {
    phone:   '۰۲۱-۸۸۸۸۸۸۸۸',
    email:   'info@petros.shop',
    address: 'تهران، خیابان ولیعصر'
  },
  social: {
    instagram: 'https://instagram.com',
    telegram:  'https://t.me',
    whatsapp:  ''
  },
  categories: [
    { id: 'fashion',     name: 'پوشاک',          icon: '👗', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80' },
    { id: 'electronics', name: 'الکترونیک',       icon: '📱', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&q=80' },
    { id: 'home',        name: 'خانه',            icon: '🏠', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80' },
    { id: 'sport',       name: 'ورزش',            icon: '⚽', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
    { id: 'beauty',      name: 'زیبایی',          icon: '💄', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&q=80' }
  ],
  products: [
    {
      id: '1', name: 'ایرپاد پرو نسل ۳', category: 'electronics',
      price: 4_900_000, originalPrice: 6_500_000,
      stock: 12, rating: 4.8, reviewCount: 234,
      description: 'صدای کریستالی با حذف نویز فعال. اتصال سریع‌تر و باتری ۳۶ ساعته.',
      features: ['حذف نویز ANC', 'باتری ۶+۳۰ ساعت', 'مقاوم IPX4', 'بلوتوث ۵.۳'],
      sizes: null,
      colors: ['#1a1a1a', '#f5f5f0', '#c0a060'],
      images: [
        'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80'
      ]
    },
    {
      id: '2', name: 'ساعت هوشمند GT5 Pro', category: 'electronics',
      price: 3_200_000, originalPrice: 4_100_000,
      stock: 8, rating: 4.6, reviewCount: 187,
      description: 'پایش سلامت ۲۴/۷، GPS داخلی، صفحه AMOLED و باتری ۱۴ روزه.',
      features: ['AMOLED 1.5"', 'GPS داخلی', 'ضربان قلب', 'باتری ۱۴ روز'],
      sizes: null,
      colors: ['#1a1a1a', '#c0a060', '#4a5568'],
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
      ]
    },
    {
      id: '3', name: 'کیف چرم دستی لاکچری', category: 'fashion',
      price: 1_850_000, originalPrice: 0,
      stock: 5, rating: 4.9, reviewCount: 92,
      description: 'چرم طبیعی گاوی دست‌دوز. آستر ابریشم ایتالیایی. طراحی کلاسیک.',
      features: ['چرم طبیعی', 'آستر ابریشم', 'دست‌دوز', 'ظرفیت A4'],
      sizes: ['S', 'M', 'L'],
      colors: ['#3d2b1f', '#1a1a1a', '#c0a060'],
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
      ]
    },
    {
      id: '4', name: 'کفش رانینگ پرو MAX', category: 'sport',
      price: 2_400_000, originalPrice: 3_000_000,
      stock: 20, rating: 4.7, reviewCount: 315,
      description: 'فناوری جذب ضربه پیشرفته. رویه تنفس‌پذیر. زیره Boost.',
      features: ['کف Boost', 'رویه تنفس‌پذیر', 'جذب ضربه 3D', '۲۸۰ گرم'],
      sizes: ['۳۸', '۳۹', '۴۰', '۴۱', '۴۲', '۴۳'],
      colors: ['#1a1a1a', '#f5f5f0', '#4a5568'],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
      ]
    },
    {
      id: '5', name: 'ست مراقبت پوست رویال', category: 'beauty',
      price: 980_000, originalPrice: 1_200_000,
      stock: 30, rating: 4.5, reviewCount: 148,
      description: 'ست کامل شامل سرم ویتامین C، مرطوب‌کننده و کرم دور چشم.',
      features: ['بدون پارابن', 'درماتولوژیست', 'پوست حساس', 'کره جنوبی'],
      sizes: null,
      colors: ['#f5e6d3'],
      images: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'
      ]
    },
    {
      id: '6', name: 'اسپیکر بلوتوث Boom X', category: 'electronics',
      price: 1_350_000, originalPrice: 1_750_000,
      stock: 0, rating: 4.4, reviewCount: 76,
      description: 'صدای ۳۶۰ درجه با باس قوی. ضدآب IPX7. باتری ۲۴ ساعته.',
      features: ['ضدآب IPX7', 'باتری ۲۴ ساعت', 'صدای ۳۶۰°', 'چند دستگاه'],
      sizes: null,
      colors: ['#1a1a1a', '#333333'],
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
      ]
    },
    {
      id: '7', name: 'تابلو دیواری مدرن', category: 'home',
      price: 650_000, originalPrice: 0,
      stock: 15, rating: 4.3, reviewCount: 41,
      description: 'چاپ UV روی بوم کتان. فریم چوب روسی. ابعاد ۸۰×۶۰.',
      features: ['چاپ UV', 'بوم کتان', 'فریم روسی', 'آماده نصب'],
      sizes: ['کوچک', 'متوسط', 'بزرگ'],
      colors: ['#ffffff', '#1a1a1a'],
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80'
      ]
    },
    {
      id: '8', name: 'لپ‌تاپ UltraBook Z14', category: 'electronics',
      price: 28_500_000, originalPrice: 32_000_000,
      stock: 3, rating: 4.9, reviewCount: 56,
      description: 'i9 نسل ۱۴، RAM 32GB، SSD 1TB، صفحه OLED 2.8K.',
      features: ['Core i9 نسل ۱۴', 'RAM 32GB', 'SSD 1TB', 'OLED 2.8K 120Hz'],
      sizes: null,
      colors: ['#c8c8c8', '#1a1a1a'],
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ]
    }
  ],
  about: {
    story: 'PETROS از سال ۱۳۹۸ با هدف ارائه محصولات اصل با قیمت منصفانه آغاز به کار کرد. ما باور داریم هر مشتری حق دارد از بهترین کیفیت با قیمت عادلانه بهره‌مند شود.',
    stats: [
      { label: 'مشتری راضی', value: '50000' },
      { label: 'محصول اصل',  value: '2000'  },
      { label: 'سال تجربه',  value: '6'     },
      { label: 'شهر تحویل',  value: '31'    }
    ],
    team: [
      { name: 'علی رضایی',  role: 'مدیرعامل',   avatar: 'https://i.pravatar.cc/120?img=8' },
      { name: 'مریم احمدی', role: 'مدیر محصول', avatar: 'https://i.pravatar.cc/120?img=5' },
      { name: 'رضا کریمی',  role: 'طراح ارشد',  avatar: 'https://i.pravatar.cc/120?img=3' }
    ]
  }
};

export const storeData = (typeof window !== 'undefined' && window.STORE_DATA) || MOCK;

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--store-primary', storeData.meta.primaryColor);
}
