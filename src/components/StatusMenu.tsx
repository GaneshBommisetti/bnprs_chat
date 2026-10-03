import type { UserStatus } from '../types'

type StatusMenuProps = {
  statuses: UserStatus[]
  selectedStatus: string
  onSelect: (status: string) => void
}

export function StatusMenu({ statuses, selectedStatus, onSelect }: StatusMenuProps) {
  return (
    <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[240px] rounded-xl border border-[#dfe4ef] bg-white p-2 shadow-xl shadow-[#dfe7f5]/70">
      {statuses.map((status) => (
        <button
          key={status.id}
          type="button"
          onClick={() => onSelect(status.label)}
          className={[
            'flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors',
            selectedStatus === status.label ? 'bg-[#fff4e8]' : 'hover:bg-[#f5f8ff]',
          ].join(' ')}
        >
          <span className="text-[12px] font-medium text-[#101B3D]">{status.label}</span>
          <span className="text-[10px] text-[#64748b]">{status.description}</span>
        </button>
      ))}
    </div>
  )
}
