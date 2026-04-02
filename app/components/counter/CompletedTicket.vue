<script setup lang="ts">
const { transactions } = useTransactions()

interface Props {
    ticket: string
    transactionType?: string
    status: string
    servedAt?: string
    completedAt?: string
    isPriority?: boolean
    isHmo?: boolean
    isRegular?: boolean
    id?: string
    calledAt?: string
    heldAt?: string
    createdAt?: string
    reason?: string
    tags?: string[]
    counter?: string
}

const props = defineProps<Props>()

import { LazyAgentQueueDetails } from '#components'
import type { Ticket } from '~/types/queue'
const overlay = useOverlay()
const slideover = overlay.create(LazyAgentQueueDetails)

function open() {
    slideover.open({
        count: 0,
        queue: props as any as Ticket
    })
}

const timeLabel = computed(() => {
    if (!props.servedAt) return ''
    return new Date(props.servedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const durationLabel = computed(() => {
    if (!props.servedAt || !props.completedAt) return ''
    const start = new Date(props.servedAt).getTime()
    const end = new Date(props.completedAt).getTime()
    const diffMs = end - start
    const mins = Math.floor(diffMs / 60000)
    const secs = Math.floor((diffMs % 60000) / 1000)
    return `${mins}:${secs.toString().padStart(2, '0')}`
})
</script>

<template>
    <UCard :ui="{ body: 'flex items-center justify-between sm:p-4' }"
        class="rounded-xl shadow-sm cursor-pointer hover:scale-[1.01] transition-all duration-200" @click="open">
        <div class="flex items-center gap-2">
            <UIcon :name="status === 'completed' ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                :class="status === 'completed' ? 'text-green-500' : 'text-red-500'" class="size-5" />
            <span class="font-extrabold">{{ ticket }}</span>
            <UBadge v-if="transactionType"
                :color="transactions.find(t => t.name === transactionType)?.color || 'neutral'" variant="subtle"
                size="sm" class="rounded-md">{{ transactionType }}</UBadge>
            <UBadge v-if="isHmo" color="sky" variant="soft" size="sm" class="rounded-md">HMO</UBadge>
            <UBadge v-if="isPriority" color="amber" variant="soft" size="sm" class="rounded-md">Priority</UBadge>
            <UBadge v-if="isRegular" color="neutral" variant="soft" size="sm" class="rounded-md">Regular</UBadge>

            <!-- <UBadge :color="status === 'completed' ? 'green' : 'red'" size="sm" class="rounded-md">{{ status === 'completed' ? 'Completed' : 'Missed' }}</UBadge> -->

        </div>
        <div class="flex items-center gap-3">
            <!-- <div class="flex items-center gap-1 text-xs text-muted">
                <UIcon name="i-lucide-clock" class="size-3" />
                <span>{{ timeLabel }}</span>
            </div> -->
            <UBadge v-if="durationLabel" icon="i-lucide-timer" :label="durationLabel" color="neutral" variant="soft"
                size="sm" class="rounded-md" />
        </div>
    </UCard>
</template>