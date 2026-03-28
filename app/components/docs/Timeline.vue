<script setup lang="ts">
interface TimelineItem {
    title: string
    description?: string
    status?: string
    [key: string]: any
}

const props = defineProps<{
    items: TimelineItem[]
}>()
</script>

<template>
    <div class="relative border-l-2 border-primary/20 ml-4 space-y-12">
        <div v-for="(item, i) in props.items" :key="i" class="relative pl-8">
            <div
                class="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-white dark:ring-neutral-950" />

            <slot name="item" :item="item" :index="i">
                <UBadge v-if="item.status" :variant="i === 0 ? 'solid' : 'subtle'" class="mb-2">
                    {{ item.status }}
                </UBadge>
                <h4 class="text-lg font-bold">{{ item.title }}</h4>
                <p class="text-sm text-neutral-500">{{ item.description }}</p>
            </slot>
        </div>
    </div>
</template>