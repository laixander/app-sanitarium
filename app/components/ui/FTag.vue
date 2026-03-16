<template>
    <UBadge variant="subtle" :color="color" size="sm"
        class="rounded-full px-3 py-2 uppercase font-semibold leading-none w-fit">
        <span v-if="showChip" class="inline-flex items-center justify-center mr-0.5">
            <UChip v-if="ping" standalone inset :color="color" size="xs" :ui="{ base: 'ring-0' }" class="absolute animate-ping" />
            <UChip standalone inset :color="color" size="xs" :ui="{ base: 'ring-0' }" />
        </span>
        {{ label }}
    </UBadge>
</template>

<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    label: string
    color: AppColor
    showChip?: boolean
    ping?: boolean
}

const props = defineProps<Props>()
</script>