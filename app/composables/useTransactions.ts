import type { TransactionCategory } from '~/types/transaction'

export const useTransactions = () => {
    const transactions = useState<TransactionCategory[]>('transactions', () => [])

    const reloadTransactions = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_transactions')
        if (saved) {
            transactions.value = JSON.parse(saved)
        } else {
            // Default ones based on previous badge constants
            transactions.value = [
                { id: '1', name: 'Consultation', description: 'Patient seeing a doctor', color: 'purple' },
                { id: '2', name: 'Admission', description: 'Admitting a patient', color: 'sky' },
                { id: '3', name: 'Billing', description: 'Paying for services', color: 'emerald' },
                { id: '4', name: 'Outpatient', description: 'Outpatient care and services', color: 'rose' }
            ]
            saveToLocal()
        }
    }

    onMounted(() => {
        reloadTransactions()
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
    }

    const updateTransaction = (id: string, data: Partial<Omit<TransactionCategory, 'id'>>) => {
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
            transactions.value[index] = { ...transactions.value[index], ...data } as TransactionCategory
            saveToLocal()
        }
    }

    const deleteTransaction = (id: string) => {
        transactions.value = transactions.value.filter(t => t.id !== id)
        saveToLocal()
    }

    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        reloadTransactions
    }
}
