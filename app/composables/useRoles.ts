import type { Role } from '~/types/role'

export const useRoles = () => {
    const roles = useState<Role[]>('roles', () => [])

    // Fetch roles if not already loaded
    useFetch<Role[]>('/api/roles', {
        key: 'roles-data-fetch',
        onResponse({ response }) {
            if (response.status === 200 && roles.value.length === 0) {
                roles.value = response._data || []
            }
        }
    })

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
