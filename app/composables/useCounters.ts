import type { Counter } from '~/types/counter'

export const useCounters = () => {
    const { logActivity } = useAudits()
    const counters = useState<Counter[]>('counters', () => [])

    const reloadCounters = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_counters')
        if (saved) {
            counters.value = JSON.parse(saved)
        } else {
            counters.value = []
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

        logActivity({
            title: 'Counter Created',
            description: `New counter '${data.name}' was added to the system`,
            category: 'Assignment Management',
            actor: 'Admin'
        })
    }

    const updateCounter = (id: string, data: Partial<Omit<Counter, 'id'>>) => {
        const index = counters.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const counter = counters.value[index]
            counters.value[index] = { ...counter, ...data } as Counter
            saveToLocal()

            logActivity({
                title: 'Counter Updated',
                description: `Counter '${counter?.name}' details were modified`,
                category: 'Assignment Management',
                actor: 'Admin'
            })
        }
    }

    const deleteCounter = (id: string) => {
        const counter = counters.value.find(t => t.id === id)
        counters.value = counters.value.filter(t => t.id !== id)
        saveToLocal()

        if (counter) {
            logActivity({
                title: 'Counter Deleted',
                description: `Counter '${counter.name}' was removed from the system`,
                category: 'Assignment Management',
                actor: 'Admin'
            })
        }
    }

    return {
        counters,
        addCounter,
        updateCounter,
        deleteCounter,
        reloadCounters
    }
}
