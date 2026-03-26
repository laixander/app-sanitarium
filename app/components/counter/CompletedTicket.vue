<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    ticket: string
    transactionType?: string
    status: string
    servedAt?: string
}

const props = defineProps<Props>()

const transactionColor: Record<string, AppColor> = {
    Consultation: 'sky',
    Outpatient: 'indigo',
    Admission: 'pink',
    Billing: 'teal',
}

const timeLabel = computed(() => {
    if (!props.servedAt) return ''
    return new Date(props.servedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
    <UCard :ui="{ body: 'flex items-center justify-between sm:p-4' }" class="rounded-xl shadow-sm">
        <div class="flex items-center gap-2">
            <span class="font-extrabold">{{ ticket }}</span>
            <UBadge v-if="transactionType" :color="transactionColor[transactionType] || 'neutral'" variant="subtle" size="sm" class="rounded-md">{{ transactionType }}</UBadge>
            <UBadge :color="status === 'completed' ? 'green' : 'red'" size="sm" class="rounded-md">{{ status === 'completed' ? 'Completed' : 'Missed' }}</UBadge>
        </div>
        <div class="flex items-center gap-1 text-xs text-muted">
            <UIcon name="i-lucide-clock" class="size-3" />
            <span>{{ timeLabel }}</span>
        </div>
    </UCard>
</template>