import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { storeData } from '../data/store-config';
import Reviews from '../components/Reviews';
import s from './ProductDetail.module.css';

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' تومان'; }
const ease = [0.25, 0.1, 0.25, 1];
const starsArr = [1,2,3,4,5];

export default function ProductDetail() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const location         = useLocation();
  const { add, hasItem } = useCart();
  const { add: toast }   = useToast();
  const product          = storeData.products.find(p => p.id === id);
  const isModal          = Boolean(location.state?.background);

  const [imgIdx, setImgIdx]     = useState(0);
  const [selSize, setSelSize]   = useState(null);
  const [selColor, setSelColor] = useState(null);
  const [wished, setWished]     = useState(false);

  useEffect(() => {
    if (product) {
      localStorage.setItem('petros_last_viewed', product.id);
      setSelSize(product.sizes?.[0] || null);
      setSelColor(product.colors?.[0] || null);
    }
  }, [product?.id]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && isModal) navigate(-1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModal, navigate]);

  useEffect(() => {
    if (isModal) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isModal]);

  if (!product) return (
    <div className={s.notFound}>
      <p>محصول یافت نشد</p>
      <button onClick={() => navigate('/products')}>← بازگشت</button>
    </div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const inCart  = hasItem(product.id);
  const isOut   = product.stock <= 0;
  const similar = storeData.products
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 4);

  function handleAdd() {
    if (isOut) return;
    add(product);
    toast(`${product.name} به سبد اضافه شد`);
  }

  const inner = (
    <>
      {/* ── بخش عکس با gradient آبی ── */}
      <div className={s.imageSection}>
        <div className={s.imageBg} />

        {/* هدر روی عکس */}
        <div className={s.imgHeader}>
          <motion.button
            className={s.imgHeaderBtn}
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </motion.button>
          <span className={s.imgHeaderTitle}>جزئیات محصول</span>
          <motion.button
            className={`${s.imgHeaderBtn} ${wished ? s.imgHeaderBtnWished : ''}`}
            onClick={() => setWished(v => !v)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
          >
            {wished ? '♥' : '♡'}
          </motion.button>
        </div>

        {/* عکس محصول float با shadow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={imgIdx}
            className={s.productImgWrap}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.img
              src={product.images?.[imgIdx] || ''}
              alt={product.name}
              className={s.productImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
            />
          </motion.div>
        </AnimatePresence>

        {discount > 0 && <span className={s.discountBadge}>-{discount}٪</span>}
      </div>

      {/* dot indicator */}
      {product.images?.length > 1 && (
        <div className={s.dots}>
          {product.images.map((_, i) => (
            <motion.button
              key={i}
              className={`${s.dot} ${i === imgIdx ? s.dotActive : ''}`}
              onClick={() => setImgIdx(i)}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      )}

      {/* ── اطلاعات ── */}
      <div className={s.infoPanel}>
        <div className={s.infoCat}>{product.category}</div>
        <h1 className={s.infoName}>{product.name}</h1>

        {/* قیمت */}
        <div className={s.priceRow}>
          <span className={s.price}>{fmtPrice(product.price)}</span>
          {discount > 0 && (
            <>
              <span className={s.orig}>{fmtPrice(product.originalPrice)}</span>
              <span className={s.discountPill}>-{discount}٪</span>
            </>
          )}
        </div>

        {/* ستاره‌ها */}
        <div className={s.ratingRow}>
          <div className={s.stars}>
            {starsArr.map(n => (
              <span key={n} className={n <= Math.round(product.rating||0) ? s.starOn : s.starOff}>★</span>
            ))}
          </div>
          <span className={s.ratingNum}>{product.rating}</span>
          <span className={s.reviewCount}>({product.reviewCount} نظر)</span>
        </div>

        <p className={s.desc}>{product.description}</p>

        {/* سایز */}
        {product.sizes?.length > 0 && (
          <div className={s.selector}>
            <div className={s.selectorLabel}>سایز</div>
            <div className={s.sizeRow}>
              {product.sizes.map(sz => (
                <motion.button
                  key={sz}
                  className={`${s.sizeBtn} ${selSize === sz ? s.sizeActive : ''}`}
                  onClick={() => setSelSize(sz)}
                  whileTap={{ scale: 0.88 }}
                >
                  {sz}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* رنگ */}
        {product.colors?.length > 0 && (
          <div className={s.selector}>
            <div className={s.selectorLabel}>رنگ</div>
            <div className={s.colorRow}>
              {product.colors.map(c => (
                <motion.button
                  key={c}
                  className={`${s.colorDot} ${selColor === c ? s.colorActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelColor(c)}
                  whileTap={{ scale: 0.88 }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* موجودی */}
        <div className={s.stockInfo}>
          {isOut
            ? <span className={s.stockOut}>ناموجود</span>
            : product.stock <= 5
              ? <span className={s.stockLow}>{product.stock} عدد باقی</span>
              : <span className={s.stockOk}>✓ موجود در انبار</span>
          }
        </div>

        {/* دکمه Add to Cart آبی تمام عرض */}
        <motion.button
          className={`${s.btnAdd} ${inCart ? s.btnAdded : ''} ${isOut ? s.btnDisabled : ''}`}
          onClick={handleAdd}
          disabled={isOut}
          whileTap={{ scale: 0.97 }}
        >
          <span>{isOut ? 'ناموجود' : inCart ? '✓ در سبد خرید' : 'افزودن به سبد'}</span>
          {!isOut && (
            <span className={s.btnArrow}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          )}
        </motion.button>

        {!isOut && (
          <motion.button
            className={s.btnBuy}
            onClick={() => { add(product); navigate('/checkout'); }}
            whileTap={{ scale: 0.97 }}
          >
            خرید فوری
          </motion.button>
        )}

        {/* ویژگی‌ها */}
        {product.features?.length > 0 && (
          <div className={s.features}>
            <div className={s.selectorLabel}>ویژگی‌ها</div>
            {product.features.map((f,i) => (
              <div key={i} className={s.featRow}>
                <span className={s.featDot} />{f}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نظرات */}
      <div className={s.reviewsSection}>
        <Reviews productId={product.id} />
      </div>

      {/* مشابه */}
      {similar.length > 0 && (
        <div className={s.similarSection}>
          <h3 className={s.similarTitle}>محصولات مشابه</h3>
          <div className={s.similarGrid}>
            {similar.map(p => (
              <motion.div key={p.id} className={s.similarCard}
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate(`/product/${p.id}`, { state: { background: location } })}
              >
                <div className={s.similarImgWrap}>
                  <img src={p.images?.[0]||''} alt={p.name} className={s.similarImg} />
                </div>
                <div className={s.similarName}>{p.name}</div>
                <div className={s.similarPrice}>{Number(p.price).toLocaleString('fa-IR')} ت</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (isModal) {
    return (
      <motion.div
        className={s.overlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease }}
        onClick={e => { if (e.target === e.currentTarget) navigate(-1); }}
      >
        <motion.div
          className={s.modal}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.32, ease }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.25 }}
          onDragEnd={(_, info) => { if (info.offset.y > 120) navigate(-1); }}
        >
          <div className={s.dragHandle} />
          {inner}
        </motion.div>
      </motion.div>
    );
  }

  return <div className={s.page}>{inner}</div>;
}
