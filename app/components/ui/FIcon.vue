<template>
    <UButton :icon="icon" :color="color" variant="soft" size="lg" square disabled :ui="ui"
        class="rounded-none squircle w-fit" />
</template>

<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    icon: string
    color: AppColor
}

const props = defineProps<Props>()

const ui = {
    base: 'p-3 disabled:cursor-default aria-disabled:cursor-default disabled:opacity-100 aria-disabled:opacity-100',
}
</script>
