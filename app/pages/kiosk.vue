<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useKioskLocale } from '~/composables/useKioskLocale';

type KioskStep = 'welcome' | 'payment' | 'priority' | 'summary' | 'ticket';

const currentStep = ref<KioskStep>('welcome');

const kioskData = reactive({
    transactionType: '',
    paymentMethod: '',
    isPriority: false,
    queueNumber: 'A001'
});

// const queueType = computed(() => kioskData.isPriority ? t('kiosk.priority_queue') : t('kiosk.regular_queue'));

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

const { transactions } = useTransactions();
const { createTicket: createQueueTicket } = useTickets();

const handleConfirm = () => {
    const transaction = transactions.value.find(tx => tx.name === kioskData.transactionType);
    const prefix = transaction?.code || kioskData.transactionType.charAt(0).toUpperCase();
    const num = Math.floor(Math.random() * 100).toString().padStart(3, '0');
    kioskData.queueNumber = `${prefix}${num}`;

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

// --- Language & I18n ---
const { activeLanguage, t } = useKioskLocale();

// --- Idle Timer Logic ---
const { settings, reloadSettings } = useKioskSettings();
const isIdle = ref(false);
let idleTimer: ReturnType<typeof setTimeout> | null = null;

const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    if (!settings.value.idleEnabled) return;

    // If returning from idle, reset the flow to welcome screen
    if (isIdle.value) {
        resetKiosk();
    }
    isIdle.value = false;

    idleTimer = setTimeout(() => {
        isIdle.value = true;
        resetKiosk();
    }, (settings.value.idleTimeout || 30) * 1000);
};

const handleInteraction = () => resetIdleTimer();

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('mousedown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('scroll', handleInteraction);
        window.addEventListener('storage', reloadSettings);
        resetIdleTimer();
    }
});

onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener('mousemove', handleInteraction);
        window.removeEventListener('mousedown', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('storage', reloadSettings);
        if (idleTimer) clearTimeout(idleTimer);
    }
});

watch(() => settings.value, resetIdleTimer, { deep: true });
watch(
    () => [settings.value.showLanguageToggle, settings.value.languages],
    ([show, languages]) => {
        const langs = languages as string[];
        if (!show) {
            activeLanguage.value = langs?.[0] || 'en';
        } else if (!langs.includes(activeLanguage.value)) {
            activeLanguage.value = langs?.[0] || 'en';
        }
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <div class="kiosk-flow relative h-screen overflow-y-auto">
        <Transition name="fade">
            <KioskIdleScreen v-if="isIdle && settings.idleEnabled" :media="settings.idleMedia"
                :image-url="settings.idleImageUrl" :video-url="settings.idleVideoUrl" @click="handleInteraction" />
        </Transition>

        <!-- Language Switcher -->
        <div v-if="settings.showLanguageToggle && settings.languages?.length > 1"
            class="fixed bottom-6 right-6 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full shadow-sm border border-default p-1 flex items-center gap-1">
            <UButton v-for="lang in settings.languages" :key="lang" :label="lang.toUpperCase()"
                :variant="activeLanguage === lang ? 'solid' : 'ghost'"
                :color="activeLanguage === lang ? 'primary' : 'neutral'" size="sm" class="rounded-full px-4"
                @click="activeLanguage = lang; resetIdleTimer()" />
        </div>

        <KioskQR v-if="settings.showQR" />

        <Transition name="page-fade" mode="out-in">
            <div :key="currentStep" class="w-full">
                <KioskWelcome v-if="currentStep === 'welcome'" @select="handleTransactionSelect" />

                <KioskPayment v-else-if="currentStep === 'payment'" @select="handlePaymentSelect"
                    @back="currentStep = 'welcome'" />

                <KioskPriority v-else-if="currentStep === 'priority'" @select="handlePrioritySelect"
                    @back="currentStep = 'payment'" />

                <KioskSummary v-else-if="currentStep === 'summary'" :transaction-type="kioskData.transactionType"
                    :payment-method="kioskData.paymentMethod" :is-priority="kioskData.isPriority"
                    @confirm="handleConfirm" @back="currentStep = 'priority'" />

                <KioskTicket v-else-if="currentStep === 'ticket'" :queue-number="kioskData.queueNumber"
                    :transaction-type="kioskData.transactionType" :payment-method="kioskData.paymentMethod"
                    :is-priority="kioskData.isPriority" @reset="resetKiosk" />
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.kiosk-flow {
    scrollbar-gutter: stable;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
    transition: all 0.3s ease-in-out;
}

.page-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.page-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>