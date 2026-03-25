<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
    queueNumber?: string;
    transactionType?: string;
    paymentMethod?: string;
    queueType?: string;
}

const props = withDefaults(defineProps<Props>(), {
    queueNumber: 'A-001',
    transactionType: 'Consultation',
    paymentMethod: 'Cash/Card',
    queueType: 'Regular Queue'
});

const emit = defineEmits<{
  (e: 'reset'): void
}>()

const transactionIcon = computed(() => {
    switch (props.transactionType) {
        case 'Consultation': return 'i-lucide-stethoscope';
        case 'Admission': return 'i-lucide-bed-double';
        case 'Billing': return 'i-lucide-credit-card';
        case 'Outpatient': return 'i-lucide-clipboard-list';
        default: return 'i-lucide-ticket';
    }
});

const transactionColor = computed(() => {
    switch (props.transactionType) {
        case 'Consultation': return 'sky';
        case 'Admission': return 'pink';
        case 'Billing': return 'teal';
        case 'Outpatient': return 'indigo';
        default: return 'primary';
    }
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
    <KioskPage title="Your Ticket is Ready!" description="Please take your printed ticket below">
        <div class="w-full max-w-xl mx-auto space-y-6">
            <UCard :ui="{ body: 'sm:px-0 space-y-6' }" class="rounded-2xl ring-2 ring-primary/20">
                <div class="bg-primary text-white px-6 py-4 text-lg font-bold text-center">Sulu Sanitarium General Hospital</div>
                <div class="px-6 space-y-8">
                    <div class="text-center px-6">
                        <p class="text-sm text-muted uppercase tracking-wide">Your Queue Number</p>
                        <p class="text-8xl font-extrabold">{{ props.queueNumber }}</p>
                    </div>
                    <div class="flex flex-wrap items-center justify-center gap-4">
                        <UBadge :label="props.transactionType" :icon="transactionIcon" :color="transactionColor" variant="soft" class="text-base py-2 px-4" />
                        <UBadge v-if="props.paymentMethod !== 'Cash/Card'" label="HMO/Insurance" icon="i-lucide-shield-check" color="purple" variant="soft" class="text-base py-2 px-4" />
                        <UBadge v-if="props.queueType !== 'Regular Queue'" label="Priority" icon="i-lucide-heart" color="rose" variant="soft" class="text-base py-2 px-4" />
                    </div>
                    <div class="flex justify-between border-y border-default p-6">
                        <div class="inline-flex items-center gap-2">
                            <span class="text-sm text-muted uppercase tracking-wide">Queue Position:</span>
                            <span class="font-bold text-slate-800">34</span>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <span class="text-sm text-muted uppercase tracking-wide">Est. Wait:</span>
                            <span class="font-bold text-slate-800">30-45 min</span>
                        </div>
                    </div>
                    <div class="text-center space-y-1">
                        <div class="text-muted font-medium">March 25, 2026 at 3:10 PM</div>
                        <div class="text-dimmed text-sm">Please wait for your number to be called</div>
                    </div>
                </div>
            </UCard>
            <UButton label="Get Another Ticket" icon="i-lucide-rotate-ccw" variant="solid" color="primary" class="text-xl font-semibold p-6 rounded-xl" block @click="handleReset" />
            <div class="text-center text-muted">
                Screen will reset in <span class="text-primary font-bold">{{ resetTimer }}</span> seconds
            </div>
        </div>

        <template #footer>
            <UAlert description="Please proceed to the waiting area and watch the display screen for your number. Listen for audio announcements as well." variant="soft" class="text-base py-3 px-6 max-w-lg mx-auto" />
        </template>
    </KioskPage>
</template>