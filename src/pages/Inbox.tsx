import { useMemo, useState } from 'react'
import { ArrowUpRight, AtSign, Bookmark, FileText, Paperclip, Search, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { inboxCategories, inboxItems, unreadInboxCount } from '../data/inbox'

import './Inbox.css'

export default function InboxPage({ searchQuery }: { searchQuery: string }) {
  const navigate = useNavigate()
  const [category, setCategory] = useState<(typeof inboxCategories)[number]>('All')
  const [selectedId, setSelectedId] = useState(inboxItems[0].id)
  const selected = inboxItems.find((item) => item.id === selectedId) ?? inboxItems[0]
  const visibleItems = useMemo(() => inboxItems.filter((item) => {
    const matchesSearch = `${item.name} ${item.preview} ${item.sender}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === 'All' ||
      (category === 'Unread' && item.unread > 0) ||
      (category === 'Mentions' && item.mention) ||
      (category === 'Important' && item.important) ||
      (category === 'Direct messages' && item.direct)
    return matchesSearch && matchesCategory
  }), [category, searchQuery])

  return (
    <main className="inbox-page">
      <div className="inbox-heading">
        <div><p className="inbox-kicker">YOUR COMMUNICATION</p><h1>Inbox</h1><p>Messages, mentions, and updates in one place.</p></div>
        <div className="inbox-heading-count"><strong>{unreadInboxCount}</strong><span>unread across BNPRS</span></div>
      </div>

      <div className="inbox-toolbar">
        <div className="inbox-filters" role="tablist" aria-label="Inbox categories">
          {inboxCategories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}{item === 'Unread' ? <span>{unreadInboxCount}</span> : null}</button>)}
        </div>
        <div className="inbox-search-indicator"><Search size={14} /><span>{searchQuery || 'Search inbox'}</span></div>
      </div>

      <div className="inbox-layout">
        <section className="inbox-list" aria-label="Inbox messages">
          <div className="inbox-list-heading"><span>RECENT</span><span>{visibleItems.length} items</span></div>
          {visibleItems.map((item) => (
            <button type="button" key={item.id} className={`inbox-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
              <span className={`inbox-avatar ${item.tone}`}>{item.initials}</span>
              <span className="inbox-item-content"><span className="inbox-item-top"><strong>{item.name}</strong><time>{item.time}</time></span><span className="inbox-item-preview">{item.preview}</span><span className="inbox-item-flags">{item.important ? <span className="important-flag"><Bookmark size={11} /> Important</span> : null}{item.mention ? <span className="mention-flag"><AtSign size={11} /> Mention</span> : null}{item.attachment ? <span className="attachment-flag"><Paperclip size={11} /> File</span> : null}</span></span>
              {item.unread > 0 ? <span className="inbox-unread-count">{item.unread}</span> : null}
            </button>
          ))}
          {visibleItems.length === 0 ? <p className="inbox-empty">Nothing in this category right now.</p> : null}
        </section>

        <article className="inbox-reading-pane">
          <div className="reading-topline"><span className="reading-label">MESSAGE PREVIEW</span><button type="button" aria-label="Mark as important"><Bookmark size={16} /></button></div>
          <div className="reading-title"><span className={`inbox-avatar large ${selected.tone}`}>{selected.initials}</span><div><h2>{selected.name}</h2><p>{selected.sender} · {selected.time}</p></div></div>
          <div className="reading-rule" />
          <p className="reading-body">{selected.body}</p>
          {selected.attachment ? <div className="reading-attachment"><span><FileText size={17} /></span><div><strong>{selected.attachment}</strong><small>Shared file · Available to the team</small></div><ArrowUpRight size={15} /></div> : null}
          <div className="reading-context"><span className="context-icon"><ShieldAlert size={15} /></span><p><strong>Shared in {selected.direct ? 'a direct message' : selected.name}</strong><span>Messages here stay connected to their original team space.</span></p></div>
          <div className="reading-actions"><button type="button" className="open-conversation" onClick={() => navigate(`/chat?channel=${selected.channel}`)}>Open conversation <ArrowUpRight size={15} /></button><button type="button" className="reading-more" onClick={() => navigate('/chat')}>Reply in BNPRS Chat</button></div>
        </article>
      </div>
    </main>
  )
}