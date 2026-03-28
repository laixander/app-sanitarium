<script setup lang="ts">
import type { AppColor } from '~/types/ui'
const { transactions } = useTransactions()
const { counters } = useCounters()
const { users } = useUsers()
const { getAverageServiceTime, getActiveTicket, getServedToday } = useTickets()

const getTransactionColor = (type: string): AppColor => {
    const tx = transactions.value.find(t => t.name === type)
    return tx ? tx.color : 'neutral'
}

const countersWithAgent = computed(() => {
    return counters.value.map(counter => {
        const agent = users.value.find(u => u.role === 'Agent' && u.counter === counter.name)
        return {
            ...counter,
            agentRecord: agent || null
        }
    })
})
</script>

<template>
    <div class="min-h-screen bg-muted/30 p-8">
        <main class="max-w-6xl mx-auto px-6 space-y-8">
            <div>
                <h1 class="text-3xl font-bold">Counters</h1>
                <p class="text-muted mt-1">Select a counter to open its operator view.</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="counter in countersWithAgent" :key="counter.id" :to="`/counter/${counter.id}`"
                    class="block">
                    <UCard
                        class="rounded-2xl shadow-sm ring-2 ring-muted hover:ring-primary/30 transition-all cursor-pointer flex flex-col h-full"
                        :ui="{ header: 'bg-muted/50 w-full', body: 'flex-1 flex flex-col', footer: 'mt-auto border-none' }">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <UBadge icon="i-lucide-monitor" :color="(counter.color as AppColor)" variant="soft"
                                        :ui="{ leadingIcon: 'size-6' }" class="p-3 rounded-none squircle" />
                                    <div>
                                        <div class="font-bold text-lg leading-tight">{{ counter.name }}</div>
                                        <div class="text-xs flex items-center gap-1.5 mt-1 font-medium">
                                            <template v-if="counter.agentRecord">
                                                <div class="size-2 rounded-full" :class="{
                                                    'bg-green-500': counter.agentRecord.agentStatus === 'Online',
                                                    'bg-blue-500': counter.agentRecord.agentStatus === 'Serving',
                                                    'bg-amber-500': counter.agentRecord.agentStatus === 'On Break',
                                                    'bg-gray-400': !counter.agentRecord.agentStatus || counter.agentRecord.agentStatus === 'Offline'
                                                }"></div>
                                                <span class="text-foreground">{{ counter.agentRecord.agentStatus ||
                                                    'Offline' }}</span>
                                            </template>
                                            <template v-else>
                                                <span class="text-muted">Unassigned</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <div class="space-y-4">
                            <div v-if="counter.agentRecord" class="flex flex-col gap-4">
                                <div class="flex items-center gap-3 px-2">
                                    <UAvatar :alt="counter.agentRecord.name" size="sm"
                                        class="bg-primary/10 text-primary font-bold shrink-0"
                                        :src="`https://i.pravatar.cc/128?u=${counter.agentRecord.id}`" />
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-bold text-sm truncate text-foreground">{{
                                            counter.agentRecord.name }}</span>
                                        <span class="text-xs text-muted truncate">
                                            {{ counter.agentRecord.code || 'NO CODE' }}
                                        </span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <div class="flex flex-col py-2 px-3 bg-muted rounded-lg">
                                        <span
                                            class="text-[10px] font-medium text-muted uppercase tracking-wider mb-1">Serving</span>
                                        <div class="flex items-center">
                                            <UBadge v-if="getActiveTicket(counter.name)"
                                                :label="getActiveTicket(counter.name)?.ticket" variant="outline"
                                                color="primary" class="font-mono text-xs" />
                                            <span v-else class="text-sm font-bold text-muted">-</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col py-2 px-3 bg-muted rounded-lg">
                                        <span
                                            class="text-[10px] font-medium text-muted uppercase tracking-wider mb-1">Served</span>
                                        <span class="font-bold text-sm text-foreground">
                                            {{ getServedToday(counter.name) }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col py-2 px-3 bg-muted rounded-lg col-span-2">
                                        <span
                                            class="text-[10px] font-medium text-muted uppercase tracking-wider mb-1">Avg.
                                            Time</span>
                                        <div class="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                            <UIcon name="i-lucide-clock" class="size-3.5 text-muted" />
                                            <span>{{ getAverageServiceTime(counter.name) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="flex flex-col items-center justify-center py-6 text-center h-full bg-muted/10 rounded-xl border border-dashed border-muted">
                                <UIcon name="i-lucide-user-x" class="size-8 text-muted mb-2 opacity-50" />
                                <p class="text-sm text-muted font-medium">No agent assigned</p>
                            </div>

                            <div class="space-y-2 mt-4">
                                <p v-if="counter.description" class="text-sm text-muted">{{ counter.description }}</p>
                                <div class="flex flex-wrap gap-1.5">
                                    <UBadge v-for="type in counter.transactions" :key="type"
                                        :color="getTransactionColor(type)" variant="subtle" size="xs">{{ type }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>

                        <template #footer>
                            <div class="flex items-center justify-end text-xs text-muted gap-1">
                                <span>Open counter view</span>
                                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
                            </div>
                        </template>
                    </UCard>
                </NuxtLink>
            </div>
        </main>
    </div>
</template>
