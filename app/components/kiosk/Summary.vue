<script setup lang="ts">
interface Props {
    transactionType: string;
    paymentMethod: string;
    queueType: string;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'confirm'): void
  (e: 'back'): void
}>()
</script>

<template>
    <KioskPage title="Confirm Your Selection" description="Please review your details before getting a ticket" footer="A ticket will be generated for you. Please wait for your number to be called." back @back="$emit('back')">
        <KioskCardList 
            :transactionType="props.transactionType" 
            :paymentMethod="props.paymentMethod" 
            :queueType="props.queueType" 
            :cashPayment="props.paymentMethod === 'Cash/Card'" 
            :regularQueue="props.queueType === 'Regular Queue'" 
        />
        <div class="flex justify-between gap-4 max-w-2xl mx-auto">
            <UButton label="Go Back" variant="outline" color="neutral" class="text-xl font-semibold p-6 rounded-xl" block @click="$emit('back')" />
            <UButton label="Get Ticket" icon="i-lucide-check-circle" variant="solid" color="success" class="text-xl font-semibold p-6 rounded-xl" block @click="$emit('confirm')" />
        </div>
    </KioskPage>
</template>