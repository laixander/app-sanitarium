<script setup lang="ts">
definePageMeta({
    title: 'Notification Settings',
    showUserToolbar: true,
})

const defaultState = {
    emailNotifications: true,
    smsNotifications: false,
    soundAlerts: true,
    displayBoardSync: true,
}

const state = ref<{ [key: string]: any }>({ ...defaultState })
const initialState = ref<{ [key: string]: any }>({ ...defaultState })

const notifications = [
    {
        name: 'emailNotifications',
        label: 'Email Notifications',
        description: 'Receive notifications via email',
        type: 'boolean'
    },
    {
        name: 'smsNotifications',
        label: 'SMS Notifications',
        description: 'Receive notifications via SMS',
        type: 'boolean'
    },
    {
        name: 'soundAlerts',
        label: 'Sound Alerts',
        description: 'Play audio when calling next patient',
        type: 'boolean'
    },
    {
        name: 'displayBoardSync',
        label: 'Display Board Sync',
        description: 'Sync display board with current queue',
        type: 'boolean'
    }
]

const appToast = useAppToast()

async function onChange() {
    initialState.value = { ...state.value }
    appToast.updated('Notification', 'Notification settings have been updated successfully.')
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
            <UPageCard title="Notification Settings" description="Manage notification settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <DynamicField v-for="field in notifications" :key="field.name" :field="field"
                    v-model="state[field.name]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Default" variant="outline" @click="resetToDefault" />
            <UButton :disabled="isUnchanged" label="Save Configuration" @click="onChange" />
        </div>
    </div>
</template>