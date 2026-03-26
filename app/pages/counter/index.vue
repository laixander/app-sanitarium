<script setup lang="ts">
import type { AppColor } from '~/types/ui'

const { counters } = useCounters()

const transactionColor: Record<string, AppColor> = {
    Consultation: 'sky',
    Outpatient: 'indigo',
    Admission: 'pink',
    Billing: 'teal',
}
</script>

<template>
    <div class="min-h-screen bg-muted/30 p-8">
        <main class="max-w-4xl mx-auto px-6 space-y-8">
            <div>
                <h1 class="text-3xl font-bold">Counters</h1>
                <p class="text-muted mt-1">Select a counter to open its operator view.</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink
                    v-for="counter in counters"
                    :key="counter.id"
                    :to="`/counter/${counter.id}`"
                    class="block"
                >
                <UCard
                    class="rounded-2xl shadow-sm ring-2 ring-muted hover:ring-primary/30 transition-all cursor-pointer hover:-translate-y-0.5"
                    :ui="{ header: 'bg-muted/50' }"
                >
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <UBadge icon="i-lucide-monitor" :color="(counter.color as AppColor)" variant="soft" :ui="{ leadingIcon: 'size-6' }" class="p-3 rounded-none squircle" />
                                <div>
                                    <div class="font-bold text-lg">{{ counter.name }}</div>
                                    <div class="text-xs text-muted">{{ counter.agent ?? 'Unassigned' }}</div>
                                </div>
                            </div>
                            <UChip standalone inset color="green" size="md" />
                        </div>
                    </template>

                    <div class="space-y-3">
                        <p v-if="counter.description" class="text-sm text-muted">{{ counter.description }}</p>
                        <div class="flex flex-wrap gap-2">
                            <UBadge
                                v-for="type in counter.transactions"
                                :key="type"
                                :color="transactionColor[type] || 'neutral'"
                                variant="subtle"
                                size="sm"
                            >{{ type }}</UBadge>
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
