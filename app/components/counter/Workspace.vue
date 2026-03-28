<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import type { AppColor } from '~/types/ui'
const { transactions } = useTransactions()

const props = defineProps<{
    servingTicket?: Ticket
    queueLength: number
    isOnline: boolean
}>()

defineEmits<{
    (e: 'callNext'): void
    (e: 'complete'): void
    (e: 'miss'): void
    (e: 'reannounce'): void
}>()

const servingBadgeColor = computed<AppColor>(() => {
    if (!props.servingTicket?.transactionType) return 'primary'
    const tx = transactions.value.find(t => t.name === props.servingTicket?.transactionType)
    return tx ? tx.color : 'primary'
})

const servingShadowClass = computed(() => {
    return `shadow-${servingBadgeColor.value}/20`
})

// Live elapsed timer — starts from servedAt
const elapsedSeconds = ref(0)

function formatElapsed(totalSeconds: number): string {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const mm = String(mins).padStart(2, '0')
    const ss = String(secs).padStart(2, '0')
    return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mm}:${ss}`
}

const elapsedDisplay = computed(() => formatElapsed(elapsedSeconds.value))

watchEffect((onCleanup) => {
    const servedAt = props.servingTicket?.servedAt
    if (!servedAt) {
        elapsedSeconds.value = 0
        return
    }

    const start = new Date(servedAt).getTime()

    // Set initial value immediately
    elapsedSeconds.value = Math.max(0, Math.floor((Date.now() - start) / 1000))

    const interval = setInterval(() => {
        elapsedSeconds.value = Math.max(0, Math.floor((Date.now() - start) / 1000))
    }, 1000)

    onCleanup(() => clearInterval(interval))
})
</script>

<template>
    <div class="transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <!-- NOW SERVING VIEW -->
        <div v-if="servingTicket"
            class="min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 p-8 bg-primary/5">
            <div class="text-center space-y-6 w-full max-w-sm">
                <p class="text-sm font-semibold uppercase tracking-widest text-primary">Now Serving</p>

                <UBadge class="rounded-2xl p-8 shadow-lg mx-auto w-fit min-w-[180px]" :class="servingShadowClass"
                    :color="servingBadgeColor">
                    <p class="text-5xl font-extrabold tracking-wide">{{ servingTicket.ticket }}</p>
                </UBadge>

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <UBadge variant="subtle" :color="servingBadgeColor">{{ servingTicket.transactionType }}</UBadge>
                    <UBadge v-if="servingTicket.isHmo" color="purple" variant="soft">HMO / Insurance</UBadge>
                    <UBadge v-if="servingTicket.isPriority" color="red" variant="soft">Priority</UBadge>
                    <!-- Display any other tags if they exist and aren't HMO/Priority (which are already handled above) -->
                    <template v-for="tag in servingTicket.tags" :key="tag">
                        <UBadge v-if="tag !== 'HMO' && tag !== 'Priority'" variant="outline" color="neutral">{{ tag }}
                        </UBadge>
                    </template>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <UButton label="Complete" icon="i-lucide-circle-check-big" color="success" size="lg" block
                        class="px-8 py-3" :disabled="!isOnline" @click="$emit('complete')" />
                    <UButton label="No Show" icon="i-lucide-circle-x" color="error" size="lg" block class="px-8 py-3"
                        :disabled="!isOnline" @click="$emit('miss')" />
                    <UButton label="Re-announce Ticket" icon="i-lucide-volume-2" color="neutral" variant="outline"
                        size="lg" block class="px-8 py-3 col-span-2" :disabled="!isOnline"
                        @click="$emit('reannounce')" />
                </div>

                <div class="flex items-center justify-center gap-2 text-muted">
                    <UIcon name="i-lucide-timer" class="w-5 h-5" />
                    <p class="text-sm font-mono tabular-nums">{{ elapsedDisplay }}</p>
                </div>
            </div>
        </div>

        <!-- WAITING / IDLE VIEW -->
        <div v-else
            class="min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-8 bg-muted">
            <div class="text-center space-y-6">
                <UBadge icon="i-lucide-ticket" color="sky" variant="soft" :ui="{ leadingIcon: 'size-10' }"
                    class="p-6 rounded-full" />
                <div>
                    <h3 class="text-xl font-bold">Waiting for Next Ticket</h3>
                    <p class="text-muted mt-1">
                        {{ queueLength > 0
                            ? `There are ${queueLength} people waiting in your queue.`
                            : 'No one is currently waiting.' }}
                    </p>
                </div>
                <UButton v-if="queueLength > 0" icon="i-lucide-play" label="Call Next Ticket"
                    :ui="{ base: 'gap-3', leadingIcon: 'size-6' }"
                    class="shadow-xl shadow-primary/20 py-4 px-8 text-lg rounded-2xl" :disabled="!isOnline"
                    @click="$emit('callNext')" />
            </div>
        </div>
    </div>
</template>
