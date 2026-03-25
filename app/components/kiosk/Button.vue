<script setup lang="ts">
import type { AppColor } from '~/types/ui';
interface Props {
    icon: string;
    title: string;
    description: string;
    color: AppColor;
    layout?: 'horizontal' | 'vertical';
}

const props = defineProps<Props>();
</script>

<template>
    <UButton :color="props.color" variant="soft" :ui="{ base: 'p-8' }" class="rounded-2xl transition-all duration-300 hover:scale-105" @click="$emit('click')">
        <div :class="['flex gap-6 w-full', props.layout === 'vertical' ? 'flex-col items-center' : 'flex-row items-center']">
            <UBadge :color="props.color" :icon="props.icon" variant="soft" :ui="{
                base: 'p-6 rounded-none',
                leadingIcon: props.layout === 'vertical' ? 'size-14' : 'size-10'
                }" class="squircle" />
            <div :class="['flex-1', props.layout === 'vertical' ? 'text-center' : 'text-left']">
                <h3 class="text-2xl font-bold">{{ props.title }}</h3>
                <p class="mt-2 text-lg text-toned">{{ props.description }}</p>
            </div>
        </div>
    </UButton>
</template>