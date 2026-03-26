<script setup lang="ts">
import type { AppColor } from '~/types/ui'

const props = defineProps<{
    counterName: string
    agentName?: string
    color: AppColor
    isOnline: boolean
    isBusy: boolean
}>()

const statusColor = computed<AppColor>(() => {
    if (props.isBusy) return 'warning'
    return 'green'
})

const statusLabel = computed(() => {
    if (!props.isOnline) return 'Offline'
    if (props.isBusy) return 'Busy'
    return 'Available'
})

const monitorColor = computed<AppColor>(() => {
    if (props.isBusy) return 'warning'
    return 'green'
})
</script>

<template>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <div class="flex items-center gap-4">
            <UBadge icon="i-lucide-monitor" :color="monitorColor" :ui="{ leadingIcon: 'size-8' }" variant="soft" class="p-4 rounded-none squircle" />
            <div>
                <div class="font-bold text-2xl">{{ counterName }}</div>
                <div class="flex items-center gap-1 text-muted">
                    <span>{{ agentName ?? 'Unassigned' }}</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-end gap-2">
            <div class="flex items-center gap-2">
                <UChip standalone inset :color="statusColor" size="lg" />
                <UBadge variant="soft" :color="statusColor" size="lg">{{ statusLabel }}</UBadge>
            </div>
        </div>
    </div>
</template>
