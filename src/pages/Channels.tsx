import { ArrowRight, Hash, LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { conversationChannels } from '../data/channels'

export default function ChannelsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-white text-[#111827]">
      <header className="border-b border-[#e5e7eb] px-6 py-4">
        <h1 className="text-[17px] font-semibold">Channels</h1>
        <p className="mt-1 text-[12px] text-[#6b7280]">{conversationChannels.length} team channels</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-3">
        <div className="max-w-3xl divide-y divide-[#e5e7eb]">
          {conversationChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              onClick={() => navigate(`/chat?channel=${encodeURIComponent(channel.id)}`)}
              aria-label={`Open ${channel.name}`}
              className="flex w-full items-center gap-3 py-3 text-left hover:bg-[#fff7ed] hover:text-[#F2992F]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f3f4f6] text-[#4b5563]">
                {channel.private ? <LockKeyhole size={15} /> : <Hash size={16} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-[#111827]">{channel.name}</span>
                <span className="mt-0.5 block text-[11px] text-[#6b7280]">{channel.private ? 'Private channel' : 'Team channel'}</span>
              </span>
              {channel.unread ? <span className="rounded-full bg-[#fff1df] px-2 py-0.5 text-[10px] font-semibold text-[#a85b08]">{channel.unread} unread</span> : null}
              <ArrowRight size={15} className="shrink-0 text-[#9ca3af]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}