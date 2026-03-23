import type { Ticket } from '~/types/queue'

export default defineEventHandler((event) => {
    const queueData: Ticket[] = [
        { id: '1', ticket: 'P-123', createdAt: '2026-03-23T12:00:00+08:00', tags: ['HMO', 'Priority'], status: 'waiting' },
        { id: '2', ticket: 'P-124', createdAt: '2026-03-23T14:10:00+08:00', tags: ['HMO'], status: 'waiting' },
        { id: '3', ticket: 'P-125', createdAt: '2026-03-23T13:45:00+08:00', tags: ['Priority'], status: 'serving', counter: '3', servedAt: '2026-03-23T14:15:00+08:00' },
        { id: '4', ticket: 'B-126', createdAt: '2026-03-23T13:30:00+08:00', tags: [], status: 'missed', counter: '3', servedAt: '2026-03-23T14:00:00+08:00' },
        { id: '5', ticket: 'B-127', createdAt: '2026-03-23T13:15:00+08:00', tags: ['HMO', 'Priority'], status: 'completed', counter: '3', servedAt: '2026-03-23T13:45:00+08:00' }
    ]

    return queueData
})
