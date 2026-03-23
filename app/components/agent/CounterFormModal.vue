<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import type { Counter } from '~/types/counter'
import { appColors } from '~/constants/colors'
import { useCounters } from '~/composables/useCounters'

const props = defineProps<{
    counter?: Counter | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { addCounter, updateCounter } = useCounters()

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

watch([() => props.counter, isOpen], ([newCounter, open]) => {
    if (open) {
        if (newCounter) {
            form.value.name = newCounter.name
            form.value.description = newCounter.description || ''
            form.value.color = newCounter.color || 'neutral'
        } else {
            form.value.name = ''
            form.value.description = ''
            form.value.color = 'neutral'
        }
    }
}, { immediate: true })

function onSubmit() {
    if (props.counter) {
        updateCounter(props.counter.id, { ...form.value })
    } else {
        addCounter({ ...form.value })
    }
    isOpen.value = false
    emit('success')
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="counter ? 'Edit Counter' : 'Add Counter'"
        :description="counter ? 'Update counter details below.' : 'Fill in the details below to create a new counter.'"
        :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Counter Name" name="name" required>
                    <UInput v-model="form.name" placeholder="e.g. Counter 1" class="w-full" required />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="form.description" placeholder="Short description of this counter" class="w-full" />
                </UFormField>

                <UFormField label="Counter Color" name="color">
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
                    <UButton type="submit" :label="counter ? 'Update Counter' : 'Add Counter'" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
