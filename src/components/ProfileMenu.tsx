import { useRef, useState } from 'react'
import { LogOut, Save, Trash2, Upload } from 'lucide-react'

type ProfileMenuProps = {
  profileName: string
  profileEmail: string
  profilePhoto: string | null
  onProfileSave: (name: string, email: string) => void
  onProfilePhotoSave: (photo: string | null) => void
  onClose: () => void
  onLogout: () => void
}

export function ProfileMenu({
  profileName,
  profileEmail,
  profilePhoto,
  onProfileSave,
  onProfilePhotoSave,
  onClose,
  onLogout,
}: ProfileMenuProps) {
  const [name, setName] = useState(profileName)
  const [email, setEmail] = useState(profileEmail)
  const [saved, setSaved] = useState(false)
  const [photoMessage, setPhotoMessage] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    if (!cleanName || !cleanEmail) return
    onProfileSave(cleanName, cleanEmail)
    setSaved(true)
    onClose()
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoMessage('Choose an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoMessage('Choose an image smaller than 10 MB.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')
      if (!context) {
        setPhotoMessage('Could not process this image.')
        URL.revokeObjectURL(objectUrl)
        return
      }
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight)
      context.drawImage(image, (image.naturalWidth - cropSize) / 2, (image.naturalHeight - cropSize) / 2, cropSize, cropSize, 0, 0, size, size)
      onProfilePhotoSave(canvas.toDataURL('image/jpeg', 0.82))
      setPhotoMessage('Profile photo updated.')
      URL.revokeObjectURL(objectUrl)
    }
    image.onerror = () => {
      setPhotoMessage('Could not load this image.')
      URL.revokeObjectURL(objectUrl)
    }
    image.src = objectUrl
  }

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[300px] rounded-lg border border-[#dfe4ef] bg-white p-4 text-[#111827] shadow-xl shadow-[#dfe7f5]/70">
      <h2 className="text-[14px] font-semibold">Profile</h2>
      <div className="mt-3 flex items-center gap-3">
        {profilePhoto ? (
          <img src={profilePhoto} alt={`${profileName} profile`} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1df] text-[14px] font-semibold text-[#a85b08]">{profileName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
        )}
        <div className="flex flex-wrap gap-2">
          <input ref={photoInput} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <button type="button" onClick={() => photoInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-[#dfe4ef] px-2.5 py-2 text-[11px] font-medium text-[#374151] hover:border-[#F2992F] hover:text-[#F2992F]">
            <Upload size={13} />
            {profilePhoto ? 'Change photo' : 'Add photo'}
          </button>
          {profilePhoto ? <button type="button" onClick={() => { onProfilePhotoSave(null); setPhotoMessage('Profile photo removed.') }} aria-label="Remove profile photo" className="flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#fff1df] hover:text-[#a85b08]"><Trash2 size={14} /></button> : null}
        </div>
      </div>
      {photoMessage ? <p role="status" className="mt-2 text-[10px] text-[#6b7280]">{photoMessage}</p> : null}
      <form onSubmit={saveProfile} className="mt-3 space-y-3">
        <label className="block text-[11px] font-medium text-[#4b5563]">
          Name
          <input
            required
            value={name}
            onChange={(event) => { setName(event.target.value); setSaved(false) }}
            className="mt-1 w-full rounded-md border border-[#dfe4ef] bg-[#f9fafb] px-2.5 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]"
          />
        </label>
        <label className="block text-[11px] font-medium text-[#4b5563]">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setSaved(false) }}
            className="mt-1 w-full rounded-md border border-[#dfe4ef] bg-[#f9fafb] px-2.5 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]"
          />
        </label>
        <div className="flex items-center justify-between">
          {saved ? <span role="status" className="text-[11px] text-[#177245]">Profile saved</span> : <span />}
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-[#F2992F] px-3 py-2 text-[11px] font-medium text-white hover:bg-[#e58b21]">
            <Save size={13} />
            Save profile
          </button>
        </div>
      </form>

      <div className="mt-4 border-t border-[#e5e7eb] pt-3">
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[12px] font-medium text-[#b42332] hover:bg-[#fff1f0]">
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  )
}