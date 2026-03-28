<script setup lang="ts">
definePageMeta({
    title: 'Branding'
})

const { branding, updateBranding, resetBranding } = useBranding()

const state = ref({ ...branding.value })
const initialState = ref({ ...branding.value })

// Sync local state with global branding if it changes elsewhere
watch(branding, (newBranding) => {
    state.value = { ...newBranding }
    initialState.value = { ...newBranding }
}, { deep: true })

const brandingFields = [
    {
        name: 'appName',
        label: 'App Name',
        description: 'The official name of the app',
        type: 'text'
    },
    {
        name: 'appTagline',
        label: 'App Tagline',
        description: 'The tagline of the app',
        type: 'text'
    },
    {
        name: 'primaryColor',
        label: 'Primary Color',
        description: 'Main brand color used throughout the app',
        type: 'colors'
    },
    {
        name: 'neutralColor',
        label: 'Neutral Color',
        description: 'Neutral color used for backgrounds and text',
        type: 'neutrals'
    },
    {
        name: 'appLogo',
        label: 'App Logo',
        description: 'Logo must be at least 100x100 pixels',
        type: 'file'
    }
]

const appToast = useAppToast()

function onSave() {
    updateBranding(state.value)
    initialState.value = { ...state.value }
    appToast.updated('Branding', 'Branding settings have been updated successfully.')
}

function onReset() {
    resetBranding()
    state.value = { ...branding.value }
    initialState.value = { ...branding.value }
    appToast.reset('Branding', 'Branding settings have been reset to default.')
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
                    v-model="(state as any)[field.name]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Default" variant="outline" @click="onReset" />
            <UButton :disabled="isUnchanged" label="Save Branding" @click="onSave" />
        </div>
    </div>
</template>