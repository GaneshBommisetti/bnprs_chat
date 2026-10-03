import { Camera, ChevronDown } from 'lucide-react'

import { StatusMenu } from './StatusMenu'

import type { UserStatus } from '../types'

type StatusBarProps = {
  statusOptions: UserStatus[]
  selectedStatus: string
  onStatusSelect: (status: string) => void
  statusMenuOpen: boolean
  onStatusMenuToggle: () => void
}

export function StatusBar({ statusOptions, selectedStatus, onStatusSelect, statusMenuOpen, onStatusMenuToggle }: StatusBarProps) {
  return (
    <div className="relative flex items-center justify-between gap-4 border-b border-[#dfe4ef] bg-[#ffffff] px-5 py-3 text-[#101B3D]">
      <div className="flex items-center gap-2 text-[12px] text-[#A7ABB5]">
        <span>Live video feed:</span>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-[#dfe4ef] bg-[#f5f7fb] text-[#F2992F] hover:border-[#F2992F]">
          <Camera size={14} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <span className="text-[12px] text-[#A7ABB5]">Status:</span>
        <div className="relative">
          <button
            type="button"
            onClick={onStatusMenuToggle}
            className="flex items-center gap-2 rounded-md border border-[#dfe4ef] bg-[#f5f7fb] px-3 py-1.5 text-[12px] text-[#101B3D] hover:border-[#F2992F]"
          >
            <span>{selectedStatus}</span>
            <ChevronDown size={12} className="text-[#A7ABB5]" />
          </button>
          {statusMenuOpen ? <StatusMenu statuses={statusOptions} selectedStatus={selectedStatus} onSelect={onStatusSelect} /> : null}
        </div>
      </div>

      <button type="button" className="rounded-md border border-[#EF5350] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#EF5350] hover:bg-[#EF5350]/10">
        Check Out
      </button>
    </div>
  )
}
