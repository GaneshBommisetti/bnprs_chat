import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, CalendarDays, ChevronRight, Clock3, ListFilter, MessageCircle, Paperclip, UsersRound, Video } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { RemoteWorkToggle } from '../components/RemoteWorkToggle'
import { StatusMenu } from '../components/StatusMenu'
import { unreadConversationCount, unreadInboxCount } from '../data/inbox'
import { atWorkEmployees, awayEmployees } from '../data/employees'
import type { Meeting, UserStatus } from '../types'

import './Dashboard.css'

type DashboardProps = {
  searchQuery: string
  statusOptions: UserStatus[]
  selectedStatus: string
  onStatusSelect: (value: string) => void
  statusMenuOpen: boolean
  onStatusMenuToggle: () => void
  remoteWorkEnabled: boolean
  onRemoteWorkChange: (enabled: boolean) => void
  remoteWorkStartedAt: number | null
  meetings: Meeting[]
  profileName: string
}

const conversations = [
  { name: 'AandhiPe Team', message: 'Ravi shared the updated rollout timeline for review.', time: '9:42', initials: 'AP', tone: 'apricot', unread: 3, priority: 'Priority', attachment: true, channel: 'bnprs-announcements' },
  { name: 'Payments Team', message: 'Settlement checks are green across all regions.', time: '9:28', initials: 'PY', tone: 'blue', unread: 2, channel: 'ramaiah' },
  { name: 'Design Team', message: 'The new onboarding flow is ready for a final look.', time: '9:16', initials: 'DS', tone: 'lilac', unread: 0, attachment: true, channel: 'bpr1010-ui-ux' },
  { name: 'Development Team', message: 'Merged the release candidate. QA can begin.', time: '8:54', initials: 'DV', tone: 'green', unread: 0, channel: 'krishna' },
  { name: 'Management', message: 'Please add your highlights to the weekly brief.', time: '8:31', initials: 'MG', tone: 'navy', unread: 0, priority: 'Important', channel: 'bnprs-announcements' },
]

