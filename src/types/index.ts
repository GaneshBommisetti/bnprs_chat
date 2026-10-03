export type EmployeeStatus = 'online' | 'away' | 'offline'

export interface Employee {
  id: string
  name: string
  email: string
  status: EmployeeStatus
  initials: string
}

export interface Channel {
  id: string
  name: string
  unread?: number
  private?: boolean
  selected?: boolean
}

export interface Meeting {
  id: string
  date?: string
  time: string
  title: string
  attendees: number
  category: 'review' | 'design' | 'management'
}

export interface NotificationItem {
  id: string
  text: string
  time: string
  unread?: boolean
}

export interface Message {
  id: string
  sender: string
  text: string
  time: string
}

export interface UserStatus {
  id: string
  label: string
  description: string
}

export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
}
