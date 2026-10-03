import { CalendarDays, Video } from 'lucide-react'

import type { Meeting } from '../types'

type MeetingsPanelProps = {
  meetings: Meeting[]
  onJoin?: (meeting: Meeting) => void
}

export function MeetingsPanel({ meetings, onJoin }: MeetingsPanelProps) {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#e5eaf3] bg-[#ffffff] shadow-sm shadow-[#dfe7f5]">
      <div className="flex items-center justify-between border-b border-[#edf1f7] px-4 py-3">
        <h3 className="text-[15px] font-semibold text-[#101B3D]">Meetings</h3>
      </div>

      <div className="flex flex-col gap-3 p-3">
        {meetings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#dfe4ef] px-3 py-6 text-center text-[12px] text-[#64748b]">
            No scheduled meetings.
          </div>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting.id} className="rounded-lg border border-[#e7ecf5] bg-[#f7f9fd] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#101B3D]">{meeting.time}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe4ef] bg-white px-2 py-0.5 text-[10px] text-[#58657d]">
                  <CalendarDays size={10} />
                  {meeting.attendees}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium text-[#101B3D]">{meeting.title}</p>
                  <p className="mt-1 text-[11px] text-[#64748b]">
                    {meeting.date ? `${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(`${meeting.date}T12:00:00`))} · ` : ''}
                    {meeting.attendees} participants
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fffaf3] text-[#F2992F]">
                    <Video size={14} />
                  </span>
                  <button type="button" onClick={() => onJoin?.(meeting)} className="rounded-md border border-[#F2992F] bg-[#fff8ef] px-2 py-1 text-[11px] font-medium text-[#a85b08] hover:bg-[#F2992F] hover:text-white">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <button type="button" className="mt-1 text-left text-[12px] font-medium text-[#F2992F] hover:text-[#F2992F]">
          View meeting history
        </button>
      </div>
    </aside>
  )
}
