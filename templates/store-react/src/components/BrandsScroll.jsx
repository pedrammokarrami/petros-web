import s from './BrandsScroll.module.css';

const BRANDS = ['Nike', 'Samsung', 'Apple', 'Sony', 'LG', 'Adidas', 'Xiaomi', 'Asus', 'Dell', 'Lenovo', 'HP', 'Bose'];

export default function BrandsScroll() {
  /* دو بار تکرار برای infinite loop */
  const double = [...BRANDS, ...BRANDS];
  return (
    <section className={s.section}>
      <div className={s.label}>برندهای معتبر</div>
      <div className={s.track}>
        <div className={s.inner}>
          {double.map((b, i) => (
            <div key={i} className={s.brand}>{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
