import { MessageSquareText, Phone } from 'lucide-react'

import type { Employee } from '../types'

type EmployeeRowProps = {
  employee: Employee
  selected?: boolean
  onMessage?: (employee: Employee) => void
}

export function EmployeeRow({ employee, selected = false, onMessage }: EmployeeRowProps) {
  const statusColor = employee.status === 'online' ? 'bg-[#20C77A]' : employee.status === 'away' ? 'bg-[#A7ABB5]' : 'bg-[#EF5350]'

  return (
    <div
      className={[
        'group flex items-center justify-between gap-3 border-b border-[#edf1f7] px-3 py-2.5 transition-colors',
        selected ? 'bg-[#fff7ef]' : 'hover:bg-[#fffaf3]',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8edf8] text-[11px] font-semibold text-[#101B3D]">
            {employee.initials}
          </div>
          <span className={['absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white', statusColor].join(' ')} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#101B3D]">{employee.name}</p>
          <p className="truncate text-[11px] text-[#64748b]">{employee.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button type="button" className="rounded-md border border-[#dfe4ef] bg-[#f5f7fb] p-1.5 text-[#101B3D] hover:border-[#F2992F] hover:text-[#F2992F]" aria-label={`Call ${employee.name}`}>
          <Phone size={12} />
        </button>
        <button type="button" onClick={() => onMessage?.(employee)} className="rounded-md border border-[#dfe4ef] bg-[#f5f7fb] p-1.5 text-[#101B3D] hover:border-[#F2992F] hover:text-[#F2992F]" aria-label={`Message ${employee.name}`}>
          <MessageSquareText size={12} />
        </button>
      </div>
    </div>
  )
}
