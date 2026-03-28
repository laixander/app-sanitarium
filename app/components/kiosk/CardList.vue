<script setup lang="ts">
interface Props {
    transactionType: string;
    paymentMethod: string;
    queueType: string;
    cashPayment: boolean;
    regularQueue: boolean;
}

const props = defineProps<Props>();

const { transactions } = useTransactions()

const transactionIcon = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.icon : 'i-lucide-help-circle'
});

const transactionColor = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.color : 'slate'
});


</script>
<template>
    <UCard class="w-full max-w-2xl mx-auto rounded-2xl ring-2">
        <div class="divide-y divide-default *:flex *:justify-between *:items-center *:py-4 *:first:pt-0 *:last:pb-0 p-2 *:sm:py-6">
            <div>
                <p class="text-muted">Transaction Type</p>
                <UButton variant="link" :icon="transactionIcon" :label="props.transactionType" :color="transactionColor" class="text-lg font-semibold p-0" />
            </div>
            <div>
                <p class="text-muted">Payment Method</p>
                <div v-if="!cashPayment" class="text-lg font-semibold">
                    <UBadge label="HMO/Insurance" color="purple" variant="soft" class="text-base py-2 px-4" />
                </div>
                <p v-else class="text-lg font-semibold">{{ props.paymentMethod }}</p>
            </div>
            <div>
                <p class="text-muted">Queue Type</p>
                <div v-if="!regularQueue" class=" font-semibold">
                    <UBadge label="Priority Queue" color="rose" variant="soft" class="text-base py-2 px-4" />
                </div>
                <p v-else class="text-lg font-semibold">{{ props.queueType }}</p>
            </div>
        </div>
    </UCard>
</template>