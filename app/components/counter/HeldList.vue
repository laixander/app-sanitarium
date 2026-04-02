<script setup lang="ts">
import type { Ticket } from '~/types/queue'

defineProps<{
    tickets: Ticket[]
    disabled?: boolean
}>()

defineEmits<{
    (e: 'recall', id: string): void
}>()
</script>

<template>
    <div class="transition-all duration-300" :class="disabled ? 'opacity-60 grayscale' : ''">
        <div class="flex items-center gap-2 text-sm text-muted mb-4">
            <UIcon name="i-lucide-pause-circle" class="size-4 text-warning" />
            <div class="font-semibold uppercase tracking-wider text-xs">On Hold / Skipped</div>
        </div>
        <div v-if="tickets.length" class="space-y-3">
            <CounterHeldTicket v-for="t in tickets" :key="t.id" v-bind="t" :disabled="disabled" @recall="$emit('recall', t.id)" />
        </div>
        <div v-else class="text-center py-6 border border-dashed border-muted rounded-xl bg-muted dark:bg-muted/50">
            <p class="text-sm text-dimmed">No tickets on hold.</p>
        </div>
    </div>
</template>
