import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { storeData } from '../data/store-config';
import s from './BottomNav.module.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.65" y1="16.65" x2="22" y2="22"/>
  </svg>
);
const ARIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    <>
      {/* ══ Desktop Sidebar ══ */}
      <nav className={s.sidebar}>
        <div className={s.sidebarLogo}>
          <span className={s.sidebarLogoAccent}>K</span>
          {storeData.meta.name || 'Kloset'}
        </div>

        {ITEMS.map(({ Icon, path, label, hasCart }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              className={`${s.sidebarItem} ${isActive ? s.sidebarItemActive : ''}`}
              onClick={() => navigate(path)}
            >
              <span className={s.sidebarItemIcon}>
                <Icon />
              </span>
              {label}
              {hasCart && count > 0 && (
                <span className={s.sidebarCartBadge}>{count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ══ Mobile Bottom Pill ══ */}
      <nav className={s.mobileNav}>
        {ITEMS.map(({ Icon, path, label, hasCart }) => {
          const isActive = location.pathname === path;
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.88 }}
              transition={{ duration: 0.1 }}
              className={s.mobileItem}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className={s.mobileBubble}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                />
              )}
              <span className={s.mobileIcon} style={{ color: '#fff', opacity: isActive ? 1 : 0.4 }}>
                <Icon />
              </span>
              {hasCart && count > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  key={count}
                  className={s.mobileCartBadge}
                >
                  {count}
                </motion.span>
              )}
              <span className={s.mobileLabel} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
