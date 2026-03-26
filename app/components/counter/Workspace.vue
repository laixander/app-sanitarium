<script setup lang="ts">
import type { Ticket } from '~/types/queue'
import type { AppColor } from '~/types/ui'

const props = defineProps<{
    servingTicket?: Ticket
    queueLength: number
    isOnline: boolean
}>()

defineEmits<{
    (e: 'callNext'): void
    (e: 'complete'): void
    (e: 'miss'): void
    (e: 'reannounce'): void
}>()

const transactionColor: Record<string, AppColor> = {
    Consultation: 'sky',
    Outpatient: 'indigo',
    Admission: 'pink',
    Billing: 'teal',
}

const transactionShadow: Record<string, string> = {
    Consultation: 'shadow-sky/20',
    Outpatient: 'shadow-indigo/20',
    Admission: 'shadow-pink/20',
    Billing: 'shadow-teal/20',
}

const servingBadgeColor = computed<AppColor>(() => {
    if (!props.servingTicket?.transactionType) return 'primary'
    return transactionColor[props.servingTicket.transactionType] || 'primary'
})

const servingShadowClass = computed(() => {
    if (!props.servingTicket?.transactionType) return 'shadow-primary/20'
    return transactionShadow[props.servingTicket.transactionType] || 'shadow-primary/20'
})
</script>

<template>
    <div class="transition-all duration-300" :class="!isOnline ? 'opacity-60 grayscale' : ''">
        <!-- NOW SERVING VIEW -->
        <div v-if="servingTicket" class="min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-warning/30 p-8 bg-warning/5">
            <div class="text-center space-y-6 w-full max-w-sm">
                <p class="text-sm font-semibold uppercase tracking-widest text-warning">Now Serving</p>

                <UBadge class="rounded-2xl p-8 shadow-lg mx-auto w-fit min-w-[180px]" :class="servingShadowClass" :color="servingBadgeColor">
                    <p class="text-5xl font-extrabold tracking-wide">{{ servingTicket.ticket }}</p>
                </UBadge>

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <p class="text-sm text-muted">
                        {{ servingTicket.transactionType }}
                        <template v-if="servingTicket.isHmo"> · HMO/Insurance</template>
                        <template v-if="servingTicket.isPriority"> · Priority</template>
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <UButton label="Complete" icon="i-lucide-circle-check-big" color="success" size="lg" block class="px-8 py-3" :disabled="!isOnline" @click="$emit('complete')" />
                    <UButton label="No Show" icon="i-lucide-circle-x" color="error" size="lg" block class="px-8 py-3" :disabled="!isOnline" @click="$emit('miss')" />
                    <UButton label="Re-announce Ticket" icon="i-lucide-volume-2" color="neutral" variant="outline" size="lg" block class="px-8 py-3 col-span-2" :disabled="!isOnline" @click="$emit('reannounce')" />
                </div>
            </div>
        </div>

        <!-- WAITING / IDLE VIEW -->
        <div v-else class="min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-8 bg-muted">
            <div class="text-center space-y-6">
                <UBadge icon="i-lucide-ticket" color="sky" variant="soft" :ui="{ leadingIcon: 'size-10' }" class="p-6 rounded-full" />
                <div>
                    <h3 class="text-xl font-bold">Waiting for Next Ticket</h3>
                    <p class="text-muted mt-1">
                        {{ queueLength > 0
                            ? `There are ${queueLength} people waiting in your queue.`
                            : 'No one is currently waiting.' }}
                    </p>
                </div>
                <UButton v-if="queueLength > 0" icon="i-lucide-play" label="Call Next Ticket" :ui="{ base: 'gap-3', leadingIcon: 'size-6' }" class="shadow-xl shadow-primary/20 py-4 px-8 text-lg rounded-2xl" :disabled="!isOnline" @click="$emit('callNext')" />
            </div>
        </div>
    </div>
</template>
