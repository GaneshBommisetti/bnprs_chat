import { FileText, Paperclip, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { inboxItems } from '../data/inbox'
import { notifications } from '../data/notifications'

const sharedFiles = [
  ...inboxItems.flatMap((item) => item.attachment ? [{
    name: item.attachment,
    sharedIn: item.name,
    href: `/chat?channel=${encodeURIComponent(item.channel)}`,
  }] : []),
  ...notifications.filter((item) => item.text.toLocaleLowerCase().includes('uploaded')).map((item) => {
    const name = item.text.replace(/^.*uploaded\s+/i, '')
    return { name, sharedIn: item.text, href: null }
  }),
]

export default function FilesPage() {
  const [searchParams] = useSearchParams()
  const selectedFile = searchParams.get('file')?.toLocaleLowerCase() ?? ''
  const files = selectedFile
    ? sharedFiles.filter((file) => file.name.toLocaleLowerCase().includes(selectedFile))
    : sharedFiles

  return (
    <main className="min-h-full bg-[#f4f6fa] px-5 py-8 text-[#101B3D] sm:px-9 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#737d8e]">BNPRS WORKSPACE</p>
        <div className="mt-2">
          <h1 className="font-['Manrope'] text-[28px] font-bold">Shared files</h1>
          <p className="mt-1 text-[13px] text-[#707971]">Files shared in BNPRS conversations.</p>
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-[#e2e7ef] bg-white shadow-[0_6px_20px_rgba(16,27,61,0.035)]" aria-label="Shared files">
          {files.length ? files.map((file, index) => {
            const contents = (
              <>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#eef2fa] text-[#536994]"><FileText size={18} /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[12px] text-[#25324e]">{file.name}</strong>
                  <small className="mt-1 block truncate text-[10px] text-[#7a8494]">{file.sharedIn}</small>
                </span>
                <Paperclip size={14} className="shrink-0 text-[#9aa3b2]" />
              </>
            )
            const rowClassName = 'flex items-center gap-3 border-b border-[#edf0f4] px-4 py-3.5 last:border-b-0'
            return file.href ? (
              <Link key={`${file.name}-${index}`} to={file.href} className={`${rowClassName} hover:bg-[#f8faff]`}>
                {contents}
              </Link>
            ) : (
              <div key={`${file.name}-${index}`} className={rowClassName}>
                {contents}
              </div>
            )
          }) : (
            <p className="flex items-center justify-center gap-2 px-5 py-10 text-[12px] text-[#788397]">
              <Search size={15} />
              No shared file found{selectedFile ? ` for “${searchParams.get('file')}”` : ''}.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
