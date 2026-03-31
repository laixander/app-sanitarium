import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Ticket, TicketStatus } from '~/types/queue'

export const useTickets = () => {
    const tickets = useState<Ticket[]>('tickets', () => [])
    const { logActivity } = useAudits()

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
        } else {
            tickets.value = []
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
            transactionType: data.transactionType,
            tags,
            isHmo: data.paymentMethod === 'HMO/Insurance',
            isPriority: data.isPriority,
            status: 'waiting',
            createdAt: now
        }

        tickets.value = [...tickets.value, newTicket]
        saveToLocal()

        logActivity({
            title: 'Ticket Created',
            description: `New ticket ${data.ticket} generated for ${data.transactionType}`,
            category: 'Queue Management',
            actor: 'Kiosk'
        })

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
                ...(status === 'serving' ? { servedAt: now } : {}),
                ...(status === 'completed' ? { completedAt: now } : {})
            }

            const ticket = tickets.value[index]
            const actionText = status === 'serving' ? 'Called' : (status === 'completed' ? 'Completed' : (status === 'missed' ? 'Marked as No-Show' : (status === 'waiting' ? 'Put Back to Queue' : status)))
            
            logActivity({
                title: `Ticket ${actionText}`,
                description: `Ticket ${ticket?.ticket} ${actionText.toLowerCase()} ${counter ? `at ${counter}` : ''}`,
                category: 'Queue Management',
                actor: counter || 'System'
            })

            saveToLocal()
        }
    }

    const getAverageServiceTime = (counterName?: string) => {
        if (!counterName || counterName === '-') return '0:00'
        
        const completedTickets = tickets.value.filter(
            t => t.status === 'completed' && t.counter === counterName && t.servedAt && t.completedAt
        )
        
        if (completedTickets.length === 0) return '0:00'
        
        const totalMs = completedTickets.reduce((acc, t) => {
            const start = new Date(t.servedAt!).getTime()
            const end = new Date(t.completedAt!).getTime()
            return acc + (end - start)
        }, 0)
        
        const avgMs = totalMs / completedTickets.length
        const avgMin = Math.floor(avgMs / 60000)
        const avgSec = Math.floor((avgMs % 60000) / 1000)
        
        return `${avgMin}:${avgSec.toString().padStart(2, '0')}`
    }

    const getActiveTicket = (counterName?: string) => {
        if (!counterName || counterName === '-') return null
        return tickets.value.find(t => t.status === 'serving' && t.counter === counterName)
    }

    const getServedToday = (counterName?: string) => {
        if (!counterName || counterName === '-') return 0
        return tickets.value.filter(t => t.status === 'completed' && t.counter === counterName).length
    }

    return {
        tickets,
        createTicket,
        updateTicketStatus,
        reloadTickets,
        getAverageServiceTime,
        getActiveTicket,
        getServedToday
    }
}
