<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    field: {
        name: string
        label: string
        description?: string
        type: string
        options?: string[] | any[]
        multiple?: boolean
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

const colorsList = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutralsList = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const availableColors = colorsList.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))

const availableNeutrals = neutralsList.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any }
}))

const fileValue = ref<any>(null)

function dataURLtoFile(dataurl: string, filename: string) {
    try {
        const [header, base64Data] = dataurl.split(',')
        if (!header || !base64Data) return null
        const mimeMatch = header.match(/:(.*?);/)
        const mime = mimeMatch ? mimeMatch[1] : 'image/png'
        const bstr = atob(base64Data)
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
    } catch (e) {
        return null
    }
}

watch(() => props.modelValue, (newVal) => {
    if (!import.meta.client) return
    if (props.field.type === 'file') {
        if (typeof newVal === 'string' && newVal.startsWith('data:')) {
            const file = dataURLtoFile(newVal, 'logo.png')
            fileValue.value = file ? [file] : null
        } else {
            fileValue.value = newVal
        }
    }
}, { immediate: true })

function onFileChange(files: any) {
    const file = Array.isArray(files) ? files?.[0] : files
    if (!file) {
        value.value = null
        return
    }
    if (!(file instanceof File)) {
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        value.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}
</script>

<template>
    <UFormField :name="field.name" :label="field.label" :description="field.description"
        class="flex sm:flex-row flex-col justify-between p-4 sm:p-6 gap-2 sm:items-center">

        <UInput v-if="field.type === 'text'" v-model="value" class="w-full sm:w-64" />

        <USelectMenu v-else-if="field.type === 'colors'" v-model="value" :items="availableColors" value-key="value"
            placeholder="Select color" class="w-full sm:w-64">
            <template #leading="{ modelValue: mv, ui }">
                <UChip v-if="mv"
                    :color="((typeof mv === 'string' ? availableColors.find(c => c.value === mv)?.chip.color : (mv as any).chip?.color) as ChipProps['color'])"
                    inset standalone :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                    :class="ui.itemLeadingChip()" />
            </template>
        </USelectMenu>

        <USelectMenu v-else-if="field.type === 'neutrals'" v-model="value" :items="availableNeutrals" value-key="value"
            placeholder="Select color" class="w-full sm:w-64">
            <template #leading="{ modelValue: mv, ui }">
                <UChip v-if="mv"
                    :color="((typeof mv === 'string' ? availableNeutrals.find(c => c.value === mv)?.chip.color : (mv as any).chip?.color) as ChipProps['color'])"
                    inset standalone :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                    :class="ui.itemLeadingChip()" />
            </template>
        </USelectMenu>

        <UFileUpload v-else-if="field.type === 'file'" v-model="fileValue" @update:model-value="onFileChange"
            class="w-full sm:w-48 min-h-48" />

        <UTextarea v-else-if="field.type === 'textarea'" v-model="value" autoresize :rows="2" class="w-full sm:w-64" />

        <UInputNumber v-else-if="field.type === 'number'" v-model="value" class="w-full sm:w-64" />

        <USelect v-else-if="field.type === 'select'" :items="field.options" v-model="value" :multiple="field.multiple"
            value-key="value" class="w-full sm:w-64" />

        <USwitch v-else-if="field.type === 'boolean'" v-model="value" />

        <USelectMenu v-else-if="field.type === 'selectMenu'" v-model="value" :items="field.options"
            :multiple="field.multiple" value-key="value" class="w-full sm:w-64" />

    </UFormField>
</template>
