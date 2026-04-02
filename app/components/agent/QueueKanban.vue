<script setup lang="ts">
import type { Ticket, TicketStatus } from '~/types/queue'
import { statusColors } from '~/constants/queue'

interface Props {
    tickets?: Ticket[]
}

const props = withDefaults(defineProps<Props & {
    visibleColumns?: Record<string, boolean>
}>(), {
    tickets: () => [],
    visibleColumns: () => ({
        waiting: true,
        serving: true,
        held: true,
        missed: true,
        completed: true
    })
})

const waiting = computed(() => props.tickets.filter(t => t.status === 'waiting'))
const serving = computed(() => props.tickets.filter(t => t.status === 'serving'))
const missed = computed(() => props.tickets.filter(t => t.status === 'missed').slice(-30))
const completed = computed(() => props.tickets.filter(t => t.status === 'completed').slice(-30))
const held = computed(() => props.tickets.filter(t => t.status === 'held' || t.status === 'skipped'))

const visibleColumnCount = computed(() => Object.values(props.visibleColumns).filter(Boolean).length)
</script>

<template>
    <div class="overflow-x-auto overflow-y-hidden">
        <div class="grid divide-x divide-default w-full" :style="{
            gridTemplateColumns: `repeat(${visibleColumnCount}, 1fr)`,
            minWidth: `${visibleColumnCount * 384}px`
        }">
            <!-- Waiting -->
            <div v-if="props.visibleColumns.waiting" class="divide-y divide-default">
                <div class="flex items-center gap-2 px-6 py-4">
                    <UChip standalone inset :color="statusColors['waiting']" />
                    <div class="text-sm font-semibold">Waiting</div>
                    <UBadge :label="String(waiting.length)" color="neutral" variant="subtle" />
                </div>
                <div class="flex flex-col gap-2 p-6 max-h-96 overflow-y-auto">
                    <CounterQueueTicket v-for="item in waiting" :key="item.id" v-bind="item" hide-index />
                    <UEmpty v-if="waiting.length === 0" description="No Data" variant="naked"
                        :ui="{ root: 'sm:p-4 lg:p-4' }" />
                </div>
            </div>
            <!-- Serving -->
            <div v-if="props.visibleColumns.serving" class="divide-y divide-default">
                <div class="flex items-center gap-2 px-6 py-4">
                    <UChip standalone inset :color="statusColors['serving']" />
                    <div class="text-sm font-semibold">Serving</div>
                    <UBadge :label="String(serving.length)" color="neutral" variant="subtle" />
                </div>
                <div class="flex flex-col gap-2 p-6 max-h-96 overflow-y-auto">
                    <CounterQueueTicket v-for="item in serving" :key="item.id" v-bind="item" hide-index />
                    <UEmpty v-if="serving.length === 0" description="No Data" variant="naked"
                        :ui="{ root: 'sm:p-4 lg:p-4' }" />
                </div>
            </div>

            <!-- Held/Skipped -->
            <div v-if="props.visibleColumns.held" class="divide-y divide-default">
                <div class="flex items-center gap-2 px-6 py-4">
                    <UChip standalone inset :color="statusColors['held']" />
                    <div class="text-sm font-semibold">Held/Skipped</div>
                    <UBadge :label="String(held.length)" color="neutral" variant="subtle" />
                </div>
                <div class="flex flex-col gap-2 p-6 max-h-96 overflow-y-auto">
                    <CounterQueueTicket v-for="item in held" :key="item.id" v-bind="item" hide-index />
                    <UEmpty v-if="held.length === 0" description="No Data" variant="naked"
                        :ui="{ root: 'sm:p-4 lg:p-4' }" />
                </div>
            </div>

            <!-- Missed -->
            <div v-if="props.visibleColumns.missed" class="divide-y divide-default">
                <div class="flex items-center gap-2 px-6 py-4">
                    <UChip standalone inset :color="statusColors['missed']" />
                    <div class="text-sm font-semibold">Missed</div>
                    <UBadge :label="String(missed.length)" color="neutral" variant="subtle" />
                </div>
                <div class="flex flex-col gap-2 p-6 max-h-96 overflow-y-auto">
                    <CounterQueueTicket v-for="item in missed" :key="item.id" v-bind="item" hide-index />
                    <UEmpty v-if="missed.length === 0" description="No Data" variant="naked"
                        :ui="{ root: 'sm:p-4 lg:p-4' }" />
                </div>
            </div>
            <!-- Completed -->
            <div v-if="props.visibleColumns.completed" class="divide-y divide-default">
                <div class="flex items-center gap-2 px-6 py-4">
                    <UChip standalone inset :color="statusColors['completed']" />
                    <div class="text-sm font-semibold">Completed</div>
                    <UBadge :label="String(completed.length)" color="neutral" variant="subtle" />
                </div>
                <div class="flex flex-col gap-2 p-6 max-h-96 overflow-y-auto">
                    <CounterQueueTicket v-for="item in completed" :key="item.id" v-bind="item" hide-index />
                    <UEmpty v-if="completed.length === 0" description="No Data" variant="naked"
                        :ui="{ root: 'sm:p-4 lg:p-4' }" />
                    <div v-if="completed.length >= 30" class="pt-2 border-t border-default/50 flex justify-center">
                        <UButton to="/agent/logs" color="neutral" variant="link" icon="i-lucide-history" size="sm">View
                            Full History</UButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>