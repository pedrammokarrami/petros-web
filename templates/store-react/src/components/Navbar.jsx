import { useLocation, useNavigate } from 'react-router-dom';
import { storeData } from '../data/store-config';

const PAGE_TITLES = {
  '/products': 'فروشگاه',
  '/cart':     'سبد خرید',
  '/checkout': 'تکمیل خرید',
  '/about':    'درباره ما',
  '/search':   'جستجو',
  '/tryon':    'Virtual Try-On',
  '/settings': 'تنظیمات',
};

const ff = 'Inter, -apple-system, sans-serif';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const isHome   = location.pathname === '/';
  const isDetail = /^\/product\//.test(location.pathname) && !location.state?.background;
  const pageTitle = PAGE_TITLES[location.pathname];

  if (isHome || isDetail) return null;

  return (
    <nav style={{
      position:       'fixed',
      top:            0, left: 0, right: 0,
      height:         56,
      zIndex:         200,
      background:     'rgba(13,27,62,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom:   '1px solid rgba(255,255,255,0.08)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '0 18px',
      fontFamily:     ff,
    }}>
      {/* چپ: برگشت + عنوان */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        {pageTitle && (
          <span style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{pageTitle}</span>
        )}
      </div>

      {/* راست: نام اپ */}
      <span style={{
        fontSize: 17, fontWeight: 900, color: '#fff',
        letterSpacing: 1.5, opacity: 0.9,
      }}>
        {storeData.meta.name}
      </span>
    </nav>
  );
}
