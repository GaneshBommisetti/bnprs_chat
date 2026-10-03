import type { NotificationItem } from '../types'

type NotificationMenuProps = {
  items: NotificationItem[]
}

export function NotificationMenu({ items }: NotificationMenuProps) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[320px] rounded-xl border border-[#dfe4ef] bg-white p-2 shadow-xl shadow-[#dfe7f5]/70">
      <div className="mb-2 px-2 pb-2 text-[12px] font-semibold uppercase tracking-wide text-[#58657d]">
        Notifications
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button key={item.id} type="button" className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#f5f8ff]">
            <span className={['mt-1 h-2 w-2 rounded-full', item.unread ? 'bg-[#F2992F]' : 'bg-transparent'].join(' ')} />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] text-[#101B3D]">{item.text}</span>
              <span className="mt-1 block text-[10px] text-[#64748b]">{item.time}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
