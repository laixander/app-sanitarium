<script setup lang="ts">
import { useFeedbackSettings } from '~/composables/useFeedbackSettings'

definePageMeta({
    title: 'Feedback Management',
    showUserToolbar: true
})

const { settings, defaultSettings, saveSettings, resetSettings } = useFeedbackSettings()
const toast = useToast()

const state = ref(JSON.parse(JSON.stringify(settings.value)))

// Sync local state when remote settings change (e.g. after reload)
watch(settings, (newVal) => {
    state.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

const generalFields = [
    {
        name: 'title',
        label: 'Form Title',
        description: 'The title of the feedback form',
        type: 'text'
    },
    {
        name: 'description',
        label: 'Form Description',
        description: 'Description of the feedback form',
        type: 'text'
    },
    {
        name: 'submitButtonLabel',
        label: 'Submit Button Label',
        description: 'Label of the submit button',
        type: 'text'
    }
]

const ratingFields = [
    {
        name: 'ratingTitle',
        label: 'Rating Title',
        description: 'The title of the rating section',
        type: 'text'
    },
    {
        name: 'ratingDescription',
        label: 'Rating Description',
        description: 'Description of the rating section',
        type: 'text'
    },
    {
        name: 'ratingLowerLabel',
        label: 'Lower Label (Poor)',
        description: 'Label of the lower rating',
        type: 'text'
    },
    {
        name: 'ratingHigherLabel',
        label: 'Higher Label (Excellent)',
        description: 'Label of the higher rating',
        type: 'text'
    }
]

const commentFields = [
    {
        name: 'showComment',
        label: 'Enable Comments',
        description: 'Allow customers to provide optional comments',
        type: 'boolean'
    },
    {
        name: 'showCommentPresets',
        label: 'Enable Comment Presets',
        description: 'Show predefined phrases for quick feedback',
        type: 'boolean'
    },
    {
        name: 'commentTitle',
        label: 'Comment Field Label',
        description: 'The label of the comment field',
        type: 'text'
    },
    {
        name: 'commentPlaceholder',
        label: 'Comment Placeholder',
        description: 'Placeholder text for the comment field',
        type: 'textarea'
    }
]

const newPreset = ref('')

function addPreset() {
    if (!newPreset.value) return
    if (state.value.commentPresets.includes(newPreset.value)) return
    state.value.commentPresets.push(newPreset.value)
    newPreset.value = ''
}

function removePreset(index: number) {
    state.value.commentPresets.splice(index, 1)
}

function onSave() {
    saveSettings(state.value)
    toast.add({
        title: 'Settings Saved',
        description: 'Feedback form content has been updated successfully.',
        color: 'success'
    })
}

const isResetModalOpen = ref(false)

function onReset() {
    state.value = JSON.parse(JSON.stringify(settings.value))
    resetSettings()
    toast.add({
        title: 'Settings Reset',
        description: 'Feedback form content has been reset to defaults.',
        color: 'neutral'
    })
}

const isUnchanged = computed(() => {
    return JSON.stringify(state.value) === JSON.stringify(settings.value)
})

const isDefault = computed(() => {
    return JSON.stringify(state.value) === JSON.stringify(defaultSettings)
})
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full lg:max-w-7xl mx-auto pb-12">
        <!-- Editor Section -->
        <div class="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-12 max-w-2xl mx-auto lg:mx-0">
            <div class="flex flex-col gap-4">
                <UPageCard title="General Content" description="Main titles and descriptions" variant="naked" />
                <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                    <DynamicField v-for="field in generalFields" :key="field.name" :field="field"
                        v-model="state[field.name as keyof typeof state]" />
                </UCard>
            </div>

            <div class="flex flex-col gap-4">
                <UPageCard title="Rating Section" description="Customize how rating is displayed" variant="naked" />
                <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                    <DynamicField v-for="field in ratingFields" :key="field.name" :field="field"
                        v-model="state[field.name as keyof typeof state]" />
                </UCard>
            </div>

            <div class="flex flex-col gap-4">
                <UPageCard title="Comment Section" description="Customize how comments are displayed" variant="naked" />
                <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                    <DynamicField :field="commentFields[0]!" v-model="state.showComment" />

                    <template v-if="state.showComment">
                        <DynamicField v-for="field in commentFields.slice(2)" :key="field.name" :field="field"
                            v-model="state[field.name as keyof typeof state]" />

                        <DynamicField :field="commentFields[1]!" v-model="state.showCommentPresets" />

                        <div v-if="state.showCommentPresets" class="p-4 sm:p-6">
                            <UFormField label="Comment Presets"
                                description="Common phrases customers can click to quickly fill the form.">
                                <div class="flex gap-2 pt-4">
                                    <UInput v-model="newPreset" placeholder="Add new preset..." class="flex-1"
                                        @keyup.enter="addPreset" />
                                    <UButton icon="i-lucide-plus" @click="addPreset" />
                                </div>
                                <div class="flex flex-wrap gap-2 pt-4">
                                    <UButton v-for="(preset, index) in state.commentPresets" :label="preset"
                                        :key="index" variant="subtle" color="neutral"
                                        @click="removePreset(index as number)" trailing-icon="i-lucide-x" size="sm"
                                        :ui="{ trailingIcon: 'size-3' }" />
                                </div>
                            </UFormField>
                        </div>
                    </template>
                </UCard>
            </div>

            <div class="flex justify-end gap-2">
                <UButton :disabled="isDefault" label="Reset to Default" variant="outline"
                    @click="isResetModalOpen = true" />
                <UButton :disabled="isUnchanged" label="Save Changes" @click="onSave" />
            </div>
        </div>

        <!-- Preview Section -->
        <div class="hidden lg:flex flex-col gap-6 w-full max-w-md sticky top-0 h-fit">
            <div class="flex flex-col gap-1">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-dimmed px-1">Live Preview</h3>
                <p class="text-xs text-dimmed px-1">This is how your feedback form will look to customers.</p>
            </div>

            <AgentFeedbackForm :settings="(state as any)" :agent="({ name: 'Sample Agent', id: 0 } as any)"
                is-preview />
        </div>

        <ConfirmationModal v-model:open="isResetModalOpen" title="Reset Settings?"
            description="This will revert all feedback form content to their default values. This action cannot be undone."
            confirm-label="Reset to Default" confirm-color="error" @confirm="onReset" />
    </div>
</template>