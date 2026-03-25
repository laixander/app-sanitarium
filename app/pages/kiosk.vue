<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

type KioskStep = 'welcome' | 'payment' | 'priority' | 'summary' | 'ticket';

const currentStep = ref<KioskStep>('welcome');

const kioskData = reactive({
    transactionType: '',
    paymentMethod: '',
    isPriority: false,
    queueNumber: 'A-001'
});

const queueType = computed(() => kioskData.isPriority ? 'Priority Queue' : 'Regular Queue');

const handleTransactionSelect = (transaction: string) => {
    kioskData.transactionType = transaction;
    currentStep.value = 'payment';
};

const handlePaymentSelect = (method: string) => {
    kioskData.paymentMethod = method;
    currentStep.value = 'priority';
};

const handlePrioritySelect = (isPriority: boolean) => {
    kioskData.isPriority = isPriority;
    currentStep.value = 'summary';
};

const { createTicket: createQueueTicket } = useTickets();

const handleConfirm = () => {
    // Generate a mock queue number based on transaction
    const prefix = kioskData.transactionType.charAt(0).toUpperCase();
    const num = Math.floor(Math.random() * 100).toString().padStart(3, '0');
    kioskData.queueNumber = `${prefix}-${num}`;
    
    // Create the actual ticket in the shared state
    createQueueTicket({
        ticket: kioskData.queueNumber,
        transactionType: kioskData.transactionType,
        paymentMethod: kioskData.paymentMethod,
        isPriority: kioskData.isPriority
    });

    currentStep.value = 'ticket';
};

const resetKiosk = () => {
    currentStep.value = 'welcome';
    kioskData.transactionType = '';
    kioskData.paymentMethod = '';
    kioskData.isPriority = false;
};
</script>

<template>
    <div class="kiosk-flow">
        <KioskWelcome 
            v-if="currentStep === 'welcome'" 
            @select="handleTransactionSelect" 
        />
        
        <KioskPayment 
            v-else-if="currentStep === 'payment'" 
            @select="handlePaymentSelect" 
            @back="currentStep = 'welcome'" 
        />
        
        <KioskPriority 
            v-else-if="currentStep === 'priority'" 
            @select="handlePrioritySelect" 
            @back="currentStep = 'payment'" 
        />
        
        <KioskSummary 
            v-else-if="currentStep === 'summary'" 
            :transaction-type="kioskData.transactionType"
            :payment-method="kioskData.paymentMethod"
            :queue-type="queueType"
            @confirm="handleConfirm" 
            @back="currentStep = 'priority'" 
        />
        
        <KioskTicket 
            v-else-if="currentStep === 'ticket'" 
            :queue-number="kioskData.queueNumber"
            :transaction-type="kioskData.transactionType"
            :payment-method="kioskData.paymentMethod"
            :queue-type="queueType"
            @reset="resetKiosk" 
        />
    </div>
</template>