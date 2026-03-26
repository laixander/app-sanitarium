<script setup lang="ts">
import type { AppColor } from '~/types/ui'

const props = defineProps<{
    transactions: string[]
    isOnline: boolean
}>()

const transactionColor: Record<string, AppColor> = {
    Consultation: 'sky',
    Outpatient: 'indigo',
    Admission: 'pink',
    Billing: 'teal',
}

const getBadgeColor = (type: string): AppColor => {
    return transactionColor[type] || 'neutral'
}
</script>

<template>
    <div class="flex flex-wrap items-center gap-2 transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <span class="text-sm font-medium text-muted mr-2">Handling:</span>
        <UBadge
            v-for="type in transactions"
            :key="type"
            :color="getBadgeColor(type)"
            variant="subtle"
        >{{ type }}</UBadge>
    </div>
</template>
