(function () {
  'use strict';

  const LANG_MAP = {
    af:'Afrikaans', sq:'Albanian', am:'Amharic', ar:'Arabic', az:'Azerbaijani',
    be:'Belarusian', bn:'Bengali', bs:'Bosnian', bg:'Bulgarian', ca:'Catalan',
    zh:'Chinese', hr:'Croatian', cs:'Czech', da:'Danish', nl:'Dutch',
    en:'English', et:'Estonian', fi:'Finnish', fr:'French', gl:'Galician',
    ka:'Georgian', de:'German', el:'Greek', gu:'Gujarati', he:'Hebrew',
    hi:'Hindi', hu:'Hungarian', is:'Icelandic', id:'Indonesian', it:'Italian',
    ja:'Japanese', kn:'Kannada', kk:'Kazakh', km:'Khmer', ko:'Korean',
    ku:'Kurdish', ky:'Kyrgyz', lo:'Lao', lv:'Latvian', lt:'Lithuanian',
    mk:'Macedonian', ms:'Malay', ml:'Malayalam', mt:'Maltese', mr:'Marathi',
    mn:'Mongolian', ne:'Nepali', nb:'Norwegian', ps:'Pashto', pl:'Polish',
    pt:'Portuguese', pa:'Punjabi', ro:'Romanian', ru:'Russian', sr:'Serbian',
    si:'Sinhala', sk:'Slovak', sl:'Slovenian', so:'Somali', es:'Spanish',
    sw:'Swahili', sv:'Swedish', tl:'Filipino', tg:'Tajik', ta:'Tamil',
    te:'Telugu', th:'Thai', tr:'Turkish', uk:'Ukrainian', ur:'Urdu',
    uz:'Uzbek', vi:'Vietnamese', cy:'Welsh', yo:'Yoruba', zu:'Zulu'
  };

  const RTL_LANGS = new Set(['ar', 'he', 'ur', 'fa', 'ps', 'ku', 'yi', 'ug']);

  const Translator = {
    async init() {
      this.showLoader();
      try {
        const lang = await this.detectLanguage();

        // Already Persian — no translation needed
        if (lang.code === 'fa') {
          this.hideLoader();
          return;
        }

        // Set document direction and language
        const dir = RTL_LANGS.has(lang.code) ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang.code);

        // Try cache first
        const cached = this.getCache(lang.code);
        if (cached) {
          this.applyTranslations(cached);
          this.hideLoader();
          return;
        }

        // Collect, translate, cache, apply
        const texts = this.collectTexts();
        if (texts.length === 0) { this.hideLoader(); return; }

        const translations = await this.translate(texts, lang.code, lang.name);
        const map = this.buildMap(texts, translations);

        this.setCache(lang.code, map);
        this.applyTranslations(map);
      } catch (err) {
        console.warn('[Translator] Skipped:', err.message);
      }
      this.hideLoader();
    },

    async detectLanguage() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('ipapi error');
        const data = await res.json();
        const full = (data.languages || 'en').split(',')[0];
        const code = full.split('-')[0].toLowerCase();
        const name = LANG_MAP[code] || data.country_name || 'English';
        return { code, name, country: data.country_code };
      } catch {
        return { code: 'en', name: 'English', country: 'US' };
      }
    },

    collectTexts() {
      const seen = new Set();
      const add = text => {
        if (text && text.trim().length > 1 && !this.isSkipped(text)) seen.add(text.trim());
      };

      document.querySelectorAll('[data-i18n]').forEach(el => add(el.textContent));
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => add(el.placeholder));
      document.querySelectorAll('[data-i18n-alt]').forEach(el => add(el.alt));
      document.querySelectorAll('[data-i18n-title]').forEach(el => add(el.title));

      return [...seen];
    },

    // Skip texts that are placeholder patterns or purely numeric/symbolic
    isSkipped(text) {
      const t = text.trim();
      return /\{\{[^}]+\}\}/.test(t) || /^[\d\s\W]+$/.test(t);
    },

    async translate(texts, langCode, langName) {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLang: langCode, targetLangName: langName })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data.translations)) throw new Error('Invalid translations response');
      return data.translations;
    },

    buildMap(texts, translations) {
      const map = {};
      texts.forEach((text, i) => {
        if (translations[i] !== undefined) map[text.trim()] = translations[i];
      });
      return map;
    },

    applyTranslations(map) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.textContent.trim();
        if (map[key]) el.textContent = map[key];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.placeholder?.trim();
        if (key && map[key]) el.placeholder = map[key];
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.alt?.trim();
        if (key && map[key]) el.alt = map[key];
      });
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.title?.trim();
        if (key && map[key]) el.title = map[key];
      });
    },

    getCache(langCode) {
      try {
        const raw = localStorage.getItem(`wb_trans_${langCode}`);
        if (!raw) return null;
        const { map, ts } = JSON.parse(raw);
        // 24-hour TTL
        if (Date.now() - ts > 86400000) { localStorage.removeItem(`wb_trans_${langCode}`); return null; }
        return map;
      } catch { return null; }
    },

    setCache(langCode, map) {
      try {
        localStorage.setItem(`wb_trans_${langCode}`, JSON.stringify({ map, ts: Date.now() }));
      } catch (e) { console.warn('[Translator] Cache write failed:', e.message); }
    },

    showLoader() {
      const el = document.getElementById('wb-loader');
      if (el) el.style.display = 'flex';
    },

    hideLoader() {
      const el = document.getElementById('wb-loader');
      if (el) el.style.display = 'none';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Translator.init());
  } else {
    Translator.init();
  }

  window.Translator = Translator;
})();
