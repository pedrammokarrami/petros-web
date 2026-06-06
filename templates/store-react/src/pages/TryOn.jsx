import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

/* ─── ۱۲ محصول نمونه ─── */
const PRODUCTS = [
  { id:1,  name:'پیراهن سفید',     category:'top',    price:350_000,
    images:{ alone:'https://picsum.photos/seed/ps1a/400/500', mannequin:'https://picsum.photos/seed/ps1m/400/500', model_front:'https://picsum.photos/seed/ps1f/400/500', model_back:'https://picsum.photos/seed/ps1b/400/500' }},
  { id:2,  name:'تیشرت مشکی',      category:'top',    price:280_000,
    images:{ alone:'https://picsum.photos/seed/pt2a/400/500', mannequin:'https://picsum.photos/seed/pt2m/400/500', model_front:'https://picsum.photos/seed/pt2f/400/500', model_back:'https://picsum.photos/seed/pt2b/400/500' }},
  { id:3,  name:'بلوز راه‌راه',    category:'top',    price:310_000,
    images:{ alone:'https://picsum.photos/seed/pb3a/400/500', mannequin:'https://picsum.photos/seed/pb3m/400/500', model_front:'https://picsum.photos/seed/pb3f/400/500', model_back:'https://picsum.photos/seed/pb3b/400/500' }},
  { id:4,  name:'هودی خاکستری',    category:'top',    price:520_000,
    images:{ alone:'https://picsum.photos/seed/hk4a/400/500', mannequin:'https://picsum.photos/seed/hk4m/400/500', model_front:'https://picsum.photos/seed/hk4f/400/500', model_back:'https://picsum.photos/seed/hk4b/400/500' }},
  { id:5,  name:'شلوار جین آبی',   category:'bottom', price:620_000,
    images:{ alone:'https://picsum.photos/seed/sj5a/400/500', mannequin:'https://picsum.photos/seed/sj5m/400/500', model_front:'https://picsum.photos/seed/sj5f/400/500', model_back:'https://picsum.photos/seed/sj5b/400/500' }},
  { id:6,  name:'شلوار کتان خاکی', category:'bottom', price:480_000,
    images:{ alone:'https://picsum.photos/seed/sk6a/400/500', mannequin:'https://picsum.photos/seed/sk6m/400/500', model_front:'https://picsum.photos/seed/sk6f/400/500', model_back:'https://picsum.photos/seed/sk6b/400/500' }},
  { id:7,  name:'شلوار مشکی',      category:'bottom', price:450_000,
    images:{ alone:'https://picsum.photos/seed/sm7a/400/500', mannequin:'https://picsum.photos/seed/sm7m/400/500', model_front:'https://picsum.photos/seed/sm7f/400/500', model_back:'https://picsum.photos/seed/sm7b/400/500' }},
  { id:8,  name:'کتونی سفید',      category:'shoes',  price:980_000,
    images:{ alone:'https://picsum.photos/seed/ks8a/400/500', mannequin:'https://picsum.photos/seed/ks8m/400/500', model_front:'https://picsum.photos/seed/ks8f/400/500', model_back:'https://picsum.photos/seed/ks8b/400/500' }},
  { id:9,  name:'کفش چرم قهوه‌ای', category:'shoes',  price:1_200_000,
    images:{ alone:'https://picsum.photos/seed/kc9a/400/500', mannequin:'https://picsum.photos/seed/kc9m/400/500', model_front:'https://picsum.photos/seed/kc9f/400/500', model_back:'https://picsum.photos/seed/kc9b/400/500' }},
  { id:10, name:'کاپشن آبی‌تیره',  category:'jacket', price:1_450_000,
    images:{ alone:'https://picsum.photos/seed/ka10a/400/500', mannequin:'https://picsum.photos/seed/ka10m/400/500', model_front:'https://picsum.photos/seed/ka10f/400/500', model_back:'https://picsum.photos/seed/ka10b/400/500' }},
  { id:11, name:'کلاه بیسبال',     category:'hat',    price:180_000,
    images:{ alone:'https://picsum.photos/seed/kb11a/400/500', mannequin:'https://picsum.photos/seed/kb11m/400/500', model_front:'https://picsum.photos/seed/kb11f/400/500', model_back:'https://picsum.photos/seed/kb11b/400/500' }},
  { id:12, name:'کلاه زمستانی',    category:'hat',    price:220_000,
    images:{ alone:'https://picsum.photos/seed/kz12a/400/500', mannequin:'https://picsum.photos/seed/kz12m/400/500', model_front:'https://picsum.photos/seed/kz12f/400/500', model_back:'https://picsum.photos/seed/kz12b/400/500' }},
];

const CATS = [
  { id:'all',    label:'همه',     icon:'🏷' },
  { id:'top',    label:'بالاتنه', icon:'👔' },
  { id:'bottom', label:'شلوار',   icon:'👖' },
  { id:'shoes',  label:'کفش',     icon:'👟' },
  { id:'jacket', label:'کاپشن',   icon:'🧥' },
  { id:'hat',    label:'کلاه',    icon:'🧢' },
];

const VIEWS = [
  { id:'alone',       icon:'👕' },
  { id:'mannequin',   icon:'🪆' },
  { id:'model_front', icon:'🧍' },
  { id:'model_back',  icon:'🔄' },
];

