import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ff = 'Inter, -apple-system, sans-serif';
const ease = [0.25, 0.1, 0.25, 1];

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' تومان'; }

export default function Cart() {
  const navigate = useNavigate();
  const { items, total, setQty, remove, clear } = useCart();

  const discount = items.reduce((sum, item) => {
    if (item.originalPrice > item.price) sum += (item.originalPrice - item.price) * item.qty;
    return sum;
  }, 0);

  return (
    <div style={{
      height:        '100dvh',
      paddingTop:    56,
      paddingBottom: 90,
      boxSizing:     'border-box',
      overflowY:     'auto',
      background:    '#0d1b3e',
      fontFamily:    ff,
    }}>

      {/* عنوان */}
      <motion.div
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        transition={{ duration:.22, ease }}
        style={{ padding:'20px 20px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}
      >
        <button
          onClick={clear}
          style={{
            background:'none', border:'none',
            color:'rgba(239,68,68,0.7)', fontSize:12,
            cursor:'pointer', fontFamily:ff,
          }}
        >پاک کردن</button>
        <h1 style={{ fontSize:20, fontWeight:800, color:'#fff' }}>سبد خرید</h1>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:.22 }}
          style={{ padding:'60px 24px', textAlign:'center' }}
        >
          <div style={{ fontSize:52, marginBottom:12 }}>🛒</div>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', marginBottom:20 }}>سبد خرید خالی است</p>
          <motion.button
            whileTap={{ scale:.95 }}
            onClick={() => navigate('/products')}
            style={{
              height:46, borderRadius:23,
              background:'linear-gradient(135deg, #2952CC, #5B8DEF)',
              color:'#fff', border:'none', padding:'0 28px',
              fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:ff,
              boxShadow:'0 6px 20px rgba(41,82,204,0.45)',
            }}
          >شروع خرید</motion.button>
        </motion.div>
      ) : (
        <>
          {/* لیست آیتم‌ها */}
          <div style={{ padding:'0 16px' }}>
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.id}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, x:-40 }} layout
                  transition={{ duration:.22, ease }}
                  style={{
                    background:   'linear-gradient(145deg, #1a2d5a, #0e1e46)',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 18,
                    padding:      '12px 14px',
                    marginBottom: 10,
                    display:      'flex',
                    alignItems:   'center',
                    gap:          12,
                  }}
                >
                  {/* عکس float */}
                  <div style={{
                    width:64, height:64, flexShrink:0,
                    background:'linear-gradient(135deg, rgba(41,82,204,0.15), rgba(91,141,239,0.08))',
                    borderRadius:12, overflow:'hidden',
                  }}>
                    <img
                      src={item.images?.[0]||''}
                      alt={item.name}
                      style={{ width:'100%', height:'100%', objectFit:'contain' }}
                    />
                  </div>

                  {/* اطلاعات */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:13, fontWeight:600, color:'#fff',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      marginBottom:4,
                    }}>{item.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize:13, fontWeight:800, color:'#5B8DEF' }}>
                      {fmtPrice(item.price)}
                    </div>
                  </div>

                  {/* تعداد + حذف */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                    <button onClick={() => remove(item.id)} style={{
                      width:22, height:22, borderRadius:11,
                      background:'rgba(239,68,68,0.15)',
                      border:'none', color:'#ef4444',
                      fontSize:12, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>✕</button>

                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <motion.button
                        whileTap={{ scale:.8 }}
                        onClick={() => setQty(item.id, item.qty - 1)}
                        style={{
                          width:26, height:26, borderRadius:13,
                          background:'rgba(255,255,255,0.1)',
                          border:'1px solid rgba(255,255,255,0.15)',
                          color:'#fff', fontSize:15,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          cursor:'pointer',
                        }}
                      >−</motion.button>
                      <span style={{ fontSize:13, fontWeight:700, color:'#fff', minWidth:16, textAlign:'center' }}>
                        {item.qty}
                      </span>
                      <motion.button
                        whileTap={{ scale:.8 }}
                        onClick={() => setQty(item.id, item.qty + 1)}
                        style={{
                          width:26, height:26, borderRadius:13,
                          background:'linear-gradient(135deg, #2952CC, #5B8DEF)',
                          border:'none', color:'#fff', fontSize:15,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          cursor:'pointer',
                          boxShadow:'0 3px 8px rgba(41,82,204,0.4)',
                        }}
                      >+</motion.button>
                    </div>

                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:ff }}>
                      {fmtPrice(item.price * item.qty)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* خلاصه سفارش */}
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.22, ease, delay:.1 }}
            style={{
              margin:       '8px 16px 0',
              background:   'rgba(255,255,255,0.06)',
              border:       '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding:      '18px 18px 20px',
            }}
          >
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', textAlign:'right', marginBottom:14 }}>
              خلاصه سفارش
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>
                {fmtPrice(total + discount)}
              </span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>مجموع</span>
            </div>

            {discount > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#22c55e' }}>− {fmtPrice(discount)}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>تخفیف</span>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#22c55e' }}>رایگان</span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>ارسال</span>
            </div>

            <div style={{
              height:1, background:'rgba(255,255,255,0.1)',
              margin:'10px 0',
            }}/>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <span style={{ fontSize:16, fontWeight:900, color:'#fff' }}>{fmtPrice(total)}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.7)' }}>قابل پرداخت</span>
            </div>

            <motion.button
              whileTap={{ scale:.97 }}
              onClick={() => navigate('/checkout')}
              style={{
                width:       '100%',
                height:      52,
                borderRadius: 16,
                background:  'linear-gradient(135deg, #2952CC, #5B8DEF)',
                color:       '#fff',
                border:      'none',
                fontSize:    15,
                fontWeight:  700,
                cursor:      'pointer',
                fontFamily:  ff,
                boxShadow:   '0 8px 24px rgba(41,82,204,0.45)',
                display:     'flex',
                alignItems:  'center',
                justifyContent: 'center',
                gap:         8,
              }}
            >
              <span>Checkout & Pay</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>

            <button
              onClick={() => navigate('/products')}
              style={{
                width:'100%', marginTop:10,
                background:'none', border:'none',
                color:'rgba(255,255,255,0.5)',
                fontSize:13, cursor:'pointer', fontFamily:ff,
              }}
            >ادامه خرید</button>
          </motion.div>
        </>
      )}
    </div>
  );
}
