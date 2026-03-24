<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import { statusColors, tagColors } from '~/constants/queue'
import { upperFirst } from 'scule'

const props = defineProps<{
    count: number
    queue: Ticket
}>()

const emit = defineEmits<{ close: [boolean] }>()

const getTagColor = (tag: string) => {
    return (tagColors as any)[tag] || 'neutral'
}

const { now } = useTimer()

const waitingTime = computed(() => {
    if (!props.queue.createdAt) return 'N/A'

    const start = new Date(props.queue.createdAt).getTime()
    const end = (['serving', 'missed', 'completed'].includes(props.queue.status) && props.queue.servedAt)
        ? new Date(props.queue.servedAt).getTime()
        : now.value

    const diffMs = Math.max(0, end - start)
    const diffMin = Math.floor(diffMs / 60000)
    const diffSec = Math.floor((diffMs % 60000) / 1000)

    if (diffMin > 0) return `${diffMin}m ${diffSec}s`
    return `${diffSec}s`
})

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

const mockFeedback = [
    {
        ticket: props.queue.ticket === 'B-127',
        rating: 4,
        comment: "The agent was very helpful with my concerns and processed everything quickly. Highly recommended!"
    },
    {
        ticket: props.queue.ticket === 'P-125',
        rating: 5,
        comment: "The agent was very accommodating and friendly."
    }
]

const feedback = computed(() => mockFeedback.find(f => f.ticket))
</script>

<template>
    <USlideover :close="{ onClick: () => emit('close', false) }" :title="`${queue.ticket}`" :description="description">
        <template #body>
            <div class="flex flex-col gap-6">
                <!-- Status & Identity -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Status</span>
                        <UBadge :label="upperFirst(queue.status)" :color="statusColors[queue.status]" variant="subtle" />
                    </div>
                    <div v-if="queue.counter" class="flex flex-col gap-1 text-right">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Counter</span>
                        <div class="font-bold text-lg flex items-center gap-1 justify-end">
                            <UIcon name="i-lucide-monitor" class="size-5" />
                            {{ queue.counter }}
                        </div>
                    </div>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-4 bg-default/5 rounded-lg p-4 border border-default">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Created At</span>
                        <span class="text-sm font-semibold">{{ formatTime(queue.createdAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Waiting Time</span>
                        <span class="text-sm font-bold text-primary">{{ waitingTime }}</span>
                    </div>
                </div>

                <!-- Tags -->
                <div v-if="queue.tags?.length" class="flex flex-col gap-2">
                    <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Tags</span>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in queue.tags" :key="tag" :label="tag" :color="getTagColor(tag)" variant="outline" />
                    </div>
                </div>

                <template v-if="!['waiting', 'missed'].includes(queue.status)">
                    <USeparator />

                    <div class="flex flex-col gap-2">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Customer Feedback</span>
                        <!-- Customer Feedback UI Placeholder -->
                        <UCard v-if="feedback" :ui="{ body: 'sm:p-4' }">
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-semibold">Service Rating</span>
                                    <div class="flex items-center text-amber-500 gap-0.5">
                                        <UIcon v-for="star in 5" :key="star"
                                            :name="feedback.rating >= star ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                                            class="size-4" :class="feedback.rating < star ? 'text-dimmed' : ''" />
                                    </div>
                                </div>
                                
                                <div v-if="feedback.comment" class="p-4 bg-muted rounded-lg">
                                    <p class="text-sm text-dimmed italic">"{{ feedback.comment }}"</p>
                                </div>
                            </div>
                        </UCard>
                        <div v-else class="text-center p-8 bg-default/5 rounded-lg border border-dashed border-default">
                            <UIcon name="i-lucide-message-square-off" class="size-8 mx-auto text-dimmed mb-2" />
                            <p class="text-sm text-dimmed">No feedback provided for this ticket yet.</p>
                        </div>
                    </div>
                </template>
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
