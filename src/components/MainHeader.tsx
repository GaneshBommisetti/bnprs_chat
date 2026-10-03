import { CalendarDays, ChevronDown, Video } from 'lucide-react'

type MainHeaderProps = {
  memberCount: number
}

export function MainHeader({ memberCount }: MainHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#e5eaf3] bg-[#ffffff] px-5 py-4 text-[#101B3D]">
      <div className="flex items-center gap-2 text-[#101B3D]">
        <span className="text-[18px] font-semibold">BNPRS</span>
        <span className="text-[12px] text-[#6b7280]">({memberCount})</span>
        <ChevronDown size={14} className="text-[#A7ABB5]" />
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="flex items-center gap-2 rounded-md border border-[#F2992F] bg-[#F2992F] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#e58b21]">
          <Video size={14} />
          <span>Meet Now</span>
          <ChevronDown size={12} className="text-[#A7ABB5]" />
        </button>
        <button type="button" className="flex items-center gap-2 rounded-md border border-[#F2992F] bg-white px-3 py-2 text-[12px] font-medium text-[#a85b08] hover:bg-[#fff7ed]">
          <CalendarDays size={14} />
          <span>Schedule Meeting</span>
        </button>
      </div>
    </div>
  )
}
