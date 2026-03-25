<script setup lang="ts">
import type { Counter } from '~/types/counter'

definePageMeta({
    title: 'Assignment Items',
    showUserToolbar: true,
})

const { counters, deleteCounter } = useCounters()

const isCounterEditModalOpen = ref(false)
const selectedCounter = ref<Counter | null>(null)

function onEditCounter(counter: Counter) {
    selectedCounter.value = counter
    isCounterEditModalOpen.value = true
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

function onDeleteCounter(counter: Counter) {
    openConfirmModal({
        title: 'Delete Counter',
        description: `Are you sure you want to delete ${counter.name}? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => deleteCounter(counter.id)
    })
}
</script>

<template>
    <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
        <UPageCard title="Counters" description="Manage counters" variant="naked" orientation="horizontal">
            <AgentAddCounter />
        </UPageCard>
        <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
            <AgentCounterList v-for="counter in counters" :key="counter.id" :title="counter.name"
                :description="counter.description" :color="counter.color" @edit="onEditCounter(counter)"
                @delete="onDeleteCounter(counter)" />
        </UCard>
    </div>

    <AgentCounterFormModal v-model:open="isCounterEditModalOpen" :counter="selectedCounter" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>