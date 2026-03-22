<script setup lang="ts">
import { appColors } from '~/utils/colors'
import type { ChipProps } from '@nuxt/ui'
import { computed } from 'vue'

const props = defineProps<{
    field: {
        name: string
        label: string
        description?: string
        type: string
        options?: string[] | any[]
    }
    modelValue: any
}>()

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>()

const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const availableColors = appColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))
</script>

<template>
    <UFormField :name="field.name" :label="field.label" :description="field.description"
        class="flex sm:flex-row flex-col justify-between p-4 sm:p-6 gap-2 sm:items-center">

        <UInput v-if="field.type === 'text'" v-model="value" class="w-full sm:w-64" />

        <USelectMenu v-else-if="field.type === 'color'" v-model="value" :items="availableColors" value-key="value"
            placeholder="Select color" class="w-full sm:w-64">
            <template #leading="{ modelValue: mv, ui }">
                <UChip v-if="mv"
                    :color="((typeof mv === 'string' ? availableColors.find(c => c.value === mv)?.chip.color : (mv as any).chip?.color) as ChipProps['color'])"
                    inset standalone :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                    :class="ui.itemLeadingChip()" />
            </template>
        </USelectMenu>

        <UFileUpload v-else-if="field.type === 'file'" v-model="value" class="w-full sm:w-96 min-h-48" />

        <UTextarea v-else-if="field.type === 'textarea'" v-model="value" autoresize :rows="2" class="w-full sm:w-64" />

        <UInputNumber v-else-if="field.type === 'number'" v-model="value" class="w-full sm:w-40" />

        <USelect v-else-if="field.type === 'select'" :items="field.options" v-model="value" class="w-full sm:w-40" />

        <USwitch v-else-if="field.type === 'boolean'" v-model="value" />

    </UFormField>
</template>
