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
    if (props.isBusy) return 'primary'
    return 'green'
})

const statusText = computed(() => {
    if (!props.isOnline) return 'On Break'
    if (props.isBusy) return 'Busy Serving'
    return 'Ready'
})

const monitorColor = computed<AppColor>(() => {
    if (props.isBusy) return 'primary'
    return 'green'
})
</script>

<template>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
        :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <div class="flex items-center gap-4">
            <UBadge icon="i-lucide-monitor" :color="monitorColor" :ui="{ leadingIcon: 'size-8' }" variant="soft"
                class="p-4 rounded-none squircle" />
            <div>
                <div class="font-bold text-2xl">{{ counterName }}</div>
                <div class="flex items-center gap-1 text-muted">
                    <span>{{ agentName ?? 'Unassigned' }}</span>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <UBadge variant="soft" :color="statusColor" size="lg">{{ statusText }}</UBadge>
        </div>
    </div>
</template>
