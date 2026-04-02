<script setup lang="ts">
import { upperFirst } from 'scule'
import { getBadgeColor } from '~/utils/badges'
import type { BadgeType } from '~/utils/badges'
import { useRoles } from '~/composables/useRoles'
import { useTransactions } from '~/composables/useTransactions'
import { statusColors } from '~/constants/queue'

interface Props {
    type: BadgeType
    value: string
}

const props = defineProps<Props>()

const { roles } = useRoles()
const { transactions } = useTransactions()

const color = computed(() => {
    if (props.type === 'role') {
        const role = roles.value.find(r => r.title === props.value)
        return role?.color || 'neutral'
    }
    if (props.type === 'transaction') {
        const transaction = transactions.value.find(t => t.name === props.value)
        return transaction?.color || 'neutral'
    }
    if (props.type === 'status') {
        return statusColors[props.value] || 'neutral'
    }
    return getBadgeColor(props.type, props.value)
})
</script>
<template>
    <UBadge :label="upperFirst(value)" variant="soft" :color="color" />
</template>