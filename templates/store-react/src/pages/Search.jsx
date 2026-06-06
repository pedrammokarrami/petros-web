/* ── Search.jsx — Kloset Dark Navy ── */
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { storeData } from '../data/store-config';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ff = 'Inter, -apple-system, sans-serif';

function useDebounce(val, ms) {
  const [v, setV] = useState(val);
  useEffect(() => { const t = setTimeout(() => setV(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return v;
}

const CATS = [
  { id:'all',         label:'All',     icon:'⊞', storeIds:null },
  { id:'fashion',     label:'Fashion', icon:'👗', storeIds:['fashion'] },
  { id:'electronics', label:'Tech',    icon:'📱', storeIds:['electronics'] },
  { id:'sport',       label:'Sport',   icon:'👟', storeIds:['sport'] },
  { id:'home',        label:'Home',    icon:'🏠', storeIds:['home'] },
  { id:'beauty',      label:'Beauty',  icon:'💄', storeIds:['beauty'] },
];

const PRICE_RANGES = [
  { id:'all',  label:'همه',       min:0,         max:Infinity },
  { id:'low',  label:'زیر ۵۰۰K', min:0,         max:500_000 },
  { id:'mid',  label:'۵۰۰K–۲M',  min:500_000,   max:2_000_000 },
  { id:'high', label:'بالای ۲M',  min:2_000_000, max:Infinity },
];

const SORT_OPTS = [
  { id:'newest',    label:'جدیدترین' },
  { id:'popular',   label:'پرفروش' },
  { id:'cheap',     label:'ارزان‌ترین' },
  { id:'expensive', label:'گران‌ترین' },
  { id:'rating',    label:'بهترین امتیاز' },
];

function calcDiscount(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

const glass = {
  background:     'rgba(255,255,255,0.07)',
  border:         '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
};

export default function Search() {
  const navigate       = useNavigate();
  const { add }        = useCart();
  const { add: toast } = useToast();

  const [query,       setQuery]       = useState('');
  const [activeCat,   setActiveCat]   = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange,  setPriceRange]  = useState('all');
  const [sort,        setSort]        = useState('newest');
  const [inStock,     setInStock]     = useState(false);
  const [liked,       setLiked]       = useState({});

  const dq = useDebounce(query, 260);

  const activeFiltersCount = [
    activeCat  !== 'all',
    priceRange !== 'all',
    sort       !== 'newest',
    inStock,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setActiveCat('all'); setPriceRange('all');
    setSort('newest'); setInStock(false); setShowFilters(false);
  };

  const results = useMemo(() => {
    const cat = CATS.find(c => c.id === activeCat);
    const pr  = PRICE_RANGES.find(r => r.id === priceRange) ?? PRICE_RANGES[0];

    let list = storeData.products.filter(p => {
      if (cat?.storeIds && !cat.storeIds.includes(p.category)) return false;
      if (dq.trim() && !p.name.includes(dq) && !p.description?.includes(dq)) return false;
      if (p.price < pr.min || p.price > pr.max) return false;
      if (inStock && (p.stock ?? 0) < 1) return false;
      return true;
    });

    switch (sort) {
      case 'popular':   list = [...list].sort((a,b) => (b.reviewCount??0)-(a.reviewCount??0)); break;
      case 'cheap':     list = [...list].sort((a,b) => a.price-b.price); break;
      case 'expensive': list = [...list].sort((a,b) => b.price-a.price); break;
      case 'rating':    list = [...list].sort((a,b) => (b.rating??0)-(a.rating??0)); break;
      default: break;
    }
    return list;
  }, [dq, activeCat, priceRange, sort, inStock]);

  const handleAdd  = (p, e) => { e.stopPropagation(); add(p); toast(`${p.name} اضافه شد`); };
  const toggleLike = (id, e) => { e.stopPropagation(); setLiked(prev => ({ ...prev, [id]: !prev[id] })); };

  return (
    <div style={{
      height:        '100dvh',
      paddingTop:    56,
      paddingBottom: 90,
      boxSizing:     'border-box',
      display:       'flex',
      flexDirection: 'column',
      background:    '#0d1b3e',
      overflow:      'hidden',
      fontFamily:    ff,
    }}>

      {/* ══ هدر ══ */}
      <div style={{ flexShrink:0 }}>
        <motion.div
          initial={{ opacity:0, y:-12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.25 }}
          style={{ padding:'16px 18px' }}
        >
          {/* آواتار + نام + اعلان */}
          <div style={{
            display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:14,
          }}>
            <motion.button whileTap={{ scale:.85 }} style={{
              width:36, height:36, borderRadius:18,
              ...glass, border:'1px solid rgba(255,255,255,0.1)',
              fontSize:15, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative', color:'#fff',
            }}>
              🔔
              <div style={{
                position:'absolute', top:5, right:5,
                width:8, height:8, borderRadius:4,
                background:'#ef4444', border:'1.5px solid #0d1b3e',
              }}/>
            </motion.button>

            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>کاربر عزیز</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>تهران، ایران</div>
              </div>
              <div style={{
                width:40, height:40, borderRadius:20,
                background:'linear-gradient(135deg, #2952CC, #5B8DEF)',
                border:'2px solid rgba(91,141,239,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>👤</div>
            </div>
          </div>

          {/* سرچ + فیلتر */}
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            <motion.button
              whileTap={{ scale:.9 }}
              onClick={() => setShowFilters(v => !v)}
              style={{
                width:46, height:46, borderRadius:14, flexShrink:0,
                background: showFilters
                  ? 'rgba(255,255,255,0.12)'
                  : 'linear-gradient(135deg, #2952CC, #5B8DEF)',
                border:`1px solid ${showFilters ? 'rgba(255,255,255,0.18)' : 'transparent'}`,
                color:'#fff', fontSize:18, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative',
                boxShadow: showFilters ? 'none' : '0 4px 14px rgba(41,82,204,0.45)',
                transition:'all .2s',
              }}
            >
              ⚙️
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    style={{
                      position:'absolute', top:-4, right:-4,
                      width:17, height:17, borderRadius:9,
                      background:'#ef4444', color:'#fff',
                      fontSize:9, fontWeight:700,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'2px solid #0d1b3e',
                    }}
                  >{activeFiltersCount}</motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div style={{
              flex:1, height:46, borderRadius:14,
              display:'flex', alignItems:'center', gap:10, padding:'0 14px',
              ...glass,
            }}>
              <span style={{ color:'rgba(255,255,255,0.4)' }}>🔍</span>
              <input
                placeholder="Search Products"
                style={{
                  flex:1, border:'none', outline:'none',
                  fontSize:13, background:'none',
                  textAlign:'right', color:'#fff', fontFamily:ff,
                }}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    whileTap={{ scale:.8 }}
                    onClick={() => setQuery('')}
                    style={{
                      width:20, height:20, borderRadius:10,
                      background:'rgba(255,255,255,0.12)',
                      border:'none', fontSize:11, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'rgba(255,255,255,0.7)',
                    }}
                  >✕</motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* دسته‌بندی‌های دایره‌ای */}
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:2 }}>
            {CATS.map((cat, i) => {
              const isA = activeCat === cat.id;
              return (
                <motion.button key={cat.id}
                  initial={{ opacity:0, scale:.8 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:i*.05, duration:.2 }}
                  whileTap={{ scale:.85 }}
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                    background:'none', border:'none', cursor:'pointer', flexShrink:0, padding:0,
                  }}
                >
                  <div style={{
                    width:50, height:50, borderRadius:25,
                    background: isA ? 'linear-gradient(135deg, #2952CC, #5B8DEF)' : 'rgba(255,255,255,0.08)',
                    border:`1px solid ${isA ? 'rgba(91,141,239,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                    boxShadow: isA ? '0 4px 14px rgba(41,82,204,0.45)' : 'none',
                    transition:'all .18s',
                  }}>{cat.icon}</div>
                  <span style={{
                    fontSize:10, fontWeight:700,
                    color: isA ? '#5B8DEF' : 'rgba(255,255,255,0.45)',
                    whiteSpace:'nowrap',
                  }}>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* پنل فیلتر */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height:0, opacity:0 }}
              animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:.22 }}
              style={{ overflow:'hidden' }}
            >
              <div style={{
                ...glass,
                margin:'0 16px 8px', borderRadius:16, padding:14,
              }}>
                {/* قیمت */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, textAlign:'right', marginBottom:7, color:'rgba(255,255,255,0.8)' }}>
                    💰 قیمت
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    {PRICE_RANGES.map(p => (
                      <motion.button key={p.id} whileTap={{ scale:.9 }} onClick={() => setPriceRange(p.id)} style={{
                        flex:1, height:32, borderRadius:9,
                        background: priceRange===p.id ? 'linear-gradient(135deg, #2952CC, #5B8DEF)' : 'rgba(255,255,255,0.07)',
                        border:`1px solid ${priceRange===p.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                        color:'#fff', fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:ff,
                        transition:'background .15s',
                      }}>{p.label}</motion.button>
                    ))}
                  </div>
                </div>

                {/* مرتب‌سازی */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, textAlign:'right', marginBottom:7, color:'rgba(255,255,255,0.8)' }}>
                    🔃 مرتب‌سازی
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {SORT_OPTS.map(opt => (
                      <motion.button key={opt.id} whileTap={{ scale:.9 }} onClick={() => setSort(opt.id)} style={{
                        height:30, borderRadius:9, padding:'0 10px',
                        background: sort===opt.id ? 'linear-gradient(135deg, #2952CC, #5B8DEF)' : 'rgba(255,255,255,0.07)',
                        border:`1px solid ${sort===opt.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                        color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:ff,
                        transition:'background .15s',
                      }}>{opt.label}</motion.button>
                    ))}
                  </div>
                </div>

                {/* toggle + پاک‌کردن */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <motion.button whileTap={{ scale:.9 }} onClick={resetFilters} style={{
                    height:30, borderRadius:9, padding:'0 12px',
                    background:'rgba(239,68,68,0.12)',
                    border:'1px solid rgba(239,68,68,0.25)',
                    color:'#ef4444', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:ff,
                  }}>پاک‌کردن</motion.button>

                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>فقط موجود</span>
                    <motion.div onClick={() => setInStock(v=>!v)} style={{
                      width:40, height:23, borderRadius:12,
                      background: inStock ? 'linear-gradient(135deg, #2952CC, #5B8DEF)' : 'rgba(255,255,255,0.12)',
                      position:'relative', cursor:'pointer', transition:'background .2s',
                    }}>
                      <motion.div
                        animate={{ x: inStock ? 18 : 2 }}
                        transition={{ type:'spring', stiffness:300, damping:25 }}
                        style={{
                          position:'absolute', top:3,
                          width:17, height:17, borderRadius:9, background:'#fff',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ اسکرول ══ */}
      <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>

        <div style={{
          display:'flex', justifyContent:'space-between',
          alignItems:'center', padding:'10px 18px 8px',
        }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{results.length} محصول</span>
          <span style={{ fontSize:16, fontWeight:800, color:'#fff' }}>
            {query ? `نتایج "${query}"` : 'محصولات'}
          </span>
        </div>

        <motion.div
          key={dq + activeCat + priceRange + sort + inStock}
          variants={{ show:{ transition:{ staggerChildren:.05 } } }}
          initial="hidden"
          animate="show"
          style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:12, padding:'0 16px 20px',
          }}
        >
          {results.map(p => {
            const discount = calcDiscount(p);
            const rating   = p.rating ?? 4;
            return (
              <motion.div key={p.id}
                variants={{ hidden:{ opacity:0, y:16 }, show:{ opacity:1, y:0, transition:{ duration:.22 } } }}
                whileTap={{ scale:.97 }}
                onClick={() => navigate(`/product/${p.id}`)}
                style={{
                  background:'linear-gradient(145deg, #1a2d5a, #0e1e46)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:18, overflow:'hidden', cursor:'pointer',
                }}
              >
                {/* عکس */}
                <div style={{
                  position:'relative',
                  background:'linear-gradient(160deg, rgba(41,82,204,0.15), rgba(91,141,239,0.06))',
                }}>
                  <img
                    src={p.images?.[0] || ''}
                    alt={p.name}
                    style={{ width:'100%', aspectRatio:'1', objectFit:'contain', padding:8, display:'block' }}
                  />
                  {discount > 0 && (
                    <div style={{
                      position:'absolute', top:6, right:6,
                      background:'#ef4444', color:'#fff',
                      borderRadius:7, padding:'2px 6px',
                      fontSize:9, fontWeight:700,
                    }}>{discount}٪–</div>
                  )}
                  <motion.button
                    whileTap={{ scale:.8 }}
                    onClick={e => toggleLike(p.id, e)}
                    style={{
                      position:'absolute', top:6, left:6,
                      width:26, height:26, borderRadius:13,
                      background:'rgba(255,255,255,0.1)',
                      backdropFilter:'blur(8px)',
                      border:'1px solid rgba(255,255,255,0.15)',
                      fontSize:12, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color: liked[p.id] ? '#ef4444' : 'rgba(255,255,255,0.6)',
                    }}
                  >{liked[p.id] ? '❤️' : '🤍'}</motion.button>
                  {p.stock === 0 && (
                    <div style={{
                      position:'absolute', inset:0,
                      background:'rgba(0,0,0,0.5)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.6)',
                    }}>ناموجود</div>
                  )}
                </div>

                <div style={{ padding:'8px 10px 10px' }}>
                  <div style={{
                    fontSize:11, fontWeight:600, color:'#fff', marginBottom:4,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>{p.name}</div>

                  <div style={{ display:'flex', justifyContent:'flex-end', gap:1, marginBottom:6 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize:9, color: s<=Math.round(rating) ? '#FFC107' : 'rgba(255,255,255,0.2)' }}>★</span>
                    ))}
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <motion.button
                      whileTap={{ scale:.8 }}
                      onClick={e => handleAdd(p, e)}
                      disabled={p.stock===0}
                      style={{
                        width:26, height:26, borderRadius:13,
                        background: p.stock===0 ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #2952CC, #5B8DEF)',
                        border:'none', color:'#fff', fontSize:15,
                        cursor: p.stock===0 ? 'default' : 'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:700, flexShrink:0,
                        boxShadow: p.stock>0 ? '0 3px 10px rgba(41,82,204,.4)' : 'none',
                      }}
                    >+</motion.button>

                    <div style={{ textAlign:'right' }}>
                      {discount > 0 && (
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textDecoration:'line-through' }}>
                          {p.originalPrice.toLocaleString('fa-IR')}
                        </div>
                      )}
                      <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>
                        {p.price.toLocaleString('fa-IR')} ت
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {dq && results.length === 0 && (
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ padding:'48px 24px', textAlign:'center', fontFamily:ff }}
            >
              <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>نتیجه‌ای نبود</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:20 }}>
                «{dq}» پیدا نشد
              </div>
              <motion.button
                whileTap={{ scale:.95 }}
                onClick={() => setQuery('')}
                style={{
                  height:40, borderRadius:20,
                  background:'linear-gradient(135deg, #2952CC, #5B8DEF)',
                  color:'#fff', border:'none', padding:'0 24px',
                  fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:ff,
                  boxShadow:'0 4px 14px rgba(41,82,204,.4)',
                }}
              >پاک کردن</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
