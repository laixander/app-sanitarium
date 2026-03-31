import type { TransactionCategory } from '~/types/transaction'

export const useTransactions = () => {
    const { logActivity } = useAudits()
    const transactions = useState<TransactionCategory[]>('transactions', () => [])

    const reloadTransactions = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_transactions')
        if (saved) {
            transactions.value = JSON.parse(saved)
        } else {
            // Default ones based on previous badge constants
            transactions.value = [
                { id: '1', name: 'Consultation', description: 'Patient seeing a doctor', color: 'sky', icon: 'i-lucide-stethoscope' },
                { id: '2', name: 'Admission', description: 'Admitting a patient', color: 'pink', icon: 'i-lucide-bed-double' },
                { id: '3', name: 'Billing', description: 'Paying for services', color: 'teal', icon: 'i-lucide-credit-card' },
                { id: '4', name: 'Outpatient', description: 'Outpatient care and services', color: 'indigo', icon: 'i-lucide-clipboard-list' }
            ]
            saveToLocal()
        }
    }

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'sanitarium_transactions') {
            reloadTransactions()
        }
    }

    onMounted(() => {
        reloadTransactions()
        if (import.meta.client) {
            window.addEventListener('storage', handleStorageChange)
        }
    })

    onUnmounted(() => {
        if (import.meta.client) {
            window.removeEventListener('storage', handleStorageChange)
        }
    })

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_transactions', JSON.stringify(transactions.value))
        }
    }

    const addTransaction = (data: Omit<TransactionCategory, 'id'>) => {
        const id = Date.now().toString()
        transactions.value = [...transactions.value, { ...data, id }]
        saveToLocal()

        logActivity({
            title: 'Category Created',
            description: `New transaction category '${data.name}' was added`,
            category: 'Assignment Management',
            actor: 'Admin'
        })
    }

    const updateTransaction = (id: string, data: Partial<Omit<TransactionCategory, 'id'>>) => {
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
            const transaction = transactions.value[index]
            transactions.value[index] = { ...transaction, ...data } as TransactionCategory
            saveToLocal()

            logActivity({
                title: 'Category Updated',
                description: `Transaction category '${transaction?.name}' was modified`,
                category: 'Assignment Management',
                actor: 'Admin'
            })
        }
    }

    const deleteTransaction = (id: string) => {
        const transaction = transactions.value.find(t => t.id === id)
        transactions.value = transactions.value.filter(t => t.id !== id)
        saveToLocal()

        if (transaction) {
            logActivity({
                title: 'Category Deleted',
                description: `Transaction category '${transaction.name}' was removed`,
                category: 'Assignment Management',
                actor: 'Admin'
            })
        }
    }

    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        reloadTransactions
    }
}
