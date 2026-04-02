<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import type { TransactionCategory } from '~/types/transaction'
import { appColors } from '~/constants/colors'
import { useTransactions } from '~/composables/useTransactions'

const props = defineProps<{
    transaction?: TransactionCategory | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { addTransaction, updateTransaction } = useTransactions()

const form = ref({
    name: '',
    code: '',
    description: '',
    color: 'neutral' as any,
    icon: 'i-lucide-clipboard-list'
})

const isManualCode = ref(false)

const availableColors = appColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))

const availableIcons = [
    { label: 'Stethoscope', value: 'i-lucide-stethoscope', icon: 'i-lucide-stethoscope' },
    { label: 'Bed', value: 'i-lucide-bed-double', icon: 'i-lucide-bed-double' },
    { label: 'Credit Card', value: 'i-lucide-credit-card', icon: 'i-lucide-credit-card' },
    { label: 'Clipboard', value: 'i-lucide-clipboard-list', icon: 'i-lucide-clipboard-list' },
    { label: 'Activity', value: 'i-lucide-activity', icon: 'i-lucide-activity' },
    { label: 'Heart', value: 'i-lucide-heart-pulse', icon: 'i-lucide-heart-pulse' },
    { label: 'Pill', value: 'i-lucide-pill', icon: 'i-lucide-pill' },
    { label: 'Syringe', value: 'i-lucide-syringe', icon: 'i-lucide-syringe' },
    { label: 'Users', value: 'i-lucide-users', icon: 'i-lucide-users' }
]

watch([() => props.transaction, isOpen], ([newTransaction, open]) => {
    if (open) {
        if (newTransaction) {
            form.value.name = newTransaction.name
            form.value.code = newTransaction.code
            form.value.description = newTransaction.description || ''
            form.value.color = newTransaction.color || 'neutral'
            form.value.icon = newTransaction.icon || 'i-lucide-clipboard-list'
            isManualCode.value = true
        } else {
            form.value.name = ''
            form.value.code = ''
            form.value.description = ''
            form.value.color = 'neutral'
            form.value.icon = 'i-lucide-clipboard-list'
            isManualCode.value = false
        }
    }
}, { immediate: true })

watch(() => form.value.name, (newName) => {
    if (!isManualCode.value && !props.transaction) {
        form.value.code = newName
            .split(' ')
            .filter(Boolean)
            .map(word => word[0])
            .join('')
            .toUpperCase()
    }
})

function onSubmit() {
    if (props.transaction) {
        updateTransaction(props.transaction.id, { ...form.value })
    } else {
        addTransaction({ ...form.value })
    }
    isOpen.value = false
    emit('success')
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="transaction ? 'Edit Transaction' : 'Add Transaction'"
        :description="transaction ? 'Update transaction details below.' : 'Fill in the details below to create a new transaction.'"
        :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Transaction Name" name="name" required>
                    <UInput v-model="form.name" placeholder="e.g. Lab Tests" class="w-full" required />
                </UFormField>

                <!-- Transaction Code: Default is the First Letter of the Transaction Name -->
                <UFormField label="Transaction Code" name="code" required>
                    <UInput v-model="form.code" placeholder="e.g. LT" class="w-full" required
                        @input="isManualCode = true" />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="form.description" placeholder="Short description of this transaction type"
                        class="w-full" />
                </UFormField>

                <UFormField label="Icon" name="icon" required>
                    <USelectMenu v-model="form.icon" :items="availableIcons" value-key="value" placeholder="Select icon"
                        class="w-full">
                        <template #leading="{ modelValue }">
                            <UIcon v-if="modelValue"
                                :name="(typeof modelValue === 'string' ? modelValue : (modelValue as any).value)"
                                class="w-5 h-5" />
                        </template>
                    </USelectMenu>
                </UFormField>

                <UFormField label="Transaction Color" name="color">
                    <USelectMenu v-model="form.color" :items="availableColors" value-key="value"
                        placeholder="Select color" class="w-full">
                        <template #leading="{ modelValue, ui }">
                            <UChip v-if="modelValue"
                                :color="((typeof modelValue === 'string' ? availableColors.find(c => c.value === modelValue)?.chip.color : (modelValue as any).chip?.color) as ChipProps['color'])"
                                inset standalone :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                                :class="ui.itemLeadingChip()" />
                        </template>
                    </USelectMenu>
                </UFormField>

                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isOpen = false" />
                    <UButton type="submit" :label="transaction ? 'Update Category' : 'Add Category'" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>