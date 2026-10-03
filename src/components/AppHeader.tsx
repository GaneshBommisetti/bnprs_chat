import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Command, Plus, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import logoLockupDark from '../assets/logo-lockup-dark.png'
import { unreadInboxCount } from '../data/inbox'
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
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

const navigation = [
  { label: 'Home', path: '/remote-work' },
  { label: 'Inbox', path: '/chat?channel=bpr2002-talab-qi-general' },
  { label: 'People', path: '/organization' },
  { label: 'Channels', path: '/channels' },
  { label: 'Meetings', path: '/meetings' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Files', path: '/files' },
  { label: 'Apps', path: '/apps' },
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
  sidebarCollapsed,
  onSidebarToggle,
}: AppHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [workspace, setWorkspace] = useState('BNPRS · Company')
  const profileWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!profileOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !profileWrapRef.current?.contains(event.target)) onProfileClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onProfileClose()
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onProfileClose, profileOpen])

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

        <div className="bn-workspace-wrap">
          <button className="bn-workspace" type="button" onClick={() => setWorkspaceOpen((open) => !open)} aria-expanded={workspaceOpen}>
            <span className="bn-workspace-mark">B</span>
            <span><small>WORKSPACE</small><strong>{workspace}</strong></span>
            <ChevronDown size={14} />
          </button>
          {workspaceOpen ? (
            <div className="bn-popover bn-workspace-menu">
              {['BNPRS · Company', 'AandhiPe · Product'].map((name) => (
                <button key={name} type="button" onClick={() => { setWorkspace(name); setWorkspaceOpen(false) }}>
                  <span className="bn-workspace-mark">{name[0]}</span><span>{name}</span>{workspace === name ? <span className="bn-current-mark">Current</span> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <label className="bn-global-search">
          <Search size={16} aria-hidden="true" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search people, messages, files" />
          <kbd><Command size={11} /> K</kbd>
        </label>

        <div className="bn-header-actions">
          <div className="bn-action-wrap">
            <button className="bn-create-button" type="button" onClick={() => setQuickActionsOpen((open) => !open)} aria-expanded={quickActionsOpen}>
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
          <div className="bn-action-wrap">
            <button className="bn-icon-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>
              <Bell size={18} /><span className="bn-notification-dot" />
            </button>
            {notificationsOpen ? <div className="bn-notification-popover"><NotificationMenu items={notifications} /></div> : null}
          </div>
          <div className="bn-action-wrap" ref={profileWrapRef}>
            <button className="bn-profile-button" type="button" onClick={onProfileToggle} aria-label="Open profile">
              {profilePhoto ? <img src={profilePhoto} alt="" /> : <span>{profileName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>}
              <ChevronDown size={13} />
            </button>
            {profileOpen ? <ProfileMenu profileName={profileName} profileEmail={profileEmail} profilePhoto={profilePhoto} onProfileSave={onProfileSave} onProfilePhotoSave={onProfilePhotoSave} onClose={onProfileClose} onLogout={onLogout} sidebarCollapsed={sidebarCollapsed} onSidebarToggle={onSidebarToggle} /> : null}
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