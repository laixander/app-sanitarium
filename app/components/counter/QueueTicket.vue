<script setup lang="ts">
import type { Ticket } from '~/types/queue'

interface Props {
    ticket: string
    transactionType?: string
    isPriority?: boolean
    isHmo?: boolean
    isRegular?: boolean
    createdAt?: string
    index?: number
    hideIndex?: boolean
    status?: string
    counter?: string
    id?: string
    tags?: string[]
    servedAt?: string
    completedAt?: string
    accumulatedServiceDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
    index: 0
})

import { LazyAgentQueueDetails } from '#components'
const appToast = useAppToast()
const overlay = useOverlay()
const count = ref(0)
const slideover = overlay.create(LazyAgentQueueDetails)

async function open() {
    if (!props.hideIndex) return

    const instance = slideover.open({
        count: count.value,
        queue: props as any as Ticket
    })

    const shouldIncrement = await instance.result

    if (shouldIncrement) {
        count.value++
        appToast.success(`Success: ${shouldIncrement}`)
        slideover.patch({
            count: count.value
        })
        return
    }
}

const { transactions } = useTransactions()

const transactionColor = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.color : 'primary'
})

const { getAverageServiceTime } = useTickets()
const avgServiceTime = computed(() => getAverageServiceTime(props.counter))

const { waitingTime, serviceTime } = useQueueTime(props.createdAt, props.servedAt, props.status, props.accumulatedServiceDuration)
</script>

<template>
    <UCard :ui="{ body: 'flex items-center gap-4 sm:p-4' }"
        class="shrink-0 rounded-xl shadow-sm transition-all duration-200" :class="[
            index === 0 && !hideIndex ? 'ring-primary/30 bg-primary/5 shadow-primary/20' : '',
            hideIndex ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : ''
        ]" @click="open">
        <!-- Ticket Number -->
        <div v-if="!hideIndex" class="flex flex-col items-center min-w-[56px]">
            <span class="text-xs font-medium text-muted uppercase tracking-wider">{{ index === 0 ? 'Next' : '#' + (index
                + 1) }}</span>
            <span class="text-lg font-bold" :class="index === 0 ? 'text-primary' : ''">{{ ticket }}</span>
        </div>

        <div v-else class="flex flex-col items-center min-w-[56px]">
            <span class="text-lg font-bold">{{ ticket }}</span>
        </div>

        <USeparator orientation="vertical" class="h-10" />

        <!-- Transaction Info -->
        <div class="flex-1 min-w-0">
            <!-- <span class="font-semibold truncate">{{ transactionType || 'General' }}</span> -->
            <UBadge :color="transactionColor" variant="subtle" size="sm">
                {{ transactionType || 'General' }}
            </UBadge>
            <div class="flex items-center gap-2 mt-1">
                <UBadge v-if="isHmo" color="purple" variant="soft" size="sm">HMO</UBadge>
                <UBadge v-if="isPriority" color="red" variant="soft" size="sm">Priority</UBadge>
                <UBadge v-if="isRegular" color="neutral" variant="soft" size="sm">Regular</UBadge>
            </div>
        </div>

        <!-- Wait Time / Counter / Status indicators -->
        <div class="text-right shrink-0">
            <!-- Commented out counter UI as per request -->
            <!-- <div v-if="['serving', 'missed', 'completed', 'held', 'skipped'].includes(status!)"
                class="flex items-center justify-end gap-1 text-sm text-muted">
                <UIcon name="i-lucide-monitor" class="size-3.5" />
                <span>{{ counter || 'N/A' }}</span>
            </div> -->

            <!-- Serving: Active timer -->
            <div v-if="status === 'serving'" class="flex items-center justify-end gap-1 text-sm text-primary">
                <UIcon name="i-lucide-play" class="size-3.5" />
                <span>{{ serviceTime }}</span>
            </div>

            <!-- Held: Paused timer -->
            <div v-else-if="status === 'held'" class="flex items-center justify-end gap-1 text-sm text-amber-500">
                <UIcon name="i-lucide-pause" class="size-3.5" />
                <span>{{ serviceTime }}</span>
            </div>

            <!-- Skipped: Pause icon -->
            <div v-else-if="status === 'skipped'" class="flex items-center justify-end gap-1 text-sm text-amber-500">
                <UIcon name="i-lucide-skip-forward" class="size-3.5" />
            </div>

            <!-- Completed: Avg. Service Time -->
            <div v-else-if="status === 'completed'" class="flex flex-col items-end">
                <span class="text-[10px] text-muted uppercase font-semibold leading-none mb-0.5 tracking-tight">Avg.
                    Service</span>
                <span class="text-sm text-blue-500">{{ avgServiceTime }}</span>
            </div>

            <!-- Missed or No Status: don't show any timer -->
            <div v-else-if="status === 'missed'">
            </div>

            <!-- Default (Waiting): Waiting time -->
            <div v-else class="flex items-center justify-end gap-1 text-sm text-muted">
                <UIcon name="i-lucide-clock" class="size-3.5" />
                <span>{{ waitingTime }}</span>
            </div>
        </div>
    </UCard>
</template>