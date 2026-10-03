import { useEffect, useMemo, useRef, useState } from 'react'
import { AppWindow, ArrowUpRight, Bell, CalendarDays, ChevronDown, Command, FileText, Grid2X2, Mail, Network, Plus, Search, UsersRound, Video } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import logoLockupDark from '../assets/logo-lockup-dark.png'
import { conversationChannels, pinnedChannels } from '../data/channels'
import { atWorkEmployees, awayEmployees } from '../data/employees'
import { inboxItems, unreadInboxCount } from '../data/inbox'
import { meetings } from '../data/meetings'
import { notifications } from '../data/notifications'

import { NotificationMenu } from './NotificationMenu'
import { ProfileMenu } from './ProfileMenu'

type AppHeaderProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  profileOpen: boolean
  onProfileToggle: () => void
  onProfileClose: () => void
  profileName: string
  profileEmail: string
  profilePhoto: string | null
  onProfileSave: (name: string, email: string) => void
  onProfilePhotoSave: (photo: string | null) => void
  onLogout: () => void
}

type SearchResult = {
  label: string
  detail: string
  href: string
}

const navigation = [
  { label: 'Home', path: '/remote-work' },
  { label: 'Inbox', path: '/chat?channel=bpr2002-talab-qi-general' },
  { label: 'BNPRS Tree', path: '/bnprs-tree' },
  { label: 'Channels', path: '/channels' },
  { label: 'Meetings', path: '/meetings' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Files', path: '/files' },
  { label: 'Apps', path: '/apps' },
]

const portals = [
  { label: 'BNPRS People', path: '/organization', icon: UsersRound },
  { label: 'BNPRS Mail', path: '/inbox', icon: Mail },
  { label: 'BNPRS Tree', path: '/bnprs-tree', icon: Network },
  { label: 'BNPRS Meetings', path: '/meetings', icon: Video },
  { label: 'BNPRS Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'BNPRS Drive', path: '/files', icon: FileText },
  { label: 'BNPRS Apps', path: '/apps', icon: AppWindow },
]

export function AppHeader({
  searchQuery,
  setSearchQuery,
  profileOpen,
  onProfileToggle,
  onProfileClose,
  profileName,
  profileEmail,
  profilePhoto,
  onProfileSave,
  onProfilePhotoSave,
  onLogout,
}: AppHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [portalMenuOpen, setPortalMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const createWrapRef = useRef<HTMLDivElement>(null)
  const notificationsWrapRef = useRef<HTMLDivElement>(null)
  const portalWrapRef = useRef<HTMLDivElement>(null)
  const profileWrapRef = useRef<HTMLDivElement>(null)
  const searchWrapRef = useRef<HTMLDivElement>(null)

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    if (!query) return []
    const matches = (text: string) => text.toLocaleLowerCase().includes(query)
    return [
      {
        category: 'People',
        results: [...atWorkEmployees, ...awayEmployees]
          .filter((employee) => matches(`${employee.name} ${employee.email}`))
          .map((employee): SearchResult => ({ label: employee.name, detail: employee.email, href: `/chat?contact=${encodeURIComponent(employee.id)}` }))
          .slice(0, 4),
      },
      {
        category: 'Messages',
        results: inboxItems
          .filter((item) => matches(`${item.name} ${item.sender} ${item.preview} ${item.body}`))
          .map((item): SearchResult => ({ label: item.name, detail: item.preview, href: `/chat?channel=${encodeURIComponent(item.channel)}` }))
          .slice(0, 4),
      },
      {
        category: 'Files',
        results: [
          ...inboxItems.filter((item) => item.attachment).map((item) => ({
            label: item.attachment ?? '',
            detail: `Shared in ${item.name}`,
            href: `/chat?channel=${encodeURIComponent(item.channel)}`,
            searchable: `${item.attachment} ${item.name}`,
          })),
          ...notifications.filter((item) => item.text.toLocaleLowerCase().includes('uploaded')).map((item) => {
            const fileName = item.text.replace(/^.*uploaded\s+/i, '')
            return { label: fileName, detail: 'Shared file', href: `/files?file=${encodeURIComponent(fileName)}`, searchable: `${fileName} ${item.text}` }
          }),
        ]
          .filter((file) => matches(`${file.label} ${file.detail} ${file.searchable}`))
          .map(({ label, detail, href }): SearchResult => ({ label, detail, href }))
          .slice(0, 4),
      },
      {
        category: 'Channels',
        results: [...pinnedChannels, ...conversationChannels]
          .filter((channel) => matches(channel.name))
          .map((channel): SearchResult => ({ label: channel.name, detail: 'Channel', href: `/chat?channel=${encodeURIComponent(channel.id)}` }))
          .slice(0, 4),
      },
      {
        category: 'Meetings',
        results: meetings
          .filter((meeting) => matches(`${meeting.title} ${meeting.time}`))
          .map((meeting): SearchResult => ({ label: meeting.title, detail: `${meeting.time} · ${meeting.attendees} participants`, href: '/meetings' }))
          .slice(0, 4),
      },
    ].filter((group) => group.results.length > 0)
  }, [searchQuery])

  const totalSearchResults = searchResults.reduce((total, group) => total + group.results.length, 0)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (!searchWrapRef.current?.contains(event.target)) setSearchFocused(false)
      if (!createWrapRef.current?.contains(event.target)) setQuickActionsOpen(false)
      if (!notificationsWrapRef.current?.contains(event.target)) setNotificationsOpen(false)
      if (!portalWrapRef.current?.contains(event.target)) setPortalMenuOpen(false)
      if (!profileWrapRef.current?.contains(event.target)) onProfileClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuickActionsOpen(false)
        setNotificationsOpen(false)
        setPortalMenuOpen(false)
        setSearchFocused(false)
        onProfileClose()
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onProfileClose])

  const isActive = (path: string) => {
    if (path === '/remote-work') return location.pathname === '/' || location.pathname === '/remote-work'
    if (path === '/notes') return ['/notes', '/settings'].includes(location.pathname)
    if (path.startsWith('/chat')) return location.pathname === '/chat' || location.pathname === '/inbox'
    return location.pathname === path
  }

  return (
    <header className="bn-header">
      <div className="bn-header-main">
        <Link className="bn-brand" to="/remote-work" aria-label="BNPRS Chat home">
          <img src={logoLockupDark} alt="BNPRS Chat" />
        </Link>

        <div className="bn-search-wrap" ref={searchWrapRef}>
          <label className="bn-global-search">
            <Search size={16} aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(event) => { if (event.key === 'Escape') setSearchFocused(false) }}
              placeholder="Search people, messages, files"
              aria-label="Search people, messages, files, channels, and meetings"
              aria-expanded={searchFocused && searchQuery.trim().length > 0}
              aria-controls="bn-global-search-results"
            />
            <kbd><Command size={11} /> K</kbd>
          </label>
          {searchFocused && searchQuery.trim() ? (
            <div id="bn-global-search-results" className="bn-search-results" role="region" aria-label="Global search results">
              <div className="bn-search-results-heading">
                <span>Search results</span>
                <span>{totalSearchResults}</span>
              </div>
              {searchResults.length ? searchResults.map((group) => (
                <section key={group.category} aria-label={group.category}>
                  <h2>{group.category}</h2>
                  {group.results.map((result) => (
                    <Link key={`${group.category}-${result.label}`} to={result.href} onClick={() => { setSearchFocused(false); setSearchQuery('') }}>
                      <span><strong>{result.label}</strong><small>{result.detail}</small></span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </section>
              )) : <p className="bn-search-empty">No results found for “{searchQuery.trim()}”.</p>}
            </div>
          ) : null}
        </div>

        <div className="bn-header-actions">
          <div className="bn-action-wrap" ref={createWrapRef}>
            <button className="bn-create-button" type="button" onClick={() => { setQuickActionsOpen((open) => !open); setNotificationsOpen(false); onProfileClose() }} aria-expanded={quickActionsOpen}>
              <Plus size={16} /><span>Create</span><ChevronDown size={13} />
            </button>
            {quickActionsOpen ? (
              <div className="bn-popover bn-action-menu">
                <button type="button" onClick={() => { navigate('/chat'); setQuickActionsOpen(false) }}>Start a message</button>
                <button type="button" onClick={() => { navigate('/meetings'); setQuickActionsOpen(false) }}>Schedule a meeting</button>
                <button type="button" onClick={() => { navigate('/channels'); setQuickActionsOpen(false) }}>Open a space</button>
              </div>
            ) : null}
          </div>
          <div className="bn-action-wrap" ref={notificationsWrapRef}>
            <button className="bn-icon-button bn-notifications-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setQuickActionsOpen(false); onProfileClose() }}>
              <Bell size={18} /><span className="bn-notification-dot" />
            </button>
            {notificationsOpen ? <div className="bn-notification-popover" onClick={() => setNotificationsOpen(false)}><NotificationMenu items={notifications} /></div> : null}
          </div>
          <div className="bn-action-wrap" ref={portalWrapRef}>
            <button
              className="bn-icon-button bn-portal-button"
              type="button"
              aria-label="Open BNPRS portals"
              aria-expanded={portalMenuOpen}
              onClick={() => { setPortalMenuOpen((open) => !open); setQuickActionsOpen(false); setNotificationsOpen(false); onProfileClose() }}
            >
              <Grid2X2 size={18} />
            </button>
            {portalMenuOpen ? (
              <div className="bn-popover bn-portal-menu">
                <p>BNPRS portals</p>
                <div>
                  {portals.map((portal) => {
                    const PortalIcon = portal.icon
                    return (
                      <Link key={portal.path} to={portal.path} onClick={() => setPortalMenuOpen(false)}>
                        <span><PortalIcon size={17} /></span>
                        {portal.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="bn-action-wrap" ref={profileWrapRef}>
            <button className="bn-profile-button" type="button" onClick={() => { onProfileToggle(); setQuickActionsOpen(false); setNotificationsOpen(false) }} aria-label="Open profile" aria-expanded={profileOpen}>
              {profilePhoto ? <img src={profilePhoto} alt="" /> : <span>{profileName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>}
              <ChevronDown size={13} />
            </button>
            {profileOpen ? <ProfileMenu profileName={profileName} profileEmail={profileEmail} profilePhoto={profilePhoto} onProfileSave={onProfileSave} onProfilePhotoSave={onProfilePhotoSave} onClose={onProfileClose} onLogout={onLogout} /> : null}
          </div>
        </div>
      </div>

      <nav className="bn-primary-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link key={item.path} to={item.path} aria-current={isActive(item.path) ? 'page' : undefined} className={isActive(item.path) ? 'is-active' : ''}>
            {item.label}{item.label === 'Inbox' && unreadInboxCount > 0 ? <span className="bn-nav-unread" aria-label={`${unreadInboxCount} unread messages`}>{unreadInboxCount}</span> : null}
          </Link>
        ))}
      </nav>
    </header>
  )
}