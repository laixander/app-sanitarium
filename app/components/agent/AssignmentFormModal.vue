<script setup lang="ts">
import type { User } from '~/types/user'
import { useTransactions } from '~/composables/useTransactions'
import { useCounters } from '~/composables/useCounters'
import { useSchedules } from '~/composables/useSchedules'
import { useUsers } from '~/composables/useUsers'

const props = defineProps<{
    user?: User | null
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits(['success'])

const { transactions } = useTransactions()
const { counters } = useCounters()
const { schedules } = useSchedules()
const { updateUser } = useUsers()
const toast = useToast()

const selectedCounter = ref('')
const selectedTransaction = ref('')
const selectedSchedule = ref('')

const availableCounters = computed(() => counters.value.map(c => c.name))
const availableTransactions = computed(() => transactions.value.map(t => t.name))
const availableSchedules = computed(() => schedules.value.map(s => s.name))

watch([() => props.user, isOpen], ([newUser, open]) => {
    if (open && newUser) {
        selectedCounter.value = newUser.counter && newUser.counter !== '-' ? newUser.counter : ''
        selectedTransaction.value = newUser.transaction || ''
        selectedSchedule.value = newUser.schedule || ''
    }
}, { immediate: true })

function onAssignmentSubmit() {
    if (props.user) {
        updateUser(props.user.id, {
            counter: selectedCounter.value || '-',
            transaction: selectedTransaction.value,
            schedule: selectedSchedule.value
        })
        toast.add({
            title: 'Assignment Updated',
            description: `${props.user.name} has been assigned.`,
            color: 'success'
        })
    }
    isOpen.value = false
    emit('success')
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Agent Assignment"
        :description="user ? `Update assignment for ${user.name}` : ''" :dismissible="false">
        <template #body>
            <UForm :state="{ counter: selectedCounter, transaction: selectedTransaction }" class="flex flex-col gap-4"
                @submit="onAssignmentSubmit">
                <UFormField label="Transaction" name="transaction" required>
                    <USelect v-model="selectedTransaction" :items="availableTransactions"
                        placeholder="Select a transaction" class="w-full" />
                </UFormField>
                <UFormField label="Counter" name="counter">
                    <USelect v-model="selectedCounter" :items="availableCounters" placeholder="Select a counter"
                        class="w-full" />
                </UFormField>
                <UFormField label="Schedule" name="schedule">
                    <USelect v-model="selectedSchedule" :items="availableSchedules" placeholder="Select a schedule"
                        class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isOpen = false" />
                    <UButton type="submit" label="Save Changes" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>