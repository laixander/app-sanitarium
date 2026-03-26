<script setup lang="ts">
import type { Ticket } from '~/types/queue'

defineProps<{
    queue: Ticket[]
}>()
</script>

<template>
    <UCard class="w-full max-w-lg rounded-2xl shadow-sm">
        <template #header>
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-ticket" class="size-5 text-primary" />
                    <h2 class="font-bold text-lg">Queue List</h2>
                </div>
                <UBadge variant="soft" color="primary" size="lg">{{ queue.length }} waiting</UBadge>
            </div>
        </template>

        <div v-if="queue.length" class="space-y-3">
            <CounterQueueTicket v-for="(item, index) in queue" :key="item.id" v-bind="item" :index="index" />
        </div>
        <div v-else class="text-center py-8">
            <UIcon name="i-lucide-inbox" class="size-10 text-muted mx-auto mb-3" />
            <p class="text-sm text-dimmed">No tickets in queue</p>
        </div>
    </UCard>
</template>