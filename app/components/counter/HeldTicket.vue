<script setup lang="ts">
const { transactions } = useTransactions()

interface Props {
    id: string
    ticket: string
    transactionType?: string
    status: string
    isPriority?: boolean
    isHmo?: boolean
    isRegular?: boolean
    calledAt?: string
    heldAt?: string
    servedAt?: string
    completedAt?: string
    createdAt?: string
    reason?: string
    tags?: string[]
    counter?: string
    disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'recall'): void
}>()

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
    const time = props.calledAt
    if (!time) return ''
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
    <UCard :ui="{ body: 'flex items-center justify-between sm:p-4' }"
        class="rounded-xl shadow-sm cursor-pointer hover:scale-[1.01] transition-all duration-200" @click="open">
        <div class="flex items-center gap-2">
            <UIcon :name="status === 'held' ? 'i-lucide-pause-circle' : 'i-lucide-skip-forward'"
                :class="status === 'held' ? 'text-sky-500' : 'text-yellow-500'" class="size-5" />
            <span class="font-extrabold">{{ ticket }}</span>
            <UBadge v-if="transactionType"
                :color="transactions.find(t => t.name === transactionType)?.color || 'neutral'" variant="subtle"
                size="sm" class="rounded-md">{{ transactionType }}</UBadge>
            <UBadge v-if="isHmo" color="purple" variant="soft" size="sm" class="rounded-md">HMO</UBadge>
            <UBadge v-if="isPriority" color="red" variant="soft" size="sm" class="rounded-md">Priority</UBadge>
            <UBadge v-if="isRegular" color="neutral" variant="soft" size="sm" class="rounded-md">Regular</UBadge>
        </div>
        <UButton label="Call Again" icon="i-lucide-phone-forwarded" size="sm" color="warning" :disabled="disabled"
            @click.stop="emit('recall')" />
    </UCard>
    <!-- <UCard :ui="{ body: 'flex items-center justify-between sm:p-4' }"
        class="rounded-xl shadow-sm border-l-4 border-warning/50">
        <div class="flex items-center gap-3">
            <div class="flex flex-col items-center justify-center min-w-[48px] py-1 bg-muted rounded-lg border"
                :class="status === 'held' ? 'border-sky-500/30' : 'border-orange-500/30'">
                <UIcon :name="status === 'held' ? 'i-lucide-pause-circle' : 'i-lucide-skip-forward'"
                    :class="status === 'held' ? 'text-sky-500' : 'text-orange-500'" class="size-4 mb-1" />
                <span class="font-extrabold text-lg leading-none">{{ ticket }}</span>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">

                    <UBadge v-if="isHmo" color="purple" variant="soft" size="sm" class="rounded-md">HMO</UBadge>
                    <UBadge v-if="isPriority" color="red" variant="soft" size="sm" class="rounded-md">Priority</UBadge>
                </div>
                <div class="flex items-center gap-1 text-[10px] text-muted font-medium">
                    <UIcon name="i-lucide-clock" class="size-3" />
                    <span>Called at {{ timeLabel }}</span>
                </div>
            </div>
        </div>

        <UButton label="Call Again" icon="i-lucide-phone-forwarded" size="sm" color="warning" variant="soft"
            @click="$emit('recall')" />
    </UCard> -->
</template>
