<script setup lang="ts">
const { transactions } = useTransactions()

interface Props {
    ticket: string
    transactionType?: string
    status: string
    servedAt?: string
    isPriority?: boolean
    isHmo?: boolean
}

const props = defineProps<Props>()

const timeLabel = computed(() => {
    if (!props.servedAt) return ''
    return new Date(props.servedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
    <UCard :ui="{ body: 'flex items-center justify-between sm:p-4' }" class="rounded-xl shadow-sm">
        <div class="flex items-center gap-2">
            <UIcon :name="status === 'completed' ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                :class="status === 'completed' ? 'text-green-500' : 'text-red-500'" class="size-5" />
            <span class="font-extrabold">{{ ticket }}</span>
            <UBadge v-if="transactionType"
                :color="transactions.find(t => t.name === transactionType)?.color || 'neutral'" variant="subtle"
                size="sm" class="rounded-md">{{ transactionType }}</UBadge>
            <UBadge v-if="isHmo" color="sky" variant="soft" size="sm" class="rounded-md">HMO</UBadge>
            <UBadge v-if="isPriority" color="amber" variant="soft" size="sm" class="rounded-md">Priority</UBadge>

            <!-- <UBadge :color="status === 'completed' ? 'green' : 'red'" size="sm" class="rounded-md">{{ status === 'completed' ? 'Completed' : 'Missed' }}</UBadge> -->

        </div>
        <div class="flex items-center gap-1 text-xs text-muted">
            <UIcon name="i-lucide-clock" class="size-3" />
            <span>{{ timeLabel }}</span>
        </div>
    </UCard>
</template>