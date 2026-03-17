export interface Role {
    title: string
    userCount: number
    permissions: string[]
}

export const useRoles = () => {
    const roles = useState<Role[]>('roles', () => [
        {
            title: 'Administrator',
            userCount: 1,
            permissions: ['Full System Access', 'User Management', 'Configuration', 'Audit Logs', 'Reports']
        },
        {
            title: 'Supervisor',
            userCount: 2,
            permissions: ['Queue Management', 'Agent Management', 'Reports', 'Feedback']
        },
        {
            title: 'Agent',
            userCount: 8,
            permissions: ['Queue Operations', 'Customer Service', 'View Own Stats']
        },
        {
            title: 'Kiosk',
            userCount: 3,
            permissions: ['Ticket Generation', 'Queue Display']
        }
    ])

    const addRole = (roleData: Omit<Role, 'userCount'>) => {
        const newRole: Role = {
            ...roleData,
            userCount: 0
        }
        roles.value.push(newRole)
    }

    const deleteRole = (title: string) => {
        roles.value = roles.value.filter(r => r.title !== title)
    }

    const updateRole = (oldTitle: string, newRoleData: Partial<Role>) => {
        const index = roles.value.findIndex(r => r.title === oldTitle)
        if (index !== -1) {
            roles.value[index] = { ...roles.value[index], ...newRoleData } as Role
        }
    }

    return {
        roles,
        addRole,
        deleteRole,
        updateRole
    }
}
