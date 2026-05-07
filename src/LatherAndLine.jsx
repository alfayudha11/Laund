import { useState, useEffect, useRef } from "react";

/* ── Google Font injected once ── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector('[href*="Cormorant"]')) document.head.appendChild(fontLink);

/* ── Global styles injected once ── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --white: #ffffff; --bg: #f0f4f8; --bg-light: #f7f9fb;
    --dark: #111214; --dark-card: #14181e;
    --text: #1a1d21; --muted: #6b7280; --muted-light: #9ca3af;
    --border: #e2e8f0; --blue: #7ab3d4; --blue-light: #deedf7;
    --blue-icon-bg: #e8f3fb; --star: #f59e0b;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Jost', sans-serif; background: var(--white); color: var(--text); -webkit-font-smoothing: antialiased; }

  /* NAV */
  .ll-nav {
    position: sticky; top: 0; z-index: 100; background: var(--white);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3.5rem; height: 64px;
  }
  .ll-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; color: var(--dark); letter-spacing: .5px; }
  .ll-nav-links { display: flex; gap: 2.25rem; }
  .ll-nav-links a { text-decoration: none; font-size: 13.5px; color: var(--muted); transition: color .2s; padding-bottom: 2px; cursor: pointer; }
  .ll-nav-links a.active { color: var(--text); border-bottom: 1.5px solid var(--text); }
  .ll-nav-links a:hover { color: var(--text); }
  .ll-nav-right { display: flex; gap: 1rem; align-items: center; }

  /* BUTTONS */
  .btn-dark { background: var(--dark); color: var(--white); border: none; border-radius: 6px; padding: .7rem 1.6rem; font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .2s; }
  .btn-dark:hover { background: #2a2e35; }
  .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: .7rem 1.6rem; font-family: 'Jost', sans-serif; font-size: 14px; cursor: pointer; transition: all .2s; }
  .btn-ghost:hover { border-color: #aaa; }
  .btn-login { background: none; border: none; font-family: 'Jost', sans-serif; font-size: 13.5px; color: var(--muted); cursor: pointer; }
  .btn-login:hover { color: var(--text); }
  .btn-schedule { background: var(--dark); color: var(--white); border: none; border-radius: 6px; padding: .55rem 1.35rem; font-family: 'Jost', sans-serif; font-size: 13.5px; font-weight: 500; cursor: pointer; }
  .btn-schedule:hover { background: #2a2e35; }

  /* HERO */
  .ll-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 64px); background: var(--bg); }
  .ll-hero-left { display: flex; flex-direction: column; justify-content: center; padding: 5rem 3.5rem 5rem 5rem; }
  .ll-badge { display: inline-block; border: 1px solid #b8d4e8; color: #3a7fa8; background: var(--white); font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; margin-bottom: 1.75rem; width: fit-content; }
  .ll-hero-title { font-family: 'Cormorant Garamond', serif; font-size: 3.25rem; font-weight: 400; line-height: 1.2; color: var(--text); margin-bottom: 1.25rem; }
  .ll-hero-desc { font-size: 15px; line-height: 1.75; color: var(--muted); max-width: 400px; margin-bottom: 2.5rem; font-weight: 300; }
  .ll-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .ll-hero-right { position: relative; overflow: hidden; background: linear-gradient(135deg, #c9d8e4 0%, #e8eff5 40%, #d4e3ed 100%); display: flex; align-items: center; justify-content: center; }

  /* SECTIONS */
  .ll-section { padding: 6rem 5rem; }
  .ll-section-center { text-align: center; }
  .ll-eyebrow { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: .75rem; }
  .ll-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; color: var(--text); margin-bottom: .75rem; }
  .ll-sub { font-size: 14.5px; color: var(--muted); line-height: 1.7; font-weight: 300; max-width: 440px; }

  /* HOW IT WORKS */
  .ll-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; max-width: 860px; margin: 3.5rem auto 0; }
  .ll-step { text-align: center; }
  .ll-step-icon { width: 56px; height: 56px; border-radius: 14px; background: var(--blue-icon-bg); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
  .ll-step-name { font-weight: 500; font-size: 14.5px; color: var(--text); margin-bottom: .5rem; }
  .ll-step-desc { font-size: 13px; color: var(--muted); line-height: 1.65; font-weight: 300; }

  /* SERVICES */
  .ll-services-bg { background: var(--bg-light); }
  .ll-services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
  .ll-see-all { font-size: 13.5px; color: var(--text); text-decoration: none; white-space: nowrap; }
  .ll-see-all:hover { text-decoration: underline; }
  .ll-svc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
  .ll-svc-card { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 1.75rem 1.5rem; transition: box-shadow .2s, transform .2s; }
  .ll-svc-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.07); transform: translateY(-2px); }
  .ll-svc-icon { width: 44px; height: 44px; border-radius: 11px; background: var(--blue-icon-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
  .ll-svc-title { font-weight: 500; font-size: 14.5px; color: var(--text); margin-bottom: .6rem; }
  .ll-svc-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 1.25rem; font-weight: 300; }
  .ll-svc-features { list-style: none; }
  .ll-svc-features li { font-size: 12px; color: var(--muted); padding: 3px 0; display: flex; align-items: center; gap: 6px; }
  .ll-svc-features li::before { content: '✓'; color: var(--blue); font-size: 11px; }

  /* PRICING */
  .ll-price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 860px; margin: 3rem auto 0; }
  .ll-price-card { border: 1px solid var(--border); border-radius: 14px; padding: 2.25rem 2rem; text-align: left; position: relative; transition: box-shadow .2s; }
  .ll-price-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.07); }
  .ll-price-card.featured { background: var(--dark-card); border-color: var(--dark-card); color: var(--white); }
  .ll-popular-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--dark); color: var(--white); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500; padding: 5px 16px; border-radius: 50px; border: 1px solid #333; white-space: nowrap; }
  .ll-price-name { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; color: var(--muted-light); margin-bottom: 1.25rem; }
  .ll-price-card.featured .ll-price-name { color: rgba(255,255,255,.5); }
  .ll-price-amount { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300; color: var(--text); line-height: 1; }
  .ll-price-card.featured .ll-price-amount { color: var(--white); }
  .ll-price-unit { font-size: 13px; color: var(--muted); font-family: 'Jost', sans-serif; margin-bottom: 1.5rem; }
  .ll-price-card.featured .ll-price-unit { color: rgba(255,255,255,.5); }
  .ll-price-features { list-style: none; margin-bottom: 2rem; }
  .ll-price-features li { font-size: 13.5px; color: var(--muted); padding: 6px 0; border-bottom: 1px solid var(--border); font-weight: 300; }
  .ll-price-card.featured .ll-price-features li { color: rgba(255,255,255,.75); border-bottom-color: rgba(255,255,255,.1); }
  .ll-price-features li:last-child { border-bottom: none; }
  .btn-price { width: 100%; padding: .7rem; border-radius: 7px; font-family: 'Jost', sans-serif; font-size: 14px; cursor: pointer; transition: all .2s; background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-price:hover { background: var(--bg); }
  .ll-price-card.featured .btn-price { background: var(--white); color: var(--dark); border-color: var(--white); }
  .ll-price-card.featured .btn-price:hover { background: #eee; }

  /* TESTIMONIALS */
  .ll-testi-bg { background: var(--bg-light); }
  .ll-testi-layout { display: grid; grid-template-columns: 1fr 1.8fr; gap: 4rem; align-items: start; }
  .ll-testi-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; color: var(--text); margin-bottom: 1rem; }
  .ll-testi-sub { font-size: 14px; color: var(--muted); line-height: 1.7; font-weight: 300; margin-bottom: 2rem; }
  .ll-testi-nav { display: flex; gap: .5rem; }
  .ll-testi-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: var(--white); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
  .ll-testi-btn:hover { border-color: #aaa; }
  .ll-testi-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .ll-testi-card { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
  .ll-testi-stars { color: var(--star); font-size: 13px; margin-bottom: .85rem; }
  .ll-testi-text { font-size: 13.5px; color: var(--muted); line-height: 1.7; margin-bottom: 1.25rem; font-weight: 300; font-style: italic; }
  .ll-testi-author { display: flex; align-items: center; gap: 10px; }
  .ll-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; flex-shrink: 0; }
  .ll-testi-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .ll-testi-role { font-size: 11px; color: var(--muted-light); }

  /* FOOTER */
  .ll-footer { background: var(--white); border-top: 1px solid var(--border); padding: 2rem 5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .ll-footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; color: var(--dark); margin-bottom: 4px; }
  .ll-footer-copy { font-size: 12px; color: var(--muted-light); font-weight: 300; line-height: 1.6; }
  .ll-footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
  .ll-footer-links a { font-size: 12.5px; color: var(--muted); text-decoration: none; transition: color .2s; }
  .ll-footer-links a:hover { color: var(--text); }
  .ll-footer-icons { display: flex; gap: .75rem; }
  .ll-footer-icon { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: border-color .2s; }
  .ll-footer-icon:hover { border-color: #aaa; }

  /* FADE-UP */
  .fade-up { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    .ll-nav { padding: 0 1.5rem; }
    .ll-nav-links { display: none; }
    .ll-hero { grid-template-columns: 1fr; }
    .ll-hero-right { min-height: 280px; }
    .ll-hero-left { padding: 3rem 2rem; }
    .ll-section { padding: 4rem 2rem; }
    .ll-steps { grid-template-columns: 1fr; max-width: 340px; }
    .ll-svc-grid { grid-template-columns: 1fr 1fr; }
    .ll-price-grid { grid-template-columns: 1fr; max-width: 360px; }
    .ll-testi-layout { grid-template-columns: 1fr; gap: 2rem; }
    .ll-testi-cards { grid-template-columns: 1fr; }
    .ll-footer { flex-direction: column; align-items: flex-start; padding: 2rem; }
    .ll-footer-links { gap: 1rem; }
  }
`;
if (!document.head.querySelector("#ll-styles")) {
  const style = document.createElement("style");
  style.id = "ll-styles";
  style.textContent = css;
  document.head.appendChild(style);
}

/* ── SVG Icons ── */
const Icon = ({ d, viewBox = "0 0 24 24", size = 22 }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="#4a8fba" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const CalendarIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#4a8fba" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const WashIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#4a8fba" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 12s1-2 4-2 4 2 4 2"/><circle cx="12" cy="14" r="2"/>
  </svg>
);

const BoxIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#4a8fba" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

/* ── Data ── */
const SERVICES = [
  { icon: <Icon d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>, title: "Cuci & Lipat", desc: "Pembersihan harian yang higienis, dilipat rapi siap masuk lemari.", features: ["Selesai 24 Jam", "Deterjen Premium"] },
  { icon: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>, title: "Dry Cleaning", desc: "Perawatan khusus untuk jas, gaun, dan kain halus Anda.", features: ["Pelarut Organik", "Finishing Detail"] },
  { icon: <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 12l2.5 2.5L16 9"/>, title: "Cuci Satuan", desc: "Pembersihan mendalam untuk item spesifik sesuai label perawatan.", features: ["Per Item", "Garansi Noda"] },
  { icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/>, title: "Karpet & Boneka", desc: "Menghilangkan debu dan tungau dari perlengkapan rumah Anda.", features: ["Anti Bakteri", "Penjemputan Khusus"] },
];

const PRICING = [
  { name: "Express Kilat", amount: "Rp 6.000", unit: "/kg", features: ["Cucian Selesai 6 Jam", "Lipat & Setrika Uap", "Pewangi Signature"], featured: false },
  { name: "Standard Fresh", amount: "Rp 4.000", unit: "/kg", features: ["Cucian Selesai 24 Jam", "Pemisahan Warna & Bahan", "Kemasan Ramah Lingkungan"], featured: true },
  { name: "Dry Clean Elite", amount: "Rp 10.000", unit: "/item", features: ["Penanganan Khusus Jas/Gaun", "Hanger & Plastik Pelindung", "Pembersihan Noda Membandel"], featured: false },
];

const TESTIMONIALS = [
  { stars: "★★★★★", text: '"Layanan yang luar biasa! Pakaian saya selalu wangi dan rapi. Penjemputan tepat waktu, sangat membantu bagi saya yang sibuk bekerja."', init: "AP", name: "Andini Putri", role: "Ibu Rumah Tangga", bg: "#deedf7", col: "#3a7fa8" },
  { stars: "★★★★★", text: '"Akhirnya menemukan laundry premium yang benar-benar menjaga kualitas kain. Dry cleaning jas saya hasilnya seperti baru lagi. Sangat direkomendasikan!"', init: "BP", name: "Budi Pratama", role: "Eksekutif Muda", bg: "#e8f3fb", col: "#4a8fba" },
  { stars: "★★★★★", text: '"Harga sangat worth it untuk kualitas yang diberikan. Kemasan ramah lingkungannya juga jadi nilai plus tersendiri!"', init: "RN", name: "Rina Novita", role: "Pengusaha", bg: "#eef6fb", col: "#2a6f9a" },
  { stars: "★★★★★", text: '"Saya dan keluarga sudah 2 tahun berlangganan. Tidak pernah kecewa. Tim mereka sangat profesional dan ramah."', init: "DH", name: "Dimas Hartono", role: "Arsitek", bg: "#d6e8f5", col: "#1b5f8c" },
];

/* ── FadeUp Hook ── */
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Subcomponents ── */
function Navbar({ active }) {
  return (
    <nav className="ll-nav">
      <div className="ll-logo">MyLaundry</div>
      <div className="ll-nav-links">
        {["Services","Pricing","Process","Locations"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className={active === l.toLowerCase() ? "active" : ""}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="ll-hero" id="services">
      <div className="ll-hero-left">
        <span className="ll-badge">Premium Garment Care</span>
        <h1 className="ll-hero-title">Cucian Bersih,<br/>Hidup Lebih Mudah</h1>
        <p className="ll-hero-desc">Layanan laundry dan dry cleaning premium antar-jemput. Kami merawat pakaian Anda seperti milik sendiri dengan standar hotel bintang lima.</p>
        <div className="ll-hero-btns">
          <button className="btn-dark">Pesan Sekarang </button>
        </div>
      </div>
      <div className="ll-hero-right">
        <svg width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="190" width="200" height="28" rx="4" fill="white" opacity="0.9"/>
          <rect x="70" y="163" width="180" height="28" rx="4" fill="white" opacity="0.85"/>
          <rect x="80" y="136" width="160" height="28" rx="4" fill="#e8f3fb" opacity="0.9"/>
          <rect x="75" y="109" width="170" height="28" rx="4" fill="white" opacity="0.85"/>
          <rect x="85" y="82" width="150" height="28" rx="4" fill="#deedf7" opacity="0.9"/>
          <rect x="90" y="56" width="140" height="28" rx="4" fill="white" opacity="0.8"/>
          <rect x="60" y="215" width="200" height="6" rx="3" fill="#a0b8c8" opacity="0.2"/>
          <rect x="70" y="188" width="180" height="5" rx="2.5" fill="#a0b8c8" opacity="0.15"/>
        </svg>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useFadeUp();
  return (
    <section className="ll-section ll-section-center fade-up" ref={ref} id="process">
      <p className="ll-eyebrow">Bagaimana Kami Bekerja</p>
      <h2 className="ll-title">Tiga Langkah Mudah</h2>
      <p className="ll-sub" style={{ margin: "0 auto" }}>Tiga langkah mudah untuk mendapatkan pakaian yang bersih dan rapi tanpa harus keluar rumah.</p>
      <div className="ll-steps">
        {[
          { icon: <CalendarIcon />, name: "Pesan Penjemputan", desc: "Jadwalkan penjemputan lewat aplikasi atau web sesuai waktu luang Anda." },
          { icon: <WashIcon />, name: "Kami Cuci & Rawat", desc: "Pembersihan profesional dengan deterjen ramah lingkungan oleh ahli kami." },
          { icon: <BoxIcon />, name: "Antar Kembali", desc: "Pakaian bersih dan rapi diantar kembali ke pintu Anda dalam waktu 24 jam." },
        ].map((s, i) => (
          <div className="ll-step" key={i}>
            <div className="ll-step-icon">{s.icon}</div>
            <div className="ll-step-name">{s.name}</div>
            <div className="ll-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const ref = useFadeUp();
  return (
    <section className="ll-section ll-services-bg fade-up" ref={ref}>
      <div className="ll-services-header">
        <div>
          <p className="ll-eyebrow">Layanan Kami</p>
          <h2 className="ll-title">Berbagai Pilihan Perawatan</h2>
          <p className="ll-sub">Berbagai pilihan perawatan garmen untuk memenuhi segala kebutuhan wardrobe Anda.</p>
        </div>
        <a href="#" className="ll-see-all">Lihat Semua Layanan →</a>
      </div>
      <div className="ll-svc-grid">
        {SERVICES.map((s, i) => (
          <div className="ll-svc-card" key={i}>
            <div className="ll-svc-icon">{s.icon}</div>
            <div className="ll-svc-title">{s.title}</div>
            <div className="ll-svc-desc">{s.desc}</div>
            <ul className="ll-svc-features">{s.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const ref = useFadeUp();
  return (
    <section className="ll-section ll-section-center fade-up" ref={ref} id="pricing">
      <p className="ll-eyebrow">Paket Populer</p>
      <h2 className="ll-title">Harga Transparan</h2>
      <p className="ll-sub" style={{ margin: "0 auto 3rem" }}>Harga transparan untuk kemudahan perencanaan keuangan rumah tangga Anda.</p>
      <div className="ll-price-grid">
        {PRICING.map((p, i) => (
          <div className={`ll-price-card${p.featured ? " featured" : ""}`} key={i}>
            {p.featured && <span className="ll-popular-badge">Paling Populer</span>}
            <p className="ll-price-name">{p.name}</p>
            <div className="ll-price-amount">{p.amount}</div>
            <p className="ll-price-unit">{p.unit}</p>
            <ul className="ll-price-features">{p.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
            <button className="btn-price">Pilih Paket</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useFadeUp();
  const [idx, setIdx] = useState(0);
  const shown = [TESTIMONIALS[idx % TESTIMONIALS.length], TESTIMONIALS[(idx + 1) % TESTIMONIALS.length]];
  return (
    <section className="ll-section ll-testi-bg fade-up" ref={ref} id="locations">
      <div className="ll-testi-layout">
        <div>
          <p className="ll-eyebrow">Apa Kata Mereka?</p>
          <h2 className="ll-testi-title">Kepercayaan pelanggan adalah prioritas utama kami.</h2>
          <p className="ll-testi-sub">Berikut adalah pengalaman mereka menggunakan Lather &amp; Line.</p>
          <div className="ll-testi-nav">
            <button className="ll-testi-btn" onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>←</button>
            <button className="ll-testi-btn" onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)}>→</button>
          </div>
        </div>
        <div className="ll-testi-cards">
          {shown.map((t, i) => (
            <div className="ll-testi-card" key={i}>
              <div className="ll-testi-stars">{t.stars}</div>
              <p className="ll-testi-text">{t.text}</p>
              <div className="ll-testi-author">
                <div className="ll-avatar" style={{ background: t.bg, color: t.col }}>{t.init}</div>
                <div>
                  <div className="ll-testi-name">{t.name}</div>
                  <div className="ll-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ll-footer">
      <div>
        <div className="ll-footer-logo">Lather &amp; Line</div>
        <div className="ll-footer-copy">© 2024 Lather &amp; Line Garment Care<br/>Professional Wardrobe Maintenance.</div>
      </div>
      <div className="ll-footer-links">
        {["Help Center","Privacy Policy","Terms of Service","Service Areas","Careers"].map(l => <a key={l} href="#">{l}</a>)}
      </div>
      <div className="ll-footer-icons">
        <div className="ll-footer-icon">🌐</div>
        <div className="ll-footer-icon">✉</div>
      </div>
    </footer>
  );
}

/* ── Main Export ── */
export default function LatherAndLine() {
  const [activeNav, setActiveNav] = useState("services");

  useEffect(() => {
    const sections = ["services","pricing","process","locations"];
    const onScroll = () => {
      let current = "services";
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      });
      setActiveNav(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <Navbar active={activeNav} />
      <Hero />
      <HowItWorks />
      <Services />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}