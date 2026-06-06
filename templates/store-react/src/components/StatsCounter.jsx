import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { storeData } from '../data/store-config';
import s from './StatsCounter.module.css';

function Counter({ value, suffix = '', duration = 1.8 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: .5 });
  const count  = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v).toLocaleString('fa-IR'));

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(count, value, { duration, ease: [.16,1,.3,1] });
    return ctrl.stop;
  }, [inView, value, duration, count]);

  return (
    <motion.span ref={ref} className={s.num}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </motion.span>
  );
}

export default function StatsCounter() {
  const { stats } = storeData.about;
  return (
    <section className={s.section}>
      <div className={s.grid}>
        {stats.map((stat, i) => {
          /* parse عدد از مقدار مثل "+۵۰k" */
          const numStr = stat.value.replace(/[^0-9]/g, '');
          const num    = parseInt(numStr) || 0;
          const suffix = stat.value.replace(/[0-9]/g, '');

          return (
            <motion.div
              key={stat.label}
              className={s.item}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * .1, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Counter value={num} suffix={suffix} />
              <div className={s.label}>{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
