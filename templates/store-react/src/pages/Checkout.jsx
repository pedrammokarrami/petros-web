import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { storeData } from '../data/store-config';
import s from './Checkout.module.css';

function fmtPrice(n) { return Number(n).toLocaleString('fa-IR') + ' تومان'; }
const ease = [0.25, 0.1, 0.25, 1];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ name:'', phone:'', city:'', address:'' });
  const [done, setDone] = useState(false);
  const valid = form.name && form.phone && form.address;

  const v = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handlePay() {
    if (!valid) return;
    const link = storeData.meta.paymentLink;
    if (link && link !== '#') window.open(link, '_blank');
    else { setDone(true); clear(); }
  }

  if (done) return (
    <div className={s.page}>
      <motion.div className={s.success}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease }}
      >
        <div className={s.successIcon}>✓</div>
        <h2 className={s.successTitle}>سفارش ثبت شد</h2>
        <p>از خرید شما سپاسگزاریم</p>
        <button className={s.btnHome} onClick={() => navigate('/')}>بازگشت به خانه</button>
      </motion.div>
    </div>
  );

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className={s.page}>
      <motion.h1 className={s.title} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease }}>
        تکمیل سفارش
      </motion.h1>

      <div className={s.layout}>
        <motion.div className={s.form} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease }}>
          <div className={s.formSection}>اطلاعات ارسال</div>
          {[
            { id:'name',    label:'نام و نام خانوادگی *', type:'text',  ph:'علی رضایی' },
            { id:'phone',   label:'شماره موبایل *',        type:'tel',   ph:'۰۹۱۲...' },
            { id:'city',    label:'شهر',                   type:'text',  ph:'تهران' },
            { id:'address', label:'آدرس کامل *',           type:'text',  ph:'خیابان، کوچه، پلاک...' },
          ].map(f => (
            <div key={f.id} className={s.field}>
              <label className={s.label}>{f.label}</label>
              <input className={s.input} type={f.type} placeholder={f.ph} value={form[f.id]} onChange={v(f.id)} />
            </div>
          ))}
        </motion.div>

        <motion.div className={s.summary} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease, delay:.1 }}>
          <div className={s.formSection}>خلاصه سفارش</div>
          {items.map(i => (
            <div key={i.id} className={s.orderItem}>
              <span>{i.name} × {i.qty}</span>
              <span>{fmtPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <div className={s.divider} />
          <div className={s.totalRow}>
            <span>مبلغ نهایی</span>
            <span className={s.totalAmt}>{fmtPrice(total)}</span>
          </div>
          <button className={s.btnPay} onClick={handlePay} disabled={!valid}>
            پرداخت {fmtPrice(total)}
          </button>
          {!valid && <p className={s.hint}>* فیلدهای اجباری را تکمیل کنید</p>}
        </motion.div>
      </div>
    </div>
  );
}
