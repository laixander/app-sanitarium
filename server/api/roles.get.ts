import type { Role } from '~/types/role'

export default defineEventHandler((event) => {
    return [
        {
            title: 'Administrator',
            userCount: 1,
            permissions: ['Full System Access', 'User Management', 'Configuration', 'Audit Logs', 'Reports'],
            color: 'violet'
        },
        {
            title: 'Supervisor',
            userCount: 2,
            permissions: ['Queue Management', 'Agent Management', 'Reports', 'Feedback'],
            color: 'blue'
        },
        {
            title: 'Agent',
            userCount: 8,
            permissions: ['Queue Operations', 'Customer Service', 'View Own Stats'],
            color: 'neutral'
        },
        {
            title: 'Kiosk',
            userCount: 3,
            permissions: ['Ticket Generation', 'Queue Display'],
            color: 'amber'
        }
    ] as Role[]
})
