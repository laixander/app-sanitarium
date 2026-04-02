import type { AppColor } from '~/types/ui'

export type TicketStatus = 'waiting' | 'serving' | 'missed' | 'completed' | 'held' | 'skipped'

export interface Ticket {
    id: string
    ticket: string
    transactionType?: string
    tags?: string[]
    isHmo?: boolean
    isPriority?: boolean
    isRegular?: boolean
    status: TicketStatus
    counter?: string
    createdAt?: string
    calledAt?: string
    heldAt?: string
    servedAt?: string
    completedAt?: string
    accumulatedServiceDuration?: number
    reason?: string
}