export default function Dashboard({
  searchQuery,
  statusOptions,
  selectedStatus,
  onStatusSelect,
  statusMenuOpen,
  onStatusMenuToggle,
  remoteWorkEnabled,
  onRemoteWorkChange,
  remoteWorkStartedAt,
  meetings,
  profileName,
}: DashboardProps) {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const [unreadOnly, setUnreadOnly] = useState(false)
  const firstName = profileName === 'You' ? 'Ganesh' : profileName.split(/\s+/)[0]
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const elapsedSeconds = remoteWorkStartedAt === null ? 0 : Math.max(0, Math.floor((currentTime - remoteWorkStartedAt) / 1000))
  const elapsedTime = [Math.floor(elapsedSeconds / 3600), Math.floor((elapsedSeconds % 3600) / 60), elapsedSeconds % 60]
    .map((value) => String(value).padStart(2, '0')).join(':')
  const filteredConversations = useMemo(() => conversations.filter((conversation) => {
    const matchesSearch = `${conversation.name} ${conversation.message}`.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (!unreadOnly || conversation.unread > 0)
  }), [searchQuery, unreadOnly])

  useEffect(() => {
    if (!remoteWorkEnabled || remoteWorkStartedAt === null) return
    const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [remoteWorkEnabled, remoteWorkStartedAt])

  return (
    <div className="overview-page">
      <main className="overview-shell">
        <section className="overview-welcome">
          <div>
            <p className="overview-eyebrow">BNPRS · COMMUNICATION OVERVIEW <span /> {today}</p>
            <h1>Good morning, {firstName}</h1>
            <p className="overview-subtitle">Here&apos;s what&apos;s happening across BNPRS today.</p>
          </div>
          <div className="welcome-actions">
            <div className="work-presence">
              <RemoteWorkToggle enabled={remoteWorkEnabled} onChange={onRemoteWorkChange} />
              {remoteWorkEnabled ? <span role="timer" aria-label={`Remote work elapsed time ${elapsedTime}`}><Clock3 size={13} /> {elapsedTime}</span> : null}
            </div>
            <div className="overview-status-wrap">
              <button className="overview-status" type="button" onClick={onStatusMenuToggle} aria-expanded={statusMenuOpen}>
                <span className={selectedStatus === 'Available' ? 'presence-dot online' : 'presence-dot away'} />{selectedStatus}<span className="status-caret">⌄</span>
              </button>
              {statusMenuOpen ? <StatusMenu statuses={statusOptions} selectedStatus={selectedStatus} onSelect={onStatusSelect} /> : null}
            </div>
          </div>
        </section>

        <section className="overview-metrics" aria-label="Communication overview">
          <Link to="/inbox" className="metric-block metric-primary"><span className="metric-label">Unread messages</span><strong>{unreadInboxCount}</strong><span className="metric-foot"><MessageCircle size={14} /> across {unreadConversationCount} conversations <ArrowUpRight size={13} /></span></Link>
          <Link to="/organization" className="metric-block"><span className="metric-label">Active team members</span><strong>{atWorkEmployees.length}<small> / {atWorkEmployees.length + awayEmployees.length}</small></strong><span className="metric-foot"><span className="presence-dot online" /> 9 online right now</span></Link>
          <Link to="/meetings" className="metric-block"><span className="metric-label">Today&apos;s meetings</span><strong>{meetings.length.toString().padStart(2, '0')}</strong><span className="metric-foot"><CalendarDays size={14} /> Next up at 10:30 AM</span></Link>
          <Link to="/channels" className="metric-block"><span className="metric-label">Important updates</span><strong>03</strong><span className="metric-foot"><span className="metric-accent-line" /> 1 announcement needs attention</span></Link>
        </section>

        <div className="overview-grid overview-grid-main">
          <section className="overview-section recent-section">
            <div className="section-heading">
              <div><span className="section-kicker">YOUR COMMUNICATION</span><h2>Recent conversations</h2></div>
              <div className="conversation-actions">
                <button className={`filter-button ${unreadOnly ? 'is-active' : ''}`} type="button" aria-pressed={unreadOnly} onClick={() => setUnreadOnly((active) => !active)}>
                  <ListFilter size={14} /> Unread only <span>{conversations.filter((conversation) => conversation.unread > 0).length}</span>
                </button>
                <Link className="text-link" to="/inbox">Open inbox <ArrowUpRight size={14} /></Link>
              </div>
            </div>
            <div className="conversation-list">
              {filteredConversations.map((conversation) => (
                <button key={conversation.name} type="button" className="conversation-row" onClick={() => navigate(`/chat?channel=${conversation.channel}`)}>
                  <span className={`conversation-avatar tone-${conversation.tone}`}>{conversation.initials}</span>
                  <span className="conversation-copy"><span className="conversation-topline"><strong>{conversation.name}</strong><time>{conversation.time}</time></span><span className="conversation-preview">{conversation.message}</span></span>
                  <span className="conversation-meta">{conversation.attachment ? <Paperclip size={14} aria-label="Attachment" /> : null}{conversation.priority ? <span className="priority-mark">{conversation.priority}</span> : null}{conversation.unread ? <span className="unread-count">{conversation.unread}</span> : null}</span>
                </button>
              ))}
              {filteredConversations.length === 0 ? <p className="empty-state">{unreadOnly ? 'No unread conversations' : 'No conversations'}{searchQuery ? ` match “${searchQuery}”.` : '.'}</p> : null}
            </div>
          </section>

          <section className="overview-section schedule-section">
            <div className="section-heading">
              <div><span className="section-kicker">ON YOUR CALENDAR</span><h2>Today&apos;s schedule</h2></div>
              <Link className="icon-link" to="/calendar" aria-label="Open calendar"><CalendarDays size={17} /></Link>
            </div>
            <div className="schedule-list">
              {meetings.map((meeting, index) => (
                <article className={`schedule-row ${index === 0 ? 'schedule-next' : ''}`} key={meeting.id}>
                  <time>{meeting.time}</time><span className="schedule-track"><i /></span>
                  <div className="schedule-details"><strong>{meeting.title}</strong><span><UsersRound size={13} /> {meeting.attendees} participants</span></div>
                  {index === 0 ? <button type="button" className="join-meeting" onClick={() => navigate('/meetings')} aria-label={`Open ${meeting.title}`}><Video size={15} /></button> : null}
                </article>
              ))}
            </div>
            <Link to="/meetings" className="schedule-footer">View all meetings <ChevronRight size={14} /></Link>
          </section>
        </div>

      </main>
    </div>
  )
}

