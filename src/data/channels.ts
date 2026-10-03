import type { Channel } from '../types'

export const pinnedChannels: Channel[] = [
  { id: 'ramaiah', name: 'Ramaiah N', unread: 2 },
  { id: 'krishna', name: 'Krishna', unread: 0 },
  { id: 'ranjith', name: 'Ranjith Kumar Jakku', unread: 1 },
  { id: 'uxui', name: 'bpr1010-ux-ui-general', unread: 6 },
  { id: 'surya', name: 'Surya Venkata Ratnam Borusu', unread: 0 },
  { id: 'satya', name: 'Satya Kalki Pinisetti', unread: 2 },
  { id: 'venkatesh', name: 'Venkatesh Kola', unread: 0 },
]

export const conversationChannels: Channel[] = [
  { id: 'bpr2002-talab-qi-general', name: '# bpr2002-talab-qi-general', unread: 4 },
  { id: 'bpr1010-hr-general', name: '# bpr1010-hr-general', unread: 1 },
  { id: 'bnprs-announcements', name: '# bnprs-announcements', unread: 8 },
  { id: 'bpr1010-release-management', name: '# bpr1010-release-management', unread: 0 },
  { id: 'bpr1010-vibe-coding', name: '# bpr1010-vibe-coding', unread: 3 },
  { id: 'bpr1010-sprint-planning', name: '# bpr1010-sprint-planning', unread: 2 },
  { id: 'bpr1010-sprint-backlog-refinement', name: '# bpr1010-sprint-backlog-refinement', unread: 2 },
  { id: 'bnprs-chit-chat', name: '# bnprs-chit-chat', unread: 0 },
  { id: 'bnprs-general', name: '# bnprs-general', unread: 5 },
  { id: 'bpr1010-ui-ux', name: '# bpr1010-ui-ux', unread: 0, private: true },
  { id: 'bpr1010-development', name: '# bpr1010-development', unread: 3, private: true },
  { id: 'aandhipe', name: '# aandhipe', unread: 0 },
  { id: 'gff-2026', name: '# gff-2026', unread: 2 },
]

export const channelThread = {
  title: 'Tasks — #bpr1010-sprint-planning',
  unread: 1,
}
