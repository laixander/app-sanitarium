<template>
    <UCard variant="subtle">
        <div class="flex justify-between" :class="[ counter ? 'gap-3' : '' ]">
            <div :class="[ counter ? 'order-1 flex-1' : '' ]">
                <h3 :class="[counter ? 'text-xs text-muted' : 'text-sm font-bold', 'uppercase']">{{ title }}</h3>
                <p v-if="counter" class="text-3xl font-bold">{{ value }}</p>
            </div>
            <UiFIcon v-if="icon" :icon="icon" :color="iconColor || 'primary'" />
        </div>
        <div v-if="!counter" class="mt-6">
            <slot name="customValue">
                <p class="text-4xl font-bold">{{ value }}</p>
                <p v-if="description || trendValue !== undefined"
                    class="flex items-center gap-1 text-sm text-muted mt-1">
                    <span v-if="computedTrend" class="flex items-center"
                        :class="[computedTrend === 'up' ? 'text-green' : 'text-red']">
                        <UIcon :name="computedTrend === 'up' ? 'i-lucide-move-up-right' : 'i-lucide-move-down-right'"
                            class="mr-1" />
                        {{ trendValue }}<span>%</span>
                    </span>
                    {{ description }}
                </p>
            </slot>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AppColor } from '~/types/ui'
interface Props {
    title: string
    value?: string
    description?: string
    icon: string
    iconColor?: AppColor
    trendValue?: string | number
    counter?: boolean
}
const props = defineProps<Props>()

const computedTrend = computed(() => {
    if (props.trendValue === undefined || props.trendValue === null || props.trendValue === '') return null
    const strVal = String(props.trendValue).trim()
    if (strVal.startsWith('-')) return 'down'
    if (strVal.startsWith('+')) return 'up'
    const val = parseFloat(strVal)
    if (!isNaN(val)) {
        if (val > 0) return 'up'
        if (val < 0) return 'down'
    }
    return null
})

// const formattedTrendValue = computed(() => {
//     if (props.trendValue === undefined || props.trendValue === null || props.trendValue === '') return ''
//     let val = String(props.trendValue).trim()
//     if (val.startsWith('-') || val.startsWith('+')) {
//         val = val.substring(1).trim()
//     }
//     if (val.endsWith('%')) {
//         val = val.slice(0, -1).trim()
//     }
//     return val
// })
</script>