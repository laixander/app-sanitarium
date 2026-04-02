import type { AppColor } from '~/types/ui'
import type { TicketStatus } from '~/types/queue'

export const statusColors: Record<string, AppColor> = {
    waiting: 'yellow',
    serving: 'green',
    missed: 'red',
    completed: 'blue',
    held: 'orange',
    skipped: 'slate',
    // Agent Statuses
    Online: 'success',
    Offline: 'neutral',
    'On Break': 'orange',
    'Serving': 'green'
}

export const tagColors: Record<string, AppColor> = {
    'HMO': 'purple',
    'Priority': 'rose'
}
