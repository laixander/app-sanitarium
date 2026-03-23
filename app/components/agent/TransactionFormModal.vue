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
    description: '',
    color: 'neutral' as any
})

const availableColors = appColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))

watch([() => props.transaction, isOpen], ([newTransaction, open]) => {
    if (open) {
        if (newTransaction) {
            form.value.name = newTransaction.name
            form.value.description = newTransaction.description || ''
            form.value.color = newTransaction.color || 'neutral'
        } else {
            form.value.name = ''
            form.value.description = ''
            form.value.color = 'neutral'
        }
    }
}, { immediate: true })

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
    <UModal v-model:open="isOpen" :title="transaction ? 'Edit Transaction Category' : 'Add Transaction Category'"
        :description="transaction ? 'Update transaction category details below.' : 'Fill in the details below to create a new transaction category.'"
        :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Category Name" name="name" required>
                    <UInput v-model="form.name" placeholder="e.g. Lab Tests" class="w-full" required />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="form.description" placeholder="Short description of this transaction type" class="w-full" />
                </UFormField>

                <UFormField label="Category Color" name="color">
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