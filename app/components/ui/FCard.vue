<template>
    <UCard :ui="{ header: 'sm:px-4', body: 'p-0 sm:p-0' }">
        <template #header>
            <div class="grid md:flex items-center justify-between gap-3">
                <div class="grid md:flex items-center gap-3">
                    <UiFIcon v-if="icon" :icon="icon" :color="color || 'primary'" />
                    <div class="flex flex-col gap-1.5">
                        <h3 class="font-bold leading-none">{{ title }}</h3>
                        <p v-if="description" class="text-sm text-muted leading-none">{{ description }}</p>
                    </div>
                </div>
                <slot name="actions" />
            </div>
        </template>
        <slot />
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
    </UCard>
</template>

<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    title: string
    description?: string
    icon?: string
    color?: AppColor
}

const props = defineProps<Props>()
</script>