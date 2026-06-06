import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { storeData } from '../data/store-config';
import ProductCard, { cardItem } from '../components/ProductCard';

const ff = 'Inter, -apple-system, sans-serif';
const ease = [0.25, 0.1, 0.25, 1];
const grid = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const PILLS   = ['همه', 'پوشاک', 'الکترونیک', 'خانه', 'ورزش', 'زیبایی'];
const CAT_MAP = { 'همه':'all', 'پوشاک':'fashion', 'الکترونیک':'electronics', 'خانه':'home', 'ورزش':'sport', 'زیبایی':'beauty' };
const SORT    = [
  { v:'default',    l:'پیش‌فرض' },
  { v:'price-asc',  l:'ارزان‌ترین' },
  { v:'price-desc', l:'گران‌ترین' },
  { v:'rating',     l:'بهترین' },
  { v:'discount',   l:'تخفیف' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('همه');
  const [sort, setSort]     = useState('default');
  const { products } = storeData;

  const catId = CAT_MAP[active] || 'all';

  const filtered = useMemo(() => {
    let list = catId === 'all' ? [...products] : products.filter(p => p.category === catId);
    if (search.trim()) list = list.filter(p => p.name.includes(search));
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating':     list.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
      case 'discount':   list.sort((a,b) => {
        const da = a.originalPrice > a.price ? 1 - a.price/a.originalPrice : 0;
        const db = b.originalPrice > b.price ? 1 - b.price/b.originalPrice : 0;
        return db - da;
      }); break;
    }
    return list;
  }, [products, active, search, sort]);

  return (
    <div style={{
      height:        '100dvh',
      paddingTop:    56,
      paddingBottom: 90,
      boxSizing:     'border-box',
      overflowY:     'auto',
      background:    '#0d1b3e',
      fontFamily:    ff,
    }}>

      {/* هدر */}
      <motion.div
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        transition={{ duration:.22, ease }}
        style={{ padding:'16px 20px 8px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}
      >
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{filtered.length} محصول</span>
        <h1 style={{ fontSize:20, fontWeight:800, color:'#fff' }}>فروشگاه</h1>
      </motion.div>

      {/* سرچ */}
      <div style={{
        margin:'0 16px 12px',
        background:'rgba(255,255,255,0.07)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:14,
        display:'flex', alignItems:'center', gap:10,
        padding:'0 14px', height:44,
      }}>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>🔍</span>
        <input
          placeholder="جستجو..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex:1, border:'none', outline:'none',
            background:'none', color:'#fff',
            fontSize:13, textAlign:'right', fontFamily:ff,
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            background:'none', border:'none',
            color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer',
          }}>✕</button>
        )}
      </div>

      {/* فیلتر دسته‌بندی */}
      <div style={{
        display:'flex', gap:8, overflowX:'auto',
        padding:'0 16px 12px',
      }}>
        {PILLS.map(p => {
          const isA = active === p;
          return (
            <motion.button key={p}
              whileTap={{ scale:.9 }}
              onClick={() => setActive(p)}
              style={{
                height:34, borderRadius:17, padding:'0 14px',
                background: isA ? 'linear-gradient(135deg, #2952CC, #5B8DEF)' : 'rgba(255,255,255,0.08)',
                border:     `1px solid ${isA ? 'rgba(91,141,239,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color:      '#fff', fontSize:12, fontWeight:700,
                cursor:     'pointer', flexShrink:0, fontFamily:ff,
                boxShadow:  isA ? '0 3px 10px rgba(41,82,204,0.4)' : 'none',
                transition: 'background .18s',
              }}
            >{p}</motion.button>
          );
        })}
      </div>

      {/* مرتب‌سازی */}
      <div style={{
        margin:'0 16px 12px',
        display:'flex', alignItems:'center',
        gap:8, justifyContent:'flex-end',
      }}>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            background:'rgba(255,255,255,0.08)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'6px 12px',
            color:'#fff', fontSize:12, fontFamily:ff,
            cursor:'pointer', outline:'none',
          }}
        >
          {SORT.map(o => <option key={o.v} value={o.v} style={{ background:'#1a2d5a' }}>{o.l}</option>)}
        </select>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>مرتب‌سازی:</span>
      </div>

      {/* گرید */}
      {filtered.length === 0 ? (
        <div style={{ padding:'48px 24px', textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:14 }}>
          محصولی پیدا نشد
        </div>
      ) : (
        <motion.div
          key={active + search + sort}
          variants={grid} initial="hidden" animate="visible"
          style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:12, padding:'0 16px',
          }}
        >
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      )}
    </div>
  );
}
