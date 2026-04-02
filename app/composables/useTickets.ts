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
                // Only reload if the data has actually changed string-wise to avoid redundant re-renders
                const current = localStorage.getItem('sanitarium_tickets')
                if (current && current !== JSON.stringify(tickets.value)) {
                    reloadTickets()
                }
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

    const averagesByCounter = computed(() => {
        const map = new Map<string, string>()
        const completed = tickets.value.filter(t => t.status === 'completed' && t.counter)
        
        const grouped = completed.reduce((acc, t) => {
            const counter = t.counter!
            if (!acc[counter]) acc[counter] = []
            acc[counter].push(t)
            return acc
        }, {} as Record<string, Ticket[]>)
        
        for (const [counter, items] of Object.entries(grouped)) {
            const totalMs = items.reduce((sum, t) => sum + (t.accumulatedServiceDuration || 0), 0)
            const avgMs = totalMs / items.length
            const avgMin = Math.floor(avgMs / 60000)
            const avgSec = Math.floor((avgMs % 60000) / 1000)
            map.set(counter, `${avgMin}:${avgSec.toString().padStart(2, '0')}`)
        }
        
        return map
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
        else tags.push('Regular')

        const newTicket: Ticket = {
            id,
            ticket: data.ticket,
            transactionType: data.transactionType,
            tags,
            isHmo: data.paymentMethod === 'HMO/Insurance',
            isPriority: data.isPriority,
            isRegular: !data.isPriority,
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

    const updateTicketStatus = (id: string, status: TicketStatus, counter?: string, reason?: string) => {
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const ticket = tickets.value[index]!
            const now = new Date().toISOString()
            
            let extraDuration = 0
            if (ticket.status === 'serving' && ticket.servedAt) {
                extraDuration = Date.now() - new Date(ticket.servedAt).getTime()
            }

            tickets.value[index] = {
                ...ticket,
                status,
                accumulatedServiceDuration: (ticket.accumulatedServiceDuration || 0) + extraDuration,
                ...(counter ? { counter } : {}),
                ...(reason ? { reason } : {}),
                ...(status === 'serving' ? { calledAt: ticket.calledAt || now } : {}),
                ...(status === 'completed' ? { completedAt: now } : {})
            }

            const actionText = status === 'serving' ? 'Called' : (status === 'completed' ? 'Completed' : (status === 'missed' ? 'Marked as No-Show' : (status === 'waiting' ? 'Put Back to Queue' : status)))
            
            logActivity({
                title: `Ticket ${actionText}`,
                description: `Ticket ${ticket?.ticket} ${actionText.toLowerCase()}${counter ? ` at ${counter}` : ''}${reason ? ` - Reason: ${reason}` : ''}`,
                category: 'Queue Management',
                actor: counter || 'System'
            })

            saveToLocal()
        }
    }

    const startTicket = (id: string) => {
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const now = new Date().toISOString()
            tickets.value[index] = {
                ...tickets.value[index]!,
                servedAt: now
            }
            
            logActivity({
                title: 'Ticket Started',
                description: `Service started for Ticket ${tickets.value[index]?.ticket}`,
                category: 'Queue Management',
                actor: tickets.value[index]?.counter || 'System'
            })
            
            saveToLocal()
        }
    }

    const skipTicket = (id: string, reason?: string) => {
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const ticket = tickets.value[index]!
            
            let extraDuration = 0
            if (ticket.status === 'serving' && ticket.servedAt) {
                extraDuration = Date.now() - new Date(ticket.servedAt).getTime()
            }

            tickets.value[index] = {
                ...ticket,
                status: 'skipped',
                accumulatedServiceDuration: (ticket.accumulatedServiceDuration || 0) + extraDuration,
                ...(reason ? { reason } : {})
            }

            logActivity({
                title: 'Ticket Skipped',
                description: `Ticket ${ticket.ticket} skipped and moved to local on-hold list${reason ? ` - Reason: ${reason}` : ''}`,
                category: 'Queue Management',
                actor: ticket.counter || 'System'
            })

            saveToLocal()
        }
    }

    const holdTicket = (id: string, reason?: string) => {
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const ticket = tickets.value[index]!
            const now = new Date().toISOString()

            let extraDuration = 0
            if (ticket.status === 'serving' && ticket.servedAt) {
                extraDuration = Date.now() - new Date(ticket.servedAt).getTime()
            }

            tickets.value[index] = {
                ...ticket,
                status: 'held',
                heldAt: now,
                accumulatedServiceDuration: (ticket.accumulatedServiceDuration || 0) + extraDuration,
                ...(reason ? { reason } : {})
            }

            logActivity({
                title: 'Ticket On Hold',
                description: `Ticket ${ticket.ticket} placed on hold${reason ? ` - Reason: ${reason}` : ''}`,
                category: 'Queue Management',
                actor: ticket.counter || 'System'
            })

            saveToLocal()
        }
    }

    const getAverageServiceTime = (counterName?: string) => {
        if (!counterName || counterName === '-') return '0:00'
        return averagesByCounter.value.get(counterName) || '0:00'
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
        startTicket,
        skipTicket,
        holdTicket,
        reloadTickets,
        getAverageServiceTime,
        averagesByCounter,
        getActiveTicket,
        getServedToday
    }
}
