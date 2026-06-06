import { motion } from 'framer-motion';
import { storeData } from '../data/store-config';
import s from './LoadingScreen.module.css';

export default function LoadingScreen({ onDone }) {
  return (
    <motion.div
      className={s.root}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className={s.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {storeData.meta.name}
      </motion.div>

      <motion.div
        className={s.line}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        onAnimationComplete={onDone}
      />
    </motion.div>
  );
}
