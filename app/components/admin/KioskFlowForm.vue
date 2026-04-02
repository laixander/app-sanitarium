<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KioskSettings, KioskFlow } from '~/composables/useKioskSettings'
import { useKioskLocale } from '~/composables/useKioskLocale'

const props = defineProps<{
    initialData?: KioskFlow
    isNew?: boolean
}>()

const emit = defineEmits<{
    (e: 'publish', data: KioskSettings & { name: string }): void
    (e: 'saveDraft', data: KioskSettings & { name: string }): void
    (e: 'cancel'): void
}>()

const { settings } = useKioskSettings()
const { languages: availableLanguages } = useKioskLocale()

const layouts = [
    { value: 'split', label: 'Split Screen', description: 'Video on the left, queue numbers on the right.' },
    { value: 'full', label: 'Full Screen Queue', description: 'Maximize space for calling numbers.' },
    { value: 'sidebar', label: 'Sidebar Queue', description: 'Small sidebar for queue, majority for content.' }
]

const languages = computed(() => availableLanguages.value.map(lang => ({
    value: lang.code,
    label: lang.name
})))

// Initialize state from existing data or defaults
const state = ref<KioskSettings & { name: string; defaultLanguage: string }>({
    title: props.initialData?.title || '',
    description: props.initialData?.description || '',
    welcomeTitle: props.initialData?.welcomeTitle || '',
    welcomeDescription: props.initialData?.welcomeDescription || '',
    layout: props.initialData?.layout || 'split',
    languages: [...(props.initialData?.languages || ['en'])],
    defaultLanguage: props.initialData?.languages?.[0] || 'en',
    idleEnabled: props.initialData?.idleEnabled ?? false,
    idleTimeout: props.initialData?.idleTimeout ?? 30,
    idleMedia: props.initialData?.idleMedia || '',
    idleImageUrl: props.initialData?.idleImageUrl || '',
    idleVideoUrl: props.initialData?.idleVideoUrl || '',
    showQR: props.initialData?.showQR ?? true,
    showLanguageToggle: props.initialData?.showLanguageToggle ?? true,
    name: props.initialData?.name || ''
})

const generalFields = [
    { name: 'title', label: 'Flow Title', description: 'The title of the flow', type: 'text' },
    { name: 'description', label: 'Flow Description', description: 'Description of the flow', type: 'textarea' },
    { name: 'showQR', label: 'Show QR Button', description: 'Enable the floating QR code button on the kiosk screen.', type: 'boolean' }
]

const welcomeFields = [
    { name: 'welcomeTitle', label: 'Welcome Title', description: 'The title of the welcome screen', type: 'text' },
    { name: 'welcomeDescription', label: 'Welcome Description', description: 'Description of the welcome screen', type: 'textarea' }
]

const layoutFields = [
    { name: 'layout', label: 'Layout', description: 'Selected structural layout', type: 'select', options: layouts }
]

const languageFields = computed(() => {
    const fields: any[] = [
        { name: 'showLanguageToggle', label: 'Show Language Toggle', description: 'Enable the floating language selection button.', type: 'boolean' }
    ]
    if (!state.value.showLanguageToggle) {
        fields.push({ name: 'defaultLanguage', label: 'Default Language', description: 'The display language for this kiosk', type: 'select', options: languages.value, multiple: false })
    }
    return fields
})

const idleFields = computed(() => {
    const fields: any[] = [
        { name: 'idleEnabled', label: 'Enable Idle Screen', description: 'Show promotional content when inactive.', type: 'boolean' }
    ]
    if (state.value.idleEnabled) {
        fields.push(
            { name: 'idleTimeout', label: 'Idle Timeout (seconds)', description: 'Time until idle screen appears.', type: 'number' },
            { name: 'idleMedia', label: 'Idle Media (Upload)', description: 'Upload the idle image or video.', type: 'file' },
            { name: 'idleImageUrl', label: 'Idle Image URL', description: 'External URL for idle image.', type: 'text' },
            { name: 'idleVideoUrl', label: 'Idle Video URL', description: 'External URL for idle video.', type: 'text' }
        )
    }
    return fields
})

