<script setup lang="ts">
import type { Ticket, TicketStatus } from '~/types/queue'
import { statusColors } from '~/constants/queue'

interface Props {
    tickets?: Ticket[]
}

const props = withDefaults(defineProps<Props>(), {
    tickets: () => []
})

const waiting = computed(() => props.tickets.filter(t => t.status === 'waiting'))
const serving = computed(() => props.tickets.filter(t => t.status === 'serving'))
const missed = computed(() => props.tickets.filter(t => t.status === 'missed'))
const completed = computed(() => props.tickets.filter(t => t.status === 'completed'))
</script>

<template>
    <div class="overflow-x-auto">
        <div class="grid grid-cols-4 min-w-[1440px] divide-x divide-default">
        <!-- Waiting -->
        <div class="divide-y divide-default">
            <div class="flex items-center gap-2 px-6 py-4">
                <UChip standalone inset :color="statusColors['waiting']" />
                <div class="text-sm font-semibold">Waiting</div>
                <UBadge :label="String(waiting.length)" color="neutral" variant="subtle" />
            </div>
            <div class="flex flex-col gap-2 p-6">
                <AgentQueueCard v-for="item in waiting" :key="item.id" v-bind="item" />
            </div>
        </div>
        <!-- Serving -->
        <div class="divide-y divide-default">
            <div class="flex items-center gap-2 px-6 py-4">
                <UChip standalone inset :color="statusColors['serving']" />
                <div class="text-sm font-semibold">Serving</div>
                <UBadge :label="String(serving.length)" color="neutral" variant="subtle" />
            </div>
            <div class="flex flex-col gap-2 p-6">
                <AgentQueueCard v-for="item in serving" :key="item.id" v-bind="item" />
            </div>
        </div>
        <!-- Missed -->
        <div class="divide-y divide-default">
            <div class="flex items-center gap-2 px-6 py-4">
                <UChip standalone inset :color="statusColors['missed']" />
                <div class="text-sm font-semibold">Missed</div>
                <UBadge :label="String(missed.length)" color="neutral" variant="subtle" />
            </div>
            <div class="flex flex-col gap-2 p-6">
                <AgentQueueCard v-for="item in missed" :key="item.id" v-bind="item" />
            </div>
        </div>
        <!-- Completed -->
        <div class="divide-y divide-default">
            <div class="flex items-center gap-2 px-6 py-4">
                <UChip standalone inset :color="statusColors['completed']" />
                <div class="text-sm font-semibold">Completed</div>
                <UBadge :label="String(completed.length)" color="neutral" variant="subtle" />
            </div>
            <div class="flex flex-col gap-2 p-6">
                <AgentQueueCard v-for="item in completed" :key="item.id" v-bind="item" />
            </div>
        </div>
        </div>
    </div>
</template>