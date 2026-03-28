<script setup lang="ts">
import type { Ticket } from '~/types/queue'

interface Props {
    ticket: string
    transactionType?: string
    isPriority?: boolean
    isHmo?: boolean
    createdAt?: string
    index?: number
    hideIndex?: boolean
    status?: string
    counter?: string
    id?: string
    tags?: string[]
    servedAt?: string
    completedAt?: string
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

const { waitingTime } = useQueueTime(props.createdAt)
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
            <span class="font-semibold truncate">{{ transactionType || 'General' }}</span>
            <div class="flex items-center gap-2 mt-1">
                <UBadge :color="transactionColor" variant="subtle" size="sm">
                    {{ transactionType || 'General' }}
                </UBadge>
                <UBadge v-if="isHmo" color="purple" variant="soft" size="sm">HMO</UBadge>
                <UBadge v-if="isPriority" color="red" variant="soft" size="sm">Priority</UBadge>
            </div>
        </div>

        <!-- Wait Time / Counter -->
        <div class="text-right shrink-0">
            <!-- if serving, missed, completed: monitor icon and counter -->
            <div v-if="['serving', 'missed', 'completed'].includes(status!)"
                class="flex items-center justify-end gap-1 text-sm text-muted">
                <UIcon name="i-lucide-monitor" class="size-3.5" />
                <span>{{ counter || 'N/A' }}</span>
            </div>

            <!-- Wait time: always show if not serving/missed/completed, or if we want both (card had it separate) -->
            <!-- But let's follow the card's logic which showed one or the other -->
            <div v-else class="flex items-center justify-end gap-1 text-sm text-muted">
                <UIcon name="i-lucide-clock" class="size-3.5" />
                <span>{{ waitingTime }}</span>
            </div>
        </div>
    </UCard>
</template>