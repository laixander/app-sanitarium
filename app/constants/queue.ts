import type { AppColor } from '~/types/ui'
import type { TicketStatus } from '~/types/queue'

export const statusColors: Record<TicketStatus, AppColor> = {
    waiting: 'yellow',
    serving: 'green',
    missed: 'red',
    completed: 'blue'
}

export const tagColors: Record<string, AppColor> = {
    'HMO': 'purple',
    'Priority': 'rose'
}
