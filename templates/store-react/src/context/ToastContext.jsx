import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import s from '../components/Toast.module.css';

const ToastCtx = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'success', duration = 2800) => {
    const id = ++_id;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);

  return (
    <ToastCtx.Provider value={{ add }}>
      {children}
      <div className={s.container} aria-live="polite">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              className={`${s.toast} ${s[t.type]}`}
              initial={{ opacity: 0, y: 40, scale: .88 }}
              animate={{ opacity: 1, y: 0,  scale: 1  }}
              exit={{    opacity: 0, y: 20, scale: .92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              onClick={() => remove(t.id)}
            >
              <span className={s.icon}>
                {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
