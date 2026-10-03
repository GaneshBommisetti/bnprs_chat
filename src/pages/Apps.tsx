import { ArrowUpRight, Fingerprint, Globe2, ShieldCheck, Smartphone } from 'lucide-react'

const companyApps = [
  {
    name: 'AandhiPe',
    platform: 'Google Play',
    description: 'BNPRS payment app',
    href: 'https://play.google.com/store/apps/details?id=ai.bnprs.aandhipe',
    icon: Fingerprint,
    iconClass: 'bg-[#fff0dc] text-[#a85b08]',
  },
  {
    name: 'bRuID',
    platform: 'Google Play',
    description: 'BNPRS app',
    href: 'https://play.google.com/store/search?q=bRuID&c=apps',
    icon: Smartphone,
    iconClass: 'bg-[#e8edff] text-[#4259a8]',
  },
]

const companyWebsites = [
  {
    name: 'BNPRS Payments',
    domain: 'bnprs.in',
    description: 'Biometric payment and card issuance technology.',
    href: 'https://bnprs.in/',
    icon: Fingerprint,
    iconClass: 'bg-[#fff0dc] text-[#a85b08]',
  },
  {
    name: 'BNPRS AI',
    domain: 'bnprs.ai',
    description: 'Explore BNPRS AI and its digital solutions.',
    href: 'https://bnprs.ai/index.html',
    icon: ShieldCheck,
    iconClass: 'bg-[#e8edff] text-[#4259a8]',
  },
  {
    name: 'BNPRS',
    domain: 'bnprs.com',
    description: 'Visit the BNPRS company website.',
    href: 'https://www.bnprs.com/',
    icon: Globe2,
    iconClass: 'bg-[#e4f1eb] text-[#347451]',
  },
]

export default function AppsPage() {
  return (
    <main className="min-h-full bg-[#f4f6fa] px-5 py-8 text-[#101B3D] sm:px-9 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#737d8e]">BNPRS WORKSPACE</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-['Manrope'] text-[28px] font-bold">BNPRS</h1>
            <p className="mt-1 text-[13px] text-[#707971]">Biometric identity, authentication, and secure payment technology.</p>
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dce5f2] bg-white shadow-[0_10px_28px_rgba(16,27,61,0.05)]" aria-labelledby="mission-title">
          <div
            className="flex flex-col gap-3 bg-[#101b3d] px-6 py-5 text-white sm:flex-row sm:items-center sm:gap-5 sm:px-8 sm:py-6"
            style={{ backgroundImage: 'linear-gradient(110deg, #101b3d 0%, #172950 58%, #23406a 100%)' }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffc36f]">Our mission</p>
              <h2 id="mission-title" className="mt-1 font-['Manrope'] text-[22px] font-extrabold leading-snug tracking-tight sm:text-[28px]">
                Towards a Zero-Fraud Payment Ecosystem
              </h2>
            </div>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="company-apps-title">
          <div className="mb-3">
            <h2 id="company-apps-title" className="text-[15px] font-bold">Our apps</h2>
            <p className="mt-1 text-[12px] text-[#707971]">Available on Google Play.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {companyApps.map((app) => {
              const AppIcon = app.icon
              return (
                <a
                  key={app.name}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[88px] items-center gap-4 rounded-xl border border-[#e2e7ef] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(16,27,61,0.03)] transition hover:border-[#cbd5e4] hover:shadow-[0_8px_20px_rgba(16,27,61,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2992f]"
                >
                  <span className={['grid h-12 w-12 shrink-0 place-items-center rounded-xl', app.iconClass].join(' ')}>
                    <AppIcon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-[#101B3D]">{app.name}</span>
                    <span className="mt-1 block text-[12px] text-[#707971]">{app.description}</span>
                    <span className="mt-1 block text-[10px] font-semibold text-[#52627d]">{app.platform}</span>
                  </span>
                  <ArrowUpRight size={17} className="shrink-0 text-[#8a938b] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#a85b08]" />
                </a>
              )
            })}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="company-websites-title">
          <div className="mb-4">
            <h2 id="company-websites-title" className="text-[15px] font-bold">Our websites</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companyWebsites.map((website) => {
              const WebsiteIcon = website.icon
              return (
                <a
                  key={website.href}
                  href={website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[150px] flex-col rounded-xl border border-[#e2e7ef] bg-white p-4 shadow-[0_4px_14px_rgba(16,27,61,0.03)] transition hover:border-[#cbd5e4] hover:shadow-[0_8px_20px_rgba(16,27,61,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2992f]"
                >
                  <span className="flex items-start justify-between">
                    <span className={['grid h-12 w-12 place-items-center rounded-xl', website.iconClass].join(' ')}>
                      <WebsiteIcon size={23} />
                    </span>
                    <ArrowUpRight size={18} className="text-[#8a938b] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#a85b08]" />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-[#101B3D]">{website.name}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-[#52627d]">{website.domain}</span>
                  <span className="mt-2 block text-[12px] leading-5 text-[#707971]">{website.description}</span>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
