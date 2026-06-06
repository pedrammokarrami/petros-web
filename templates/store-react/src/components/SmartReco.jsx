import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { storeData } from '../data/store-config';
import s from './SmartReco.module.css';

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' تومان'; }

export default function SmartReco() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { add }       = useCart();
  const { add: toast} = useToast();
  const trackRef      = useRef(null);

  /* آخرین محصول دیده‌شده */
  const lastId    = localStorage.getItem('petros_last_viewed');
  const lastProd  = storeData.products.find(p => p.id === lastId);
  const suggested = lastProd
    ? storeData.products.filter(p => p.id !== lastId && p.category === lastProd.category).slice(0, 6)
    : storeData.products.slice(0, 6);

  if (suggested.length === 0) return null;

  return (
    <section className={s.section}>
      <h2 className={s.title}>
        {lastProd ? '💡 شاید دوست داشته باشید' : '⭐ پیشنهاد ویژه'}
      </h2>
      <div
        ref={trackRef}
        className={s.track}
        onWheel={e => { e.preventDefault(); trackRef.current.scrollLeft += e.deltaY; }}
      >
        {suggested.map((p, i) => (
          <motion.div
            key={p.id}
            className={s.card}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .05, duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/product/${p.id}`, { state: { background: location } })}
          >
            <img src={p.images?.[0] || ''} alt={p.name} className={s.img} />
            <div className={s.body}>
              <div className={s.name}>{p.name}</div>
              <div className={s.price}>{fmtPrice(p.price)}</div>
              <motion.button
                className={s.btnAdd}
                whileTap={{ scale: .88 }}
                onClick={e => { e.stopPropagation(); add(p); toast(`${p.name} به سبد اضافه شد`); }}
              >+</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
