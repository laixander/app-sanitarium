import type { AuditLog } from '~/types/audit'

export default defineEventHandler((event) => {
    return [
        {
            id: '1',
            title: 'User Created',
            description: 'Created new agent account for Nurse Lisa Domingo',
            category: 'Account Management',
            actor: 'Admin',
            time: 'Mar 21, 2026, 08:15 AM'
        },
        {
            id: '2',
            title: 'Queue Called',
            description: 'Called ticket CON-001 to Counter 1',
            category: 'Queue Management',
            actor: 'Dr. Maria Rivera',
            time: 'Mar 21, 2026, 08:10 AM'
        },
        {
            id: '3',
            title: 'Counter Activated',
            description: 'Counter 3 activated for Admission transaction',
            category: 'System',
            actor: 'System',
            time: 'Mar 20, 2026, 08:05 AM'
        },
        {
            id: '4',
            title: 'Session Started',
            description: 'Agent logged in and started session at Counter 3',
            category: 'Agent Management',
            actor: 'Mr. Jose Villanueva',
            time: 'Mar 20, 2026, 08:00 AM'
        },
        {
            id: '5',
            title: 'No-Show Detected',
            description: 'Ticket ADM-002 marked as No-Show after 15 min wait',
            category: 'Queue Management',
            actor: 'System',
            time: 'Mar 20, 2026, 07:55 AM'
        },
        {
            id: '6',
            title: 'Config Updated',
            description: 'Updated queue priority rules for Senior/PWD',
            category: 'System Configuration',
            actor: 'Admin',
            time: 'Mar 19, 2026, 07:50 AM'
        },
        {
            id: '7',
            title: 'Queue Completed',
            description: 'Completed ticket OUT-001 at Counter 2',
            category: 'Queue Management',
            actor: 'Nurse Ana Bautista',
            time: 'Mar 19, 2026, 07:45 AM'
        },
        {
            id: '8',
            title: 'Role Updated',
            description: 'Changed Dr. Maria Rivera role to Supervisor',
            category: 'Account Management',
            actor: 'Admin',
            time: 'Mar 19, 2026, 07:30 AM'
        },
        {
            id: '9',
            title: 'Inventory Alert',
            description: 'Medical supplies for Station A reaching low threshold',
            category: 'Inventory',
            actor: 'System',
            time: 'Mar 18, 2026, 11:45 PM'
        },
        {
            id: '10',
            title: 'Patient Admitted',
            description: 'New admission processed for Room 402',
            category: 'Patient Care',
            actor: 'Nurse Joy Sanchez',
            time: 'Mar 18, 2026, 10:20 PM'
        },
        {
            id: '11',
            title: 'Baggage Checked',
            description: 'Security clearance completed for storage unit B-12',
            category: 'Security',
            actor: 'Officer Tan',
            time: 'Mar 18, 2026, 09:15 PM'
        },
        {
            id: '12',
            title: 'Schedule Modified',
            description: 'Shift rotation updated for next week',
            category: 'Staffing',
            actor: 'HR Manager',
            time: 'Mar 18, 2026, 05:30 PM'
        },
        {
            id: '13',
            title: 'Logon Failure',
            description: 'Multiple failed attempts for user guest_01',
            category: 'Security',
            actor: 'System',
            time: 'Mar 18, 2026, 03:00 PM'
        },
        {
            id: '14',
            title: 'Feedback Received',
            description: 'Patient survey submitted for outpatient clinic',
            category: 'Quality Assurance',
            actor: 'Anonymous',
            time: 'Mar 18, 2026, 01:15 PM'
        },
        {
            id: '15',
            title: 'Maintenance Logged',
            description: 'AC unit in Lobby serviced',
            category: 'Facilities',
            actor: 'Engr. Santos',
            time: 'Mar 18, 2026, 10:00 AM'
        },
        {
            id: '16',
            title: 'Billing Finalized',
            description: 'Invoice #INV-992 paid via insurance',
            category: 'Finance',
            actor: 'Cashier May',
            time: 'Mar 18, 2026, 09:30 AM'
        },
        {
            id: '17',
            title: 'Backup Completed',
            description: 'Full system backup stored on cloud storage',
            category: 'System',
            actor: 'System',
            time: 'Mar 18, 2026, 02:00 AM'
        },
        {
            id: '18',
            title: 'Script Executed',
            description: 'Daily database optimization script finished',
            category: 'System',
            actor: 'System',
            time: 'Mar 18, 2026, 01:00 AM'
        }
    ] as AuditLog[]
})
