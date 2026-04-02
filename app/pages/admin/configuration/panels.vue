<script setup lang="ts">
definePageMeta({
    title: 'System Configuration',
    showUserToolbar: true,
})

const { data: queueData, refresh: refreshQueue } = await useFetch('/api/queue-panel')
const { data: kioskData, refresh: refreshKiosk } = await useFetch('/api/kiosk-panel')

const state = ref({
    queuePanel: queueData.value?.status === 'Online',
    kioskPanel: kioskData.value?.status === 'Online'
})

const initialState = ref({ ...state.value })

const fields = [
    {
        name: 'queuePanel',
        label: 'Queue Panel Status',
        description: 'Simulate Online/Offline status for the Queue Display',
        type: 'boolean'
    },
    {
        name: 'kioskPanel',
        label: 'Kiosk Panel Status',
        description: 'Simulate Online/Offline status for the Kiosk Interface',
        type: 'boolean'
    }
]

const appToast = useAppToast()
const loading = ref(false)

async function onSave() {
    loading.value = true
    try {
        await Promise.all([
            $fetch('/api/panel-status', {
                method: 'POST',
                body: { id: 'queue-panel', status: state.value.queuePanel ? 'Online' : 'Offline' }
            }),
            $fetch('/api/panel-status', {
                method: 'POST',
                body: { id: 'kiosk-panel', status: state.value.kioskPanel ? 'Online' : 'Offline' }
            })
        ])

        initialState.value = { ...state.value }
        appToast.updated('Panel Status', 'Panel connectivity simulation has been updated.')

        await Promise.all([refreshQueue(), refreshKiosk()])
    } catch (error) {
        appToast.error('Error', 'Failed to update panel status.')
    } finally {
        loading.value = false
    }
}

function resetToDefault() {
    state.value = {
        queuePanel: true,
        kioskPanel: true
    }
}

const isUnchanged = computed(() => {
    return JSON.stringify(state.value) === JSON.stringify(initialState.value)
})
</script>

<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Panel Status Simulation" description="Manage connectivity status for simulation purposes"
                variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <DynamicField v-for="field in fields" :key="field.name" :field="field"
                    v-model="state[field.name as keyof typeof state]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Online" variant="outline" @click="resetToDefault" />
            <UButton :disabled="isUnchanged" :loading="loading" label="Save Status" @click="onSave" />
        </div>
    </div>
</template>
