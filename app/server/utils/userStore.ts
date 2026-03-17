import type { User } from '~/types/ui'

const users: User[] = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@ssgh.ph',
        role: 'Administrator',
        status: 'Active',
        last_login: 'Mar 16, 8:00 AM'
    },
    {
        id: 2,
        name: 'Dr. Maria Rivera',
        email: 'm.rivera@ssgh.ph',
        role: 'Supervisor',
        status: 'Active',
        last_login: 'Mar 16, 7:30 AM'
    },
    {
        id: 3,
        name: 'Nurse Ana Bautista',
        email: 'a.bautista@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 7:00 AM'
    },
    {
        id: 4,
        name: 'Mr. Jose Villanueva',
        email: 'j.villanueva@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 8:00 AM'
    },
    {
        id: 5,
        name: 'Ms. Clara Santiago',
        email: 'c.santiago@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 7:00 AM'
    },
    {
        id: 6,
        name: 'Mr. Ramon Aquino',
        email: 'r.aquino@ssgh.ph',
        role: 'Agent',
        status: 'Suspended',
        last_login: 'Mar 15, 4:00 PM'
    },
    {
        id: 7,
        name: 'Ms. Elena Cruz',
        email: 'e.cruz@ssgh.ph',
        role: 'Supervisor',
        status: 'Active',
        last_login: 'Mar 16, 9:00 AM'
    },
    {
        id: 8,
        name: 'Mr. Roberto Gomez',
        email: 'r.gomez@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 8:45 AM'
    },
    {
        id: 9,
        name: 'Dr. Francis Santos',
        email: 'f.santos@ssgh.ph',
        role: 'Administrator',
        status: 'Active',
        last_login: 'Mar 16, 10:00 AM'
    },
    {
        id: 10,
        name: 'Nurse Laila Reyes',
        email: 'l.reyes@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 6:30 AM'
    },
    {
        id: 11,
        name: 'Mr. Antonio Luna',
        email: 'a.luna@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 11:00 AM'
    },
    {
        id: 12,
        name: 'Ms. Patricia Lim',
        email: 'p.lim@ssgh.ph',
        role: 'Supervisor',
        status: 'Active',
        last_login: 'Mar 16, 8:15 AM'
    },
    {
        id: 13,
        name: 'Mr. Miguel Ramos',
        email: 'm.ramos@ssgh.ph',
        role: 'Agent',
        status: 'Suspended',
        last_login: 'Mar 14, 2:00 PM'
    },
    {
        id: 14,
        name: 'Dr. Sarah Tan',
        email: 's.tan@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 12:00 PM'
    },
    {
        id: 15,
        name: 'Nurse Kevin Lee',
        email: 'k.lee@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 5:00 AM'
    },
    {
        id: 16,
        name: 'Ms. Jasmine Diaz',
        email: 'j.diaz@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 1:00 PM'
    },
    {
        id: 17,
        name: 'Mr. David Wilson',
        email: 'd.wilson@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 2:30 PM'
    },
    {
        id: 18,
        name: 'Ms. Linda Garcia',
        email: 'l.garcia@ssgh.ph',
        role: 'Supervisor',
        status: 'Active',
        last_login: 'Mar 16, 3:45 PM'
    },
    {
        id: 19,
        name: 'Mr. Peter Parker',
        email: 'p.parker@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 4:00 PM'
    },
    {
        id: 20,
        name: 'Ms. Mary Jane Watson',
        email: 'mj.watson@ssgh.ph',
        role: 'Agent',
        status: 'Active',
        last_login: 'Mar 16, 4:15 PM'
    }
]

export const getUsersStore = () => {
    return users
}

export const addUserToStore = (userData: Omit<User, 'id' | 'status' | 'last_login'>) => {
    const newUser: User = {
        ...userData,
        id: users.length + 1,
        status: 'Active',
        last_login: 'Just Now'
    }
    users.unshift(newUser)
    return newUser
}
