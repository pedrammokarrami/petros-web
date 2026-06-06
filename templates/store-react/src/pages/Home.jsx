import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storeData } from '../data/store-config';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard, { cardItem } from '../components/ProductCard';

const ff = 'Inter, -apple-system, sans-serif';
const ease = [0.25, 0.1, 0.25, 1];

/* دسته‌بندی‌های نمایشی → map به storeData */
const CATS = [
  { id: 'all',      label: 'All',      icon: '⊞', storeId: null },
  { id: 'sneakers', label: 'Sneakers', icon: '👟', storeId: 'sport' },
  { id: 'jackets',  label: 'Jackets',  icon: '🧥', storeId: 'fashion' },
  { id: 'shirts',   label: 'Shirts',   icon: '👔', storeId: 'fashion' },
  { id: 'bags',     label: 'Bags',     icon: '👜', storeId: 'fashion' },
  { id: 'watches',  label: 'Watches',  icon: '⌚', storeId: 'electronics' },
  { id: 'home',     label: 'Home',     icon: '🏠', storeId: 'home' },
  { id: 'beauty',   label: 'Beauty',   icon: '💄', storeId: 'beauty' },
];

const grid = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

/* ── کارت Featured بزرگ ── */
function FeaturedCard({ product, onClick }) {
  return (
    <div style={{ position: 'relative', overflow: 'visible' }}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
          background:   'linear-gradient(135deg,#1a3a6e,#2952CC)',
          borderRadius: 20,
          padding:      '20px',
          height:       180,
          overflow:     'hidden',
          direction:    'ltr',
          cursor:       'pointer',
        }}
      >
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, fontFamily: ff }}>
          FEATURED
        </div>
        <div style={{
          fontSize: 16, fontWeight: 800, color: '#fff',
          maxWidth: '55%', lineHeight: 1.3, marginTop: 6, fontFamily: ff,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#5B8DEF', marginTop: 8, fontFamily: ff }}>
          {Number(product.price).toLocaleString('fa-IR')} ت
        </div>
      </motion.div>

      {/* عکس بیرون از کارت */}
      <img
        src={product.images?.[0] || ''}
        alt={product.name}
        style={{
          position:      'absolute',
          top:           -20,
          right:         -10,
          width:         140,
          height:        140,
          objectFit:     'contain',
          filter:        'drop-shadow(0 15px 30px rgba(0,0,0,0.6))',
          transform:     'rotate(-12deg)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ── کارت Small ── */
function SmallCard({ product, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background:  'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding:      '12px',
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        height:       84,
        border:       '1px solid rgba(255,255,255,0.1)',
        direction:    'ltr',
        cursor:       'pointer',
        overflow:     'hidden',
        fontFamily:   ff,
        boxSizing:    'border-box',
      }}
    >
      <img
        src={product.images?.[0] || ''}
        alt={product.name}
        style={{
          width: 60, height: 60, objectFit: 'contain', flexShrink: 0,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{product.name}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#5B8DEF' }}>
          {Number(product.price).toLocaleString('fa-IR')} ت
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate       = useNavigate();
  const { add }        = useCart();
  const { add: toast } = useToast();
  const [activeCat, setActiveCat] = useState('all');

  const { meta, products } = storeData;

  /* فیلتر بر اساس دسته‌بندی انتخابی */
  const cat = CATS.find(c => c.id === activeCat);
  const filtered = useMemo(() => {
    if (!cat?.storeId) return products;
    return products.filter(p => p.category === cat.storeId);
  }, [activeCat, products]);

  /* top 3 برای featured */
  const top3 = useMemo(() =>
    [...filtered].sort((a,b) => (b.reviewCount||0) - (a.reviewCount||0)).slice(0, 3),
    [filtered]
  );
  const [featBig, feat1, feat2] = top3;

  /* بقیه محصولات برای grid */
  const gridProds = useMemo(() => {
    const featIds = new Set(top3.map(p => p.id));
    return filtered.filter(p => !featIds.has(p.id));
  }, [filtered, top3]);

  const catLabel = cat?.id === 'all' ? 'All Products' : cat?.label || '';

  return (
    <div style={{
      background: '#0d1b3e',
      height:     '100dvh',
      overflowY:  'auto',
    }}>
    <div style={{
      maxWidth:      430,
      margin:        '0 auto',
      minHeight:     '100dvh',
      background:    '#0d1b3e',
      position:      'relative',
      overflow:      'hidden',
      paddingBottom: 90,
      fontFamily:    ff,
    }}>

      {/* ══ هدر ══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .28, ease }}
        style={{
          padding:    '52px 20px 20px',
          background: 'linear-gradient(180deg, rgba(41,82,204,0.22) 0%, transparent 100%)',
        }}
      >
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          direction:      'ltr',
        }}>
          {/* left: notification */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            style={{
              width: 42, height: 42, borderRadius: 21,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0,
            }}
          >
            🔔
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7, borderRadius: '50%',
              background: '#ef4444', border: '1.5px solid #0d1b3e',
            }}/>
          </motion.button>

          {/* center: title */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 6,
            }}>
              Discover Your Style
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              Redefining{' '}
              <span style={{
                background: 'linear-gradient(90deg,#5B8DEF,#a5c3ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Shopping</span>
              {' '}with
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              POWER Intelligence!
            </div>
          </div>

          {/* right: avatar */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/settings')}
            style={{
              width: 42, height: 42, borderRadius: 21,
              background: 'linear-gradient(135deg, #2952CC, #5B8DEF)',
              border: '2px solid rgba(91,141,239,0.45)',
              fontSize: 18, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >👤</motion.button>
        </div>
      </motion.div>

      {/* ══ دسته‌بندی‌ها — scroll افقی ══ */}
      <div style={{
        display:    'flex',
        gap:        16,
        overflowX:  'auto',
        padding:    '0 16px 16px',
        direction:  'ltr',
      }}>
        {CATS.map((cat, i) => {
          const isA = activeCat === cat.id;
          return (
            <motion.button key={cat.id}
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * .045, duration: .2, ease }}
              whileTap={{ scale: .86 }}
              onClick={() => setActiveCat(cat.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 28,
                background: isA ? '#2952CC' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isA ? 'rgba(91,141,239,0.5)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
                boxShadow: isA ? '0 4px 16px rgba(41,82,204,0.5)' : 'none',
                transition: 'all .18s',
              }}>{cat.icon}</div>
              <span style={{
                fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                color: isA ? '#5B8DEF' : 'rgba(255,255,255,0.45)',
                transition: 'color .18s',
              }}>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ══ سرتیتر بخش ══ */}
      <AnimatePresence mode="wait">
        <motion.div key={activeCat}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: .2, ease }}
          style={{ padding: '0 16px 12px' }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
          }}>
            {/* فیلتر و مرتب‌سازی */}
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                whileTap={{ scale: .9 }}
                onClick={() => navigate('/search')}
                style={{
                  height: 28, borderRadius: 14, padding: '0 10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: ff,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >⚙️ Filter</motion.button>
              <motion.button
                whileTap={{ scale: .9 }}
                onClick={() => navigate('/products')}
                style={{
                  height: 28, borderRadius: 14, padding: '0 10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: ff,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >⇅ Sort</motion.button>
            </div>
            {/* عنوان */}
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{catLabel}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <motion.button
              whileTap={{ scale: .95 }}
              onClick={() => navigate('/products')}
              style={{
                background: 'none', border: 'none',
                color: '#5B8DEF', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: ff,
              }}
            >مشاهده همه ←</motion.button>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              {filtered.length} محصول
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ══ بخش Featured: کارت بزرگ + ۲ کارت کوچک ══ */}
      {featBig && (
        <AnimatePresence mode="wait">
          <motion.div key={activeCat + '-feat'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .25, ease }}
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 12,
              padding:             '0 16px',
              marginBottom:        12,
              overflow:            'visible',
            }}
          >
            {/* کارت بزرگ */}
            <FeaturedCard
              product={featBig}
              onClick={() => navigate(`/product/${featBig.id}`)}
            />

            {/* دو کارت کوچک */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {feat1 && (
                <SmallCard product={feat1} onClick={() => navigate(`/product/${feat1.id}`)} />
              )}
              {feat2 && (
                <SmallCard product={feat2} onClick={() => navigate(`/product/${feat2.id}`)} />
              )}
              {/* اگر فقط یک featured هست، placeholder */}
              {!feat1 && (
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  borderRadius: 16, border: '1px dashed rgba(255,255,255,0.08)',
                }}/>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ══ گرید محصولات ══ */}
      <motion.div
        key={activeCat + '-grid'}
        variants={grid}
        initial="hidden"
        animate="visible"
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 12,
          padding:             '0 16px',
        }}
      >
        {(gridProds.length > 0 ? gridProds : filtered).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>

      {/* فوتر */}
      <div style={{
        margin: '24px 16px 0',
        padding: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: 2, marginBottom: 3 }}>
          {meta.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          {storeData.contact.phone}
        </div>
      </div>

    </div>
    </div>
  );
}
