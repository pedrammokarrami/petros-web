import { useEffect, useRef } from 'react';

/* custom cursor — فقط روی دستگاه‌های non-touch */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let rx = 0, ry = 0;

    const onMove = e => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
    };

    const tick = () => {
      rx += (pos.current.x - rx) * 0.12;
      ry += (pos.current.y - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return null;
}
