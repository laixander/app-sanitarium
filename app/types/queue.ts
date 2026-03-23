import type { AppColor } from '~/types/ui'

export type TicketStatus = 'waiting' | 'serving' | 'missed' | 'completed'

export interface Ticket {
    id: string
    ticket: string
    tags?: string[]
    isHmo?: boolean
    isPriority?: boolean
    status: TicketStatus
    counter?: string
    createdAt?: string
    servedAt?: string
}
