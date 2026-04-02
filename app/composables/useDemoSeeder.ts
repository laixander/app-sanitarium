import { type User } from '~/types/user'
import { type Ticket } from '~/types/queue'
import { type Counter } from '~/types/counter'
import { type Feedback } from './useFeedback'

export const useDemoSeeder = () => {
    const { tickets, reloadTickets } = useTickets()
    const { users, reloadUsers } = useUsers()
    const { feedbackList, reloadFeedback } = useFeedback()
    const { counters, reloadCounters } = useCounters()
    const { transactions, reloadTransactions } = useTransactions()
    const { reloadSettings: reloadKioskSettings } = useKioskSettings()
    const { reloadSettings: reloadFeedbackSettings } = useFeedbackSettings()

    const resetAll = () => {
        if (!import.meta.client) return
        console.log('Resetting all demo data...')
        
        localStorage.removeItem('sanitarium_tickets')
        localStorage.removeItem('sanitarium_users')
        localStorage.removeItem('sanitarium_feedback')
        localStorage.removeItem('sanitarium_counters')
        localStorage.removeItem('sanitarium_transactions')
        localStorage.removeItem('sanitarium_kiosk_flows')
        localStorage.removeItem('sanitarium_active_flow_id')
        localStorage.removeItem('sanitarium_feedback_settings')

        // Reload all composables to clear state
        reloadTickets()
        reloadUsers()
        reloadFeedback()
        reloadCounters()
        reloadTransactions()
        reloadKioskSettings()
        reloadFeedbackSettings()
        console.log('System reset complete.')
    }

    const seedAll = () => {
        if (!import.meta.client) return
        console.log('Starting demo data seeding...')

        const now = new Date()
        const getPastDate = (minutesAgo: number) => {
            const d = new Date(now.getTime() - minutesAgo * 60000)
            return d.toISOString()
        }

        const formatPrettyDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleString('en-US', { 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            })
        }

        // 1. Seed Transactions (Ensuring we have the basics)
        const demoTransactions = [
            { id: '1', name: 'Consultation', code: 'C', description: 'Patient seeing a doctor', color: 'sky' as const, icon: 'i-lucide-stethoscope' },
            { id: '2', name: 'Admission', code: 'A', description: 'Admitting a patient', color: 'pink' as const, icon: 'i-lucide-bed-double' },
            { id: '3', name: 'Billing', code: 'B', description: 'Paying for services', color: 'teal' as const, icon: 'i-lucide-credit-card' },
            { id: '4', name: 'Outpatient', code: 'O', description: 'Outpatient care and services', color: 'indigo' as const, icon: 'i-lucide-clipboard-list' }
        ]
        localStorage.setItem('sanitarium_transactions', JSON.stringify(demoTransactions))

        // 2. Seed Counters
        const demoCounters: Counter[] = Array.from({ length: 8 }, (_, i) => ({
            id: String(i + 1),
            name: `Counter 0${i + 1}`,
            description: `Service Station ${i + 1}`,
            color: (['sky', 'pink', 'teal', 'indigo', 'orange', 'emerald', 'rose', 'violet'][i % 8]) as any,
            transactions: [demoTransactions[i % demoTransactions.length]!.name]
        }))
        localStorage.setItem('sanitarium_counters', JSON.stringify(demoCounters))

        // 3. Seed Users/Agents
        const agentNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'Diana Prince', 'Edward Norton', 'Fiona Apple', 'George Costanza', 'Hubert Farnsworth']
        const demoUsers: User[] = [
            {
                id: 1,
                name: 'Administrator',
                email: 'admin@sanitarium.com',
                role: 'Admin',
                createdAt: formatPrettyDate(getPastDate(1440)),
                updatedAt: formatPrettyDate(getPastDate(1440)),
                createdBy: 'System',
                updatedBy: 'System'
            },
            ...agentNames.map((name, i) => {
                const id = i + 2
                const isOnline = i < 8
                const isServing = i < 5
                const isOnBreak = i === 6
                
                return {
                    id,
                    name,
                    email: `${name.toLowerCase().replace(' ', '.')}@sanitarium.com`,
                    role: 'Agent',
                    code: `AGT${String(id).padStart(3, '0')}`,
                    agentStatus: (isOnBreak ? 'On Break' : (isServing ? 'Serving' : (isOnline ? 'Online' : 'Offline'))) as any,
                    counter: isOnline ? demoCounters[i]?.name : '-',
                    transaction: demoTransactions[i % demoTransactions.length]?.name,
                    createdAt: formatPrettyDate(getPastDate(720)),
                    updatedAt: formatPrettyDate(getPastDate(60)),
                    createdBy: 'Admin',
                    updatedBy: 'Admin',
                    served: Math.floor(Math.random() * 50) + 10,
                    avgService: `${Math.floor(Math.random() * 10) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                    dateAssigned: formatPrettyDate(getPastDate(720)),
                    schedule: '08:00 AM - 05:00 PM'
                } as User
            })
        ]
        localStorage.setItem('sanitarium_users', JSON.stringify(demoUsers))

        // 4. Seed Tickets
        const demoTickets: Ticket[] = []
        const reasonPresets = {
            missed: ['Not physically present', 'Did not respond after 3 calls', 'Left premises'],
            held: ['Incomplete requirements', 'Waiting for payment/approval', 'Emergency pause'],
            skipped: ['Wrong counter / transaction', 'System error', 'Requested skip by patient']
        }
        
        // Generate ~150 completed tickets (for analytics)
        for (let i = 0; i < 150; i++) {
            const transaction = demoTransactions[i % demoTransactions.length]!
            const letter = transaction.code
            const num = String(i + 1).padStart(3, '0')
            const minutesAgo = Math.floor(Math.random() * 480) + 30 // Last 8 hours
            const serviceTime = (Math.floor(Math.random() * 15) + 3) * 60000 // In ms
            
            const createdAt = getPastDate(minutesAgo)
            const servedAt = getPastDate(minutesAgo - 2)
            const completedAt = getPastDate(minutesAgo - 2 - (serviceTime / 60000))
            
            const agent = demoUsers.filter(u => u.role === 'Agent')[i % agentNames.length]!
            
            const isPriority = Math.random() > 0.8
            const isHmo = Math.random() > 0.7
            const isRegular = !isPriority
            const tags = []
            if (isPriority) tags.push('Priority')
            if (isHmo) tags.push('HMO')
            if (isRegular) tags.push('Regular')

            demoTickets.push({
                id: `hist-${i}`,
                ticket: `${letter}${num}`,
                transactionType: transaction.name,
                status: 'completed',
                counter: agent.counter,
                createdAt,
                servedAt,
                completedAt,
                accumulatedServiceDuration: serviceTime,
                isPriority,
                isHmo,
                isRegular,
                tags
            })
        }

        // Generate ~20 serving tickets
        const servingAgents = demoUsers.filter(u => u.agentStatus === 'Serving')
        servingAgents.forEach((agent, i) => {
            const transaction = demoTransactions.find(t => t.name === agent.transaction) || demoTransactions[0]!
            const letter = transaction.code
            const num = String(151 + i).padStart(3, '0')
            const createdAt = getPastDate(20 + i)
            const servedAt = getPastDate(5 + i)
            const hasAccumulated = Math.random() > 0.5
            const accumulated = hasAccumulated ? (Math.floor(Math.random() * 10) + 2) * 60000 : 0
            
            const isPriority = Math.random() > 0.8
            const isHmo = Math.random() > 0.7
            const isRegular = !isPriority
            const tags = []
            if (isPriority) tags.push('Priority')
            if (isHmo) tags.push('HMO')
            if (isRegular) tags.push('Regular')

            demoTickets.push({
                id: `serv-${i}`,
                ticket: `${letter}${num}`,
                transactionType: agent.transaction,
                status: 'serving',
                counter: agent.counter,
                createdAt,
                servedAt,
                accumulatedServiceDuration: accumulated,
                isPriority,
                isHmo,
                isRegular,
                tags
            })
            // Update agent with current ticket
            agent.ticket = `${letter}${num}`
        })

        // Generate ~30 waiting tickets
        for (let i = 0; i < 30; i++) {
            const transaction = demoTransactions[Math.floor(Math.random() * demoTransactions.length)]!
            const letter = transaction.code
            const num = String(180 + i).padStart(3, '0')
            const createdAt = getPastDate(30 - i)
            
            const isPriority = Math.random() > 0.9
            const isHmo = Math.random() > 0.8
            const isRegular = !isPriority
            const tags = []
            if (isPriority) tags.push('Priority')
            if (isHmo) tags.push('HMO')
            if (isRegular) tags.push('Regular')

            demoTickets.push({
                id: `wait-${i}`,
                ticket: `${letter}${num}`,
                transactionType: transaction.name,
                status: 'waiting',
                createdAt,
                isPriority,
                isHmo,
                isRegular,
                tags
            })
        }

        // Generate ~30 held, skipped, missed tickets
        for (let i = 0; i < 30; i++) {
            const transaction = demoTransactions[Math.floor(Math.random() * demoTransactions.length)]!
            const letter = transaction.code
            const num = String(210 + i).padStart(3, '0')
            const minutesAgo = Math.floor(Math.random() * 120) + 10
            
            let status = 'missed'
            let reason = reasonPresets.missed[i % reasonPresets.missed.length]!
            if (i < 10) {
                status = 'held'
                reason = reasonPresets.held[i % reasonPresets.held.length]!
            } else if (i < 20) {
                status = 'skipped'
                reason = reasonPresets.skipped[i % reasonPresets.skipped.length]!
            }

            const createdAt = getPastDate(minutesAgo + 20)
            const calledAt = getPastDate(minutesAgo + 10)
            const heldAt = (status === 'held' || status === 'skipped') ? getPastDate(minutesAgo) : undefined
            const servedAt = (status === 'held' || status === 'skipped') ? getPastDate(minutesAgo + 5) : undefined
            const accumulated = (status === 'held' || status === 'skipped') ? (Math.floor(Math.random() * 8) + 2) * 60000 : 0

            const agent = demoUsers.filter(u => u.role === 'Agent')[i % agentNames.length]!
            const counterAssigned = agent.counter !== '-' ? agent.counter : `Counter 0${(i % 8) + 1}`

            const isPriority = Math.random() > 0.8
            const isHmo = Math.random() > 0.7
            const isRegular = !isPriority
            const tags = []
            if (isPriority) tags.push('Priority')
            if (isHmo) tags.push('HMO')
            if (isRegular) tags.push('Regular')

            demoTickets.push({
                id: `${status}-${i}`,
                ticket: `${letter}${num}`,
                transactionType: transaction.name,
                status: status as any,
                counter: counterAssigned,
                createdAt,
                calledAt,
                heldAt,
                servedAt,
                reason,
                accumulatedServiceDuration: accumulated,
                isPriority,
                isHmo,
                isRegular,
                tags
            })
        }

        localStorage.setItem('sanitarium_tickets', JSON.stringify(demoTickets))
        localStorage.setItem('sanitarium_users', JSON.stringify(demoUsers)) // Update with serving tickets

        // 5. Seed Feedback
        const comments = [
            'Excellent service, very fast!',
            'The agent was very helpful and professional.',
            'Wait time was a bit long but overall good experience.',
            'Clean facilities and clear instructions.',
            'Very efficient process.',
            'Friendly staff!',
            'Could be better, but acceptable.',
            'Great job by the billing team.',
            'Admission was smooth and easy.',
            'Five stars!'
        ]

        const demoFeedback: Feedback[] = [
            // Agent Feedback
            ...Array.from({ length: 60 }, (_, i) => {
                const agent = demoUsers.filter(u => u.role === 'Agent')[i % agentNames.length]!
                return {
                    id: i + 1,
                    agentId: agent.id,
                    agentCode: agent.code!,
                    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
                    comment: comments[i % comments.length]!,
                    createdAt: formatPrettyDate(getPastDate(Math.floor(Math.random() * 400) + 10))
                }
            }),
            // Kiosk Feedback (agentId: 0, agentCode: KIOSK-XX)
            ...Array.from({ length: 15 }, (_, i) => {
                const kioskNum = (i % 3) + 1
                return {
                    id: 61 + i,
                    agentId: 0,
                    agentCode: `KIOSK-0${kioskNum}`,
                    rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
                    comment: comments[Math.floor(Math.random() * comments.length)]!,
                    createdAt: formatPrettyDate(getPastDate(Math.floor(Math.random() * 200) + 5))
                }
            })
        ]
        localStorage.setItem('sanitarium_feedback', JSON.stringify(demoFeedback))

        // 6. Seed Kiosk Content Management
        const demoKioskFlows = [
            {
                id: 'flow-1',
                name: 'Main Reception (Split)',
                status: 'Active',
                title: 'St. Mary’s Sanitarium',
                description: 'Please select a service to begin your journey.',
                welcomeTitle: 'Welcome to St. Mary’s',
                welcomeDescription: 'We are here to care for you with compassion and excellence.',
                layout: 'split',
                languages: ['English', 'Spanish', 'Tagalog'],
                idleEnabled: true,
                idleTimeout: 30,
                idleMedia: '',
                idleImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053',
                idleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-hospital-hallway-with-doctors-and-patients-40251-large.mp4',
                showQR: true,
                showLanguageToggle: true,
                updatedAt: formatPrettyDate(getPastDate(60))
            },
            {
                id: 'flow-2',
                name: 'VIP Executive Lounge',
                status: 'Draft',
                title: 'Executive Care Wing',
                description: 'Personalized healthcare at your convenience.',
                welcomeTitle: 'Premium Medical Services',
                welcomeDescription: 'Your health, our priority. Experience world-class care.',
                layout: 'vertical',
                languages: ['English'],
                idleEnabled: false,
                idleTimeout: 60,
                idleMedia: '',
                idleImageUrl: '',
                idleVideoUrl: '',
                showQR: false,
                showLanguageToggle: false,
                updatedAt: formatPrettyDate(getPastDate(1440))
            },
            {
                id: 'flow-3',
                name: 'Express Lab Checkout',
                status: 'Draft',
                title: 'Laboratory Services',
                description: 'Fast-track laboratory registration and results.',
                welcomeTitle: 'Express Lab Services',
                welcomeDescription: 'Minimal waiting, maximal accuracy.',
                layout: 'grid',
                languages: ['English', 'Spanish'],
                idleEnabled: true,
                idleTimeout: 15,
                idleMedia: '',
                idleImageUrl: 'https://images.unsplash.com/photo-1579154273841-491138b21e67?auto=format&fit=crop&q=80&w=2070',
                idleVideoUrl: '',
                showQR: true,
                showLanguageToggle: true,
                updatedAt: formatPrettyDate(getPastDate(120))
            }
        ]
        localStorage.setItem('sanitarium_kiosk_flows', JSON.stringify(demoKioskFlows))
        localStorage.setItem('sanitarium_active_flow_id', 'flow-1')

        // 7. Seed Kiosk Feedback Settings
        const demoFeedbackSettings = {
            title: 'How was your experience?',
            description: 'Help us provide better care for everyone.',
            ratingTitle: 'Rate our facilities and staff',
            ratingDescription: 'Your feedback matters to our continuous improvement.',
            ratingLowerLabel: 'Needs Improvement',
            ratingHigherLabel: 'Exceptional',
            showComment: true,
            showCommentPresets: true,
            commentTitle: 'Tell us more',
            commentPlaceholder: 'Any specific department or staff member you’d like to mention?',
            commentPresets: [
                'Very clean environment', 
                'Friendly staff at reception', 
                'Fast waiting time', 
                'Professional doctors', 
                'Clear instructions'
            ],
            submitButtonLabel: 'Confirm Feedback'
        }
        localStorage.setItem('sanitarium_feedback_settings', JSON.stringify(demoFeedbackSettings))

        // Reload all to reflect changes
        reloadTickets()
        reloadUsers()
        reloadFeedback()
        reloadCounters()
        reloadTransactions()
        reloadKioskSettings()
        reloadFeedbackSettings()
        console.log('Demo data seeding complete.')
    }

    return {
        seedAll,
        resetAll
    }
}
