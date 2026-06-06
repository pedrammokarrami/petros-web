import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { storeData } from '../data/store-config';
import s from './Settings.module.css';

/* ════════════════════════════════════════
   Constants & Helpers
════════════════════════════════════════ */
const ease = [0.25, 0.1, 0.25, 1];
const APP_VERSION = '1.0.0';
const KEYS = {
  auth:      'petros_auth',
  orders:    'petros_orders',
  addresses: 'petros_addresses',
  payment:   'petros_payment_methods',
  notif:     'petros_notif_prefs',
  wishlist:  'petros_wishlist',
};

function ls(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function sw(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function mockOrders() {
  return storeData.products.slice(0, 3).map((p, i) => ({
    id: `ORD-${1001 + i}`,
    date: `۱۴۰۳/0${9 - i}/15`,
    items: [{ ...p, qty: 1 }],
    total: p.price,
    status: ['delivered', 'shipped', 'pending'][i],
  }));
}

/* ════════════════════════════════════════
   SVG Icons
════════════════════════════════════════ */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.22.14-2.17 1.26-2.15 3.76.03 2.99 2.63 3.99 2.65 4-.03.07-.41 1.4-1.35 2.76M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

/* ════════════════════════════════════════
   Reusable Field
════════════════════════════════════════ */
function Field({ label, children }) {
  return (
    <div className={s.field}>
      <label className={s.label}>{label}</label>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   Auth Screen
════════════════════════════════════════ */
function AuthScreen({ onAuth }) {
  const { add: toast } = useToast();
  const [mode, setMode]   = useState('login');
  const [busy, setBusy]   = useState(false);
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [pass2, setPass2] = useState('');

  function finish(extra) {
    const user = { id: 'u_' + Date.now(), avatarUrl: '', createdAt: new Date().toISOString(), ...extra };
    const auth = { user };
    sw(KEYS.auth, auth);
    onAuth(auth);
  }

  function handleSocial(provider) {
    setBusy(true);
    setTimeout(() => finish({
      name:     provider === 'google' ? 'کاربر گوگل' : 'کاربر اپل',
      email:    provider + '@example.com',
      provider,
    }), 1100);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !pass) { toast('همه فیلدها الزامی هستند', 'error'); return; }
    if (mode === 'register') {
      if (!name)         { toast('نام خود را وارد کنید', 'error'); return; }
      if (pass !== pass2){ toast('رمزهای عبور مطابقت ندارند', 'error'); return; }
      if (pass.length<6) { toast('رمز باید حداقل ۶ کاراکتر باشد', 'error'); return; }
    }
    setBusy(true);
    setTimeout(() => finish({
      name:     mode === 'register' ? name : (email.split('@')[0] || 'کاربر'),
      email,
      provider: 'email',
    }), 750);
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login');
    setBusy(false); setName(''); setEmail(''); setPass(''); setPass2('');
  }

  return (
    <div className={s.authPage}>

      {/* لوگو */}
      <motion.div className={s.authLogo}
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3, ease }}
      >
        <div className={s.authLogoCircle}>{storeData.meta.name.charAt(0)}</div>
        <h1 className={s.authBrand}>{storeData.meta.name}</h1>
        <p className={s.authSub}>{mode === 'login' ? 'خوش برگشتید 👋' : 'ایجاد حساب جدید'}</p>
      </motion.div>

      <motion.div className={s.authCard}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3, ease, delay:0.1 }}
      >
        {/* دکمه‌های اجتماعی */}
        <motion.button className={`${s.socialBtn} ${s.googleBtn}`}
          onClick={() => handleSocial('google')} disabled={busy}
          whileTap={{ scale:0.96 }}
        >
          <GoogleIcon />
          <span>ادامه با Google</span>
        </motion.button>

        <motion.button className={`${s.socialBtn} ${s.appleBtn}`}
          onClick={() => handleSocial('apple')} disabled={busy}
          whileTap={{ scale:0.96 }}
        >
          <AppleIcon />
          <span>ادامه با Apple</span>
        </motion.button>

        {/* جداکننده */}
        <div className={s.orRow}>
          <div className={s.orLine} /><span className={s.orText}>یا</span><div className={s.orLine} />
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence initial={false}>
            {mode === 'register' && (
              <motion.div key="name" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }} style={{ overflow:'hidden' }}>
                <Field label="نام کامل">
                  <input className={s.input} type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="علی رضایی" />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="ایمیل">
            <input className={s.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </Field>

          <Field label="رمز عبور">
            <input className={s.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" autoComplete={mode==='login'?'current-password':'new-password'} />
          </Field>

          <AnimatePresence initial={false}>
            {mode === 'register' && (
              <motion.div key="pass2" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }} style={{ overflow:'hidden' }}>
                <Field label="تکرار رمز عبور">
                  <input className={s.input} type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="••••••••" />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button type="submit" className={s.btnPrimary} disabled={busy} whileTap={{ scale:0.96 }}>
            {busy ? <span className={s.spinner} /> : (mode === 'login' ? 'ورود به حساب' : 'ایجاد حساب')}
          </motion.button>
        </form>

        <button className={s.authToggle} onClick={switchMode}>
          {mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید ←' : '← حساب دارید؟ وارد شوید'}
        </button>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════
   Profile Screen
════════════════════════════════════════ */
function ProfileScreen({ auth, onUpdateAuth, onLogout }) {
  const navigate      = useNavigate();
  const { add: toast }= useToast();
  const avatarRef     = useRef(null);
  const user          = auth.user;

  const [panel, setPanel]           = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [editName, setEditName]     = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl || '');

  /* ── data state ── */
  const [orders]               = useState(() => ls(KEYS.orders) || mockOrders());
  const [addresses, setAddrs]  = useState(() => ls(KEYS.addresses, []));
  const [payment, setPayment]  = useState(() => ls(KEYS.payment, []));
  const [notif, setNotif]      = useState(() => ls(KEYS.notif, { email:true, sms:false, discount:true }));
  const wishIds    = ls(KEYS.wishlist) || [];
  const wishProd   = storeData.products.filter(p => wishIds.includes(p.id));

  function saveProfile() {
    const updated = { ...auth, user: { ...user, name: editName, avatarUrl: editAvatar }};
    sw(KEYS.auth, updated);
    onUpdateAuth(updated);
    setEditMode(false);
    toast('پروفایل بروز شد ✓');
  }

  function handleAvatarPick(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setEditAvatar(ev.target.result);
    r.readAsDataURL(f);
  }

  function saveAddrs(v)  { setAddrs(v);    sw(KEYS.addresses, v); }
  function savePayment(v){ setPayment(v);  sw(KEYS.payment, v);   }
  function saveNotif(v)  { setNotif(v);    sw(KEYS.notif, v);     }

  /* ── menu definition ── */
  const GROUPS = [
    [
      { id:'orders',    icon:'📦', label:'سفارشات من',       sub: orders.length ? `${orders.length} سفارش` : 'خریدی انجام ندادید' },
      { id:'addresses', icon:'📍', label:'آدرس‌های من',      sub: addresses.length ? `${addresses.length} آدرس ذخیره شده` : 'آدرسی ذخیره نشده', badge: addresses.length||null },
    ],
    [
      { id:'payment',   icon:'💳', label:'روش‌های پرداخت',  sub: payment.length ? `${payment.length} کارت` : 'کارتی اضافه نشده' },
      { id:'wishlist',  icon:'❤️', label:'علاقه‌مندی‌ها',   sub: `${wishProd.length} محصول`, badge: wishProd.length||null },
    ],
    [
      { id:'notif',     icon:'🔔', label:'اعلان‌ها',         sub: 'ایمیل، پیامک و تخفیف' },
      { id:'security',  icon:'🔒', label:'امنیت',             sub: 'رمز عبور و دستگاه‌ها' },
      { id:'language',  icon:'🌐', label:'زبان و منطقه',     sub: 'فارسی · تومان' },
    ],
    [
      { id:'contact',   icon:'📞', label:'تماس با ما',       sub: storeData.contact.phone },
      { id:'about',     icon:'ℹ️', label:'درباره اپ',         sub: `نسخه ${APP_VERSION}` },
    ],
  ];

  const PANEL_TITLE = {
    orders:'سفارشات من', addresses:'آدرس‌های من', payment:'روش‌های پرداخت',
    wishlist:'علاقه‌مندی‌ها', notif:'اعلان‌ها', security:'امنیت',
    language:'زبان و منطقه', contact:'تماس با ما', about:'درباره اپ',
  };

  function renderPanelContent() {
    switch(panel) {
      case 'orders':    return <OrdersPanel orders={orders} />;
      case 'addresses': return <AddressesPanel addresses={addresses} onChange={saveAddrs} />;
      case 'payment':   return <PaymentPanel payment={payment} onChange={savePayment} />;
      case 'wishlist':  return <WishlistPanel products={wishProd} navigate={navigate} />;
      case 'notif':     return <NotifPanel notif={notif} onChange={saveNotif} />;
      case 'security':  return <SecurityPanel />;
      case 'language':  return <LanguagePanel />;
      case 'contact':   return <ContactPanel />;
      case 'about':     return <AboutPanel />;
      default: return null;
    }
  }

  return (
    <div className={s.profilePage}>

      {/* ── هدر پروفایل ── */}
      <motion.div className={s.profileHeader}
        initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.22, ease }}
      >
        <div className={s.avatarWrap} onClick={() => editMode && avatarRef.current?.click()}>
          {(editMode ? editAvatar : user.avatarUrl)
            ? <img src={editMode ? editAvatar : user.avatarUrl} alt="avatar" className={s.avatarImg} />
            : <div className={s.avatarInitial}>{(editMode ? editName : user.name || '?').charAt(0).toUpperCase()}</div>
          }
          {editMode && <div className={s.avatarEditOverlay}>📷</div>}
        </div>
        <input ref={avatarRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleAvatarPick} />

        <div className={s.profileMeta}>
          {editMode
            ? <input className={`${s.input} ${s.inlineInput}`} value={editName} onChange={e=>setEditName(e.target.value)} />
            : <div className={s.profileName}>{user.name}</div>
          }
          <div className={s.profileEmail}>{user.email}</div>
          <div className={s.providerTag}>
            {user.provider === 'google' ? '🔵 Google' : user.provider === 'apple' ? '⬛ Apple' : '📧 ایمیل'}
          </div>
        </div>

        <div className={s.profileActions}>
          {editMode ? (
            <>
              <motion.button className={s.btnSaveSmall} onClick={saveProfile} whileTap={{scale:0.92}}>ذخیره</motion.button>
              <button className={s.btnCancelSmall} onClick={() => { setEditMode(false); setEditName(user.name); setEditAvatar(user.avatarUrl||''); }}>لغو</button>
            </>
          ) : (
            <button className={s.btnEdit} onClick={() => setEditMode(true)}>ویرایش</button>
          )}
        </div>
      </motion.div>

      {/* ── گروه‌های منو ── */}
      <div className={s.menuWrap}>
        {GROUPS.map((group, gi) => (
          <motion.div key={gi} className={s.menuGroup}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.22, ease, delay: 0.05 + gi * 0.04 }}
          >
            {group.map((item, ii) => (
              <motion.button
                key={item.id}
                className={`${s.menuRow} ${ii < group.length-1 ? s.menuRowBorder : ''}`}
                onClick={() => setPanel(item.id)}
                whileTap={{ scale:0.97 }}
              >
                {/* globe button چرخنده — سمت راست */}
                <div className={s.globeBtn} />
                <div className={s.menuRowText}>
                  <span className={s.menuRowLabel}>{item.label}</span>
                  <span className={s.menuRowSub}>{item.sub}</span>
                </div>
                {item.badge > 0 && <span className={s.menuBadge}>{item.badge}</span>}
                <span className={s.menuArrow}><ChevronIcon /></span>
              </motion.button>
            ))}
          </motion.div>
        ))}

        {/* دکمه خروج */}
        <motion.button className={s.btnLogout}
          onClick={() => setShowLogout(true)}
          whileTap={{ scale:0.96 }}
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:0.22, delay:0.25 }}
        >
          🚪 خروج از حساب کاربری
        </motion.button>
      </div>

      {/* ── Sub-panel ── */}
      <AnimatePresence>
        {panel && (
          <motion.div className={s.subPanel}
            initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ duration:0.28, ease }}
          >
            <div className={s.subPanelHead}>
              <motion.button className={s.subPanelBack} onClick={() => setPanel(null)} whileTap={{scale:0.88}}>
                <BackIcon />
              </motion.button>
              <h2 className={s.subPanelTitle}>{PANEL_TITLE[panel]}</h2>
              <div style={{ width:36 }} />
            </div>
            <div className={s.subPanelBody}>
              {renderPanelContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── مودال خروج ── */}
      <AnimatePresence>
        {showLogout && (
          <motion.div className={s.modalOverlay}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.18 }}
            onClick={() => setShowLogout(false)}
          >
            <motion.div className={s.modal}
              initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }}
              exit={{ y:40, opacity:0 }} transition={{ duration:0.25, ease }}
              onClick={e => e.stopPropagation()}
            >
              <div className={s.modalIcon}>🚪</div>
              <h3 className={s.modalTitle}>خروج از حساب</h3>
              <p className={s.modalText}>مطمئنید می‌خواهید خارج شوید؟</p>
              <div className={s.modalBtns}>
                <button className={s.btnCancelMd} onClick={() => setShowLogout(false)}>انصراف</button>
                <motion.button className={s.btnLogoutConfirm}
                  whileTap={{ scale:0.92 }}
                  onClick={() => {
                    localStorage.removeItem(KEYS.auth);
                    onLogout();
                  }}
                >
                  بله، خروج
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Orders
════════════════════════════════════════ */
const STATUS_MAP = {
  delivered: { label:'تحویل داده شده', bg:'#dcfce7', color:'#166534' },
  shipped:   { label:'ارسال شده',       bg:'#dbeafe', color:'#1e40af' },
  pending:   { label:'در انتظار',        bg:'#fef9c3', color:'#854d0e' },
};

