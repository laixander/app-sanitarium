<script setup lang="ts">
import type { Schedule } from '~/types/schedule'

definePageMeta({
    title: 'Assignment Items',
    showUserToolbar: true,
})

const { schedules, deleteSchedule } = useSchedules()

const isScheduleEditModalOpen = ref(false)
const selectedSchedule = ref<Schedule | null>(null)

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
    <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
        <UPageCard title="Schedule" description="Manage schedule" variant="naked" orientation="horizontal">
            <AgentAddSchedule />
        </UPageCard>
        <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
            <AgentScheduleList v-for="schedule in schedules" :key="schedule.id" :title="schedule.name"
                :start-time="schedule.startTime" :end-time="schedule.endTime" :color="schedule.color"
                @edit="onEditSchedule(schedule)" @delete="onDeleteSchedule(schedule)" />
        </UCard>
    </div>

    <AgentScheduleFormModal v-model:open="isScheduleEditModalOpen" :schedule="selectedSchedule" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>