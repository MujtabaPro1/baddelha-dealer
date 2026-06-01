'use client';
import { useLanguage } from '../../contexts/LanguageContext';
import lang from '../../locale';
import { useRouter } from 'next/navigation';



export default function About() {

  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const t: any = lang[languageContent];

  const router = useRouter();



  return (
    <div className="about-page">
    
      <main>
        <section className="about-section">
          <div className="about-container text-center">
            <h1 className="section-title">{t.hero_section.title}</h1>
            <p className="section-subtitle">
              {t.hero_section.subtitle}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={()=>{
                    router.push('https://baddelha.com.sa/contactus');
              }} className="btn-outline">{t.hero_section.ctaOutline}</button>
              <button
              onClick={()=>{
                   router.push('https://baddelha.com.sa/');
              }}
              className="btn-primary">{t.hero_section.ctaPrimary}</button>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <figure className="card overflow-hidden">
              <img
                src={'/about.webp'}
                alt=""
                className="w-full h-full object-cover aspect-[16/10]"
              />
            </figure>
            <div className="card p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-slate-800">{t.story.title}</h2>
              </div>
              <div className="mt-4 space-y-4 text-slate-700 leading-8">
                {t.story.paragraphs.map((p: any, i: any) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6">
                <span className="pill">{t.story.badge}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.values.map((v: any, i: any) => (
              <div key={i} className="value-card">
                <div className="-mt-10 mb-2 flex justify-center">
                  <div className="icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.5L12 17l-5.5 2.7 1-6.5L3 8.9 9 8l3-6z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">{v.title}</h3>
                <p className="mt-2 text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-container grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.stats.map((s:any, i:any) => (
              <div key={i} className="stat-card">
                <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
                <div className="mt-1 text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-container text-center">
            <h2 className="section-title">{t.howItWorksContent.title}</h2>
            <p className="section-subtitle">{t.howItWorksContent.subtitle}</p>
          </div>
          <div className="about-container mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.howItWorksContent.steps.map((step: any, i:any) => (
              <div key={i} className="relative step-card">
                <span className="number-badge">{step.id}</span>
                <div className="flex items-center gap-3">
                  <div className="icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a7 7 0 017 7c0 4.97-7 13-7 13S5 13.97 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">{step.title}</h3>
                </div>
                <p className="mt-3 text-slate-600 leading-7">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>


      </main>

    </div>
  );
}