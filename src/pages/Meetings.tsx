import { CalendarDays, Check, Clock3, UsersRound, Video } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { MeetingsPanel } from '../components/MeetingsPanel'
import type { Meeting } from '../types'

type MeetingsPageProps = {
  meetings: Meeting[]
  onSchedule: (meeting: Meeting) => void
  onDelete: (meetingId: string) => void
  onReschedule: (meetingId: string, meeting: Omit<Meeting, 'id'>) => void
}

export default function MeetingsPage({ meetings, onSchedule, onDelete, onReschedule }: MeetingsPageProps) {
  const [notice, setNotice] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => {
    const today = new Date()
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    return localDate.toISOString().slice(0, 10)
  })
  const [time, setTime] = useState('09:00')
  const [attendees, setAttendees] = useState('4')
  const [category, setCategory] = useState<Meeting['category']>('review')
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null)
  const [prepChecked, setPrepChecked] = useState<Record<string, boolean>>({})
  const prepItems = ['Review the shared agenda', 'Confirm the attendee list', 'Post your update in the team chat']
  const completedPrepCount = prepItems.filter((item) => prepChecked[item]).length
  const nextMeeting = meetings[0]

  const resetForm = () => {
    setTitle('')
    setDate(() => {
      const today = new Date()
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
      return localDate.toISOString().slice(0, 10)
    })
    setTime('09:00')
    setAttendees('4')
    setCategory('review')
    setEditingMeetingId(null)
  }

  const handleSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return

    const scheduledAt = new Date(`${date}T${time}`)
    const displayTime = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(scheduledAt)
    const nextPayload = {
      title: cleanTitle,
      date,
      time: displayTime,
      attendees: Math.max(1, Number(attendees) || 1),
      category,
    }

    if (editingMeetingId) {
      onReschedule(editingMeetingId, nextPayload)
      setNotice(`${cleanTitle} rescheduled`)
    } else {
      onSchedule({
        id: `meeting-${Date.now()}`,
        ...nextPayload,
      })
      setNotice(`${cleanTitle} scheduled`)
    }

    resetForm()
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeetingId(meeting.id)
    setTitle(meeting.title)
    setDate(meeting.date ?? '')
    setTime(meeting.time)
    setAttendees(String(meeting.attendees))
    setCategory(meeting.category)
    setNotice(`Editing ${meeting.title}`)
  }

  const handleJoin = (meeting: Meeting) => {
    setNotice(`Joining ${meeting.title}...`)
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f7fb] text-[#101B3D]">
      <header className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-6 py-4">
        <div>
          <h1 className="text-[17px] font-semibold text-[#111827]">Meetings</h1>
          <p className="mt-1 text-[12px] text-[#6b7280]">Your team's upcoming sessions</p>
        </div>
        <Link to="/calendar" className="inline-flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:border-[#F2992F] hover:text-[#F2992F]">
          <CalendarDays size={15} />
          Calendar
        </Link>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(290px,0.75fr)]">
          <section className="min-w-0">
          <form onSubmit={handleSchedule} className="mb-5 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm shadow-[#dfe7f5]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-semibold text-[#111827]">{editingMeetingId ? 'Reschedule meeting' : 'Schedule a meeting'}</h2>
              {editingMeetingId ? (
                <button type="button" onClick={resetForm} className="text-[11px] font-medium text-[#667085] hover:text-[#101B3D]">Cancel</button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[11px] font-medium text-[#4b5563] sm:col-span-2">
                Meeting name
                <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project sync" className="mt-1 w-full rounded-xl border border-[#dfe4ef] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]" />
              </label>
              <label className="text-[11px] font-medium text-[#4b5563]">
                Date
                <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full rounded-xl border border-[#dfe4ef] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]" />
              </label>
              <label className="text-[11px] font-medium text-[#4b5563]">
                Time
                <input required type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-1 w-full rounded-xl border border-[#dfe4ef] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]" />
              </label>
              <label className="text-[11px] font-medium text-[#4b5563]">
                Attendees
                <input required type="number" min="1" value={attendees} onChange={(event) => setAttendees(event.target.value)} className="mt-1 w-full rounded-xl border border-[#dfe4ef] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]" />
              </label>
              <label className="text-[11px] font-medium text-[#4b5563]">
                Type
                <select value={category} onChange={(event) => setCategory(event.target.value as Meeting['category'])} className="mt-1 w-full rounded-xl border border-[#dfe4ef] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#111827] outline-none focus:border-[#F2992F]">
                  <option value="review">Review</option>
                  <option value="design">Design</option>
                  <option value="management">Management</option>
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {notice ? <span role="status" className="text-[11px] text-[#177245]">{notice}</span> : <span />}
              <button type="submit" className="rounded-xl bg-[#F2992F] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#e58b21]">{editingMeetingId ? 'Update meeting' : 'Schedule'}</button>
            </div>
          </form>
          <MeetingsPanel meetings={meetings} onJoin={handleJoin} onDelete={onDelete} onReschedule={handleEditMeeting} />
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#e1e5df] bg-white p-5 shadow-sm shadow-[#dfe7f5]">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#818981]">Next on your schedule</p>
              {nextMeeting ? (
                <>
                  <h2 className="mt-3 text-[20px] font-bold text-[#101B3D]">{nextMeeting.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#69756d]">
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{nextMeeting.time}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{nextMeeting.date ? new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' }).format(new Date(`${nextMeeting.date}T12:00:00`)) : 'Today'}</span>
                    <span className="inline-flex items-center gap-1.5"><UsersRound size={13} />{nextMeeting.attendees} people</span>
                  </div>
                  <button type="button" onClick={() => handleJoin(nextMeeting)} className="mt-5 inline-flex items-center gap-2 bg-[#101B3D] px-4 py-2.5 text-[11px] font-semibold text-white hover:bg-[#24365f] rounded-xl">
                    <Video size={14} />Join meeting
                  </button>
                </>
              ) : (
                <div className="mt-3">
                  <h2 className="text-[18px] font-bold text-[#101B3D]">No meetings scheduled</h2>
                  <p className="mt-2 text-[11px] text-[#69756d]">Schedule one here or choose a time on the calendar.</p>
                  <Link to="/calendar" className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-[#405b49]">Open calendar <CalendarDays size={14} /></Link>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#e1e5df] bg-white p-5 shadow-sm shadow-[#dfe7f5]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#818981]">Meeting prep</p>
                  <h2 className="mt-2 text-[15px] font-bold text-[#101B3D]">Before you join</h2>
                </div>
                <span className="text-[10px] font-semibold text-[#717a73]">{completedPrepCount}/{prepItems.length} ready</span>
              </div>
              <div className="mt-3 divide-y divide-[#edf0eb]">
                {prepItems.map((item) => (
                  <button key={item} type="button" role="checkbox" aria-checked={Boolean(prepChecked[item])} onClick={() => setPrepChecked((current) => ({ ...current, [item]: !current[item] }))} className="flex w-full items-center gap-3 py-3 text-left text-[11px] text-[#536057]">
                    <span className={['grid h-4 w-4 shrink-0 place-items-center border', prepChecked[item] ? 'border-[#4d8b60] bg-[#4d8b60] text-white' : 'border-[#cfd6ce] bg-white'].join(' ')}>{prepChecked[item] ? <Check size={11} /> : null}</span>
                    {item}
                  </button>
                ))}
              </div>
              <Link to="/chat?channel=bnprs-announcements" className="mt-2 inline-flex items-center gap-2 border-t border-[#edf0eb] pt-3 text-[10px] font-semibold text-[#405b49]">Open team chat <Video size={13} /></Link>
            </section>

            <Link to="/calendar" className="flex items-center justify-between border-b border-[#e1e5df] px-1 py-2 text-[11px] font-semibold text-[#536057] hover:text-[#a96419]">
              <span>View full team calendar</span><CalendarDays size={15} />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  )
}