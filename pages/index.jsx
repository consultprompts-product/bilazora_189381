import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) return;
    const els = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --site-bg: #0B1D15;
          --site-surface: #132A20;
          --site-border: #2A4D3E;
          --site-heading: #F3E5AB;
          --site-body: #D1E0D7;
          --brand-primary: #886F1D;
          --brand-secondary: #C5A059;
          --color-bg: #0B1D15;
          --color-border: #2A4D3E;
        }
        .gold-rule { background: linear-gradient(90deg, transparent, var(--brand-secondary), transparent); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; }
        .fade-up.visible { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.2) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1 !important; animation: none !important; }
        }
        .bento-card {
          background-color: var(--site-surface);
          border: 1px solid var(--site-border);
          transition: border-color 0.3s ease;
        }
        .bento-card:hover { border-color: var(--brand-secondary); }
        .testimonial-pull { font-family: 'Playfair Display', Georgia, serif; font-style: italic; }
      `}</style>

      {/* NAVIGATION */}
      <nav
        id="site-nav"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4"
        style={scrolled
          ? { backgroundColor: 'var(--color-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }
          : { backgroundColor: 'transparent', backdropFilter: 'none', borderBottom: 'none' }
        }
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img
              id="site-logo"
              src="/assets/logo.png"
              alt="logo.png"
              className="h-12 w-auto object-contain"
              onLoad={(e) => { e.target.style.display = 'block'; }}
              onError={(e) => { e.target.style.display = 'none'; document.getElementById('logo-fallback-text').style.display = 'inline'; }}
              style={{ display: 'none' }}
            />
            <span id="logo-fallback-text" className="text-2xl font-bold tracking-tight text-[var(--site-heading)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>BilaZora</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors duration-200">Services</a>
            <a href="#menu-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors duration-200">Menu</a>
            <a href="#gallery-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors duration-200">Gallery</a>
            <a href="#reviews-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors duration-200">Reviews</a>
            <a href="#location-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors duration-200">Location</a>
            <a href="#contact" className="ml-4 px-6 py-2.5 text-sm font-semibold text-[var(--site-heading)] bg-[var(--brand-primary)] transition-all duration-300 hover:opacity-90">Reserve Table</a>
          </div>
          <button
            className="md:hidden text-[var(--site-heading)] p-2"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[var(--site-border)]">
            <div className="flex flex-col gap-4 pt-4">
              <a href="#services-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors">Services</a>
              <a href="#menu-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors">Menu</a>
              <a href="#gallery-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors">Gallery</a>
              <a href="#reviews-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors">Reviews</a>
              <a href="#location-section" className="text-sm tracking-wide text-[var(--site-heading)] hover:text-[var(--brand-secondary)] transition-colors">Location</a>
              <a href="#contact" className="mt-2 px-6 py-3 text-sm font-semibold text-[var(--site-heading)] bg-[var(--brand-primary)] text-center">Reserve Table</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: '72px' }}>
        <section className="relative bg-[var(--site-bg)] px-6 py-24 sm:py-32 text-center">
          <img id="hero-bg-image" alt="" style={{ display: 'none' }} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          <div id="hero-bg-overlay" style={{ display: 'none', backgroundColor: 'color-mix(in srgb, #0B1D15 85%, transparent)' }} className="absolute inset-0"></div>
          <div className="relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Precision Cooking Meets High Luxury</span>
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
              </div>
              <h1 className="font-serif text-5xl sm:text-7xl leading-[1.05] mb-6 text-[var(--site-heading)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Elevating <span className="text-[var(--brand-secondary)] italic">Haute Cuisine</span> in North Macedonia Every Night
              </h1>
              <p className="text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl text-[var(--site-body)]">
                Discover masterfully curated dishes paired with exceptional vintages in an atmosphere of prestige.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="#contact" className="rounded-none text-[var(--site-heading)] px-8 py-4 text-sm font-semibold bg-[var(--brand-primary)] transition-all duration-300 hover:opacity-90">Reserve Your Experience</a>
                <a href="#gallery-section" className="rounded-none px-8 py-4 text-sm font-semibold border border-[var(--site-border)] text-[var(--site-heading)] transition-all duration-300 hover:border-[var(--brand-secondary)]">View Gallery</a>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a id="social-hero-1" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
                <a id="social-hero-2" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
                <a id="social-hero-3" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
              </div>
              <div className="mt-14 w-full max-w-xs mx-auto h-px gold-rule opacity-40"></div>
              <div className="flex flex-wrap items-center justify-center gap-10 mt-10">
                <div>
                  <p className="font-serif text-3xl sm:text-4xl text-[var(--site-heading)] leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>200+</p>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--site-body)] mt-1.5">Reserve Vintages</p>
                </div>
                <div className="w-px h-10 bg-[var(--site-border)] hidden sm:block"></div>
                <div>
                  <p className="font-serif text-3xl sm:text-4xl text-[var(--site-heading)] leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Awarded</p>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--site-body)] mt-1.5">Head Chef</p>
                </div>
                <div className="w-px h-10 bg-[var(--site-border)] hidden sm:block"></div>
                <div>
                  <p className="font-serif text-3xl sm:text-4xl text-[var(--site-heading)] leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Exquisite</p>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--site-body)] mt-1.5">Atmosphere</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SERVICES SECTION */}
      <div id="services-section" style={{ display: 'none' }}>
        <div className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">What We Offer</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--site-heading)] leading-tight max-w-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our <em className="text-[var(--brand-secondary)]">Services</em>
              </h2>
              <div className="mt-4 h-px w-16 bg-[var(--brand-primary)] opacity-60"></div>
            </div>
            <div id="services-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div id="service-card-template" style={{ display: 'none' }} className="bento-card p-8 flex flex-col gap-4">
                <div data-field="image-wrap" style={{ display: 'none' }} className="relative rounded-none overflow-hidden aspect-[4/3]">
                  <img data-field="image" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ display: 'none' }} />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-secondary)] block mb-3">Featured</span>
                  <h3 data-field="title" className="font-serif text-xl text-[var(--site-heading)] mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Signature Facial</h3>
                  <p data-field="description" className="text-[var(--site-body)] text-sm leading-relaxed mb-4">A one-sentence example description of this exceptional service.</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-[var(--site-border)] pt-4">
                  <p data-field="price" className="text-[var(--brand-secondary)] font-serif text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>From $85</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-secondary)] uppercase tracking-wider">
                    Enquire
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU SECTION */}
      <div id="menu-section" style={{ display: 'none' }}>
        <div className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Chef's Selection</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--site-heading)] leading-tight max-w-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our <em className="text-[var(--brand-secondary)]">Menu</em>
              </h2>
              <div className="mt-4 h-px w-16 bg-[var(--brand-primary)] opacity-60"></div>
            </div>
            <div id="menu-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div id="menu-card-template" style={{ display: 'none' }} className="bento-card flex flex-col overflow-hidden">
                <div data-field="image-wrap" style={{ display: 'none' }} className="relative overflow-hidden aspect-[4/3]">
                  <img data-field="image" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ display: 'none' }} />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-secondary)]">À La Carte</span>
                  </div>
                  <h3 data-field="title" className="font-serif text-xl text-[var(--site-heading)] mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Margherita Pizza</h3>
                  <p data-field="description" className="text-[var(--site-body)] text-sm leading-relaxed mb-4 flex-1">A one-sentence example description of this exquisite dish.</p>
                  <div className="flex items-center justify-between border-t border-[var(--site-border)] pt-4 mt-auto">
                    <p data-field="price" className="text-[var(--brand-secondary)] font-serif text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>$16</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-[var(--brand-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE CUISINE — existing mockup content */}
      <section id="cuisine" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 fade-up">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Chef's Selection</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--site-heading)] leading-tight max-w-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Signature Dishes &amp; <em className="text-[var(--brand-secondary)]">Tasting Menus</em>
            </h2>
            <div className="mt-4 h-px w-16 bg-[var(--brand-primary)] opacity-60"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large feature card */}
            <div className="md:col-span-2 bento-card p-8 lg:p-12 fade-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[var(--brand-secondary)] text-xs uppercase tracking-[0.2em]">Chef's Tasting</span>
                <span className="w-8 h-px bg-[var(--site-border)]"></span>
                <span className="text-[var(--site-body)] text-xs">7 Courses</span>
              </div>
              <h3 className="font-serif text-3xl lg:text-4xl text-[var(--site-heading)] mb-4 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                The <em className="text-[var(--brand-secondary)]">Grand Degustation</em> Experience
              </h3>
              <p className="text-[var(--site-body)] leading-relaxed text-base mb-8 max-w-md">A seven-course journey through the finest seasonal produce, each plate composed with surgical precision by our award-winning head chef. Wine pairings curated by our in-house sommelier.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 text-[11px] uppercase tracking-wider border border-[var(--site-border)] text-[var(--site-body)]">Seasonal</span>
                <span className="px-3 py-1 text-[11px] uppercase tracking-wider border border-[var(--site-border)] text-[var(--site-body)]">Wine Pairing</span>
                <span className="px-3 py-1 text-[11px] uppercase tracking-wider border border-[var(--site-border)] text-[var(--site-body)]">Sommelier-Led</span>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-secondary)] hover:text-[var(--site-heading)] transition-colors duration-300">
                Reserve This Menu
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            {/* Stacked smaller cards */}
            <div className="flex flex-col gap-4">
              <div className="bento-card p-7 flex-1 fade-up" style={{ animationDelay: '0.12s' }}>
                <div className="w-8 h-8 border border-[var(--brand-primary)] flex items-center justify-center mb-5">
                  <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.927 19.073l.707-.707M18.364 5.636l.707-.707" /></svg>
                </div>
                <h3 className="font-serif text-xl text-[var(--site-heading)] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Seasonal Terroir Menu</h3>
                <p className="text-[var(--site-body)] text-sm leading-relaxed">Five thoughtfully composed courses drawing from local Macedonian heritage with French technique.</p>
              </div>
              <div className="bento-card p-7 flex-1 fade-up" style={{ animationDelay: '0.18s' }}>
                <div className="w-8 h-8 border border-[var(--brand-primary)] flex items-center justify-center mb-5">
                  <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <h3 className="font-serif text-xl text-[var(--site-heading)] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Signature Lamb Royale</h3>
                <p className="text-[var(--site-body)] text-sm leading-relaxed">Slow-braised rack with truffle jus, pomme purée, and a roasted marrow accompaniment.</p>
              </div>
            </div>
            {/* Second row: three equal cards */}
            <div className="bento-card p-7 fade-up" style={{ animationDelay: '0.22s' }}>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-secondary)] block mb-4">À La Carte</span>
              <h3 className="font-serif text-xl text-[var(--site-heading)] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Black Truffle Risotto</h3>
              <p className="text-[var(--site-body)] text-sm leading-relaxed">Carnaroli rice finished with Périgord black truffle, aged Parmigiano, and white wine foam.</p>
            </div>
            <div className="bento-card p-7 fade-up" style={{ animationDelay: '0.28s' }}>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-secondary)] block mb-4">Signature</span>
              <h3 className="font-serif text-xl text-[var(--site-heading)] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Adriatic Sea Bass</h3>
              <p className="text-[var(--site-body)] text-sm leading-relaxed">Pan-seared fillet with saffron beurre blanc, fennel confit, and micro-herb salad.</p>
            </div>
            <div className="bento-card p-7 fade-up" style={{ animationDelay: '0.34s' }}>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-secondary)] block mb-4">Dessert</span>
              <h3 className="font-serif text-xl text-[var(--site-heading)] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Valrhona Chocolate Sphere</h3>
              <p className="text-[var(--site-body)] text-sm leading-relaxed">Warm caramel poured tableside reveals a dark chocolate mousse with hazelnut praline crumble.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WINE CELLAR & AMBIENCE */}
      <section id="wine" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
            <div className="lg:col-span-5 lg:pr-12 fade-up">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Cellar & Atmosphere</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[var(--site-heading)] leading-tight mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                The Art of <em className="text-[var(--brand-secondary)]">Wine</em> &amp; Setting
              </h2>
              <p className="text-[var(--site-body)] leading-relaxed text-base mb-6">Our private cellar houses over 200 reserve vintages sourced from Burgundy, Napa Valley, and the celebrated Tikveš wine region of North Macedonia. Each bottle is hand-selected by our resident sommelier to complement our seasonal tasting menus.</p>
              <p className="text-[var(--site-body)] leading-relaxed text-base mb-10">Dine beneath candlelit archways in our main salon, retreat to one of four private dining suites for intimate celebrations, or gather in the botanical garden terrace for al-fresco refinement.</p>
              <div className="h-px bg-[var(--site-border)] mb-8"></div>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-[var(--brand-primary)] flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-[var(--site-heading)] text-sm font-semibold mb-1">Sommelier-Led Pairings</p>
                    <p className="text-[var(--site-body)] text-sm leading-relaxed">Bespoke wine journeys crafted to the nuances of each dish and palate.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-[var(--brand-secondary)] flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-[var(--site-heading)] text-sm font-semibold mb-1">Private Dining Suites</p>
                    <p className="text-[var(--site-body)] text-sm leading-relaxed">Four intimate rooms for celebrations, corporate dinners, and milestone occasions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-[var(--brand-primary)] flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-[var(--site-heading)] text-sm font-semibold mb-1">Garden Terrace</p>
                    <p className="text-[var(--site-body)] text-sm leading-relaxed">A botanical sanctuary for twilight dining under the open Macedonian sky.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <div className="w-px h-full min-h-[500px] mx-auto bg-[var(--site-border)] opacity-50"></div>
            </div>
            <div className="lg:col-span-6 lg:pl-8 fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bento-card p-6 sm:mt-12">
                  <div className="text-[var(--brand-secondary)] text-4xl font-serif mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>200+</div>
                  <p className="text-[var(--site-heading)] text-sm font-semibold mb-2">Reserve Vintages</p>
                  <p className="text-[var(--site-body)] text-sm leading-relaxed">Curated cellars spanning Burgundy, Tuscany, and Macedonia's finest estates.</p>
                </div>
                <div className="bento-card p-6">
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-[var(--brand-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>
                  </div>
                  <p className="text-[var(--site-heading)] text-sm font-semibold mb-2">Award-Winning Head Chef</p>
                  <p className="text-[var(--site-body)] text-sm leading-relaxed">Internationally trained, nationally celebrated. A culinary philosophy rooted in exceptional produce.</p>
                </div>
                <div className="bento-card p-6 sm:col-span-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 border border-[var(--brand-secondary)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--brand-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-[var(--site-heading)] text-sm font-semibold mb-2">Exquisite Atmosphere</p>
                      <p className="text-[var(--site-body)] text-sm leading-relaxed">Candlelit salons, hand-carved stone archways, and linen-draped tables set the stage for an evening beyond ordinary. BilaZora is an event in itself.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOURMET EVENTS */}
      <section id="events" className="py-24 lg:py-32 px-6 lg:px-12 bg-[var(--site-surface)] border-t border-[var(--site-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Private Events</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[var(--site-heading)] leading-tight mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Gourmet Events <em className="text-[var(--brand-secondary)]">Crafted</em> for Every Milestone
              </h2>
              <p className="text-[var(--site-body)] leading-relaxed text-base mb-8">From intimate anniversary dinners for two to milestone corporate galas and wedding receptions, BilaZora's dedicated events team orchestrates every detail — from custom tasting menus to floral arrangements and live quartet performances.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-[var(--site-body)] text-sm">
                  <span className="w-1.5 h-1.5 bg-[var(--brand-secondary)] flex-shrink-0"></span>
                  Private dining buyouts for up to 80 guests
                </li>
                <li className="flex items-center gap-3 text-[var(--site-body)] text-sm">
                  <span className="w-1.5 h-1.5 bg-[var(--brand-secondary)] flex-shrink-0"></span>
                  Bespoke menu design with Chef consultation
                </li>
                <li className="flex items-center gap-3 text-[var(--site-body)] text-sm">
                  <span className="w-1.5 h-1.5 bg-[var(--brand-secondary)] flex-shrink-0"></span>
                  Sommelier-curated wine and cocktail program
                </li>
                <li className="flex items-center gap-3 text-[var(--site-body)] text-sm">
                  <span className="w-1.5 h-1.5 bg-[var(--brand-secondary)] flex-shrink-0"></span>
                  Live entertainment, floral décor, and full coordination
                </li>
              </ul>
              <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-[var(--site-heading)] bg-[var(--brand-primary)] hover:opacity-90 transition-opacity duration-300">
                Enquire About Events
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div className="fade-up grid grid-cols-2 gap-4" style={{ animationDelay: '0.15s' }}>
              <div className="bento-card p-7 col-span-2">
                <p className="font-serif text-lg text-[var(--site-heading)] mb-2 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>"Our product launch dinner at BilaZora was unlike any corporate event we've hosted — the team transformed the space into something truly cinematic."</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 bg-[var(--site-border)] flex items-center justify-center text-[var(--brand-secondary)] font-serif font-bold text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>M</div>
                  <div>
                    <p className="text-[var(--site-heading)] text-xs font-semibold">Milena V.</p>
                    <p className="text-[var(--site-body)] text-[11px] uppercase tracking-wide">Corporate Client</p>
                  </div>
                </div>
              </div>
              <div className="bento-card p-6 flex flex-col justify-between">
                <p className="text-[var(--brand-secondary)] font-serif text-3xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>4</p>
                <p className="text-[var(--site-heading)] text-sm font-semibold mb-1">Private Suites</p>
                <p className="text-[var(--site-body)] text-xs leading-relaxed">Intimate rooms for every scale of occasion.</p>
              </div>
              <div className="bento-card p-6 flex flex-col justify-between">
                <p className="text-[var(--brand-secondary)] font-serif text-3xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>80</p>
                <p className="text-[var(--site-heading)] text-sm font-semibold mb-1">Max Capacity</p>
                <p className="text-[var(--site-body)] text-xs leading-relaxed">Full venue buyouts available upon request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <div id="gallery-section" style={{ display: 'none' }}>
        <div className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Inside BilaZora</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--site-heading)] leading-tight max-w-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our <em className="text-[var(--brand-secondary)]">Gallery</em>
              </h2>
              <div className="mt-4 h-px w-16 bg-[var(--brand-primary)] opacity-60"></div>
            </div>
            <div id="gallery-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div
                id="gallery-item-template"
                style={{ display: 'none' }}
                className="relative overflow-hidden aspect-square"
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 12%, var(--site-surface))' }}
                >
                  <svg className="w-10 h-10" style={{ color: 'color-mix(in srgb, var(--brand-secondary) 60%, transparent)' }} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <img
                  data-field="image"
                  alt=""
                  style={{ display: 'none' }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div id="reviews-section" style={{ display: 'none' }}>
        <div className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Guest Voices</span>
                <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[var(--site-heading)] leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What Our <em className="text-[var(--brand-secondary)]">Guests</em> Say
              </h2>
            </div>
            <div id="reviews-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div id="review-card-template" style={{ display: 'none' }} className="bento-card p-8 flex flex-col gap-4">
                <svg className="w-6 h-6 text-[var(--brand-primary)] opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                <p data-field="rating" className="text-[var(--brand-secondary)] text-lg tracking-wider">★★★★★</p>
                <p data-field="text" className="testimonial-pull text-base text-[var(--site-body)] leading-relaxed flex-1">A one-to-two sentence example review from a delighted guest.</p>
                <div className="flex items-center gap-3 border-t border-[var(--site-border)] pt-4 mt-auto">
                  <div className="w-8 h-8 bg-[var(--site-border)] flex items-center justify-center font-serif font-bold text-[var(--brand-secondary)] text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>G</div>
                  <p data-field="author" className="text-[var(--site-heading)] text-xs font-semibold">Jane D.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCATION & HOURS */}
      <section className="py-16 sm:py-24 px-6 lg:px-12 bg-[var(--site-surface)] border-t border-[var(--site-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 fade-up">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-[var(--brand-primary)]"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">Find Us</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[var(--site-heading)] leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Visit Us &amp; <em className="text-[var(--brand-secondary)]">Hours</em>
            </h2>
            <div className="mt-4 h-px w-16 bg-[var(--brand-primary)] opacity-60"></div>
          </div>
          <div id="location-section" data-business-name="BilaZora" style={{ display: 'none' }} className="grid md:grid-cols-2 gap-6">
            <div className="rounded-none overflow-hidden relative" style={{ minHeight: '280px' }}>
              <div id="location-map-placeholder" className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)' }}>
                <svg className="w-8 h-8" style={{ color: 'color-mix(in srgb, var(--brand-primary) 45%, white)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <iframe id="location-map-embed" title="Map" style={{ display: 'none' }} className="absolute inset-0 w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              <a id="location-directions-btn" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-full text-white text-sm font-semibold px-5 py-3 text-center shadow-lg hover:opacity-90 transition-opacity bg-[var(--brand-primary)]">Get Directions →</a>
            </div>
            <div className="rounded-none p-8 flex flex-col" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 6%, var(--site-surface))' }}>
              <div className="space-y-4 mb-6">
                <div id="location-address-row" style={{ display: 'none' }} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--brand-primary)]">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <a id="location-address" href="#" target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline hover:no-underline text-[var(--site-heading)]"></a>
                </div>
                <div id="location-phone-row" style={{ display: 'none' }} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--brand-primary)]">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a id="location-phone" href="#" className="text-sm text-[var(--site-body)]"></a>
                </div>
                <div id="location-email-row" style={{ display: 'none' }} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--brand-primary)]">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a id="location-email" href="#" className="text-sm text-[var(--site-body)]"></a>
                </div>
              </div>
              <ul className="space-y-2.5 mt-auto pt-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--brand-primary) 15%, transparent)' }}>
                <li id="location-hours-monday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Monday</span>
                  <span id="location-hours-monday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-tuesday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Tuesday</span>
                  <span id="location-hours-tuesday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-wednesday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Wednesday</span>
                  <span id="location-hours-wednesday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-thursday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Thursday</span>
                  <span id="location-hours-thursday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-friday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Friday</span>
                  <span id="location-hours-friday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-saturday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Saturday</span>
                  <span id="location-hours-saturday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
                <li id="location-hours-sunday" style={{ display: 'none' }} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--site-heading)]">Sunday</span>
                  <span id="location-hours-sunday-value" className="opacity-70 text-[var(--site-body)]"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="contact" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[var(--site-border)]">
        <div className="max-w-4xl mx-auto text-center fade-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-16 h-px bg-[var(--site-border)]"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-body)]">The Experience Awaits</span>
            <span className="w-16 h-px bg-[var(--site-border)]"></span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[var(--site-heading)] leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Reserve Your <em className="text-[var(--brand-secondary)]">Evening</em> at BilaZora
          </h2>
          <p className="text-[var(--site-body)] text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            Every night at BilaZora is a singular occasion. Secure your table now and let our team curate an unforgettable culinary journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a href="tel:+38932123456" className="px-10 py-4 text-sm font-semibold text-[var(--site-heading)] bg-[var(--brand-primary)] hover:opacity-90 transition-opacity duration-300">
              Call to Reserve
            </a>
            <a href="mailto:reservations@bilazora.mk" className="px-10 py-4 text-sm font-semibold border border-[var(--site-border)] text-[var(--site-heading)] hover:border-[var(--brand-secondary)] transition-colors duration-300">
              Email Enquiry
            </a>
          </div>
          <div className="h-px gold-rule opacity-30 mb-10"></div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[var(--site-body)] text-sm">
            <svg className="w-4 h-4 text-[var(--brand-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>ул. Маршал Тито бр.100, Ж 2220 Sveti Nikole, North Macedonia</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--site-surface)] border-t border-[var(--site-border)] px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Left */}
            <div className="md:col-span-1">
              <p className="font-serif text-2xl text-[var(--site-heading)] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>BilaZora</p>
              <p className="text-[var(--site-body)] text-sm mb-4">Haute cuisine in the heart of Sveti Nikole.</p>
              <p className="text-[var(--site-body)] text-xs leading-relaxed mb-4">ул. Маршал Тито бр.100<br />Ж 2220 Sveti Nikole, North Macedonia</p>
              <p className="text-[var(--site-body)] text-xs mb-3">© 2025 BilaZora. All rights reserved.</p>
              <div className="flex items-center gap-2 mb-1">
                <a id="social-footer-1" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
                <a id="social-footer-2" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
                <a id="social-footer-3" href="#" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }} className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80" aria-label="Social link"></a>
              </div>
              <a href="https://consultprompts.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs opacity-40 hover:opacity-70 transition-opacity mt-3">Powered by ConsultPrompts</a>
            </div>
            {/* Center */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-secondary)] mb-5">Quick Links</p>
              <ul className="space-y-3">
                <li><a href="#services-section" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Services</a></li>
                <li><a href="#menu-section" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Menu</a></li>
                <li><a href="#gallery-section" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Gallery</a></li>
                <li><a href="#reviews-section" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Reviews</a></li>
                <li><a href="#location-section" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Location</a></li>
                <li><a href="#contact" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors">Reservations</a></li>
              </ul>
            </div>
            {/* Right */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-secondary)] mb-5">Reserve</p>
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[var(--site-heading)] bg-[var(--brand-primary)] hover:opacity-90 transition-opacity duration-300 mb-3">
                Book Now →
              </a>
              <p className="text-[var(--site-body)] text-xs mt-3">Reservations strongly recommended. Private suites available.</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-secondary)] mt-6 mb-3">Contact</p>
              <a href="tel:+38932123456" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors block mb-2">+389 32 123 456</a>
              <a href="mailto:reservations@bilazora.mk" className="text-[var(--site-body)] text-sm hover:text-[var(--site-heading)] transition-colors break-all">reservations@bilazora.mk</a>
            </div>
          </div>
          <div className="h-px bg-[var(--site-border)] mb-6"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[var(--site-body)] text-xs">© 2025 BilaZora. All rights reserved.</p>
            <p className="text-[var(--site-body)] text-xs">Sveti Nikole, North Macedonia</p>
          </div>
        </div>
      </footer>
    </>
  );
}