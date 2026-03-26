<script setup lang="ts">
import type { Ticket } from '~/types/queue'

interface Props {
    ticket: string
    transactionType?: string
    isPriority?: boolean
    createdAt?: string
    index: number
}

const props = defineProps<Props>()

const waitTime = computed(() => {
    if (!props.createdAt) return ''
    const diff = Date.now() - new Date(props.createdAt).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
})
</script>

<template>
    <UCard
        :ui="{ body: 'flex items-center gap-4 sm:p-4' }"
        class="rounded-xl shadow-sm"
        :class="index === 0 ? 'ring-primary/30 bg-primary/5 shadow-primary/20' : ''">
        <!-- Ticket Number -->
        <div class="flex flex-col items-center min-w-[56px]">
            <span class="text-xs font-medium text-muted uppercase tracking-wider">{{ index === 0 ? 'Next' : '#' + (index + 1) }}</span>
            <span class="text-lg font-bold" :class="index === 0 ? 'text-primary' : ''">{{ ticket }}</span>
        </div>

        <USeparator orientation="vertical" class="h-10" />

        <!-- Transaction Info -->
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <span class="font-semibold truncate">{{ transactionType || 'General' }}</span>
                <UIcon v-if="isPriority" name="i-lucide-alert-triangle" class="size-4 text-amber shrink-0" />
            </div>
            <div class="flex items-center gap-2 mt-1">
                <UBadge :color="transactionType === 'Consultation' ? 'sky' : 'indigo'" variant="subtle" size="sm">
                    {{ transactionType }}
                </UBadge>
                <span v-if="isPriority" class="text-xs font-medium text-amber">Priority</span>
            </div>
        </div>

        <!-- Wait Time -->
        <div class="text-right shrink-0">
            <div class="flex items-center gap-1 text-sm text-muted">
                <UIcon name="i-lucide-clock" class="size-3.5" />
                <span>{{ waitTime }}</span>
            </div>
        </div>
    </UCard>
</template>