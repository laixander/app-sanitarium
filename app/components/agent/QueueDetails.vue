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


</script>

<template>
    <USlideover :close="{ onClick: () => emit('close', false) }" :title="`${queue.ticket}`" :description="description">
        <template #body>
            <div class="flex flex-col gap-6">
                <!-- Status & Identity -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-dimmed uppercase tracking-wider">Status</span>
                        <UBadge :label="upperFirst(queue.status)" :color="statusColors[queue.status]"
                            variant="subtle" />
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
