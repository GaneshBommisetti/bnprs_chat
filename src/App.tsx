import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import { AppHeader } from './components/AppHeader'
import { meetings as initialMeetings } from './data/meetings'
import CalendarPage from './pages/Calendar'
import ChannelsPage from './pages/Channels'
import ChatPage from './pages/Chat'
import Dashboard from './pages/Dashboard'
import AppsPage from './pages/Apps'
import FilesPage from './pages/Files'
import HistoryPage from './pages/History'
import LoginPage from './pages/Login'
import MeetingsPage from './pages/Meetings'
import NotesPage from './pages/Notes'
import OrganizationTreePage from './pages/OrganizationTree'
import OrganizationPage from './pages/Organization'
import SettingsPage from './pages/Settings'

import type { Meeting, UserStatus } from './types'

const statusOptions: UserStatus[] = [
  { id: 'available', label: 'Available', description: 'Ready to collaborate' },
  { id: 'busy', label: 'Busy', description: 'Focus time' },
  { id: 'away', label: 'Away', description: 'Stepping away' },
]

function App() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('Available')
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [remoteWorkEnabled, setRemoteWorkEnabled] = useState(() => window.localStorage.getItem('bnprs-remote-work') !== 'off')
  const [remoteWorkStartedAt, setRemoteWorkStartedAt] = useState<number | null>(() => {
    if (window.localStorage.getItem('bnprs-remote-work') === 'off') return null
    const savedStart = Number(window.localStorage.getItem('bnprs-remote-work-started-at'))
    if (Number.isFinite(savedStart) && savedStart > 0) return savedStart
    const startedAt = Date.now()
    window.localStorage.setItem('bnprs-remote-work-started-at', String(startedAt))
    return startedAt
  })
  const [profileName, setProfileName] = useState(() => window.localStorage.getItem('bnprs-profile-name') ?? 'You')
  const [profileEmail, setProfileEmail] = useState(() => window.localStorage.getItem('bnprs-profile-email') ?? 'you@bnprs.in')
  const [profilePhoto, setProfilePhoto] = useState(() => window.localStorage.getItem('bnprs-profile-photo'))
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.localStorage.getItem('bnprs-authenticated') === 'true' || window.sessionStorage.getItem('bnprs-authenticated') === 'true')
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = window.localStorage.getItem('bnprs-scheduled-meetings')
      return saved ? JSON.parse(saved) as Meeting[] : initialMeetings
    } catch {
      return initialMeetings
    }
  })

  const handleRemoteWorkChange = (enabled: boolean) => {
    setRemoteWorkEnabled(enabled)
    window.localStorage.setItem('bnprs-remote-work', enabled ? 'on' : 'off')
    if (enabled) {
      const startedAt = Date.now()
      setRemoteWorkStartedAt(startedAt)
      window.localStorage.setItem('bnprs-remote-work-started-at', String(startedAt))
    } else {
      setRemoteWorkStartedAt(null)
      window.localStorage.removeItem('bnprs-remote-work-started-at')
    }
  }

  const handleProfileSave = (name: string, email: string) => {
    const nextName = name.trim()
    const nextEmail = email.trim()
    if (!nextName || !nextEmail) return
    setProfileName(nextName)
    setProfileEmail(nextEmail)
    window.localStorage.setItem('bnprs-profile-name', nextName)
    window.localStorage.setItem('bnprs-profile-email', nextEmail)
  }

  const handleProfilePhotoSave = (photo: string | null) => {
    setProfilePhoto(photo)
    if (photo) window.localStorage.setItem('bnprs-profile-photo', photo)
    else window.localStorage.removeItem('bnprs-profile-photo')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('bnprs-authenticated')
    window.sessionStorage.removeItem('bnprs-authenticated')
    setIsAuthenticated(false)
    setProfileOpen(false)
    navigate('/login', { replace: true })
  }

  const handleLogin = (email: string, keepSignedIn: boolean) => {
    const accountName = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
    const displayName = accountName ? accountName.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'You'
    setProfileName(displayName)
    setProfileEmail(email)
    setIsAuthenticated(true)
    window.localStorage.setItem('bnprs-profile-name', displayName)
    window.localStorage.setItem('bnprs-profile-email', email)
    if (keepSignedIn) {
      window.localStorage.setItem('bnprs-authenticated', 'true')
      window.sessionStorage.removeItem('bnprs-authenticated')
    } else {
      window.localStorage.removeItem('bnprs-authenticated')
      window.sessionStorage.setItem('bnprs-authenticated', 'true')
    }
    navigate('/remote-work', { replace: true })
  }

  const handleScheduleMeeting = (meeting: Meeting) => {
    setScheduledMeetings((current) => {
      const next = [...current, meeting]
      window.localStorage.setItem('bnprs-scheduled-meetings', JSON.stringify(next))
      return next
    })
  }

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status)
    setStatusMenuOpen(false)
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />

  return (
    <div className="flex h-screen flex-col bg-[#f5f7fb] text-[#101B3D]">
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        profileOpen={profileOpen}
        onProfileToggle={() => setProfileOpen((open) => !open)}
        onProfileClose={() => setProfileOpen(false)}
        profileName={profileName}
        profileEmail={profileEmail}
        onProfileSave={handleProfileSave}
        profilePhoto={profilePhoto}
        onProfilePhotoSave={handleProfilePhotoSave}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/remote-work" replace />} />
            <Route path="/login" element={<Navigate to="/remote-work" replace />} />
            <Route
              path="/remote-work"
              element={(
                <Dashboard
                  searchQuery={searchQuery}
                  statusOptions={statusOptions}
                  selectedStatus={selectedStatus}
                  onStatusSelect={handleStatusSelect}
                  statusMenuOpen={statusMenuOpen}
                  onStatusMenuToggle={() => setStatusMenuOpen((open) => !open)}
                  remoteWorkEnabled={remoteWorkEnabled}
                  onRemoteWorkChange={handleRemoteWorkChange}
                  remoteWorkStartedAt={remoteWorkStartedAt}
                  meetings={scheduledMeetings}
                  profileName={profileName}
                />
              )}
            />
            <Route path="/chat" element={<ChatPage sidebarCollapsed={sidebarCollapsed} />} />
            <Route path="/inbox" element={<Navigate to="/chat?channel=bpr2002-talab-qi-general" replace />} />
            <Route path="/bnprs-tree" element={<OrganizationTreePage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/meetings" element={<MeetingsPage meetings={scheduledMeetings} onSchedule={handleScheduleMeeting} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/calendar" element={<CalendarPage meetings={scheduledMeetings} />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App