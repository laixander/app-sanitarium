<script setup lang="ts">
import type { TransactionCategory } from '~/types/transaction'
import type { Counter } from '~/types/counter'
import type { Schedule } from '~/types/schedule'

definePageMeta({
    title: 'Queue Settings'
})

const { transactions, deleteTransaction } = useTransactions()
const { counters, deleteCounter } = useCounters()
const { schedules, deleteSchedule } = useSchedules()

const isEditModalOpen = ref(false)
const selectedTransaction = ref<TransactionCategory | null>(null)

const isCounterEditModalOpen = ref(false)
const selectedCounter = ref<Counter | null>(null)

const isScheduleEditModalOpen = ref(false)
const selectedSchedule = ref<Schedule | null>(null)

function onEdit(transaction: TransactionCategory) {
    selectedTransaction.value = transaction
    isEditModalOpen.value = true
}

function onEditCounter(counter: Counter) {
    selectedCounter.value = counter
    isCounterEditModalOpen.value = true
}

function onEditSchedule(schedule: Schedule) {
    selectedSchedule.value = schedule
    isScheduleEditModalOpen.value = true
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

function onDeleteCounter(counter: Counter) {
    openConfirmModal({
        title: 'Delete Counter',
        description: `Are you sure you want to delete ${counter.name}? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => deleteCounter(counter.id)
    })
}

function onDeleteSchedule(schedule: Schedule) {
    openConfirmModal({
        title: 'Delete Schedule',
        description: `Are you sure you want to delete the ${schedule.name} schedule? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => deleteSchedule(schedule.id)
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
                <AgentTransactionList v-for="transaction in transactions" :key="transaction.id"
                    :title="transaction.name" :description="transaction.description" :color="transaction.color"
                    @edit="onEdit(transaction)" @delete="onDelete(transaction)" />
            </UCard>
        </div>

        <div class="flex flex-col gap-4">
            <UPageCard title="Counters" description="Manage counters" variant="naked" orientation="horizontal">
                <AgentAddCounter />
            </UPageCard>
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AgentCounterList v-for="counter in counters" :key="counter.id" :title="counter.name"
                    :description="counter.description" :color="counter.color" @edit="onEditCounter(counter)"
                    @delete="onDeleteCounter(counter)" />
            </UCard>
        </div>

        <div class="flex flex-col gap-4">
            <UPageCard title="Schedule" description="Manage schedule" variant="naked" orientation="horizontal">
                <AgentAddSchedule />
            </UPageCard>
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AgentScheduleList v-for="schedule in schedules" :key="schedule.id" :title="schedule.name"
                    :start-time="schedule.startTime" :end-time="schedule.endTime" :color="schedule.color"
                    @edit="onEditSchedule(schedule)" @delete="onDeleteSchedule(schedule)" />
            </UCard>
        </div>
    </div>

    <AgentTransactionFormModal v-model:open="isEditModalOpen" :transaction="selectedTransaction" />
    <AgentCounterFormModal v-model:open="isCounterEditModalOpen" :counter="selectedCounter" />
    <AgentScheduleFormModal v-model:open="isScheduleEditModalOpen" :schedule="selectedSchedule" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>