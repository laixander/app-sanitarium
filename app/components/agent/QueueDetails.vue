<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import { statusColors, tagColors } from '~/constants/queue'
import { upperFirst } from 'scule'

const { transactions } = useTransactions()

const props = defineProps<{
    count: number
    queue: Ticket
}>()

const getTransactionColor = (name: string) => {
    return transactions.value.find(t => t.name === name)?.color || 'neutral'
}

const emit = defineEmits<{ close: [boolean] }>()

const getTagColor = (tag: string) => {
    return (tagColors as any)[tag] || 'neutral'
}

const { getAverageServiceTime } = useTickets()
const avgServiceTime = computed(() => getAverageServiceTime(props.queue.counter))

const { waitingTime, serviceTime } = useQueueTime(props.queue.createdAt, props.queue.servedAt, props.queue.status, props.queue.accumulatedServiceDuration)

const formatTime = (iso?: string) => {
    if (!iso) return 'N/A'
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const description = computed(() => {
    switch (props.queue.status) {
        case 'serving':
            return props.queue.counter
                ? `This ticket is currently being served at ${props.queue.counter}`
                : 'This ticket is currently being served'
        case 'waiting':
            return 'This ticket is currently waiting to be called'
        case 'missed':
            return 'This ticket was marked as missed'
        case 'completed':
            return 'This ticket has been marked as completed'
        default:
            return 'Ticket details'
    }
})

const displayTags = computed(() => {
    const t = new Set<string>(props.queue.tags || [])
    if (props.queue.isHmo) t.add('HMO')
    if (props.queue.isPriority) t.add('Priority')
    return Array.from(t)
})


</script>

<template>
    <USlideover :close="{ onClick: () => emit('close', false) }" :description="description">
        <template #title>
            <div class="flex items-center gap-3">
                <span class="text-xl font-bold">{{ queue.ticket }}</span>
                <UBadge v-if="queue.transactionType" :label="queue.transactionType"
                    :color="getTransactionColor(queue.transactionType)" variant="soft" class="font-semibold" />
            </div>
        </template>
        <template #body>
            <div class="flex flex-col gap-6">
                <!-- Status & Identity -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Status</span>
                        <UBadge :label="upperFirst(queue.status)" :color="statusColors[queue.status]" variant="subtle"
                            class="w-fit" />
                    </div>
                    <div v-if="queue.counter" class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Counter</span>
                        <div class="font-semibold text-sm flex items-center gap-1">
                            <UIcon name="i-lucide-monitor" class="size-5" />
                            {{ queue.counter }}
                        </div>
                    </div>
                </div>

                <!-- HMO, PWD, Senior, etc -->
                <!-- <div v-if="displayTags.length" class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Details</span>
                        <div class="flex flex-wrap gap-2">
                            <UBadge v-for="tag in displayTags" :key="tag" :label="tag" :color="getTagColor(tag)"
                                variant="soft" />
                        </div>
                    </div>
                </div> -->

                <!-- Reason Alert -->
                <UAlert v-if="queue.reason" variant="soft"
                    :color="['missed'].includes(queue.status) ? 'error' : (['held', 'skipped'].includes(queue.status) ? 'warning' : 'primary')"
                    class="rounded-lg">
                    <template #title>
                        <span class="font-semibold text-sm">Reason for {{ queue.status }}</span>
                    </template>
                    <template #description>
                        <span class="text-sm font-medium">{{ queue.reason }}</span>
                    </template>
                </UAlert>

                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-x-4 gap-y-3 bg-default/5 rounded-lg p-4 border border-default">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Created At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.createdAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Waiting Time</span>
                        <span class="text-sm font-bold text-primary">{{ waitingTime }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Called At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.calledAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Started At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.servedAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Held At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.heldAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Completed At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.completedAt) }}</span>
                    </div>
                </div>

                <!-- Service Stats -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Service Duration</span>
                        <span class="text-sm font-bold text-primary">{{ serviceTime }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Avg. Counter Time</span>
                        <span class="text-sm font-bold text-blue-500">{{ avgServiceTime }}</span>
                    </div>
                </div>

                <!-- Tags -->
                <div v-if="queue.tags?.length" class="flex flex-col gap-2">
                    <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Tags</span>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in queue.tags" :key="tag" :label="tag" :color="getTagColor(tag)"
                            variant="outline" />
                    </div>
                </div>

            </div>
        </template>

        <template #footer>
            <div class="flex gap-2">
                <UButton color="neutral" variant="ghost" label="Close" @click="emit('close', false)" />
                <!-- <UButton label="Success" @click="emit('close', true)" /> -->
            </div>
        </template>
    </USlideover>
</template>
