<script setup lang="ts">
definePageMeta({
    title: 'Branding'
})

const defaultState = {
    hospitalName: 'App Sanitarium',
    abbreviation: 'AS',
    primaryColor: 'blue',
    secondaryColor: 'neutral',
    hospitalLogo: null,
    kioskWelcomeMessage: 'Welcome to App Sanitarium! Please take a queue number.'
}

const state = ref<{ [key: string]: any }>({ ...defaultState })
const initialState = ref<{ [key: string]: any }>({ ...defaultState })

const brandingFields = [
    {
        name: 'hospitalName',
        label: 'Hospital Name',
        description: 'The official name of the hospital',
        type: 'text'
    },
    {
        name: 'abbreviation',
        label: 'Abbreviation',
        description: 'Short name or acronym',
        type: 'text'
    },
    {
        name: 'primaryColor',
        label: 'Primary Color',
        description: 'Main brand color used throughout the app',
        type: 'color'
    },
    {
        name: 'secondaryColor',
        label: 'Secondary Color',
        description: 'Accent color used for highlights',
        type: 'color'
    },
    {
        name: 'hospitalLogo',
        label: 'Hospital Logo',
        description: 'Upload your hospital\'s logo',
        type: 'file'
    },
    {
        name: 'kioskWelcomeMessage',
        label: 'Kiosk Welcome Message',
        description: 'Message displayed on the kiosk welcome screen',
        type: 'textarea'
    }
]

const toast = useToast()

async function onChange() {
    initialState.value = { ...state.value }
    toast.add({
        title: 'Branding Updated',
        description: 'Branding settings have been updated successfully.',
        color: 'success'
    })
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
            <UPageCard title="Branding" description="Manage branding settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <DynamicField v-for="field in brandingFields" :key="field.name" :field="field"
                    v-model="state[field.name]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Default" variant="outline" @click="resetToDefault" />
            <UButton :disabled="isUnchanged" label="Save Branding" @click="onChange" />
        </div>
    </div>
</template>