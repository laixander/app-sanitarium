import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Ticket, TicketStatus } from '~/types/queue'

export const useTickets = () => {
    const tickets = useState<Ticket[]>('tickets', () => [])

    // Initialize tickets from API if empty
    const { data: initialTickets } = useFetch<Ticket[]>('/api/queue', {
        key: 'tickets-data-fetch',
        immediate: tickets.value.length === 0
    })

    const reloadTickets = () => {
        if (!import.meta.client) return

        // Load from localStorage
        const saved = localStorage.getItem('sanitarium_tickets')
        if (saved) {
            tickets.value = JSON.parse(saved)
        }
    }

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_tickets', JSON.stringify(tickets.value))
        }
    }

    // Initialize
    onMounted(() => {
        reloadTickets()

        // Real-time sync across tabs
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'sanitarium_tickets') {
                reloadTickets()
            }
        }
        window.addEventListener('storage', onStorage)
        onUnmounted(() => window.removeEventListener('storage', onStorage))

        // Sync initial API data if no local data exists
        watch(initialTickets, (newData) => {
            if (newData && tickets.value.length === 0) {
                tickets.value = newData
                saveToLocal()
            }
        }, { immediate: true })
    })

    const createTicket = (data: { 
        ticket: string, 
        transactionType: string, 
        paymentMethod: string, 
        isPriority: boolean 
    }) => {
        const id = String(Date.now())
        const now = new Date().toISOString()
        
        const tags = []
        if (data.paymentMethod === 'HMO/Insurance') tags.push('HMO')
        if (data.isPriority) tags.push('Priority')

        const newTicket: Ticket = {
            id,
            ticket: data.ticket,
            tags,
            isHmo: data.paymentMethod === 'HMO/Insurance',
            isPriority: data.isPriority,
            status: 'waiting',
            createdAt: now
        }

        tickets.value = [...tickets.value, newTicket]
        saveToLocal()
        return newTicket
    }

    const updateTicketStatus = (id: string, status: TicketStatus, counter?: string) => {
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const now = new Date().toISOString()
            tickets.value[index] = {
                ...tickets.value[index]!,
                status,
                ...(counter ? { counter } : {}),
                ...(status === 'serving' ? { servedAt: now } : {})
            }
            saveToLocal()
        }
    }

    return {
        tickets,
        createTicket,
        updateTicketStatus,
        reloadTickets
    }
}