function OrdersPanel({ orders }) {
  return (
    <div className={s.panelBody}>
      {orders.length === 0 ? <EmptyState icon="📦" text="سفارشی ثبت نشده است" /> : orders.map(o => (
        <div key={o.id} className={s.orderCard}>
          <div className={s.orderHead}>
            <div>
              <div className={s.orderId}>سفارش #{o.id}</div>
              <div className={s.orderDate}>{o.date}</div>
            </div>
            <span className={s.statusChip} style={{ background: STATUS_MAP[o.status]?.bg, color: STATUS_MAP[o.status]?.color }}>
              {STATUS_MAP[o.status]?.label}
            </span>
          </div>

          {o.items.map(item => (
            <div key={item.id} className={s.orderItemRow}>
              <div className={s.orderItemImg}><img src={item.images?.[0]||''} alt={item.name} /></div>
              <div className={s.orderItemInfo}>
                <div className={s.orderItemName}>{item.name}</div>
                <div className={s.orderItemPrice}>{Number(item.price).toLocaleString('fa-IR')} تومان × {item.qty}</div>
              </div>
            </div>
          ))}

          <div className={s.orderFoot}>
            <span className={s.orderTotal}>جمع: {Number(o.total).toLocaleString('fa-IR')} تومان</span>
            {o.status === 'shipped' && (
              <motion.button className={s.btnTrack} whileTap={{scale:0.92}}>پیگیری ←</motion.button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Addresses
════════════════════════════════════════ */
function AddressesPanel({ addresses, onChange }) {
  const { add: toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label:'', name:'', phone:'', city:'', address:'' });

  function addAddress() {
    if (!form.name || !form.address) { toast('نام و آدرس الزامی است', 'error'); return; }
    const newA = { ...form, id:'addr_'+Date.now(), isDefault: addresses.length === 0 };
    onChange([...addresses, newA]);
    setForm({ label:'', name:'', phone:'', city:'', address:'' });
    setShowForm(false);
    toast('آدرس اضافه شد ✓');
  }

  return (
    <div className={s.panelBody}>
      {addresses.length === 0 && !showForm && <EmptyState icon="📍" text="آدرسی ذخیره نشده است" />}

      {addresses.map(a => (
        <div key={a.id} className={s.addrCard}>
          <div className={s.addrTop}>
            <div className={s.addrLabel}>
              {a.label || 'آدرس'}
              {a.isDefault && <span className={s.defaultTag}>پیش‌فرض</span>}
            </div>
            <div className={s.addrOps}>
              {!a.isDefault && (
                <button className={s.btnXs} onClick={() => onChange(addresses.map(x=>({...x, isDefault: x.id===a.id})))}>
                  پیش‌فرض
                </button>
              )}
              <button className={s.btnXsRed} onClick={() => { onChange(addresses.filter(x=>x.id!==a.id)); toast('حذف شد'); }}>حذف</button>
            </div>
          </div>
          <div className={s.addrName}>{a.name}</div>
          {a.phone && <div className={s.addrMeta}>{a.phone}</div>}
          {a.city  && <div className={s.addrMeta}>{a.city}</div>}
          <div className={s.addrText}>{a.address}</div>
        </div>
      ))}

      <AnimatePresence>
        {showForm && (
          <motion.div className={s.formCard}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          >
            <div className={s.formCardTitle}>آدرس جدید</div>
            <Field label="برچسب (خانه، محل کار...)">
              <input className={s.input} value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="خانه" />
            </Field>
            <Field label="نام گیرنده *">
              <input className={s.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="نام و نام خانوادگی" />
            </Field>
            <Field label="شماره تماس">
              <input className={s.input} type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="09..." />
            </Field>
            <Field label="شهر">
              <input className={s.input} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="تهران" />
            </Field>
            <Field label="آدرس کامل *">
              <textarea className={`${s.input} ${s.textarea}`} value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="خیابان، کوچه، پلاک..." rows={3} />
            </Field>
            <div className={s.formBtns}>
              <motion.button className={s.btnPrimary} whileTap={{scale:0.94}} onClick={addAddress}>ذخیره آدرس</motion.button>
              <button className={s.btnCancelSm} onClick={() => setShowForm(false)}>لغو</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <motion.button className={s.btnAddNew} onClick={() => setShowForm(true)} whileTap={{scale:0.94}}>
          + افزودن آدرس جدید
        </motion.button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Payment
════════════════════════════════════════ */
function PaymentPanel({ payment, onChange }) {
  const { add: toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ number:'', expiry:'', name:'' });

  function addCard() {
    const num = form.number.replace(/[\s-]/g,'');
    if (num.length < 16) { toast('شماره کارت ناقص است', 'error'); return; }
    if (!form.expiry)    { toast('تاریخ انقضا را وارد کنید', 'error'); return; }
    onChange([...payment, { id:'card_'+Date.now(), last4: num.slice(-4), expiry:form.expiry, name:form.name, isDefault: payment.length===0 }]);
    setForm({ number:'', expiry:'', name:'' });
    setShowForm(false);
    toast('کارت اضافه شد ✓');
  }

  return (
    <div className={s.panelBody}>
      {payment.length === 0 && !showForm && <EmptyState icon="💳" text="کارتی ذخیره نشده است" />}

      {payment.map(c => (
        <div key={c.id} className={s.cardRow}>
          <div className={s.cardChip}>💳</div>
          <div className={s.cardInfo}>
            <div className={s.cardNum}>•••• •••• •••• {c.last4}</div>
            <div className={s.cardMeta}>انقضا: {c.expiry}{c.name ? ` · ${c.name}` : ''}</div>
          </div>
          {c.isDefault && <span className={s.defaultTag}>پیش‌فرض</span>}
          <button className={s.btnXsRed} onClick={() => { onChange(payment.filter(x=>x.id!==c.id)); toast('کارت حذف شد'); }}>حذف</button>
        </div>
      ))}

      <AnimatePresence>
        {showForm && (
          <motion.div className={s.formCard} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <div className={s.formCardTitle}>کارت جدید</div>
            <Field label="شماره کارت ۱۶ رقمی">
              <input className={s.input} value={form.number} onChange={e=>setForm(f=>({...f,number:e.target.value}))} placeholder="0000 0000 0000 0000" maxLength={19} />
            </Field>
            <Field label="تاریخ انقضا">
              <input className={s.input} value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))} placeholder="MM/YY" maxLength={5} />
            </Field>
            <Field label="نام دارنده کارت">
              <input className={s.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="نام روی کارت" />
            </Field>
            <div className={s.formBtns}>
              <motion.button className={s.btnPrimary} whileTap={{scale:0.94}} onClick={addCard}>ذخیره کارت</motion.button>
              <button className={s.btnCancelSm} onClick={() => setShowForm(false)}>لغو</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <motion.button className={s.btnAddNew} onClick={() => setShowForm(true)} whileTap={{scale:0.94}}>
          + افزودن کارت جدید
        </motion.button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Wishlist
════════════════════════════════════════ */
function WishlistPanel({ products, navigate }) {
  if (!products.length) return <div className={s.panelBody}><EmptyState icon="❤️" text="هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌اید" /></div>;
  return (
    <div className={s.panelBody}>
      <div className={s.wishGrid}>
        {products.map(p => (
          <motion.div key={p.id} className={s.wishCard} whileTap={{scale:0.94}} onClick={() => navigate(`/product/${p.id}`)}>
            <div className={s.wishImgWrap}>
              <img src={p.images?.[0]||''} alt={p.name} className={s.wishImg} />
            </div>
            <div className={s.wishName}>{p.name}</div>
            <div className={s.wishPrice}>{Number(p.price).toLocaleString('fa-IR')} ت</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Notifications
════════════════════════════════════════ */
function NotifPanel({ notif, onChange }) {
  const rows = [
    { k:'email',    label:'اعلان ایمیل',    desc:'خبرنامه و تأیید سفارش' },
    { k:'sms',      label:'اعلان پیامک',    desc:'ارسال و تحویل سفارش' },
    { k:'discount', label:'پیشنهادات ویژه', desc:'تخفیف‌ها و فروش فوری' },
  ];
  return (
    <div className={s.panelBody}>
      {rows.map(r => (
        <div key={r.k} className={s.toggleRow}>
          <div className={s.toggleMeta}>
            <div className={s.toggleLabel}>{r.label}</div>
            <div className={s.toggleDesc}>{r.desc}</div>
          </div>
          <button className={`${s.toggle} ${notif[r.k] ? s.toggleOn : ''}`}
            onClick={() => onChange({ ...notif, [r.k]: !notif[r.k] })}>
            <motion.div className={s.toggleThumb}
              animate={{ x: notif[r.k] ? 22 : 0 }}
              transition={{ type:'spring', stiffness:500, damping:30 }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Security
════════════════════════════════════════ */
function SecurityPanel() {
  const { add: toast } = useToast();
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const DEVICES = [
    { icon:'📱', name:'iPhone 14 Pro', loc:'تهران', time:'همین الان', current:true },
    { icon:'💻', name:'MacBook Air',   loc:'تهران', time:'۳ ساعت پیش', current:false },
  ];
  return (
    <div className={s.panelBody}>
      <div className={s.secCard}>
        <div className={s.secCardTitle}>تغییر رمز عبور</div>
        <Field label="رمز عبور فعلی"><input className={s.input} type="password" value={oldP} onChange={e=>setOldP(e.target.value)} placeholder="••••••••" /></Field>
        <Field label="رمز عبور جدید"><input className={s.input} type="password" value={newP} onChange={e=>setNewP(e.target.value)} placeholder="••••••••" /></Field>
        <motion.button className={s.btnPrimary} whileTap={{scale:0.94}}
          onClick={() => { if(!oldP||!newP){toast('فیلدها را پر کنید','error');return;} if(newP.length<6){toast('رمز باید حداقل ۶ کاراکتر باشد','error');return;} setOldP('');setNewP('');toast('رمز تغییر یافت ✓'); }}>
          ذخیره رمز جدید
        </motion.button>
      </div>

      <div className={s.toggleRow}>
        <div className={s.toggleMeta}>
          <div className={s.toggleLabel}>تأیید دو مرحله‌ای</div>
          <div className={s.toggleDesc}>ارسال کد به موبایل هنگام ورود</div>
        </div>
        <button className={`${s.toggle} ${twoFA ? s.toggleOn : ''}`}
          onClick={() => { setTwoFA(v=>!v); toast(twoFA ? 'غیرفعال شد' : 'فعال شد ✓'); }}>
          <motion.div className={s.toggleThumb} animate={{ x: twoFA ? 22 : 0 }} transition={{ type:'spring',stiffness:500,damping:30 }} />
        </button>
      </div>

      <div className={s.secCard}>
        <div className={s.secCardTitle}>دستگاه‌های فعال</div>
        {DEVICES.map((d,i) => (
          <div key={i} className={s.deviceRow}>
            <span className={s.deviceIcon}>{d.icon}</span>
            <div className={s.deviceInfo}>
              <div className={s.deviceName}>{d.name} {d.current && <span className={s.currentTag}>این دستگاه</span>}</div>
              <div className={s.deviceMeta}>{d.loc} · {d.time}</div>
            </div>
            {!d.current && (
              <button className={s.btnXsRed} onClick={() => toast('از این دستگاه خارج شدید')}>خروج</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Language
════════════════════════════════════════ */
function LanguagePanel() {
  const { add: toast } = useToast();
  const [lang, setLang]     = useState('fa');
  const [currency, setCur]  = useState('IRR');

  function pickLang(v)  { setLang(v);  toast('زبان تغییر یافت ✓'); }
  function pickCur(v)   { setCur(v);   toast('واحد پول تغییر یافت ✓'); }

  return (
    <div className={s.panelBody}>
      <div className={s.secCard}>
        <div className={s.secCardTitle}>زبان</div>
        {[{v:'fa',l:'فارسی 🇮🇷'},{v:'en',l:'English 🇺🇸'},{v:'ar',l:'العربية 🇸🇦'}].map(({v,l}) => (
          <button key={v} className={`${s.selectRow} ${lang===v?s.selectRowOn:''}`} onClick={() => pickLang(v)}>
            <span>{l}</span>{lang===v && <span className={s.checkMark}>✓</span>}
          </button>
        ))}
      </div>
      <div className={s.secCard}>
        <div className={s.secCardTitle}>واحد پول</div>
        {[{v:'IRR',l:'تومان (IRR)'},{v:'USD',l:'دلار (USD)'},{v:'EUR',l:'یورو (EUR)'}].map(({v,l}) => (
          <button key={v} className={`${s.selectRow} ${currency===v?s.selectRowOn:''}`} onClick={() => pickCur(v)}>
            <span>{l}</span>{currency===v && <span className={s.checkMark}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: Contact
════════════════════════════════════════ */
function ContactPanel() {
  const { add: toast } = useToast();
  const rows = [
    { icon:'💬', label:'چت آنلاین',         desc:'پاسخ در کمتر از ۵ دقیقه', action: () => toast('چت آنلاین', 'info'), href: null },
    { icon:'📧', label:'ایمیل پشتیبانی',    desc: storeData.contact.email,   href: `mailto:${storeData.contact.email}` },
    { icon:'📞', label:'تلفن',               desc: storeData.contact.phone,   href: `tel:${storeData.contact.phone}` },
    { icon:'❓', label:'سوالات متداول',      desc:'پاسخ به سوالات رایج',      action: () => toast('سوالات متداول', 'info'), href: null },
  ];
  return (
    <div className={s.panelBody}>
      {rows.map((r,i) => (
        r.href
          ? <a key={i} href={r.href} className={s.contactRow}><span className={s.contactIcon}>{r.icon}</span><div className={s.contactText}><div className={s.contactLabel}>{r.label}</div><div className={s.contactDesc}>{r.desc}</div></div><ChevronIcon /></a>
          : <button key={i} className={s.contactRow} onClick={r.action}><span className={s.contactIcon}>{r.icon}</span><div className={s.contactText}><div className={s.contactLabel}>{r.label}</div><div className={s.contactDesc}>{r.desc}</div></div><ChevronIcon /></button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-panel: About
════════════════════════════════════════ */
function AboutPanel() {
  return (
    <div className={s.panelBody}>
      <div className={s.aboutHero}>
        <div className={s.aboutLogoCircle}>{storeData.meta.name.charAt(0)}</div>
        <div className={s.aboutName}>{storeData.meta.name}</div>
        <div className={s.aboutVer}>نسخه {APP_VERSION}</div>
      </div>
      {[{i:'📜',l:'قوانین و مقررات'},{i:'🔐',l:'حریم خصوصی'},{i:'📋',l:'مجوزهای استفاده'}].map(({i,l}) => (
        <div key={l} className={s.aboutRow}><span className={s.aboutRowIcon}>{i}</span><span>{l}</span><ChevronIcon /></div>
      ))}
      <p className={s.aboutCopy}>© {new Date().getFullYear()} {storeData.meta.name} · تمام حقوق محفوظ</p>
    </div>
  );
}

/* ════════════════════════════════════════
   Empty State
════════════════════════════════════════ */
function EmptyState({ icon, text }) {
  return (
    <div className={s.emptyState}>
      <div className={s.emptyIcon}>{icon}</div>
      <p className={s.emptyText}>{text}</p>
    </div>
  );
}

/* ════════════════════════════════════════
   Main Export
════════════════════════════════════════ */
export default function Settings() {
  const [auth, setAuth] = useState(() => ls(KEYS.auth));

  if (!auth) return <AuthScreen onAuth={setAuth} />;
  return <ProfileScreen auth={auth} onUpdateAuth={setAuth} onLogout={() => setAuth(null)} />;
}
