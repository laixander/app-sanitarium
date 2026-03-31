<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    title: string
    icon: string
    id?: string
}

const props = defineProps<Props>()

const sectionId = computed(() => props.id || props.title.toLowerCase().replace(/\s+/g, '-'))
</script>

<template>
    <section :id="sectionId" class="scroll-mt-24">
        <div class="flex items-center gap-3 mb-6">
            <UIcon :name="props.icon" class="size-8 text-primary" />
            <h2 class="text-3xl font-bold tracking-tight">{{ props.title }}</h2>
        </div>
        <slot />
    </section>
</template>