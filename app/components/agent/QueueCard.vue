<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import { statusColors, tagColors } from '~/constants/queue'
import { LazyAgentQueueDetails } from '#components'

const props = defineProps<Ticket>()
const { waitingTime, serviceTime } = useQueueTime(props.createdAt, props.servedAt, props.status, props.accumulatedServiceDuration)

const allTags = computed(() => {
    const result = [...(props.tags || [])]
    if (props.isHmo && !result.includes('HMO')) result.push('HMO')
    if (props.isPriority && !result.includes('Priority')) result.push('Priority')
    return result
})

const getTagColor = (tag: string) => {
    return (tagColors as any)[tag] || 'neutral'
}


// slideover programmatic usage
const count = ref(0)

const appToast = useAppToast()
const overlay = useOverlay()

const slideover = overlay.create(LazyAgentQueueDetails)

async function open() {
    const instance = slideover.open({
        count: count.value,
        queue: props
    })

    const shouldIncrement = await instance.result

    if (shouldIncrement) {
        count.value++

        appToast.success(`Success: ${shouldIncrement}`)

        // Update the count
        slideover.patch({
            count: count.value
        })
        return
    }
}
</script>
<template>
    <UCard variant="subtle" :ui="{ body: 'flex items-center justify-between gap-6 sm:p-4 relative' }"
        class="shrink-0 shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
        @click="open">
        <div class="flex items-center gap-2">
            <div class="text-lg font-extrabold whitespace-nowrap">{{ ticket }}</div>
            <UBadge v-for="tag in allTags" :key="tag" :label="tag" :color="getTagColor(tag)" variant="subtle" />
        </div>

        <!-- Waiting: Waiting time -->
        <div v-if="status === 'waiting' || !status" class="flex items-center gap-1 text-sm text-dimmed">
            <UIcon name="i-lucide-clock" class="shrink-0" />
            <div>{{ waitingTime }}</div>
        </div>

        <!-- Serving: Active timer -->
        <div v-else-if="status === 'serving'" class="flex items-center gap-1 text-sm text-primary font-bold animate-pulse">
            <UIcon name="i-lucide-play" class="shrink-0" />
            <div>{{ serviceTime }}</div>
        </div>

        <!-- Held: Paused timer -->
        <div v-else-if="status === 'held'" class="flex items-center gap-1 text-sm text-amber-500 font-semibold">
            <UIcon name="i-lucide-pause" class="shrink-0" />
            <div>{{ serviceTime }}</div>
        </div>

        <!-- Skipped: Pause icon -->
        <div v-else-if="status === 'skipped'" class="flex items-center gap-1 text-sm text-muted">
            <UIcon name="i-lucide-pause-circle" class="shrink-0" />
            <span>Skipped</span>
        </div>

        <!-- Completed/Missed: Service time or counter -->
        <div v-else class="flex items-center gap-1 text-sm text-dimmed">
            <UIcon name="i-lucide-monitor" class="shrink-0" />
            <div>{{ counter || 'N/A' }}</div>
        </div>

        <!-- apply color based on status -->
        <div class="absolute top-1.5 left-1 bg-accented w-1 h-[calc(100%-12px)] rounded-full overflow-hidden">
            <div class="w-full h-full" :class="`bg-${statusColors[status!]}`">
            </div>
        </div>
    </UCard>
</template>