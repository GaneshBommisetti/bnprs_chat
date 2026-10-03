export type InboxCategory = 'All' | 'Unread' | 'Mentions' | 'Important' | 'Direct messages'

export type InboxItem = {
  id: string
  name: string
  initials: string
  tone: string
  preview: string
  time: string
  unread: number
  channel: string
  direct?: boolean
  mention?: boolean
  important?: boolean
  attachment?: string
  sender: string
  body: string
}

export const inboxCategories: InboxCategory[] = ['All', 'Unread', 'Mentions', 'Important', 'Direct messages']

export const inboxItems: InboxItem[] = [
  { id: 'aandhipe', name: 'AandhiPe Team', initials: 'AP', tone: 'sand', preview: 'Ravi: Shared the updated rollout timeline for review.', time: '9:42 AM', unread: 3, channel: 'aandhipe', important: true, attachment: 'AandhiPe rollout · v3.pdf', sender: 'Ravi Kumar', body: 'The updated rollout timeline is ready. I have marked the regional handoffs and added a short list of launch dependencies for review before Thursday.' },
  { id: 'payments', name: 'Payments Team', initials: 'PY', tone: 'blue', preview: 'Settlement checks are green across all regions.', time: '9:28 AM', unread: 2, channel: 'bpr2002-talab-qi-general', attachment: 'Settlement reconciliation · v4.xlsx', sender: 'Chiranjeevi', body: 'Settlement checks are green across all regions. The reconciliation sheet is attached with the remaining exceptions highlighted.' },
  { id: 'surya', name: 'Surya Venkata', initials: 'SV', tone: 'green', preview: 'Could you confirm the final payment states?', time: '9:16 AM', unread: 1, channel: 'surya', direct: true, mention: true, sender: 'Surya Venkata', body: 'Ganesh, could you confirm the final payment states in the onboarding flow? We are preparing the handoff notes this morning.' },
  { id: 'design', name: 'Design Team', initials: 'DS', tone: 'lilac', preview: 'The new onboarding flow is ready for a final look.', time: '8:54 AM', unread: 0, channel: 'bpr1010-ui-ux', attachment: 'Onboarding flow · Figma link', sender: 'Maha Lakshmi', body: 'The new onboarding flow is ready for a final look. Please check the empty, pending, and completed payment states.' },
  { id: 'management', name: 'Management', initials: 'MG', tone: 'navy', preview: 'Please add your highlights to the weekly brief.', time: '8:31 AM', unread: 0, channel: 'bnprs-announcements', important: true, sender: 'BNPRS People Ops', body: 'Please add your team highlights and key decisions to the weekly brief by 3 PM today. The draft is pinned in the Management space.' },
  { id: 'krishna', name: 'Krishna', initials: 'KR', tone: 'peach', preview: 'I can take the QA handoff this afternoon.', time: 'Yesterday', unread: 0, channel: 'krishna', direct: true, sender: 'Krishna', body: 'I can take the QA handoff this afternoon. Let me know when the release candidate is ready.' },
]

export const unreadInboxCount = inboxItems.reduce((total, item) => total + item.unread, 0)
export const unreadConversationCount = inboxItems.filter((item) => item.unread > 0).length
