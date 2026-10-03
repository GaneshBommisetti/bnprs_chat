import { Search, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ChannelItem } from './ChannelItem'

import { channelThread, conversationChannels, pinnedChannels } from '../data/channels'

type ConversationSidebarProps = {
  collapsed: boolean
}

export function ConversationSidebar({ collapsed }: ConversationSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedChannelId = new URLSearchParams(location.search).get('channel') ?? 'bnprs-announcements'

  return (
    <aside className={['flex h-full shrink-0 flex-col overflow-hidden border-r border-[#e5e7eb] bg-[#fafafa] transition-all duration-200', collapsed ? 'w-0 opacity-0' : 'w-[300px] opacity-100'].join(' ')}>
      <div className="overflow-y-auto bg-[#fafafa]">
        <div className="border-b border-[#e5e7eb] px-3 py-3">
          <h2 className="text-[12px] font-semibold text-[#374151]">Company channels</h2>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-2 py-2 text-[#4b5563] shadow-sm">
            <Search size={12} />
            <input placeholder="Search" className="w-full bg-transparent text-[12px] text-[#111827] placeholder:text-[#6b7280] focus:outline-none" />
          </div>
        </div>

        <div className="px-3 pb-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A7ABB5]">MY PINS</span>
          </div>
          <div className="space-y-1">
            {pinnedChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => navigate(`/chat?channel=${encodeURIComponent(channel.id)}`)}
                aria-label={`Open chat with ${channel.name}`}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-[#fff7ed] hover:text-[#F2992F]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb] text-[10px] font-semibold text-[#111827]">
                  {channel.name.split(' ').slice(0, 2).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'NA'}
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-[#1f2937]">{channel.name}</span>
                  {channel.unread ? <span className="rounded-full bg-[#F2992F] px-1.5 py-0.5 text-[9px] text-white">{channel.unread}</span> : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 pb-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f6773]">CONVERSATIONS</span>
          </div>
          <div className="space-y-1">
            {conversationChannels.map((channel) => (
              <ChannelItem
                key={channel.id}
                item={channel}
                active={channel.id === selectedChannelId}
                onClick={() => navigate(`/chat?channel=${encodeURIComponent(channel.id)}`)}
              />
            ))}
            <button type="button" className="mt-2 text-[11px] font-medium text-[#F2992F] hover:text-[#F2992F]">
              Show more
            </button>
          </div>
        </div>

        <div className="px-3 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f6773]">THREADS</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-2 py-2 text-[12px] text-[#111827] shadow-sm">
            <Sparkles size={12} className="text-[#F2992F]" />
            <span>{channelThread.title}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
