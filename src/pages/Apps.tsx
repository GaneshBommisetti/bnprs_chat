import { useState } from 'react'
import { ArrowUpRight, Fingerprint, Layers3 } from 'lucide-react'

const workspaceApps = [
  {
    id: 'aandhipe',
    name: 'AandhiPe',
    category: 'Product workspace',
    description: 'AandhiPe is available in your BNPRS workspace.',
    icon: Layers3,
    iconClass: 'bg-[#fff0dc] text-[#a85b08]',
  },
  {
    id: 'bruid',
    name: 'bRuID',
    category: 'BNPRS application',
    description: 'bRuID is available in your BNPRS workspace.',
    icon: Fingerprint,
    iconClass: 'bg-[#e4edf0] text-[#315c6b]',
  },
]

export default function AppsPage() {
  const [selectedAppId, setSelectedAppId] = useState(workspaceApps[0].id)
  const selectedApp = workspaceApps.find((app) => app.id === selectedAppId) ?? workspaceApps[0]
  const SelectedIcon = selectedApp.icon

  return (
    <main className="min-h-full bg-[#f4f5f1] px-5 py-8 text-[#101B3D] sm:px-9 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#818981]">BNPRS WORKSPACE</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-['Manrope'] text-[28px] font-bold">Apps</h1>
            <p className="mt-1 text-[13px] text-[#707971]">Your connected BNPRS applications.</p>
          </div>
          <span className="text-[11px] font-semibold text-[#727a74]">{workspaceApps.length} available</span>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
          <section aria-labelledby="available-apps-title">
            <h2 id="available-apps-title" className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#818981]">Available to you</h2>
            <div className="divide-y divide-[#e1e5df] border-y border-[#e1e5df]">
              {workspaceApps.map((app) => {
                const AppIcon = app.icon
                const isSelected = selectedAppId === app.id
                return (
                  <button
                    key={app.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedAppId(app.id)}
                    className={['flex w-full items-center gap-4 px-3 py-4 text-left transition-colors sm:px-4', isSelected ? 'bg-white' : 'hover:bg-white/60'].join(' ')}
                  >
                    <span className={['grid h-12 w-12 shrink-0 place-items-center rounded-lg', app.iconClass].join(' ')}><AppIcon size={22} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold">{app.name}</span>
                      <span className="mt-1 block text-[11px] text-[#707971]">{app.category}</span>
                    </span>
                    <span className="hidden items-center gap-1 text-[10px] font-semibold text-[#55745f] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#4d9b66]" />Available</span>
                    <ArrowUpRight size={16} className="shrink-0 text-[#8a938b]" />
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="border-t border-[#dfe3dc] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0" aria-live="polite">
            <div className={['grid h-12 w-12 place-items-center rounded-lg', selectedApp.iconClass].join(' ')}><SelectedIcon size={22} /></div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#818981]">Connected app</p>
            <h2 className="mt-1 text-[21px] font-bold">{selectedApp.name}</h2>
            <p className="mt-2 max-w-sm text-[12px] leading-5 text-[#707971]">{selectedApp.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 border-t border-[#dfe3dc] pt-4 text-[11px] font-semibold text-[#55745f]">
              <span className="h-2 w-2 rounded-full bg-[#4d9b66]" />Available to this workspace
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
