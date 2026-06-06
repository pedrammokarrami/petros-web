import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import s from './BackToTop.module.css';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => scrollY.on('change', v => setVisible(v > 400)), [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={s.btn}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{    opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="برگشت به بالا"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
