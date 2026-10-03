import type { UserStatus } from '../types'
import { Building2, CalendarOff, Circle, CircleSlash, House, Moon, UserRoundCheck } from 'lucide-react'

type StatusMenuProps = {
  statuses: UserStatus[]
  selectedStatus: string
  onSelect: (status: string) => void
}

export function StatusMenu({ statuses, selectedStatus, onSelect }: StatusMenuProps) {
  const iconMap = {
    available: UserRoundCheck,
    away: Circle,
    'do-not-disturb': CircleSlash,
    offline: Circle,
    'working-remotely': House,
    'in-office': Building2,
    'on-leave': CalendarOff,
  }
  const colorMap: Record<string, string> = {
    available: 'text-emerald-600',
    away: 'text-amber-500',
    'do-not-disturb': 'text-rose-600',
    offline: 'text-slate-400',
    'working-remotely': 'text-sky-600',
    'in-office': 'text-indigo-600',
    'on-leave': 'text-violet-600',
  }

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[260px] rounded-xl border border-[#dfe4ef] bg-white p-2 shadow-xl shadow-[#dfe7f5]/70 sm:right-auto sm:left-0">
      {statuses.map((status) => (
        <button
          key={status.id}
          type="button"
          onClick={() => onSelect(status.label)}
          aria-pressed={selectedStatus === status.label}
          className={[
            'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
            selectedStatus === status.label ? 'bg-[#fff4e8]' : 'hover:bg-[#f5f8ff]',
          ].join(' ')}
        >
          {(() => {
            const Icon = iconMap[status.id as keyof typeof iconMap] ?? Moon
            return <Icon size={15} className={colorMap[status.id] ?? 'text-slate-500'} aria-hidden="true" />
          })()}
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-medium text-[#101B3D]">{status.label}</span>
            <span className="mt-0.5 block text-[10px] text-[#64748b]">{status.description}</span>
          </span>
          {selectedStatus === status.label ? <span className="h-1.5 w-1.5 rounded-full bg-[#f2992f]" /> : null}
        </button>
      ))}
    </div>
  )
}
