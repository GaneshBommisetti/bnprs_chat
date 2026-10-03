import { CalendarDays, Hash, History, Laptop, MessageSquareText, Video } from 'lucide-react'

import type { NavItem } from '../types'

type IconSidebarProps = {
  items: NavItem[]
  selectedId: string
  onSelect: (id: string) => void
}

export function IconSidebar({ items, selectedId, onSelect }: IconSidebarProps) {
  const iconMap = {
    'remote-work': Laptop,
    chats: MessageSquareText,
    channels: Hash,
    meetings: Video,
    history: History,
    calendar: CalendarDays,
  }

  return (
    <aside className="flex w-[76px] shrink-0 flex-col overflow-y-auto border-r border-[#e5e7eb] bg-white py-2">
      {items.map((item) => {
        const Icon = iconMap[item.id as keyof typeof iconMap] ?? MessageSquareText
        const isActive = selectedId === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              'group flex min-h-[68px] w-full min-w-0 flex-col items-center justify-center gap-1 border-l-2 px-1 text-[8px] font-medium transition-colors',
              isActive ? 'border-[#F2992F] bg-[#fff7ed] text-[#F2992F]' : 'border-transparent text-[#5f6773] hover:bg-[#fff7ed] hover:text-[#F2992F]',
            ].join(' ')}
          >
            <span className={['relative flex h-8 w-10 items-center justify-center rounded-lg transition-colors', isActive ? 'bg-[#fff1df] text-[#F2992F]' : 'group-hover:bg-[#fff1df]'].join(' ')}>
              <Icon size={18} />
              {item.id === 'chats' ? <span aria-label="1 unread chat" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e5394f] px-1 text-[10px] font-semibold text-white">1</span> : null}
            </span>
            <span className={item.id === 'remote-work' ? 'w-full whitespace-normal text-center leading-[11px]' : 'whitespace-nowrap leading-none'}>
              {item.id === 'remote-work' ? <>Remote<br />Work</> : `${item.label.charAt(0)}${item.label.slice(1).toLowerCase()}`}
            </span>
          </button>
        )
      })}
    </aside>
  )
}
