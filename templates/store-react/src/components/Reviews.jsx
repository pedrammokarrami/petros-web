import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import s from './Reviews.module.css';

function Stars({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={s.starRow}>
      {[1,2,3,4,5].map(n => (
        <motion.button
          key={n}
          className={`${s.starBtn} ${n <= (hovered || value) ? s.starOn : ''}`}
          whileHover={{ opacity: 0.8 }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange?.(n)}
          type="button"
        >★</motion.button>
      ))}
    </div>
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [form, setForm]           = useState({ rating: 0, text: '' });
  const [submitting, setSubmitting] = useState(false);
  const { add: toast }            = useToast();

  /* خواندن نظرات از API */
  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) setReviews(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchReviews(); }, [productId]);

  async function submit(e) {
    e.preventDefault();
    if (form.rating === 0) { toast('امتیاز را انتخاب کنید', 'error'); return; }
    if (!form.text.trim()) { toast('متن نظر را بنویسید', 'error');   return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId, ...form })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => [data.review, ...prev]);
        setForm({ rating: 0, text: '' });
        setShowForm(false);
        setShowPrize(true);
        setTimeout(() => setShowPrize(false), 4000);
      } else {
        toast('خطا در ثبت نظر', 'error');
      }
    } catch { toast('خطا در ارتباط با سرور', 'error'); }
    finally { setSubmitting(false); }
  }

  async function vote(id, type) {
    try {
      const res = await fetch(`/api/reviews/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => prev.map(r => r.id === id
          ? { ...r, likes: data.likes, dislikes: data.dislikes } : r
        ));
      }
    } catch { /* ignore */ }
  }

  return (
    <div className={s.section}>
      <div className={s.header}>
        <h3 className={s.title}>نظر مشتریان ({reviews.length})</h3>
        <motion.button
          className={s.btnNew}
          whileTap={{ opacity: 0.7 }}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '✕ بستن' : '+ ثبت نظر'}
        </motion.button>
      </div>

      {/* فرم نظر */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className={s.form}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: .3 }}
            onSubmit={submit}
          >
            <div className={s.formGroup}>
              <label>امتیاز *</label>
              <Stars value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
            <div className={s.formGroup}>
              <label>نظر شما *</label>
              <textarea
                className={s.textarea}
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="تجربه خرید و نظر شما در مورد این محصول..."
                rows={3}
              />
            </div>
            <motion.button
              type="submit"
              className={s.btnSubmit}
              disabled={submitting}
              whileTap={{ opacity: 0.7 }}
            >
              {submitting ? '...' : 'ثبت نظر'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* پیام قرعه‌کشی */}
      <AnimatePresence>
        {showPrize && (
          <motion.div
            className={s.prize}
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:8 }}
          >
            🎉 نظر شما ثبت شد! در قرعه‌کشی ماهانه شرکت کردید.
          </motion.div>
        )}
      </AnimatePresence>

      {/* لیست نظرات */}
      {loading && <div className={s.loading}>در حال بارگذاری...</div>}
      {!loading && reviews.length === 0 && (
        <div className={s.empty}>اولین نظر را بنویسید</div>
      )}
      <div className={s.list}>
        <AnimatePresence>
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              className={s.reviewCard}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * .05 }}
            >
              <div className={s.reviewTop}>
                <div className={s.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                <span className={s.reviewDate}>{r.date || r.createdAt?.slice(0,10)}</span>
              </div>
              <p className={s.reviewText}>{r.text}</p>
              <div className={s.votes}>
                <button className={s.voteBtn} onClick={() => vote(r.id, 'like')}>
                  👍 {r.likes || 0}
                </button>
                <button className={s.voteBtn} onClick={() => vote(r.id, 'dislike')}>
                  👎 {r.dislikes || 0}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
