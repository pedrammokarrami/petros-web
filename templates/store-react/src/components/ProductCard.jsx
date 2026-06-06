import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ff = 'Inter, -apple-system, sans-serif';

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' ت'; }

const WISH_KEY = 'petros_wishlist';
function getWishSet() {
  try { return new Set(JSON.parse(localStorage.getItem(WISH_KEY)) || []); }
  catch { return new Set(); }
}
function toggleWish(id, on) {
  const s = getWishSet();
  on ? s.add(id) : s.delete(id);
  localStorage.setItem(WISH_KEY, JSON.stringify([...s]));
}

export const cardItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25,0.1,0.25,1] } },
};

export default function ProductCard({ product }) {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { add, hasItem } = useCart();
  const { add: toast }   = useToast();
  const [wished, setWished] = useState(() => getWishSet().has(product.id));

  const inCart   = hasItem(product.id);
  const isOut    = product.stock <= 0;
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  function openDetail() {
    navigate(`/product/${product.id}`, { state: { background: location } });
  }

  function handleAdd(e) {
    e.stopPropagation();
    if (isOut) return;
    add(product);
    toast(`${product.name} به سبد اضافه شد`);
  }

  return (
    <motion.div
      variants={cardItem}
      whileTap={{ scale: 0.97 }}
      onClick={openDetail}
      style={{
        background:   'rgba(255,255,255,0.06)',
        borderRadius: 16,
        overflow:     'hidden',
        border:       '1px solid rgba(255,255,255,0.08)',
        cursor:       'pointer',
        fontFamily:   ff,
      }}
    >
      {/* بخش عکس */}
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, position: 'relative' }}>
        <img
          src={product.images?.[0] || ''}
          alt={product.name}
          loading="lazy"
          style={{
            width:       '100%',
            aspectRatio: '1',
            objectFit:   'contain',
            display:     'block',
            filter:      'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
          }}
        />

        {/* badge تخفیف */}
        {discount > 0 && (
          <div style={{
            position:     'absolute', top: 8, right: 8,
            background:   '#ff3b30', color: '#fff',
            borderRadius: 8, padding: '2px 7px',
            fontSize:     10, fontWeight: 700,
          }}>-{discount}٪</div>
        )}

        {/* ناموجود overlay */}
        {isOut && (
          <div style={{
            position:   'absolute', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            fontSize:   10, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
          }}>ناموجود</div>
        )}

        {/* wishlist */}
        <motion.button
          onClick={e => { e.stopPropagation(); const nv = !wished; setWished(nv); toggleWish(product.id, nv); }}
          whileTap={{ scale: 0.8 }}
          style={{
            position:   'absolute', top: 8, left: 8,
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            border:     'none',
            fontSize:   14, cursor: 'pointer',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            color:      wished ? '#ef4444' : '#fff',
          }}
        >{wished ? '❤️' : '🤍'}</motion.button>
      </div>

      {/* بخش اطلاعات */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize:     12,
          fontWeight:   700,
          color:        '#fff',
          marginBottom: 6,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          textAlign:    'right',
        }}>
          {product.name}
        </div>

        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleAdd}
            style={{
              width:          28, height: 28, borderRadius: 14,
              background:     isOut ? 'rgba(255,255,255,0.1)' : inCart ? '#22c55e' : '#2952CC',
              color:          '#fff',
              border:         'none',
              fontSize:       18,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         isOut ? 'default' : 'pointer',
              fontWeight:     700,
            }}
          >
            {inCart ? '✓' : '+'}
          </motion.button>

          <div style={{ textAlign: 'right' }}>
            {discount > 0 && (
              <div style={{
                fontSize:       10,
                color:          'rgba(255,255,255,0.4)',
                textDecoration: 'line-through',
              }}>
                {Number(product.originalPrice).toLocaleString('fa-IR')}
              </div>
            )}
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
              {fmtPrice(product.price)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
