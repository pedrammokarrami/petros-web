import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ff = 'Inter, -apple-system, sans-serif';

const HomeIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.65" y1="16.65" x2="22" y2="22"/>
  </svg>
);
const ARIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const CartIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const ITEMS = [
  { Icon: HomeIcon,     path: '/',         label: 'خانه' },
  { Icon: SearchIcon,   path: '/search',   label: 'کشف' },
  { Icon: ARIcon,       path: '/tryon',    label: 'پرو AR' },
  { Icon: CartIcon,     path: '/cart',     label: 'سبد', hasCart: true },
  { Icon: SettingsIcon, path: '/settings', label: 'پروفایل' },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { count } = useCart();

  return (
    <nav style={{
      position:       'fixed',
      bottom:         20,
      left:           '50%',
      transform:      'translateX(-50%)',
      background:     'rgba(10,18,40,0.96)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius:   30,
      border:         '1px solid rgba(255,255,255,0.12)',
      padding:        '6px 8px',
      display:        'flex',
      alignItems:     'center',
      boxShadow:      '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
      zIndex:         400,
      width:          'min(calc(100% - 2rem), 360px)',
      justifyContent: 'space-around',
      fontFamily:     ff,
    }}>
      {ITEMS.map(({ Icon, path, label, hasCart }) => {
        const isActive = location.pathname === path;

        return (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
            style={{
              position:       'relative',
              background:     'none',
              border:         'none',
              padding:        '10px 12px',
              cursor:         'pointer',
              borderRadius:   40,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            3,
              flex:           1,
              minWidth:       0,
            }}
          >
            {/* blue active bubble */}
            {isActive && (
              <motion.div
                layoutId="bubble"
                style={{
                  position:     'absolute',
                  inset:        0,
                  background:   'linear-gradient(135deg, #2952CC, #5B8DEF)',
                  borderRadius: 40,
                  zIndex:       0,
                  boxShadow:    '0 4px 16px rgba(41,82,204,0.5)',
                }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              />
            )}

            {/* icon */}
            <span style={{
              position:        'relative',
              zIndex:          1,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              color:           '#ffffff',
              opacity:         isActive ? 1 : 0.4,
              willChange:      isActive ? 'opacity' : undefined,
            }}>
              <Icon />
            </span>

            {/* cart badge */}
            {hasCart && count > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                key={count}
                style={{
                  position:   'absolute',
                  top:        7, right: 'calc(50% - 18px)',
                  width:      14, height: 14,
                  background: '#ef4444',
                  color:      '#fff',
                  borderRadius: '50%',
                  fontSize:   9,
                  fontWeight: 700,
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:     '1.5px solid #0a1228',
                  zIndex:     2,
                }}
              >
                {count}
              </motion.span>
            )}

            {/* label */}
            <span style={{
              position:   'relative',
              zIndex:     1,
              fontSize:   9,
              fontWeight: 700,
              color:      isActive ? '#fff' : 'rgba(255,255,255,0.35)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
