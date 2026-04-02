<script setup lang="ts">
defineProps<{
    servedToday: number
    missedCount: number
    heldCount: number
    isOnline: boolean
    isBusy?: boolean
}>()

defineEmits<{
    (e: 'update:isOnline', value: boolean): void
}>()
</script>

<template>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
        <div class="flex items-center gap-8 transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
            <div class="space-y-1">
                <p class="text-xs uppercase font-medium text-muted tracking-wider">Served Today</p>
                <div class="flex items-center gap-2 font-bold text-lg">
                    <UIcon name="i-lucide-circle-check-big" class="h-4 w-4 text-success" />
                    {{ servedToday }}
                </div>
            </div>
            <div class="space-y-1">
                <p class="text-xs uppercase font-medium text-muted tracking-wider">Missed/No Show</p>
                <div class="flex items-center gap-2 font-bold text-lg">
                    <UIcon name="i-lucide-circle-x" class="h-4 w-4 text-error" />
                    {{ missedCount }}
                </div>
            </div>
            <div class="space-y-1">
                <p class="text-xs uppercase font-medium text-muted tracking-wider">On Hold/Skipped</p>
                <div class="flex items-center gap-2 font-bold text-lg">
                    <UIcon name="i-lucide-pause-circle" class="h-4 w-4 text-warning" />
                    {{ heldCount }}
                </div>
            </div>
        </div>
        <CounterStatusButton :is-online="isOnline" :is-busy="isBusy" @update:is-online="$emit('update:isOnline', $event)" />
    </div>
</template>
