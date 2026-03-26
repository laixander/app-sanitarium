<script setup lang="ts">
import type { Ticket } from '~/types/queue'

defineProps<{
    tickets: Ticket[]
    disabled?: boolean
}>()
</script>

<template>
    <div class="transition-all duration-300" :class="disabled ? 'opacity-60 grayscale' : ''">
        <div class="flex items-center gap-2 text-sm text-muted mb-4">
            <UIcon name="i-lucide-history" class="size-4" />
            <div class="font-semibold uppercase tracking-wider text-xs">Recently Completed</div>
        </div>
        <div v-if="tickets.length" class="space-y-3">
            <CounterCompletedTicket v-for="t in tickets" :key="t.id" v-bind="t" />
        </div>
        <div v-else class="text-center py-6 border border-dashed border-muted rounded-xl bg-muted dark:bg-muted/50">
            <p class="text-sm text-dimmed">No tickets served yet today.</p>
        </div>
    </div>
</template>