export default function TryOn() {
  const { add }        = useCart();
  const { add: toast } = useToast();

  const [selected,   setSelected]   = useState(PRODUCTS[0]);
  const [activeView, setActiveView] = useState('alone');
  const [activeCat,  setActiveCat]  = useState('all');
  const [added,      setAdded]      = useState(false);

  const filtered = PRODUCTS.filter(p =>
    activeCat === 'all' || p.category === activeCat
  );

  const handleAdd = () => {
    if (!selected) return;
    add(selected);
    toast(`${selected.name} اضافه شد`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReset = () => {
    setSelected(PRODUCTS[0]);
    setActiveView('alone');
    setActiveCat('all');
  };

  const handleSelect = (p) => {
    setSelected(p);
    setActiveView('alone');
  };

  return (
    /*
      ─ چرا height: 100dvh + paddingTop + paddingBottom به‌جای position: fixed?
        Navbar و BottomNav هر دو position: fixed هستن. Wrap (framer-motion) روی
        TryOn یه transform اعمال می‌کنه که position: fixed رو می‌شکنه.
        با height + padding مشکل ریشه‌ای حل می‌شه.
    */
    <div style={{
      height: '100dvh',
      paddingTop: 56,      /* ارتفاع Navbar */
      paddingBottom: 90,   /* فضای BottomNav pill */
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d1b3e',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* ══ محتوا: عکس | منوی دایره‌ای ══ */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 76px',
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* ── پنل چپ: عکس محصول ── */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #1a2d5a, #0e1e46)',
          border: '1px solid rgba(255,255,255,0.1)',
          margin: 10,
          borderRadius: 24,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          {/* عکس با crossfade */}
          <AnimatePresence mode="wait">
            <motion.img
              key={`${selected?.id}-${activeView}`}
              src={selected?.images?.[activeView] ?? selected?.images?.alone}
              alt={selected?.name}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* دکمه‌های view — گوشه پایین چپ */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            display: 'flex', gap: 8,
          }}>
            {VIEWS.map(v => (
              <motion.button key={v.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => setActiveView(v.id)}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: activeView === v.id ? 'linear-gradient(135deg,#2952CC,#5B8DEF)' : 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: 'none', fontSize: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {v.icon}
              </motion.button>
            ))}
          </div>

          {/* نام + قیمت — گوشه پایین راست */}
          {selected && (
            <AnimatePresence mode="wait">
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', bottom: 14, right: 14,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: 12, padding: '8px 12px', color: '#fff',
                  maxWidth: '48%',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {selected.price.toLocaleString('fa-IR')} ت
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* ── پنل راست: دایره‌های منو ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 6px',
          gap: 10,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          alignItems: 'center',
        }}>

          {/* دسته‌بندی‌ها */}
          {CATS.map((cat, i) => (
            <motion.button key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActiveCat(cat.id)}
              style={{
                width: 60, height: 60, borderRadius: 30,
                background: activeCat === cat.id ? 'linear-gradient(135deg,#2952CC,#5B8DEF)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, cursor: 'pointer', flexShrink: 0,
                boxShadow: activeCat === cat.id
                  ? '0 4px 16px rgba(41,82,204,0.5)'
                  : '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{cat.icon}</span>
              <span style={{
                fontSize: 9, fontWeight: 600, lineHeight: 1,
                color: activeCat === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
              }}>
                {cat.label}
              </span>
            </motion.button>
          ))}

          {/* جداکننده */}
          <div style={{ height: 1, width: '75%', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* تامبنیل محصولات */}
          <AnimatePresence>
            {filtered.map((p, i) => {
              const isActive = selected?.id === p.id;
              return (
                <motion.button key={p.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleSelect(p)}
                  style={{
                    width: 60, height: 60, borderRadius: 30,
                    overflow: 'hidden',
                    border: isActive ? '3px solid #5B8DEF' : '2px solid rgba(255,255,255,0.1)',
                    padding: 0, cursor: 'pointer', flexShrink: 0,
                    boxShadow: isActive
                      ? '0 4px 16px rgba(0,0,0,0.3)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative', background: 'none',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                >
                  <img src={p.images.alone} alt={p.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type:'spring', stiffness:500, damping:25 }}
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        width: 16, height: 16, borderRadius: 8,
                        background: '#2952CC', color: '#fff',
                        fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✓</motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ Bottom Bar ══ */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(10,18,40,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          style={{
            flex: 1, height: 50, borderRadius: 25,
            background: 'linear-gradient(135deg, #2952CC, #5B8DEF)', color: '#fff',
            border: 'none', fontSize: 15,
            boxShadow: '0 6px 20px rgba(41,82,204,0.45)',
            fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {added
              ? <motion.span key="done"
                  initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-5 }} transition={{ duration: 0.15 }}>
                  ✓ اضافه شد
                </motion.span>
              : <motion.span key="add"
                  initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-5 }} transition={{ duration: 0.15 }}>
                  افزودن به سبد 🛒
                </motion.span>
            }
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          style={{
            width: 50, height: 50, borderRadius: 25,
            background: 'rgba(255,255,255,0.08)',
            border: 'none', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >🔄</motion.button>
      </div>
    </div>
  );
}
