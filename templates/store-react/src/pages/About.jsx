import { motion } from 'framer-motion';
import { storeData } from '../data/store-config';
import s from './About.module.css';

const ease = [0.25, 0.1, 0.25, 1];
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease } }
};

export default function About() {
  const { meta, contact, social, about } = storeData;

  return (
    <div className={s.page}>
      {/* Hero */}
      <motion.section className={s.hero}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.4, ease }}
      >
        <motion.p className={s.heroLabel} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease, delay:.1 }}>
          درباره ما
        </motion.p>
        <motion.h1 className={s.heroTitle} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, ease, delay:.2 }}>
          {meta.name}
        </motion.h1>
        <motion.p className={s.heroSub} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.25, ease, delay:.35 }}>
          {meta.tagline}
        </motion.p>
      </motion.section>

      <div className={s.divider} />

      {/* داستان */}
      <motion.section className={s.section}
        initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:.25, ease }}
      >
        <div className={s.label}>داستان ما</div>
        <p className={s.story}>{about.story}</p>
      </motion.section>

      <div className={s.divider} />

      {/* آمار */}
      <motion.section className={s.statsSection}
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
      >
        {about.stats.map(stat => (
          <motion.div key={stat.label} className={s.stat} variants={fadeUp}>
            <div className={s.statNum}>{stat.value}</div>
            <div className={s.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      <div className={s.divider} />

      {/* تیم */}
      <motion.section className={s.section}
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
      >
        <div className={s.label}>تیم ما</div>
        <div className={s.team}>
          {about.team.map((m, i) => (
            <motion.div key={m.name} className={s.member}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:.25, ease, delay: i * .06 }}
            >
              <img src={m.avatar} alt={m.name} className={s.avatar} />
              <div className={s.memberName}>{m.name}</div>
              <div className={s.memberRole}>{m.role}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className={s.divider} />

      {/* تماس */}
      <motion.section className={s.contactSection}
        initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:.25, ease }}
      >
        <div className={s.contactInfo}>
          <div className={s.label}>تماس</div>
          {contact.phone   && <p className={s.contactLine}>{contact.phone}</p>}
          {contact.email   && <p className={s.contactLine}>{contact.email}</p>}
          {contact.address && <p className={s.contactLine}>{contact.address}</p>}
        </div>
        <div className={s.socialLinks}>
          <div className={s.label}>شبکه‌های اجتماعی</div>
          <div className={s.links}>
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener" className={s.socialLink}>
                Instagram
              </a>
            )}
            {social.telegram && (
              <a href={social.telegram} target="_blank" rel="noopener" className={s.socialLink}>
                Telegram
              </a>
            )}
            {social.whatsapp && (
              <a href={social.whatsapp} target="_blank" rel="noopener" className={s.socialLink}>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
