<script setup lang="ts">
const props = withDefaults(defineProps<{
    filename?: string
}>(), {
    filename: 'data'
})

const toast = useToast()

function onExport() {
    toast.add({
        title: 'Exporting...',
        description: `Your ${props.filename} are being prepared for export.`,
        color: 'success',
        icon: 'i-lucide-check-circle'
    })
}
</script>
<template>
    <UButton label="Export" icon="i-lucide-download" @click="onExport" />
</template>