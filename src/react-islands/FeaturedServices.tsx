import { useState } from "react"

const features = [
  {
    id: "emergency",
    label: "Emergency & Trauma",
    badge: "24 / 7",
    badgeClass: "bg-accent/10 text-accent border border-accent/20",
    headline: "We're ready before you arrive.",
    body: "Our Emergency & Trauma Unit runs around the clock with a dedicated team of physicians, nurses, and support staff. Whether it's a road accident, a sudden cardiac event, or any acute crisis — walk in at any hour and be seen immediately. No referral. No waiting for an appointment.",
    points: [
      "Immediate triage on arrival",
      "Trauma resuscitation bay",
      "24-hour on-call specialist cover",
      "Direct admission pathway to wards",
    ],
    cta: "Get Emergency Care",
    ctaHref: "/services/emergency",
    accentColor: "#860f0f",
    bgAccent: "bg-accent",
    stat: { val: "< 5 min", label: "Average triage time" },
  },
  {
    id: "maternity",
    label: "Maternity & Newborn",
    badge: "Full Pathway",
    badgeClass: "bg-primary/10 text-primary border border-primary/20",
    headline: "Every birth is a milestone we honour.",
    body: "From your first antenatal visit through labour, delivery, and postnatal recovery — our maternity unit provides a continuous, woman-centred care experience. Our newborn unit handles both healthy infants and those requiring special care in a warm, safe environment.",
    points: [
      "Antenatal clinics & birth planning",
      "Skilled birth attendants on every shift",
      "Postnatal mother & baby support",
      "Newborn special care unit",
    ],
    cta: "Book Antenatal Visit",
    ctaHref: "/services/maternity",
    accentColor: "#1565c0",
    bgAccent: "bg-primary",
    stat: { val: "MCH", label: "Serving mothers since" },
  },
  {
    id: "ccc",
    label: "Comprehensive Care Centre",
    badge: "Confidential",
    badgeClass: "bg-secondary/10 text-secondary border border-secondary/20",
    headline: "Care without judgement. Always.",
    body: "Our Comprehensive Care Centre (CCC) provides integrated, confidential HIV/AIDS services — from voluntary testing and counselling to antiretroviral treatment and long-term management. Every patient is treated with complete dignity and discretion by a trained, compassionate team.",
    points: [
      "Voluntary Counselling & Testing (VCT)",
      "Antiretroviral therapy (ART) management",
      "Nutritional support & adherence counselling",
      "Community linkage & follow-up",
    ],
    cta: "Visit the CCC",
    ctaHref: "/services/ccc",
    accentColor: "#125276",
    bgAccent: "bg-secondary",
    stat: { val: "100%", label: "Confidential & dignified" },
  },
]

export default function FeaturedServices() {
  const [active, setActive] = useState(0)
  const f = features[active]

  return (
    <section id="featured" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3">
              Spotlight
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-secondary font-normal leading-tight">
              Featured Services
            </h2>
          </div>
          
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 mb-1 border-b border-border">
          {features.map((feat, i) => (
            <button
              key={feat.id}
              onClick={() => setActive(i)}
              className={`
                relative px-2 py-4 text-sm font-semibold tracking-wide transition-all duration-200
                ${active === i
                  ? "text-primary"
                  : "text-muted hover:text-secondary"
                }
              `}
            >
              {feat.label}
              {active === i && (
                <span
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                  style={{ background: feat.accentColor }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          key={f.id}
          className="grid lg:grid-cols-5 gap-0 border border-border/60 mt-0"
          style={{ animation: "fadeIn 0.35s ease" }}
        >

          {/* Left: main content — spans 3 cols */}
          <div className="lg:col-span-3 p-4 md:p-8 lg:p-14 bg-white flex flex-col justify-between">

            <div>
              <span className={`inline-block text-[0.62rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 mb-6 ${f.badgeClass}`}>
                {f.badge}
              </span>
              <h3 className="font-display text-3xl lg:text-4xl text-secondary font-normal leading-snug mb-5">
                {f.headline}
              </h3>
              <p className="text-muted leading-relaxed text-[0.95rem] mb-8 max-w-xl">
                {f.body}
              </p>

              {/* Points */}
              <ul className="space-y-3 mb-10">
                {f.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <svg
                      className="size-4 shrink-0 mt-0.5"
                      style={{ color: f.accentColor }}
                      fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-sm text-slate-700">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={f.ctaHref}
              className="inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-white px-7 py-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 self-start"
              style={{ background: f.accentColor }}
            >
              {f.cta}
              <svg className="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>

          </div>

          {/* Right: accent panel — spans 2 cols */}
          <div
            className={`lg:col-span-2 flex flex-col justify-between p-10 lg:p-12 ${f.bgAccent}`}
          >

            {/* Stat */}
            <div>
              <p className="text-white/50 text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-1">
                At a glance
              </p>
              <div className="font-display text-white text-5xl font-bold leading-none mb-2">
                {f.stat.val}
              </div>
              <div className="text-white/70 text-sm">{f.stat.label}</div>
            </div>


            {/* Tab dots */}
            <div className="flex gap-2 mt-auto">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === i ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