const getPayload = () => {
    const payload = { ...state.value, name: state.value.title || 'Untitled Flow' }
    if (payload.showLanguageToggle) {
        payload.languages = languages.value.map(l => l.value)
    } else {
        payload.languages = [payload.defaultLanguage]
    }
    return payload
}

const onPublish = () => emit('publish', getPayload())
const onSaveDraft = () => emit('saveDraft', getPayload())
</script>

<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <div class="flex items-center gap-2">
            <UButton icon="i-lucide-chevron-left" label="Back to List" color="neutral" variant="ghost"
                @click="$emit('cancel')" />
        </div>
        <div class="flex items-center gap-2">
            <UButton label="Save Draft" color="neutral" variant="ghost" @click="onSaveDraft" />
            <UButton :label="isNew ? 'Publish' : 'Keep Active'" color="primary" @click="onPublish" />
        </div>
    </div>

    <div class="-mt-4 sm:-mt-6 p-4 sm:p-6 overflow-y-auto">
        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Form Settings -->
            <div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6 lg:gap-12">
                <!-- Basic Information -->
                <div class="flex flex-col gap-4">
                    <UPageCard title="Basic Information" description="Identify this workflow setup." variant="naked" />
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                        <DynamicField v-for="field in generalFields" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />
                    </UCard>
                </div>

                <!-- Welcome Screen -->
                <div class="flex flex-col gap-4">
                    <UPageCard title="Welcome Screen" description="Configure the welcome screen." variant="naked" />
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                        <DynamicField v-for="field in welcomeFields" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />
                    </UCard>
                </div>

                <!-- Layout Config (Hidden for now) -->
                <!-- <div class="flex flex-col gap-4">
                    <UPageCard title="Layout Configuration"
                        description="Choose the structural layout of the kiosk panel." variant="naked" />
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                        <DynamicField v-for="field in layoutFields" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />
                    </UCard>
                </div> -->

                <!-- Language Selection -->
                <div class="flex flex-col gap-4">
                    <UPageCard title="Localization & Languages"
                        description="Select which languages should be available for patrons." variant="naked" />
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                        <DynamicField v-for="field in languageFields" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />
                    </UCard>
                </div>

                <!-- Idle Screen -->
                <div class="flex flex-col gap-4">
                    <UPageCard title="Idle Screen Config" description="Show a promotional video or image when inactive."
                        variant="naked" />
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                        <DynamicField v-for="field in idleFields" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />
                    </UCard>
                </div>
            </div>

            <!-- Right Column: Summary / Status -->
            <div class="space-y-6 sticky top-0 h-fit">
                <UCard variant="subtle">
                    <template #header>
                        <h3 class="font-semibold">Flow Summary</h3>
                    </template>
                    <div
                        class="text-sm *:flex *:justify-between *:py-4 *:border-b *:border-default *:last:border-0 *:last:pb-0 *:first:pt-0">
                        <div class="">
                            <span class="text-gray-500">Status</span>
                            <UBadge :color="initialData?.status === 'Active' ? 'primary' : 'neutral'" variant="subtle">
                                {{
                                    initialData?.status || 'Draft' }}</UBadge>
                        </div>
                        <!-- <div class="">
                            <span class="text-gray-500">Layout</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{layouts.find(l => l.value ===
                                state.layout)?.label ||
                                'None'}}</span>
                        </div> -->
                        <div class="">
                            <span class="text-gray-500">Language</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                                {{state.showLanguageToggle ? languages.length + ' Available' : languages.find(l =>
                                    l.value ===
                                state.defaultLanguage)?.label }}
                            </span>
                        </div>
                        <div class="">
                            <span class="text-gray-500">Idle Screen</span>
                            <span class="font-medium"
                                :class="state.idleEnabled ? 'text-primary' : 'text-gray-900 dark:text-white'">
                                {{ state.idleEnabled ? `Enabled (${state.idleTimeout}s)` : 'Disabled' }}
                            </span>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>
