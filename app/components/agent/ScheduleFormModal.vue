<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import type { Schedule } from '~/types/schedule'
import { appColors } from '~/constants/colors'
import { useSchedules } from '~/composables/useSchedules'

const props = defineProps<{
    schedule?: Schedule | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { addSchedule, updateSchedule } = useSchedules()

const form = ref({
    name: '',
    startTime: '08:00',
    endTime: '17:00',
    color: 'neutral' as any
})

const availableColors = appColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))

watch([() => props.schedule, isOpen], ([newSchedule, open]) => {
    if (open) {
        if (newSchedule) {
            form.value.name = newSchedule.name
            form.value.startTime = newSchedule.startTime
            form.value.endTime = newSchedule.endTime
            form.value.color = newSchedule.color || 'neutral'
        } else {
            form.value.name = ''
            form.value.startTime = '08:00'
            form.value.endTime = '17:00'
            form.value.color = 'neutral'
        }
    }
}, { immediate: true })

function onSubmit() {
    if (props.schedule) {
        updateSchedule(props.schedule.id, { ...form.value })
    } else {
        addSchedule({ ...form.value })
    }
    isOpen.value = false
    emit('success')
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="schedule ? 'Edit Schedule' : 'Add Schedule'"
        :description="schedule ? 'Update schedule details below.' : 'Fill in the details below to create a new schedule.'"
        :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Schedule Name" name="name" required>
                    <UInput v-model="form.name" placeholder="e.g. Morning Shift" class="w-full" required />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Start Time" name="startTime" required>
                        <UInput v-model="form.startTime" type="time" class="w-full" required />
                    </UFormField>
                    <UFormField label="End Time" name="endTime" required>
                        <UInput v-model="form.endTime" type="time" class="w-full" required />
                    </UFormField>
                </div>

                <UFormField label="Schedule Color" name="color">
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
                    <UButton type="submit" :label="schedule ? 'Update Schedule' : 'Add Schedule'" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
