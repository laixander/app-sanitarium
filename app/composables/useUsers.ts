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
            // Migrate department to transaction
            users.value = parsed.map((u: any) => {
                const migrated = { ...u }
                
                if ('department' in migrated && !('transaction' in migrated)) {
                    migrated.transaction = migrated.department
                    delete migrated.department
                }
                
                return migrated
            })

        } else {
            users.value = []
        }
    }

    // Sync initial data and localStorage to state
    onMounted(() => {
        reloadUsers()

        // Real-time sync across tabs
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'sanitarium_users') {
                reloadUsers()
            }
        }
        window.addEventListener('storage', onStorage)
        onUnmounted(() => window.removeEventListener('storage', onStorage))

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

    const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        // Find highest existing ID to avoid collisions
        const maxId = users.value.reduce((max, u) => Math.max(max, u.id), 0)
        const id = maxId + 1

        const now = new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        })

        const isAgent = userData.role === 'Agent'
        const newUser: User = {
            ...userData,
            id,
            createdAt: now,
            updatedAt: now,
            createdBy: 'Admin', // Default for now
            updatedBy: 'Admin',
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

            const now = new Date().toLocaleString('en-US', { 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            })

            const hasAssignment = userData.transaction || userData.counter || userData.schedule
            const isFirstAssignment = !user.dateAssigned || user.dateAssigned === '-'

            users.value[index] = {
                ...user,
                ...userData,
                updatedAt: now,
                updatedBy: 'Admin',
                ...(hasAssignment ? (isFirstAssignment ? { dateAssigned: now } : { dateUpdated: now }) : {})
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
