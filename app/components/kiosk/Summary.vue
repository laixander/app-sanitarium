<script setup lang="ts">
import { useKioskLocale } from '~/composables/useKioskLocale';

const { t } = useKioskLocale()
interface Props {
    transactionType: string;
    paymentMethod: string;
    isPriority: boolean;
}

const props = defineProps<Props>();

defineEmits<{
    (e: 'confirm'): void
    (e: 'back'): void
}>()
</script>

<template>
    <KioskPage :title="t('summary.title')" :description="t('summary.desc')" :footer="t('summary.footer')" back
        @back="$emit('back')">
        <KioskCardList :transactionType="props.transactionType" :paymentMethod="props.paymentMethod"
            :isPriority="props.isPriority" />
        <div class="flex justify-between gap-4 max-w-2xl mx-auto">
            <UButton :label="t('action.back')" variant="outline" color="neutral"
                class="text-xl font-semibold p-6 rounded-xl" block @click="$emit('back')" />
            <UButton :label="t('action.confirm')" icon="i-lucide-check-circle" variant="solid" color="success"
                class="text-xl font-semibold p-6 rounded-xl" block @click="$emit('confirm')" />
        </div>
    </KioskPage>
</template>