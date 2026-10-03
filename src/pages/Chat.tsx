import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Bell, MoreVertical, Paperclip, Phone, PhoneOff, Search, Send, Smile, UserRound, UsersRound, Video, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { conversationChannels, pinnedChannels } from '../data/channels'
import { atWorkEmployees, awayEmployees } from '../data/employees'
import { inboxItems } from '../data/inbox'

type ChatMessage = {
  id: string
  sender: string
  text: string
  time: string
  mine?: boolean
  image?: string
  imageName?: string
}

const messagesByChannel: Record<string, ChatMessage[]> = {
  'bnprs-announcements': [
    {
      id: '1',
      sender: 'BNPRS Team',
      text: 'Good morning everyone! Please share your sprint updates before 10:30 AM.',
      time: '09:20 AM',
    },
    {
      id: '2',
      sender: 'Amit',
      text: 'Updated the dashboard and the mobile QA checklist is ready for review.',
      time: '09:24 AM',
      mine: true,
    },
    {
      id: '3',
      sender: 'Priya',
      text: 'Design files are uploaded in the shared drive. I’ve also added the final specs.',
      time: '09:31 AM',
    },
    {
      id: '4',
      sender: 'Amit',
      text: 'Thanks! I’ll sync the implementation and testing notes before lunch.',
      time: '09:35 AM',
      mine: true,
    },
  ],
  'bpr1010-ui-ux': [
    { id: '5', sender: 'Surya', text: 'Need final approval on the onboarding workflow screens.', time: '08:58 AM' },
    { id: '6', sender: 'You', text: 'Perfect. I’ll review the spacing and accessibility details today.', time: '09:03 AM', mine: true },
  ],
  ramaiah: [
    { id: '7', sender: 'Ramaiah N', text: 'Could you confirm the customer feedback summary?', time: 'Yesterday' },
    { id: '8', sender: 'You', text: 'Yes, I have sent the notes to the project team.', time: 'Yesterday', mine: true },
  ],
  krishna: [
    { id: '9', sender: 'Krishna', text: 'We can align the handoff for the QA signoff this afternoon.', time: 'Mon' },
  ],
}

