<template>
    <UBadge variant="subtle" :color="color" size="sm"
        class="rounded-full px-3 py-2 uppercase font-semibold leading-none w-fit">
        <UChip v-if="showChip" standalone inset :color="color" size="xs" class="mr-0.5" />
        {{ label }}
    </UBadge>
</template>

<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    label: string
    color: AppColor
    showChip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showChip: false
})
</script>