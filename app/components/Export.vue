<script setup lang="ts">
const props = withDefaults(defineProps<{
    filename?: string
}>(), {
    filename: 'data'
})

const appToast = useAppToast()

function onExport() {
    appToast.exporting(props.filename)
}
</script>
<template>
    <UButton label="Export" icon="i-lucide-download" @click="onExport" />
</template>