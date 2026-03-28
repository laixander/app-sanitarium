<script setup lang="ts">
import type { AppColor } from '~/types/ui'

definePageMeta({
    layout: 'counter'
})

const route = useRoute()
const { counters } = useCounters()
const { tickets, updateTicketStatus } = useTickets()
const { users, updateUser } = useUsers()

const counter = computed(() => counters.value.find(c => c.id === route.params.id))
const counterName = computed(() => counter.value?.name ?? '')

// Resolve agent assigned to this counter from the users store
const agentRecord = computed(() =>
    users.value.find(u => u.role === 'Agent' && u.counter === counterName.value) ?? null
)

// Computed property to sync counter online status with agent status
const isOnline = computed({
    get: () => {
        if (!agentRecord.value) return false
        return ['Online', 'Serving'].includes(agentRecord.value.agentStatus || '')
    },
    set: (val: boolean) => {
        if (!agentRecord.value) return
        updateUser(agentRecord.value.id, {
            agentStatus: val ? 'Online' : 'On Break'
        })
    }
})

// Queue: waiting tickets for this counter's transaction types
const counterQueue = computed(() => {
    const types = agentRecord.value?.transaction
        ? [agentRecord.value.transaction]
        : (counter.value?.transactions ?? [])

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
    <UContainer class="p-4 sm:p-6">
        <div v-if="counter" class="flex items-start justify-center gap-8">
            <main class="flex-1">
                <!-- combine the class -->
                <UCard :ui="{ header: 'bg-muted/50' }"
                    :class="[isOnline ? (servingTicket ? 'ring-primary/20' : 'ring-green/20') : 'ring-gray/5', 'rounded-2xl shadow-sm ring-2 transition-all duration-300']"
                    variant="subtle">
                    <template #header>
                        <CounterHeader :counter-name="counter.name" :agent-name="agentRecord?.name"
                            :color="(counter.color as AppColor)" :is-online="isOnline" :is-busy="!!servingTicket" />
                    </template>

                    <div class="space-y-8">
                        <CounterTransactions
                            :transactions="agentRecord?.transaction ? [agentRecord.transaction] : (counter.transactions || [])"
                            :is-online="isOnline" />

                        <CounterWorkspace :serving-ticket="servingTicket" :queue-length="counterQueue.length"
                            :is-online="isOnline" @call-next="callNextTicket" @complete="completeTicket"
                            @miss="missTicket" @reannounce="reannounceTicket" />

                        <USeparator />

                        <!-- RECENTLY COMPLETED -->
                        <CounterCompletedList :tickets="recentlyCompleted" :disabled="!isOnline" />

                        <USeparator />

                        <CounterStats v-model:isOnline="isOnline" :served-today="servedToday"
                            :missed-count="missedCount" :waiting-count="counterQueue.length"
                            :is-busy="!!servingTicket" />
                    </div>
                </UCard>

                <UAlert variant="outline" color="neutral" class="mt-12 rounded-xl">
                    <template #description>
                        <span class="font-semibold">System Note:</span> Ticket data is simulated and will reset on
                        page
                        refresh. Use this screen to manage patient flow at your assigned counter.
                    </template>
                </UAlert>
            </main>

            <aside class="shrink-0 sticky top-22 transition-all duration-300"
                :class="!isOnline ? 'opacity-60 grayscale' : ''">
                <CounterQueueList :queue="counterQueue" />
            </aside>
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
    </UContainer>
</template>