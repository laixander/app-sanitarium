<template>
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold">{{ title }}</h2>
            <p v-if="description" class="text-sm text-muted">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    description?: string
}

const props = defineProps<Props>()
</script>