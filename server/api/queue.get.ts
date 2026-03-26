import type { Ticket } from '~/types/queue'

export default defineEventHandler((event) => {
    const queueData: Ticket[] = [
        { id: '1', ticket: 'C-001', transactionType: 'Consultation', createdAt: '2026-03-24T12:00:00+08:00', tags: ['HMO', 'Priority'], status: 'waiting' },
        { id: '2', ticket: 'C-002', transactionType: 'Consultation', createdAt: '2026-03-24T14:10:00+08:00', tags: ['HMO'], status: 'waiting' },
        { id: '3', ticket: 'P-001', transactionType: 'Outpatient', createdAt: '2026-03-24T13:45:00+08:00', tags: ['Priority'], status: 'serving', counter: '3', servedAt: '2026-03-24T14:15:00+08:00' },
        { id: '4', ticket: 'B-001', transactionType: 'Billing', createdAt: '2026-03-24T13:30:00+08:00', tags: [], status: 'missed', counter: '3', servedAt: '2026-03-24T14:00:00+08:00' },
        { id: '5', ticket: 'B-002', transactionType: 'Billing', createdAt: '2026-03-24T13:15:00+08:00', tags: ['HMO', 'Priority'], status: 'completed', counter: '3', servedAt: '2026-03-24T13:45:00+08:00' },
        { id: '6', ticket: 'C-003', transactionType: 'Consultation', createdAt: '2026-03-24T13:15:00+08:00', tags: [], status: 'completed', counter: '1', servedAt: '2026-03-24T13:45:00+08:00' },
        { id: '7', ticket: 'C-004', transactionType: 'Consultation', createdAt: '2026-03-24T13:15:00+08:00', tags: [], status: 'serving', counter: '1', servedAt: '2026-03-24T13:45:00+08:00' },
        { id: '8', ticket: 'P-002', transactionType: 'Outpatient', createdAt: '2026-03-24T13:15:00+08:00', tags: [], status: 'waiting', counter: '1', servedAt: '2026-03-24T13:45:00+08:00' }
    ]
    return queueData
})
