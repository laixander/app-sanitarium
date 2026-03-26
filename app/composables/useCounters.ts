import type { Counter } from '~/types/counter'

export const useCounters = () => {
    const counters = useState<Counter[]>('counters', () => [])

    const reloadCounters = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_counters')
        if (saved) {
            counters.value = JSON.parse(saved)
        } else {
            // Default ones
            counters.value = [
                { id: '1', name: 'Counter 1', description: 'Main reception counter', color: 'blue', agent: 'Maria Santos', transactions: ['Consultation', 'Admission'] },
                { id: '2', name: 'Counter 2', description: 'Secondary reception counter', color: 'indigo', agent: 'Juan Cruz', transactions: ['Consultation', 'Outpatient'] },
                { id: '3', name: 'Counter 3', description: 'Billing and outpatient services', color: 'teal', agent: 'Ana Reyes', transactions: ['Billing', 'Outpatient'] },
            ]
            saveToLocal()
        }
    }

    onMounted(() => {
        reloadCounters()
    })

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_counters', JSON.stringify(counters.value))
        }
    }

    const addCounter = (data: Omit<Counter, 'id'>) => {
        const id = Date.now().toString()
        counters.value = [...counters.value, { ...data, id }]
        saveToLocal()
    }

    const updateCounter = (id: string, data: Partial<Omit<Counter, 'id'>>) => {
        const index = counters.value.findIndex(t => t.id === id)
        if (index !== -1) {
            counters.value[index] = { ...counters.value[index], ...data } as Counter
            saveToLocal()
        }
    }

    const deleteCounter = (id: string) => {
        counters.value = counters.value.filter(t => t.id !== id)
        saveToLocal()
    }

    return {
        counters,
        addCounter,
        updateCounter,
        deleteCounter,
        reloadCounters
    }
}
