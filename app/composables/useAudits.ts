export interface AuditLog {
    id: string
    title: string
    description: string
    category: string
    actor: string
    time: string
}

export const useAudits = () => {
    const audits = ref<AuditLog[]>([
        {
            id: '1',
            title: 'User Created',
            description: 'Created new agent account for Nurse Lisa Domingo',
            category: 'Account Management',
            actor: 'Admin',
            time: '8:15 AM'
        },
        {
            id: '2',
            title: 'Queue Called',
            description: 'Called ticket CON-001 to Counter 1',
            category: 'Queue Management',
            actor: 'Dr. Maria Rivera',
            time: '8:10 AM'
        },
        {
            id: '3',
            title: 'Counter Activated',
            description: 'Counter 3 activated for Admission department',
            category: 'System',
            actor: 'System',
            time: '8:05 AM'
        },
        {
            id: '4',
            title: 'Session Started',
            description: 'Agent logged in and started session at Counter 3',
            category: 'Agent Management',
            actor: 'Mr. Jose Villanueva',
            time: '8:00 AM'
        },
        {
            id: '5',
            title: 'No-Show Detected',
            description: 'Ticket ADM-002 marked as No-Show after 15 min wait',
            category: 'Queue Management',
            actor: 'System',
            time: '7:55 AM'
        },
        {
            id: '6',
            title: 'Config Updated',
            description: 'Updated queue priority rules for Senior/PWD',
            category: 'System Configuration',
            actor: 'Admin',
            time: '7:50 AM'
        },
        {
            id: '7',
            title: 'Queue Completed',
            description: 'Completed ticket OUT-001 at Counter 2',
            category: 'Queue Management',
            actor: 'Nurse Ana Bautista',
            time: '7:45 AM'
        },
        {
            id: '8',
            title: 'Role Updated',
            description: 'Changed Dr. Maria Rivera role to Supervisor',
            category: 'Account Management',
            actor: 'Admin',
            time: '7:30 AM'
        }
    ])

    return {
        audits
    }
}
