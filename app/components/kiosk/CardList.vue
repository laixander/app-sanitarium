<script setup lang="ts">
import { useKioskLocale } from '~/composables/useKioskLocale';

interface Props {
    transactionType: string;
    paymentMethod: string;
    isPriority: boolean;
}

const props = defineProps<Props>();

const { transactions } = useTransactions()
const { t } = useKioskLocale()

const transactionIcon = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.icon : 'i-lucide-help-circle'
});

const transactionColor = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.color : 'slate'
});

const isCashPayment = computed(() => props.paymentMethod === 'Cash/Card')

</script>
<template>
    <UCard class="w-full max-w-2xl mx-auto rounded-2xl ring-2">
        <div
            class="divide-y divide-default *:flex *:justify-between *:items-center *:py-4 *:first:pt-0 *:last:pb-0 p-2 *:sm:py-6">
            <div>
                <p class="text-muted">{{ t('label.transaction_type') }}</p>
                <UButton variant="link" :icon="transactionIcon" :label="props.transactionType" :color="transactionColor"
                    class="text-lg font-semibold p-0" />
            </div>
            <div>
                <p class="text-muted">{{ t('label.payment_method') }}</p>
                <div v-if="!isCashPayment" class="text-lg font-semibold">
                    <UBadge :label="t('label.hmo_insurance')" color="purple" variant="soft"
                        class="text-base py-2 px-4" />
                </div>
                <p v-else class="text-lg font-semibold">{{ props.paymentMethod }}</p>
            </div>
            <div>
                <p class="text-muted">{{ t('label.queue_type') }}</p>
                <div v-if="props.isPriority" class=" font-semibold">
                    <UBadge :label="t('label.priority_queue')" color="rose" variant="soft"
                        class="text-base py-2 px-4" />
                </div>
                <p v-else class="text-lg font-semibold">{{ t('kiosk.regular_queue') }}</p>
            </div>
        </div>
    </UCard>
</template>