import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Hash, LockKeyhole, MessageCircle, Paperclip, Send, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { conversationChannels } from '../data/channels'
import { inboxItems } from '../data/inbox'

type ChannelMessage = {
  id: string
  sender: string
  text: string
  time: string
  attachment?: string
}

function currentTime() {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

export default function ChannelsPage() {
  const [selectedChannelId, setSelectedChannelId] = useState(conversationChannels[0].id)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [sentMessages, setSentMessages] = useState<Record<string, ChannelMessage[]>>({})
  const selectedChannel = conversationChannels.find((channel) => channel.id === selectedChannelId) ?? conversationChannels[0]
  const channelInboxItems = useMemo(
    () => inboxItems.filter((item) => item.channel === selectedChannelId),
    [selectedChannelId],
  )
  const visibleChannels = conversationChannels.filter((channel) => channel.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setSentMessages((current) => ({
      ...current,
      [selectedChannelId]: [
        ...(current[selectedChannelId] ?? []),
        { id: crypto.randomUUID(), sender: 'You', text, time: currentTime() },
      ],
    }))
    setDraft('')
  }

  return (
    <main className="h-full min-h-0 overflow-hidden bg-white text-[#101b3d]">
      <div className="h-full w-full">
        <div className="grid h-full min-h-0 grid-cols-[minmax(235px,0.8fr)_minmax(0,1.5fr)] overflow-hidden border-y border-[#e0e6ef] bg-white lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.5fr)]">
          <aside className="flex min-h-0 flex-col border-r border-[#e7ebf1] bg-[#fbfcfe]">
            <div className="border-b border-[#e7ebf1] px-4 py-4">
              <div className="flex items-center gap-2">
                <UsersRound size={16} className="text-[#f2992f]" />
                <h2 className="text-[14px] font-bold">Team channels</h2>
              </div>
              <label className="mt-3 flex items-center gap-2 rounded-lg border border-[#e4e8ef] bg-white px-3 py-2 text-[#8a93a1] focus-within:border-[#f2992f]">
                <MessageCircle size={14} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find a channel"
                  aria-label="Find a channel"
                  className="w-full border-0 bg-transparent text-[12px] text-[#25324e] outline-none placeholder:text-[#9aa3b2]"
                />
              </label>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {visibleChannels.map((channel) => {
                const selected = selectedChannelId === channel.id
                const unread = channel.unread ?? 0
                return (
                  <button
                    type="button"
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    aria-pressed={selected}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selected ? 'bg-[#fff5e9] ring-1 ring-[#f6d4a5]' : 'hover:bg-[#f2f5fa]'}`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${selected ? 'bg-[#f2992f] text-white' : 'bg-[#eef2f7] text-[#68758c]'}`}>
                      {channel.private ? <LockKeyhole size={16} /> : <Hash size={17} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-[#25324e]">{channel.name}</span>
                      <span className="mt-1 block text-[10px] text-[#8791a0]">{channel.private ? 'Private channel' : 'Team channel'}</span>
                    </span>
                    {unread ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#f2992f] px-1 text-[9px] font-bold text-white">{unread}</span> : null}
                  </button>
                )
              })}
              {visibleChannels.length === 0 ? <p className="px-3 py-8 text-center text-[12px] text-[#8791a0]">No channels found.</p> : null}
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-[#e7ebf1] px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff1df] text-[#f2992f]"><Hash size={19} /></span>
                <div className="min-w-0">
                  <h2 className="truncate text-[14px] font-bold text-[#172541]">{selectedChannel.name}</h2>
                  <p className="mt-1 text-[10px] text-[#7a8494]">{selectedChannel.private ? 'Private channel' : 'BNPRS team channel'}</p>
                </div>
              </div>
              <Link
                to={`/chat?channel=${encodeURIComponent(selectedChannel.id)}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e7ebf1] px-3 py-2 text-[10px] font-semibold text-[#52627d] transition hover:border-[#f2992f] hover:text-[#a85b08]"
              >
                Open chat <ArrowUpRight size={13} />
              </Link>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[#fbfcfe] px-4 py-5 sm:px-6">
              <p className="mx-auto rounded-full bg-white px-3 py-1 text-[10px] text-[#8791a0] shadow-sm">Recent channel updates</p>
              {channelInboxItems.map((item) => (
                <article key={item.id} className="flex max-w-[min(92%,620px)] gap-3 self-start">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[10px] font-bold tone-${item.tone}`}>{item.initials}</span>
                  <div className="min-w-0 rounded-2xl rounded-tl-md border border-[#e7ebf1] bg-white px-4 py-3 shadow-[0_2px_6px_rgba(16,27,61,0.025)]">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <strong className="text-[11px] text-[#25324e]">{item.sender}</strong>
                      <time className="text-[9px] text-[#9aa3b2]">{item.time}</time>
                    </div>
                    <p className="mt-2 text-[12px] leading-5 text-[#526078]">{item.body}</p>
                    {item.attachment ? (
                      <span className="mt-3 flex items-center gap-2 rounded-lg border border-[#edf0f4] bg-[#fafbfc] px-3 py-2 text-[10px] text-[#52627d]">
                        <Paperclip size={13} className="text-[#f2992f]" />{item.attachment}
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
              {(sentMessages[selectedChannelId] ?? []).map((message) => (
                <article key={message.id} className="max-w-[min(92%,620px)] self-end rounded-2xl rounded-tr-md bg-[#fff1df] px-4 py-3">
                  <div className="flex items-center gap-2"><strong className="text-[11px] text-[#89520f]">{message.sender}</strong><time className="text-[9px] text-[#a67842]">{message.time}</time></div>
                  <p className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-[#634c31]">{message.text}</p>
                </article>
              ))}
              {channelInboxItems.length === 0 && !(sentMessages[selectedChannelId]?.length) ? (
                <div className="m-auto max-w-sm py-8 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1df] text-[#f2992f]"><Hash size={22} /></span>
                  <p className="mt-3 text-[13px] font-semibold text-[#526078]">You&apos;re viewing {selectedChannel.name}</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#8791a0]">Start the conversation with your team.</p>
                </div>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-[#e7ebf1] bg-white p-3 sm:p-4">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Message ${selectedChannel.name}`}
                aria-label={`Message ${selectedChannel.name}`}
                className="min-w-0 flex-1 rounded-xl border border-[#e2e7ef] bg-[#fbfcfe] px-4 py-3 text-[12px] text-[#25324e] outline-none placeholder:text-[#9aa3b2] focus:border-[#f2992f]"
              />
              <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f2992f] text-white transition hover:bg-[#e5891d] disabled:cursor-not-allowed disabled:opacity-45">
                <Send size={16} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
