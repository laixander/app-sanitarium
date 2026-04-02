<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ticket } from '~/types/queue'

export type ReasonActionType = 'Missed' | 'Held' | 'Skipped'

const props = defineProps<{
    actionType: ReasonActionType
    ticket: Ticket
}>()

const emit = defineEmits<{
    (e: 'close', reason: string | false): void
}>()

const presets = computed(() => {
    switch (props.actionType) {
        case 'Missed':
            return ['Not physically present', 'Did not respond after 3 calls', 'Left premises', 'Other']
        case 'Held':
            return ['Incomplete requirements', 'Waiting for payment/approval', 'Emergency pause', 'Other']
        case 'Skipped':
            return ['Wrong counter / transaction', 'System error', 'Requested skip by patient', 'Other']
        default:
            return ['Other']
    }
})

// URadioGroup needs objects with value/label if we just pass strings, let's format it.
// Ah, URadioGroup in Nuxt UI v3 can accept strings directly.
const options = computed(() => presets.value.map(val => ({ value: val, label: val })))

const selectedPreset = ref(presets.value[0])
const otherReason = ref('')

const finalReason = computed<string>(() => {
    if (selectedPreset.value === 'Other') {
        return otherReason.value.trim() || 'Other'
    }
    return selectedPreset.value || 'Other'
})

const submit = () => {
    isOpen.value = false
    emit('close', finalReason.value)
}

const cancel = () => {
    isOpen.value = false
    emit('close', false)
}

const title = computed(() => {
    switch (props.actionType) {
        case 'Missed': return 'Mark as No Show'
        case 'Held': return 'Put Ticket On Hold'
        case 'Skipped': return 'Skip Ticket'
        default: return 'Reason Required'
    }
})

const isOpen = ref(true)
</script>

<template>
    <UModal v-model:open="isOpen" :title="title" prevent-close>
        <template #body>
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Please provide a reason for marking ticket <strong class="text-gray-900 dark:text-white">{{
                        ticket.ticket
                        }}</strong> as {{ actionType.toLowerCase() }}.
                </p>

                <URadioGroup v-model="selectedPreset" :items="options" />

                <div v-if="selectedPreset === 'Other'" class="pt-2">
                    <p class="text-sm font-medium mb-1.5">Please specify:</p>
                    <UTextarea v-model="otherReason" placeholder="Enter reason here..." :rows="3" class="w-full" />
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <UButton color="gray" variant="ghost" label="Cancel" @click="cancel" />
                <UButton :color="actionType === 'Missed' ? 'error' : (actionType === 'Held' ? 'warning' : 'primary')"
                    label="Confirm" @click="submit" :disabled="selectedPreset === 'Other' && !otherReason.trim()" />
            </div>
        </template>
    </UModal>
</template>
