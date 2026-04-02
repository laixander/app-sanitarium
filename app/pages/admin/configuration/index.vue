<script setup lang="ts">
definePageMeta({
    title: 'System Configuration',
    showUserToolbar: true,
})

const defaultState = {
    maxQueueSize: 50,
    noShowTimeout: 15,
    priorityBoost: 'Move to front',
    autoRedirectNoShows: 'Enable'
}

const state = ref<{ [key: string]: any }>({ ...defaultState })
const initialState = ref<{ [key: string]: any }>({ ...defaultState })

const queue = [
    {
        name: 'maxQueueSize',
        label: 'Max Queue Size',
        description: 'Maximum number of patients in the queue',
        type: 'number'
    },
    {
        name: 'noShowTimeout',
        label: 'No-Show Timeout (minutes)',
        description: 'Time to wait before marking a patient as no-show',
        type: 'number'
    },
    {
        name: 'priorityBoost',
        label: 'Priority Boost (Senior/PWD)',
        description: 'Automatically prioritize seniors and PWDs in queue',
        type: 'select',
        options: ['Move to front', 'Skip 3 positions', 'Skip 5 positions']
    },
    {
        name: 'autoRedirectNoShows',
        label: 'Auto-redirect No-Shows',
        description: 'Automatically redirect no-show patients to a different queue',
        type: 'select',
        options: ['Enable', 'Disable']
    }
]

const appToast = useAppToast()

async function onChange() {
    initialState.value = { ...state.value }
    appToast.updated('Queue', 'Queue configuration has been updated successfully.')
}

function resetToDefault() {
    state.value = { ...defaultState }
}

const isUnchanged = computed(() => {
    return JSON.stringify(state.value) === JSON.stringify(initialState.value)
})
</script>
<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Queue Configuration" description="Manage queue settings" variant="naked"
                orientation="horizontal" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <DynamicField v-for="field in queue" :key="field.name" :field="field" v-model="state[field.name]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Default" variant="outline" @click="resetToDefault" />
            <UButton :disabled="isUnchanged" label="Save Configuration" @click="onChange" />
        </div>
    </div>
</template>