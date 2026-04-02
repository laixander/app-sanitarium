<script setup lang="ts">
import type { AppColor } from '~/types/ui'

definePageMeta({
    layout: 'counter'
})

const route = useRoute()
const { counters } = useCounters()
const { tickets, updateTicketStatus, startTicket, skipTicket, holdTicket } = useTickets()
const { users, updateUser } = useUsers()

const counter = computed(() => counters.value.find(c => c.id === route.params.id))
const counterName = computed(() => counter.value?.name ?? '')
const appToast = useAppToast()

import { LazyCounterTicketReasonModal } from '#components'
import type { ReasonActionType } from '~/components/counter/TicketReasonModal.vue'
import type { Ticket } from '~/types/queue'
const overlay = useOverlay()

const openReasonModal = async (actionType: ReasonActionType, ticket: Ticket) => {
    return new Promise<string | false>((resolve) => {
        const slideover = overlay.create(LazyCounterTicketReasonModal)
        slideover.open({
            actionType,
            ticket,
            onClose: (reason: string | false) => {
                slideover.close()
                resolve(reason)
            }
        })
    })
}

// Resolve agent assigned to this counter from the users store
const agentRecord = computed(() =>
    users.value.find(u => u.role === 'Agent' && u.counter === counterName.value) ?? null
)

const isAccessDenied = computed(() => !agentRecord.value || agentRecord.value.agentStatus === 'Offline')

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

// Recently completed tickets for this counter
const recentlyCompleted = computed(() =>
    tickets.value
        .filter(t => t.status === 'completed' && t.counter === counterName.value)
        .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
        .slice(0, 5)
)

// Recently missed tickets for this counter
const missedTickets = computed(() =>
    tickets.value
        .filter(t => t.status === 'missed' && t.counter === counterName.value)
        .sort((a, b) => new Date(b.calledAt || '').getTime() - new Date(a.calledAt || '').getTime())
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

// Held/Skipped tickets for this counter
const heldTickets = computed(() =>
    tickets.value.filter(t => (t.status === 'held' || t.status === 'skipped') && t.counter === counterName.value)
)

// Actions
const callNextTicket = () => {
    if (counterQueue.value.length === 0) return
    const next = counterQueue.value[0]!
    updateTicketStatus(next.id, 'serving', counterName.value)
    appToast.success('Ticket Called', `Ticket ${next.ticket} is now serving.`)
}

const completeTicket = () => {
    if (!servingTicket.value) return
    const ticketNum = servingTicket.value.ticket
    updateTicketStatus(servingTicket.value.id, 'completed', counterName.value)
    appToast.success('Ticket Completed', `Ticket ${ticketNum} has been completed.`)
}

const missTicket = async () => {
    if (!servingTicket.value) return
    const ticketNum = servingTicket.value.ticket
    const reason = await openReasonModal('Missed', servingTicket.value)
    if (reason !== false) {
        updateTicketStatus(servingTicket.value.id, 'missed', counterName.value, reason)
        appToast.error('Marked as No Show', `Ticket ${ticketNum} was marked as missed.`)
    }
}

const startTicketAction = () => {
    if (!servingTicket.value) return
    startTicket(servingTicket.value.id)
    appToast.success('Service Started', `Timer has begun for Ticket ${servingTicket.value.ticket}.`)
}

const skipTicketAction = async () => {
    if (!servingTicket.value) return
    const ticketNum = servingTicket.value.ticket
    const reason = await openReasonModal('Skipped', servingTicket.value)
    if (reason !== false) {
        skipTicket(servingTicket.value.id, reason)
        appToast.warning('Ticket Skipped', `Ticket ${ticketNum} was skipped.`)
    }
}

const holdTicketAction = async () => {
    if (!servingTicket.value) return
    const ticketNum = servingTicket.value.ticket
    const reason = await openReasonModal('Held', servingTicket.value)
    if (reason !== false) {
        holdTicket(servingTicket.value.id, reason)
        appToast.warning('Ticket On Hold', `Ticket ${ticketNum} was placed on hold.`)
    }
}

const recallTicketAction = (id: string, ticketNum: string) => {
    updateTicketStatus(id, 'serving', counterName.value)
    appToast.info('Ticket Recalled', `Ticket ${ticketNum} is now serving again.`)
}

const reannounceTicket = () => {
    if (!servingTicket.value) return
    updateTicketStatus(servingTicket.value.id, 'serving', counterName.value)
    
    appToast.success('Ticket Re-announced', `Ticket ${servingTicket.value.ticket} has been called again.`)
}

// Redirect if session ended or counter not found
watchEffect(() => {
    if (!counter.value) {
        navigateTo('/counter/ended?type=not-found')
    } else if (isAccessDenied.value) {
        navigateTo(`/counter/ended?type=ended&name=${encodeURIComponent(counterName.value)}`)
    }
})
</script>

<template>
    <UContainer class="p-4 sm:p-6">
        <div v-if="counter && !isAccessDenied" class="flex items-start justify-center gap-8">
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
                            :is-online="isOnline" @call-next="callNextTicket" @start="startTicketAction"
                            @complete="completeTicket" @miss="missTicket" @skip="skipTicketAction"
                            @hold="holdTicketAction" @reannounce="reannounceTicket" />

                        <USeparator />

                        <!-- Skipped/On Hold Tickets -->
                        <CounterHeldList :tickets="heldTickets" :disabled="!isOnline || !!servingTicket"
                            @recall="(id) => recallTicketAction(id, heldTickets.find(t => t.id === id)?.ticket || '')" />

                        <USeparator />

                        <!-- RECENTLY COMPLETED -->
                        <CounterCompletedList :tickets="recentlyCompleted" :disabled="!isOnline" />

                        <USeparator />

                        <!-- MISSED Tickets -->
                        <CounterMissedList :tickets="missedTickets" :disabled="!isOnline || !!servingTicket"
                            @recall="(id) => recallTicketAction(id, missedTickets.find(t => t.id === id)?.ticket || '')" />

                        <CounterStats v-model:isOnline="isOnline" :served-today="servedToday"
                            :missed-count="missedCount" :held-count="heldTickets.length"
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

    </UContainer>
</template>