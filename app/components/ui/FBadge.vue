<template>
    <UBadge :label="value" variant="soft" :color="color" />
</template>

<script setup lang="ts">
import { getBadgeColor } from '~/utils/badges'
import type { BadgeType } from '~/utils/badges'
import { useRoles } from '~/composables/useRoles'
import { useTransactions } from '~/composables/useTransactions'

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
    return getBadgeColor(props.type, props.value)
})
</script>
