import { CalendarDays, ChevronLeft, ChevronRight, Clock3, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Meeting } from '../types'

import './Calendar.css'

const categoryColors = {
  review: 'bg-[#fff1df] text-[#a85b08]',
  design: 'bg-[#e8f5ee] text-[#177245]',
  management: 'bg-[#eaf1fb] text-[#315f99]',
}

type CalendarPageProps = {
  meetings: Meeting[]
}

export default function CalendarPage({ meetings }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [view, setView] = useState<CalendarView>('Month')
  const todayKey = dateKey(new Date())
  const selectedKey = dateKey(selectedDate)
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(selectedDate)
  const selectedLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDate)
  const monthDates = useMemo(() => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const gridStart = new Date(firstDay)
    gridStart.setDate(firstDay.getDate() - firstDay.getDay())
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart)
      day.setDate(gridStart.getDate() + index)
      return day
    })
  }, [selectedDate])
  const weekDates = useMemo(() => {
    const weekStart = startOfWeek(selectedDate)
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + index)
      return day
    })
  }, [selectedDate])
  const selectedMeetings = meetings.filter((meeting) => (meeting.date ?? todayKey) === selectedKey)

  const shiftDate = (direction: number) => {
    setSelectedDate((current) => {
      const next = new Date(current)
      if (view === 'Month') next.setMonth(next.getMonth() + direction)
      else next.setDate(next.getDate() + direction * (view === 'Week' ? 7 : 1))
      return next
    })
  }

  const dayButton = (day: Date, compact = false) => {
    const key = dateKey(day)
    const dayMeetings = meetings.filter((meeting) => (meeting.date ?? todayKey) === key)
    const dayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(day)
    return (
      <button
        type="button"
        key={key}
        className={`calendar-day ${key === selectedKey ? 'selected' : ''} ${key === todayKey ? 'today' : ''} ${day.getMonth() !== selectedDate.getMonth() ? 'outside-month' : ''} ${compact ? 'week-day' : ''}`}
        onClick={() => setSelectedDate(day)}
        aria-pressed={key === selectedKey}
        aria-label={`${dayLabel}${dayMeetings.length ? `, ${dayMeetings.length} meetings` : ''}`}
      >
        <span className="calendar-day-number">{day.getDate()}</span>
        {compact ? <span className="calendar-weekday-label">{weekdays[day.getDay()]}</span> : null}
        {dayMeetings.length ? <span className="calendar-day-events">{dayMeetings.length} {dayMeetings.length === 1 ? 'meeting' : 'meetings'}</span> : null}
        {dayMeetings.length ? <i className="calendar-event-dot" /> : null}
      </button>
    )
  }

  return (
    <div className="calendar-page">
      <main className="calendar-content">
        <section className="calendar-board" aria-label={`${view} calendar`}>
          <div className="calendar-toolbar">
            <div className="calendar-month-controls">
              <button type="button" onClick={() => shiftDate(-1)} aria-label={`Previous ${view.toLowerCase()}`}><ChevronLeft size={18} /></button>
              <h2>{monthLabel}</h2>
              <button type="button" onClick={() => shiftDate(1)} aria-label={`Next ${view.toLowerCase()}`}><ChevronRight size={18} /></button>
              <button type="button" className="calendar-today-button" onClick={() => setSelectedDate(new Date())}>Today</button>
            </div>
            <div className="calendar-view-switch" role="tablist" aria-label="Calendar view">
              {(['Month', 'Week', 'Day'] as const).map((option) => (
                <button key={option} type="button" role="tab" aria-selected={view === option} className={view === option ? 'active' : ''} onClick={() => setView(option)}>{option}</button>
              ))}
            </div>
          </div>

          {view === 'Month' ? (
            <div className="calendar-month-grid">
              {weekdays.map((weekday) => <span className="calendar-weekday" key={weekday}>{weekday}</span>)}
              {monthDates.map((day) => dayButton(day))}
            </div>
          ) : view === 'Week' ? (
            <div className="calendar-week-grid">{weekDates.map((day) => dayButton(day, true))}</div>
          ) : (
            <div className="calendar-day-timeline">
              {Array.from({ length: 10 }, (_, index) => index + 8).map((hour) => {
                const hourMeetings = selectedMeetings.filter((meeting) => meetingHour(meeting.time) === hour)
                return (
                  <div className="calendar-hour-row" key={hour}>
                    <time>{hourLabel(hour)}</time>
                    <div className="calendar-hour-content">
                      {hourMeetings.map((meeting) => (
                        <article className={`calendar-hour-event ${meeting.category}`} key={meeting.id}>
                          <strong>{meeting.title}</strong><span>{meeting.time} · {meeting.attendees} participants</span>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="calendar-agenda">
          <div className="calendar-agenda-heading">
            <div><CalendarDays size={17} /><div><span>SELECTED DATE</span><h2>{selectedLabel}</h2></div></div>
            <span>{selectedMeetings.length} {selectedMeetings.length === 1 ? 'meeting' : 'meetings'}</span>
          </div>
          {selectedMeetings.length ? selectedMeetings.map((meeting) => (
            <article className="calendar-meeting-row" key={meeting.id}>
              <time><Clock3 size={14} />{meeting.time}</time>
              <div className="calendar-meeting-marker" />
              <div className="calendar-meeting-detail"><h3>{meeting.title}</h3><p><UsersRound size={13} />{meeting.attendees} participants</p></div>
              <span className={`calendar-category ${categoryColors[meeting.category]}`}>{meeting.category}</span>
            </article>
          )) : <p className="calendar-empty">No meetings scheduled for this date.</p>}
        </section>
      </main>
    </div>
  )
}

type CalendarView = 'Month' | 'Week' | 'Day'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - start.getDay())
  return start
}

function meetingHour(time: string) {
  const [clock, period = 'AM'] = time.split(' ')
  const hour = Number(clock.split(':')[0]) % 12
  return period.toUpperCase() === 'PM' ? hour + 12 : hour
}

function hourLabel(hour: number) {
  return `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`
}