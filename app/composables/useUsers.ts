import type { AppColor } from '~/types/ui'

export interface User {
    id: number
    name: string
    email: string
    role: string
    status: 'Active' | 'Suspended'
    last_login: string
}

export const useUsers = () => {
    const users = useState<User[]>('users', () => [])

    // Initialize users from API if empty
    const { data } = useFetch<User[]>('/api/users')
    
    watch(data, (newData) => {
        if (newData && users.value.length === 0) {
            users.value = [...newData]
        }
    }, { immediate: true })

    const addUser = (userData: Omit<User, 'id' | 'status' | 'last_login'>) => {
        const newUser: User = {
            ...userData,
            id: users.value.length + 1,
            status: 'Active',
            last_login: 'Just Now'
        }
        users.value.unshift(newUser)
    }

    const deleteUser = (id: number) => {
        users.value = users.value.filter(u => u.id !== id)
    }

    const updateUser = (id: number, userData: Partial<Omit<User, 'id'>>) => {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
            const user = users.value[index]
            users.value[index] = { ...user, ...userData } as User
        }
    }

    const getRoleColor = (role: string): AppColor => {
        switch (role) {
            case 'Administrator': return 'violet'
            case 'Supervisor': return 'blue'
            default: return 'neutral'
        }
    }

    return {
        users,
        addUser,
        deleteUser,
        updateUser,
        getRoleColor
    }
}
