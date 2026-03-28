<script setup lang="ts">
import type { AppColor } from '~/types/ui'
const { transactions: allTransactions } = useTransactions()

const props = defineProps<{
    transactions: string[]
    isOnline: boolean
}>()

const getBadgeColor = (type: string): AppColor => {
    const tx = allTransactions.value.find(t => t.name === type)
    return tx ? tx.color : 'neutral'
}
</script>

<template>
    <div class="flex flex-wrap items-center gap-2 transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <span class="text-sm font-medium text-muted mr-2">Transaction:</span>
        <UBadge
            v-for="type in transactions"
            :key="type"
            :color="getBadgeColor(type)"
            variant="subtle"
        >{{ type }}</UBadge>
    </div>
</template>
