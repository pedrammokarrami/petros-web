import { useEffect } from 'react';
import { useScroll, useSpring } from 'framer-motion';

/* نوار پیشرفت اسکرول — روی #scroll-progress اعمال می‌شود */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    return scaleX.on('change', v => {
      bar.style.transform = `scaleX(${v})`;
    });
  }, [scaleX]);

  return null;
}
