<template>
    <div class="space-y-6">
        <UiFPageHeader title="Queuing Control (HQS)" description="Service Notification & Queue Management">
            <UiFTag label="System Online" color="success" showChip ping />
        </UiFPageHeader>

        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            <UiFStatCard 
                v-for="stat in QUEUE_STATS_CONFIG" 
                :key="stat.key"
                :title="stat.title" 
                :value="queueStats[stat.key]" 
                :icon="stat.icon" 
                :iconColor="stat.iconColor" 
                counter 
            />
        </div>

        <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <UiFCard title="Service Controls" description="Call and manage patients">
                <div class="grid lg:grid-cols-2 grid-cols-1 gap-2">
                    <UButton label="Call Next Patient" icon="i-lucide-phone-forwarded" size="lg" block class="col-span-2" />
                    <UButton label="Hold" icon="i-lucide-pause" color="warning" size="lg" block />
                    <UButton label="Skip" icon="i-lucide-skip-forward" color="error" size="lg" block />
                    <UButton label="Recall Current Patient" icon="i-lucide-refresh-cw" color="success" size="lg" block class="col-span-2" />
                </div>
                <USeparator />
                <div class="text-sm text-muted">
                    Service Windows
                </div>
                <div class="space-y-2">
                    <UAlert title="Window 1" color="lime" variant="subtle">
                        <template #description>
                            Serving: John Doe
                        </template>
                    </UAlert>

                    <UiFCard v-for="(data, window) in windows" :key="window" :title="`Window ${window}`" as-list>
                        <template #actions>
                            <UiFTag :label="data.status === 'active' ? 'Active' : 'Idle'" :color="data.status === 'active' ? 'success' : 'neutral'" showChip />
                        </template>
                        <template #description>
                            <div v-if="data.patient">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-muted">Serving:</span>
                                    <span class="text-xs font-semibold">{{ data.patient.name }}</span>
                                    <UBadge variant="subtle" size="xs">
                                    {{ data.patient.queueNumber }}</UBadge>
                                </div>
                            </div>
                        </template>
                    </UiFCard>
                </div>
            </UiFCard>
        </div>
    </div>
</template>
<script setup lang="ts">
import { QUEUE_STATS_CONFIG } from '~/constants/queuing';

definePageMeta({
    title: 'Queuing Control'
})

// Mock dynamic values for now - these would typically come from a composable or store
const queueStats = ref<Record<string, string>>({
    nowServing: "10",
    inQueue: "5",
    completed: "8",
    skipped: "1"
})

const windows = {
    1: {
        status: 'active',
        patient: {
            name: 'John Doe',
            queueNumber: '002'
        }
    },
    2: {
        status: 'idle',
        patient: null
    },
    3: {
        status: 'idle',
        patient: null
    }
}
</script>