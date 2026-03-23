<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import { statusColors, tagColors } from '~/constants/queue'
import { LazyAgentQueueDetails } from '#components'

const props = defineProps<Ticket>()
const { now } = useTimer()

const waitingTime = computed(() => {
    if (!props.createdAt) return 'N/A'

    const start = new Date(props.createdAt).getTime()
    const end = (['serving', 'missed', 'completed'].includes(props.status) && props.servedAt)
        ? new Date(props.servedAt).getTime()
        : now.value

    const diffMs = Math.max(0, end - start)
    const diffMin = Math.floor(diffMs / 60000)
    const diffSec = Math.floor((diffMs % 60000) / 1000)

    if (diffMin > 0) return `${diffMin}m ${diffSec}s`
    return `${diffSec}s`
})

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

const toast = useToast()
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

        toast.add({
            title: `Success: ${shouldIncrement}`,
            color: 'success',
            id: 'slideover-success'
        })

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
        class="shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" @click="open">
        <div class="flex items-center gap-2">
            <div class="text-lg font-extrabold whitespace-nowrap">{{ ticket }}</div>
            <UBadge v-for="tag in allTags" :key="tag" :label="tag" :color="getTagColor(tag)" variant="subtle" />
        </div>

        <!-- if waiting: waitingTime -->
        <div v-if="status === 'waiting' || !status" class="flex items-center gap-1 text-sm text-dimmed">
            <UIcon name="i-lucide-clock" class="shrink-0" />
            <div>{{ waitingTime }}</div>
        </div>

        <!-- if serving, missed, completed: counter -->
        <div v-else-if="['serving', 'missed', 'completed'].includes(status!)"
            class="flex items-center gap-1 text-sm text-dimmed">
            <UIcon name="i-lucide-monitor" />
            <div>{{ counter || 'N/A' }}</div>
        </div>

        <!-- other statuses: show total wait time -->
        <div v-else class="flex items-center gap-1 text-sm text-dimmed text-nowrap">
            <UIcon name="i-lucide-clock" />
            <div class="truncate">{{ waitingTime }}</div>
        </div>

        <!-- apply color based on status -->
        <div class="absolute top-1.5 left-1 bg-accented w-1 h-[calc(100%-12px)] rounded-full overflow-hidden">
            <div class="w-full h-full" :class="`bg-${statusColors[status!]}`">
            </div>
        </div>
    </UCard>
</template>