import type { User } from '~/types/user'

export const useUsers = () => {
    const users = useState<User[]>('users', () => [])

    // Initialize users from API if empty
    const { data: initialUsers } = useFetch<User[]>('/api/users', {
        key: 'users-data-fetch',
        immediate: users.value.length === 0
    })

    const reloadUsers = () => {
        if (!import.meta.client) return

        // Load from localStorage first
        const saved = localStorage.getItem('sanitarium_users')
        if (saved) {
            const parsed = JSON.parse(saved)
            // Migrate last_login to lastLogin and department to transaction
            users.value = parsed.map((u: any) => {
                const migrated = { ...u }
                
                if ('last_login' in migrated && !('lastLogin' in migrated)) {
                    migrated.lastLogin = migrated.last_login
                    delete migrated.last_login
                }
                
                if ('department' in migrated && !('transaction' in migrated)) {
                    migrated.transaction = migrated.department
                    delete migrated.department
                }
                
                return migrated
            })

        }
    }

    // Sync initial data and localStorage to state
    onMounted(() => {
        reloadUsers()

        // Watch initial API users and merge if needed
        watch(initialUsers, (newData) => {
            if (newData) {
                const existingIds = new Set(users.value.map(u => u.id))
                const usersToAdd = newData.filter(u => !existingIds.has(u.id))
                if (usersToAdd.length > 0) {
                    users.value = [...users.value, ...usersToAdd]
                    localStorage.setItem('sanitarium_users', JSON.stringify(users.value))
                }
            }
        }, { immediate: true })
    })

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_users', JSON.stringify(users.value))
        }
    }

    const addUser = (userData: Omit<User, 'id' | 'status' | 'lastLogin'>) => {
        // Find highest existing ID to avoid collisions
        const maxId = users.value.reduce((max, u) => Math.max(max, u.id), 0)
        const id = maxId + 1

        const isAgent = userData.role === 'Agent'
        const newUser: User = {
            ...userData,
            id,
            status: 'Active',
            lastLogin: 'Just Now',
            ...(isAgent ? {
                code: `AGT${String(id).padStart(3, '0')}`,
                agentStatus: 'Offline',
                served: 0,
                avgService: '0:00'
            } : {})
        }
        users.value = [newUser, ...users.value]
        saveToLocal()
    }

    const deleteUser = (id: number) => {
        users.value = users.value.filter(u => u.id !== id)
        saveToLocal()
    }

    const updateUser = (id: number, userData: Partial<Omit<User, 'id'>>) => {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
            const user = users.value[index]
            if (!user) return
            const hasAssignment = userData.transaction || userData.counter || userData.schedule
            const isFirstAssignment = !user.dateAssigned || user.dateAssigned === '-'

            users.value[index] = {
                ...user,
                ...userData,
                ...(hasAssignment ? (isFirstAssignment ? { dateAssigned: 'Just Now' } : { dateUpdated: 'Just Now' }) : {})
            } as User
            saveToLocal()
        }
    }

    const assignCounter = (id: number, counter: string) => {
        updateUser(id, { counter, agentStatus: 'Online' })
    }

    const setOnBreak = (id: number) => {
        updateUser(id, { agentStatus: 'On Break', ticket: '-' })
    }

    const forceLogout = (id: number) => {
        updateUser(id, { agentStatus: 'Offline', counter: '-', ticket: '-' })
    }

    return {
        users,
        addUser,
        deleteUser,
        updateUser,
        assignCounter,
        setOnBreak,
        forceLogout,
        reloadUsers
    }
}
