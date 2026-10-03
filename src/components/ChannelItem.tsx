import { Hash, Lock } from 'lucide-react'

import type { Channel } from '../types'

type ChannelItemProps = {
  item: Channel
  active?: boolean
  onClick?: () => void
}

export function ChannelItem({ item, active = false, onClick }: ChannelItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      //added comment 
      className={[
        'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors',
        active ? 'bg-[#fff1df] text-[#a85b08]' : 'text-[#374151] hover:bg-[#fff7ed] hover:text-[#F2992F]',
      ].join(' ')}
    >
      <span className="flex items-center gap-2 truncate">
        {item.private ? <Lock size={12} className="text-[#6b7280]" /> : <Hash size={12} className="text-[#6b7280]" />}
        <span className="truncate text-[11px] font-medium">{item.name}</span>
      </span>
      {item.unread ? (
        <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#F2992F] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {item.unread}
        </span>
      ) : null}
    </button>
  )
}
