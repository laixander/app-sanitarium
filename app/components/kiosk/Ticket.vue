<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useKioskLocale } from '~/composables/useKioskLocale';

const { tickets } = useTickets();
const { transactions } = useTransactions();
const { t } = useKioskLocale();

// Queue position: count of waiting tickets ahead (same transaction type gets priority context)
const queuePosition = computed(() => {
    const waiting = tickets.value.filter(t => t.status === 'waiting')
    const myIndex = waiting.findIndex(t => t.ticket === props.queueNumber)
    return myIndex >= 0 ? myIndex + 1 : waiting.length
})

// Estimated wait: ~8 min per person ahead
const estWait = computed(() => {
    const minPerPerson = 8
    const pos = queuePosition.value
    if (pos <= 1) return '< 5 min'
    const low = (pos - 1) * (minPerPerson - 2)
    const high = (pos - 1) * minPerPerson
    return `${low}-${high} min`
})

// Current timestamp
const ticketTimestamp = computed(() => {
    return new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
})

interface Props {
    queueNumber?: string;
    transactionType?: string;
    paymentMethod?: string;
    isPriority?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    queueNumber: 'A-001',
    transactionType: 'Consultation',
    paymentMethod: 'Cash/Card',
    isPriority: false
});

const emit = defineEmits<{
    (e: 'reset'): void
}>()

const transactionIcon = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.icon : 'i-lucide-ticket'
});

const transactionColor = computed(() => {
    const tx = transactions.value.find(t => t.name === props.transactionType)
    return tx ? tx.color : 'primary'
});

const setTimer = ref(30);
const resetTimer = ref(setTimer.value);

let timerInterval: any = null;

const handleReset = () => {
    emit('reset');
}

onMounted(() => {
    timerInterval = setInterval(() => {
        resetTimer.value--;
        if (resetTimer.value <= 0) {
            handleReset();
        }
    }, 1000);
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
    <KioskPage :title="t('ticket.title')" :description="t('ticket.desc')">
        <div class="w-full max-w-xl mx-auto space-y-6">
            <UCard :ui="{ body: 'sm:px-0 space-y-6' }" class="rounded-2xl ring-2 ring-primary/20">
                <div class="bg-primary text-white px-6 py-4 text-lg font-bold text-center">Sulu Sanitarium General
                    Hospital</div>
                <div class="px-6 space-y-8">
                    <div class="text-center px-6">
                        <p class="text-sm text-muted uppercase tracking-wide">{{ t('ticket.number') }}</p>
                        <p class="text-8xl font-extrabold">{{ props.queueNumber }}</p>
                    </div>
                    <div class="flex flex-wrap items-center justify-center gap-4">
                        <UBadge :label="props.transactionType" :icon="transactionIcon" :color="transactionColor"
                            variant="soft" class="text-base py-2 px-4" />
                        <UBadge v-if="props.paymentMethod !== 'Cash/Card'" label="HMO/Insurance"
                            icon="i-lucide-shield-check" color="purple" variant="soft" class="text-base py-2 px-4" />
                        <UBadge v-if="props.isPriority" :label="t('label.priority_queue')" icon="i-lucide-heart"
                            color="rose" variant="soft" class="text-base py-2 px-4" />
                    </div>
                    <div class="flex justify-between border-y border-default p-6">
                        <div class="inline-flex items-center gap-2">
                            <span class="text-sm text-muted uppercase tracking-wide">Queue Position:</span>
                            <span class="font-bold">{{ queuePosition }}</span>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <span class="text-sm text-muted uppercase tracking-wide">Est. Wait:</span>
                            <span class="font-bold">{{ estWait }}</span>
                        </div>
                    </div>
                    <div class="text-center space-y-1">
                        <div class="text-muted font-medium">{{ ticketTimestamp }}</div>
                        <div class="text-dimmed text-sm">Please wait for your number to be called</div>
                    </div>
                </div>
            </UCard>
            <UButton label="Get Another Ticket" icon="i-lucide-rotate-ccw" variant="solid" color="primary"
                class="text-xl font-semibold p-6 rounded-xl" block @click="handleReset" />
            <div class="text-center text-muted">
                Screen will reset in <span class="text-primary font-bold">{{ resetTimer }}</span> seconds
            </div>
        </div>

        <template #footer>
            <UAlert
                description="Please proceed to the waiting area and watch the display screen for your number. Listen for audio announcements as well."
                variant="soft" class="text-base py-3 px-6 max-w-lg mx-auto" />
        </template>
    </KioskPage>
</template>