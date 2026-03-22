<template>
    <UCard variant="subtle"
        :ui="{ root: asList ? 'divide-y-0' : '', body: asTable || asList ? 'p-0 sm:p-0' : 'space-y-4' }">
        <template #header>
            <div class="grid md:flex items-center justify-between gap-3">
                <div class="grid md:flex items-center gap-3">
                    <UiFIcon v-if="icon" :icon="icon" :color="color || 'primary'" />
                    <div class="flex flex-col gap-2">
                        <slot v-if="$slots.title || title" name="title">
                            <h3 :class="[asList ? 'text-sm font-semibold' : '', 'font-bold leading-none']">{{ title }}
                            </h3>
                        </slot>
                        <slot v-if="$slots.description || description" name="description">
                            <p class="text-sm text-muted leading-none">{{ description }}</p>
                        </slot>
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
    asTable?: boolean
    asList?: boolean
}

const props = defineProps<Props>()
</script>