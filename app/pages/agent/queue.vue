<script setup lang="ts">
import type { TransactionCategory } from '~/types/transaction'

definePageMeta({
    title: 'Queue Settings'
})

const { transactions, deleteTransaction } = useTransactions()

const isEditModalOpen = ref(false)
const selectedTransaction = ref<TransactionCategory | null>(null)

function onEdit(transaction: TransactionCategory) {
    selectedTransaction.value = transaction
    isEditModalOpen.value = true
}

const isConfirmModalOpen = ref(false)
const confirmModalConfig = ref({
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    confirmColor: 'primary' as const,
    onConfirm: () => { }
})

function openConfirmModal(config: { title: string, description: string, confirmLabel?: string, confirmColor?: any, onConfirm: () => void }) {
    confirmModalConfig.value = {
        confirmLabel: 'Confirm',
        confirmColor: 'primary',
        ...config
    }
    isConfirmModalOpen.value = true
}

function onDelete(transaction: TransactionCategory) {
    openConfirmModal({
        title: 'Delete Category',
        description: `Are you sure you want to delete the ${transaction.name} category? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => deleteTransaction(transaction.id)
    })
}
</script>

<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Transaction Categories" description="Manage transaction categories" variant="naked"
                orientation="horizontal">
                <AgentAddTransaction />
            </UPageCard>
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AgentTransactionList v-for="transaction in transactions" :key="transaction.id" :title="transaction.name"
                    :description="transaction.description" :color="transaction.color"
                    @edit="onEdit(transaction)" @delete="onDelete(transaction)" />
            </UCard>
        </div>
    </div>

    <AgentTransactionFormModal v-model:open="isEditModalOpen" :transaction="selectedTransaction" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>