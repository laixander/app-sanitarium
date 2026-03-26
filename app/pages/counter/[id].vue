<script setup lang="ts">
import type { AppColor } from '~/types/ui'

const route = useRoute()
const { counters } = useCounters()
const { tickets, updateTicketStatus } = useTickets()
const isOnline = ref(true)

const counter = computed(() => counters.value.find(c => c.id === route.params.id))
const counterName = computed(() => counter.value?.name ?? '')

// Queue: waiting tickets for this counter's transaction types
const counterQueue = computed(() => {
    const types = counter.value?.transactions ?? []
    return tickets.value
        .filter(t => t.status === 'waiting' && types.includes(t.transactionType || ''))
        .sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime())
})

// Currently serving ticket for this counter
const servingTicket = computed(() =>
    tickets.value.find(t => t.status === 'serving' && t.counter === counterName.value)
)

// Recently completed/missed tickets for this counter
const recentlyCompleted = computed(() =>
    tickets.value
        .filter(t => (t.status === 'completed' || t.status === 'missed') && t.counter === counterName.value)
        .sort((a, b) => new Date(b.servedAt || '').getTime() - new Date(a.servedAt || '').getTime())
        .slice(0, 5)
)

// Served today count
const servedToday = computed(() =>
    tickets.value.filter(t => t.status === 'completed' && t.counter === counterName.value).length
)

// Missed count
const missedCount = computed(() =>
    tickets.value.filter(t => t.status === 'missed' && t.counter === counterName.value).length
)

// Actions
const callNextTicket = () => {
    if (counterQueue.value.length === 0) return
    const next = counterQueue.value[0]!
    updateTicketStatus(next.id, 'serving', counterName.value)
}

const completeTicket = () => {
    if (!servingTicket.value) return
    updateTicketStatus(servingTicket.value.id, 'completed', counterName.value)
}

const missTicket = () => {
    if (!servingTicket.value) return
    updateTicketStatus(servingTicket.value.id, 'missed', counterName.value)
}

// Per-transaction badge colors
const transactionColor: Record<string, string> = {
    Consultation: 'sky',
    Outpatient: 'indigo',
    Admission: 'pink',
    Billing: 'teal',
}

// Full class strings so Tailwind JIT can detect them
const transactionShadow: Record<string, string> = {
    Consultation: 'shadow-sky/20',
    Outpatient: 'shadow-indigo/20',
    Admission: 'shadow-pink/20',
    Billing: 'shadow-teal/20',
}

const reannounceTicket = () => {
    if (!servingTicket.value) return
    updateTicketStatus(servingTicket.value.id, 'serving', counterName.value)
    // toast
    useToast().add({
        title: 'Ticket re-announced',
        description: `Ticket ${servingTicket.value.ticket} has been re-announced.`,
        color: 'success',
    })
}
</script>

<template>
    <div v-if="counter" class="min-h-screen bg-muted/30 p-8">
        <main class="max-w-3xl mx-auto px-6">
            <UCard :ui="{ header: 'bg-muted/50' }" class="rounded-2xl shadow-sm ring-2" :class="isOnline ? (servingTicket ? 'ring-warning/20' : 'ring-green/20') : 'ring-gray/5'">
                <template #header>
                    <CounterHeader
                        :counter-name="counter.name"
                        :agent-name="counter.agent"
                        :color="(counter.color as AppColor)"
                        :is-online="isOnline"
                        :is-busy="!!servingTicket"
                    />
                </template>

                <div class="space-y-8">
                    <CounterHandling
                        :transactions="counter.transactions || []"
                        :is-online="isOnline"
                    />

                    <CounterWorkspace
                        :serving-ticket="servingTicket"
                        :queue-length="counterQueue.length"
                        :is-online="isOnline"
                        @call-next="callNextTicket"
                        @complete="completeTicket"
                        @miss="missTicket"
                        @reannounce="reannounceTicket"
                    />

                    <USeparator />

                    <!-- RECENTLY COMPLETED -->
                    <CounterCompletedList :tickets="recentlyCompleted" :disabled="!isOnline" />

                    <USeparator />

                    <CounterStats
                        v-model:isOnline="isOnline"
                        :served-today="servedToday"
                        :missed-count="missedCount"
                        :waiting-count="counterQueue.length"
                        :is-busy="!!servingTicket"
                    />
                </div>
            </UCard>

            <UAlert variant="outline" color="neutral" class="mt-12 rounded-xl">
                <template #description>
                    <span class="font-semibold">System Note:</span> Ticket data is simulated and will reset on page refresh. Use this screen to manage patient flow at your assigned counter.
                </template>
            </UAlert>
        </main>

        <div class="fixed top-8 right-8 transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
            <CounterQueueList :queue="counterQueue" />
        </div>
    </div>

    <!-- 404 fallback if counter ID not found -->
    <div v-else class="min-h-screen flex items-center justify-center bg-muted/30">
        <div class="text-center space-y-4">
            <UIcon name="i-lucide-monitor-x" class="size-16 text-muted mx-auto" />
            <h2 class="text-2xl font-bold">Counter Not Found</h2>
            <p class="text-muted">The counter you're looking for doesn't exist.</p>
            <UButton label="Back to Counters" icon="i-lucide-arrow-left" to="/counter" />
        </div>
    </div>
</template>