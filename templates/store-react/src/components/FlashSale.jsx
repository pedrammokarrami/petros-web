import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { storeData } from '../data/store-config';
import s from './FlashSale.module.css';

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' تومان'; }

function useCountdown(endMs) {
  const [diff, setDiff] = useState(Math.max(0, endMs - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setDiff(Math.max(0, endMs - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endMs]);
  const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  const sec = String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0');
  return { h, m, sec, done: diff === 0 };
}

export default function FlashSale() {
  const navigate     = useNavigate();
  const location     = { pathname: '/' };
  const { add }      = useCart();
  const { add: toast } = useToast();

  /* محصولات با تخفیف بیش از ۱۰٪ */
  const saleProducts = storeData.products
    .filter(p => p.originalPrice > p.price)
    .slice(0, 4);

  if (saleProducts.length === 0) return null;

  /* تایمر — ۸ ساعت از اول امروز */
  const endMs = (() => {
    const KEY = 'petros_flash_end';
    let v = parseInt(localStorage.getItem(KEY) || '0');
    if (v < Date.now()) {
      v = Date.now() + 8 * 3_600_000;
      localStorage.setItem(KEY, String(v));
    }
    return v;
  })();
  const { h, m, sec } = useCountdown(endMs);

  return (
    <section className={s.section}>
      <div className={s.header}>
        <div className={s.titleWrap}>
          <span className={s.fireIcon}>⚡</span>
          <h2 className={s.title}>فروش ویژه</h2>
        </div>
        <div className={s.timer}>
          <span className={s.timerLabel}>پایان در</span>
          {[h, m, sec].map((v, i) => (
            <span key={i} className={s.timerBlock}>
              {i > 0 && <span className={s.colon}>:</span>}
              <motion.span
                className={s.timerNum}
                key={v}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {v}
              </motion.span>
            </span>
          ))}
        </div>
      </div>

      <div className={s.grid}>
        {saleProducts.map((p, i) => {
          const discount = Math.round((1 - p.price / p.originalPrice) * 100);
          const stockPct = Math.min(100, (p.stock / 20) * 100);

          return (
            <motion.div
              key={p.id}
              className={s.card}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * .05, duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className={s.imgWrap}>
                <img src={p.images?.[0] || ''} alt={p.name} className={s.img} />
                <span className={s.badgeDiscount}>-{discount}٪</span>
              </div>
              <div className={s.body}>
                <div className={s.name}>{p.name}</div>
                <div className={s.prices}>
                  <span className={s.price}>{fmtPrice(p.price)}</span>
                  <span className={s.orig}>{fmtPrice(p.originalPrice)}</span>
                </div>
                {/* progress bar موجودی */}
                <div className={s.stockWrap}>
                  <div className={s.stockBar}>
                    <motion.div
                      className={s.stockFill}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: stockPct / 100 }}
                      viewport={{ once: true }}
                      transition={{ delay: .3 + i*.07, duration:.8, ease:'easeOut' }}
                    />
                  </div>
                  <span className={s.stockLabel}>{p.stock} عدد باقی</span>
                </div>
                <motion.button
                  className={s.btnBuy}
                  onClick={e => {
                    e.stopPropagation();
                    add(p);
                    toast(`${p.name} به سبد اضافه شد`);
                  }}
                >
                  خرید سریع
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