export default function ChatPage({ channelsOnly = false }: { channelsOnly?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedContactId = searchParams.get('contact')
  const requestedContactName = searchParams.get('name')
  const requestedChatId = searchParams.get('channel')
  const requestedCall = searchParams.get('call')
  const directContact = useMemo(() => (
    [...atWorkEmployees, ...awayEmployees].find((employee) => employee.id === requestedContactId) ?? (
      requestedContactId && requestedContactName
        ? {
          id: requestedContactId,
          name: requestedContactName,
          email: '',
          status: 'offline' as const,
          initials: requestedContactName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
        }
        : undefined
    )
  ), [requestedContactId, requestedContactName])
  const contactChatId = directContact ? `employee-${directContact.id}` : null
  const allChats = useMemo(() => [
    ...(channelsOnly ? [] : pinnedChannels),
    ...conversationChannels,
    ...(!channelsOnly && directContact ? [{ id: `employee-${directContact.id}`, name: directContact.name }] : []),
  ], [channelsOnly, directContact])
  const initialChatId = channelsOnly
    ? (allChats.some((item) => item.id === requestedChatId) ? requestedChatId as string : conversationChannels[0].id)
    : contactChatId ?? (allChats.some((item) => item.id === requestedChatId) ? requestedChatId as string : 'bnprs-announcements')
  const [selectedId, setSelectedId] = useState(initialChatId)
  const [mobileConversationOpen, setMobileConversationOpen] = useState(true)
  const [chatFilter, setChatFilter] = useState<'All' | 'Unread' | 'Mentions'>('All')
  const [openChatIds, setOpenChatIds] = useState([initialChatId])
  const [chatMessages, setChatMessages] = useState(messagesByChannel)
  const [draft, setDraft] = useState('')
  const [chatSearch, setChatSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null)
  const [callStartedAt, setCallStartedAt] = useState<number | null>(null)
  const [callNow, setCallNow] = useState(() => Date.now())
  const attachmentInput = useRef<HTMLInputElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const autoCallKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!moreMenuOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !moreMenuRef.current?.contains(event.target)) setMoreMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [moreMenuOpen])

  useEffect(() => {
    const requestedId = contactChatId ?? requestedChatId
    if (!requestedId || !allChats.some((item) => item.id === requestedId)) return

    setSelectedId(requestedId)
    setOpenChatIds((current) => current.includes(requestedId) ? current : [...current, requestedId])
  }, [allChats, contactChatId, requestedChatId])

  useEffect(() => {
    if (!activeCall) return

    const intervalId = window.setInterval(() => setCallNow(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [activeCall])

  const selectedItem = allChats.find((item) => item.id === selectedId) ?? allChats[0]
  const messages = chatMessages[selectedId] ?? [
    { id: 'default', sender: 'Team', text: 'New conversation started. Share updates here.', time: 'Just now' },
  ]
  const getUnreadCount = (item: { id: string; unread?: number }) => Math.max(item.unread ?? 0, inboxItems.find((inboxItem) => inboxItem.channel === item.id)?.unread ?? 0)
  const hasMention = (chatId: string) => inboxItems.some((inboxItem) => inboxItem.channel === chatId && inboxItem.mention)
  const unreadChatCount = allChats.filter((item) => getUnreadCount(item) > 0).length
  const mentionChatCount = allChats.filter((item) => hasMention(item.id)).length
  const visibleChats = allChats.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(chatSearch.trim().toLowerCase())
    const matchesFilter = chatFilter === 'All' ||
      (chatFilter === 'Unread' && getUnreadCount(item) > 0) ||
      (chatFilter === 'Mentions' && hasMention(item.id))
    return matchesSearch && matchesFilter
  })
  const openChats = openChatIds
    .map((id) => allChats.find((item) => item.id === id))
    .filter((item) => item !== undefined)

  const openChat = (id: string) => {
    setOpenChatIds((current) => current.includes(id) ? current : [...current, id])
    setSelectedId(id)
    setMobileConversationOpen(true)
  }

  const startCall = (type: 'audio' | 'video') => {
    const startedAt = Date.now()
    setCallStartedAt(startedAt)
    setCallNow(startedAt)
    setActiveCall(type)
  }

  useEffect(() => {
    if (!requestedCall || !directContact) {
      autoCallKeyRef.current = null
      return
    }
    const callKey = `${directContact.id}:${requestedCall}`
    if (requestedCall !== 'audio' || autoCallKeyRef.current === callKey) return

    autoCallKeyRef.current = callKey
    startCall('audio')
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.delete('call')
    setSearchParams(nextSearchParams, { replace: true })
  }, [directContact, requestedCall, searchParams, setSearchParams])

  const endCall = () => {
    setActiveCall(null)
    setCallStartedAt(null)
  }

  const callSeconds = callStartedAt === null ? 0 : Math.max(0, Math.floor((callNow - callStartedAt) / 1000))
  const callDuration = `${String(Math.floor(callSeconds / 60)).padStart(2, '0')}:${String(callSeconds % 60).padStart(2, '0')}`

  const closeChat = (id: string) => {
    const remaining = openChatIds.filter((openId) => openId !== id)
    if (remaining.length === 0) return

    setOpenChatIds(remaining)
    if (selectedId === id) setSelectedId(remaining[remaining.length - 1])
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return

    const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date())
    setChatMessages((current) => ({
      ...current,
      [selectedId]: [...(current[selectedId] ?? messagesByChannel[selectedId] ?? []), {
        id: `${Date.now()}`,
        sender: 'You',
        text,
        time,
        mine: true,
      }],
    }))
    setDraft('')
    setNotice('Message sent')
  }

  const sendImage = (imageFile: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setNotice('Could not send image')
        return
      }

      const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date())
      const imageMessage: ChatMessage = {
        id: `${Date.now()}`,
        sender: 'You',
        text: '',
        time,
        mine: true,
        image: reader.result,
        imageName: imageFile.name,
      }
      setChatMessages((current) => ({
        ...current,
        [selectedId]: [...(current[selectedId] ?? messagesByChannel[selectedId] ?? []), imageMessage],
      }))
      setNotice(`${imageFile.name} sent`)
    }
    reader.onerror = () => setNotice('Could not send image')
    reader.readAsDataURL(imageFile)
  }

  return (
    <div className="flex h-full bg-[#f5f7fb] text-[#101B3D]">
      <aside className={[
        'w-full shrink-0 flex-col border-r border-[#e5e7eb] bg-[#fafafa] md:flex md:w-[300px]',
        mobileConversationOpen ? 'hidden' : 'flex',
      ].join(' ')}>
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Company chat</p>
            <h2 className="mt-1 text-[16px] font-semibold text-[#111827]">{channelsOnly ? 'Channels' : 'Messages'}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setNotificationsEnabled((enabled) => !enabled)
              setNotice(`Chat notifications ${notificationsEnabled ? 'muted' : 'enabled'}`)
            }}
            aria-label={notificationsEnabled ? 'Mute chat notifications' : 'Enable chat notifications'}
            title={notificationsEnabled ? 'Mute notifications' : 'Enable notifications'}
            className="rounded-md border border-[#e5e7eb] bg-white p-2 text-[#4b5563] hover:text-[#101B3D]"
          >
            <Bell size={14} />
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[#6b7280] shadow-sm">
            <Search size={12} />
            <input
              value={chatSearch}
              onChange={(event) => setChatSearch(event.target.value)}
              placeholder="Search chats"
              className="w-full border-0 bg-transparent text-[12px] text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1" role="tablist" aria-label="Filter conversations">
            {(['All', 'Unread', 'Mentions'] as const).map((filter) => {
              const count = filter === 'Unread' ? unreadChatCount : filter === 'Mentions' ? mentionChatCount : null
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={chatFilter === filter}
                  onClick={() => setChatFilter(filter)}
                  className={['flex min-w-0 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] font-semibold transition-colors', chatFilter === filter ? 'bg-[#101B3D] text-white' : 'text-[#667085] hover:bg-white'].join(' ')}
                >
                  <span>{filter}</span>
                  {count !== null ? <span className={['rounded-full px-1.5 py-0.5 text-[9px]', chatFilter === filter ? 'bg-white/15 text-white' : 'bg-[#edf0f3] text-[#667085]'].join(' ')}>{count}</span> : null}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {visibleChats.length ? visibleChats.map((item) => {
            const isActive = item.id === selectedId
            const isGroupChat = item.name.startsWith('#') || item.id === 'uxui'
            const unreadCount = getUnreadCount(item)
            const ChatIcon = isGroupChat ? UsersRound : UserRound

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openChat(item.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors',
                  isActive ? 'bg-[#f3f4f6] shadow-sm ring-1 ring-[#e5e7eb]' : 'hover:bg-[#f1f5f9]',
                ].join(' ')}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5e7eb] text-[#374151]">
                  <ChatIcon size={17} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium text-[#111827]">{item.name}</span>
                    {unreadCount ? (
                      <span className="rounded-full bg-[#d92d3f] px-1.5 py-0.5 text-[9px] font-semibold text-white">{unreadCount}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-[11px] text-[#6b7280]">
                    {item.id === 'bnprs-announcements' ? 'Sprint review scheduled at 2:30 PM' : 'Updated files and follow-up notes are ready'}
                  </p>
                </div>
              </button>
            )
          }) : <p className="px-3 py-6 text-center text-[12px] text-[#6b7280]">No chats found</p>}
        </div>
      </aside>

      <section className={[
        'min-w-0 flex-1 flex-col bg-[#ffffff]',
        mobileConversationOpen ? 'flex' : 'hidden md:flex',
      ].join(' ')}>
        <div role="tablist" aria-label="Open chats" className="flex min-h-12 items-end gap-1 overflow-x-auto border-t border-[#d1d5db] bg-[#f3f4f6] px-4 pt-1">
          {openChats.map((chat) => (
            <div key={chat.id} className={['group flex max-w-[220px] shrink-0 items-center rounded-t-md border-t-2', selectedId === chat.id ? 'border-[#F2992F] bg-white' : 'border-transparent hover:bg-white/70'].join(' ')}>
              <button
                type="button"
                role="tab"
                aria-selected={selectedId === chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={['truncate px-3 py-2 text-[12px]', selectedId === chat.id ? 'font-semibold text-[#111827]' : 'text-[#4b5563] hover:text-[#111827]'].join(' ')}
              >
                {chat.name}
              </button>
              <button
                type="button"
                onClick={() => closeChat(chat.id)}
                aria-label={`Close ${chat.name}`}
                title={`Close ${chat.name}`}
                disabled={openChatIds.length === 1}
                className="mr-1 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#111827] disabled:opacity-30"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <header className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileConversationOpen(false)}
              aria-label="Back to conversation list"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[#52627d] md:hidden"
            >
              <ArrowLeft size={17} />
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1df] text-[#a85b08]">
              {selectedItem?.name.startsWith('#') || selectedItem?.id === 'uxui'
                ? <UsersRound size={19} aria-hidden="true" />
                : <UserRound size={19} aria-hidden="true" />}
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-[#111827]">{selectedItem?.name}</h3>
              <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#15803d]">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#20C77A]" />
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => startCall('audio')} aria-label="Start audio call" title="Audio call" className="hidden rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-2 text-[#4b5563] hover:text-[#101B3D] sm:inline-flex">
              <Phone size={15} />
            </button>
            <button type="button" onClick={() => startCall('video')} aria-label="Start video call" title="Video call" className="hidden rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-2 text-[#4b5563] hover:text-[#101B3D] sm:inline-flex">
              <Video size={15} />
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button type="button" onClick={() => setMoreMenuOpen((open) => !open)} aria-label="More chat actions" title="More actions" className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-2 text-[#4b5563] hover:text-[#101B3D]">
              <MoreVertical size={15} />
              </button>
              {moreMenuOpen ? (
                <div className="absolute right-0 top-10 z-10 w-44 rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-lg">
                  <button type="button" onClick={() => { setNotice(`${selectedItem?.name} marked unread`); setMoreMenuOpen(false) }} className="w-full rounded-md px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#f3f4f6]">Mark as unread</button>
                  <button type="button" onClick={() => { setNotice('Chat details opened'); setMoreMenuOpen(false) }} className="w-full rounded-md px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#f3f4f6]">Chat details</button>
                  <button type="button" onClick={() => { startCall('audio'); setMoreMenuOpen(false) }} className="w-full rounded-md px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#f3f4f6] sm:hidden">Start audio call</button>
                  <button type="button" onClick={() => { startCall('video'); setMoreMenuOpen(false) }} className="w-full rounded-md px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#f3f4f6] sm:hidden">Start video call</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col bg-[#f9fafb]">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {notice ? <div role="status" className="mx-auto w-fit rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[11px] text-[#4b5563] shadow-sm">{notice}</div> : null}
            {messages.map((message) => (
              <div key={message.id} className={['flex items-end gap-2', message.mine ? 'justify-end' : 'justify-start'].join(' ')}>
                {!message.mine ? (
                  <div className="mb-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280]">
                    <UserRound size={15} aria-hidden="true" />
                  </div>
                ) : null}
                <div className="flex max-w-[86%] flex-col sm:max-w-[72%]">
                  <p className={['mb-1 text-[11px] font-medium text-[#4b5563]', message.mine ? 'text-right' : ''].join(' ')}>{message.sender}</p>
                  <div
                    className={[
                      'rounded-2xl px-4 py-2 text-[12px] leading-6',
                      message.mine ? 'bg-[#111827] text-white' : 'border border-[#e5e7eb] bg-white text-[#111827]',
                    ].join(' ')}
                  >
                    {message.image ? <img src={message.image} alt={message.imageName ?? 'Shared image'} className="mb-2 max-h-72 max-w-full rounded-lg object-contain" /> : null}
                    {message.text}
                  </div>
                  <p className={['mt-1 text-[10px]', message.mine ? 'text-right text-[#6b7280]' : 'text-[#6b7280]'].join(' ')}>{message.time}</p>
                </div>
                {message.mine ? (
                  <div className="mb-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f2d2aa] bg-[#fff1df] text-[#a85b08]">
                    <UserRound size={15} aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-[#e5e7eb] bg-white px-2 py-2 sm:px-4 sm:py-3">
            <form onSubmit={(event) => { event.preventDefault(); sendMessage() }} className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-2 py-2 sm:gap-3 sm:px-3">
              <input ref={attachmentInput} type="file" accept="image/*" className="hidden" onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) sendImage(file)
                event.target.value = ''
              }} />
              <button type="button" onClick={() => attachmentInput.current?.click()} aria-label="Attach a file" title="Attach file" className="text-[#4b5563] hover:text-[#111827]">
                <Paperclip size={15} />
              </button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message..."
                aria-label="Type a message"
                className="w-full border-0 bg-transparent text-[12px] text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
              />
              <button type="button" onClick={() => setDraft((current) => `${current}${current ? ' ' : ''}🙂`)} aria-label="Add emoji" title="Add emoji" className="text-[#4b5563] hover:text-[#111827]">
                <Smile size={15} />
              </button>
              <button type="submit" aria-label="Send message" title="Send message" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F2992F] text-white shadow-sm hover:bg-[#F2992F]">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {activeCall ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/55 p-4">
            <section role="dialog" aria-modal="true" aria-labelledby="active-call-title" className="w-full max-w-sm rounded-lg border border-[#e5e7eb] bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1df] text-[#a85b08]">
                {activeCall === 'video' ? <Video size={24} /> : <UserRound size={24} />}
              </div>
              <h2 id="active-call-title" className="mt-4 text-[16px] font-semibold text-[#111827]">{activeCall === 'video' ? 'Video call' : 'Audio call'}</h2>
              <p className="mt-1 text-[13px] text-[#4b5563]">{selectedItem?.name}</p>
              <p className="mt-3 text-[11px] text-[#6b7280]">Demo call · {callDuration}</p>
              <button type="button" onClick={endCall} aria-label="End call" className="mx-auto mt-6 flex items-center gap-2 rounded-md bg-[#dc3545] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#c82333]">
                <PhoneOff size={15} />
                End call
              </button>
            </section>
          </div>
        ) : null}

      </section>
    </div>
  )
}
