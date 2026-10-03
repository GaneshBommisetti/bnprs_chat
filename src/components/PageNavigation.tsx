import { Link } from 'react-router-dom'

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'Chats', path: '/chat' },
  { label: 'Channels', path: '/channels' },
  { label: 'History', path: '/history' },
  { label: 'Files', path: '/files' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Notes', path: '/notes' },
  { label: 'Organization', path: '/organization' },
  { label: 'Settings', path: '/settings' },
]

export function PageNavigation() {
  return (
    <div className="px-5 pt-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5eaf3] pb-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className="rounded-full border border-[#dfe4ef] bg-[#f6f8fc] px-3 py-1.5 text-[11px] font-medium text-[#58657d] transition-colors hover:border-[#F2992F] hover:text-[#F2992F]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
