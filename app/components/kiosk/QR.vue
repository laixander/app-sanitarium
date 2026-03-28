<script setup lang="ts">
const props = withDefaults(defineProps<{
    kioskCode?: string
}>(), {
    kioskCode: 'KIOSK-001'
})

const expanded = ref(false)
const containerRef = ref<HTMLElement>()

const url = useRequestURL()

const qrData = computed(() => `${url.origin}/feedback/${props.kioskCode}`)
const qrUrl = computed(() =>
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData.value)}`
)

function toggle() {
    expanded.value = !expanded.value
}

function close() {
    expanded.value = false
}

function onClickOutside(e: MouseEvent) {
    if (expanded.value && containerRef.value && !containerRef.value.contains(e.target as Node)) {
        close()
    }
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<template>
    <div ref="containerRef" class="fixed top-6 right-6 z-50 flex flex-col items-end">
        <!-- FAB Button -->
        <Transition name="fab">
            <button
                v-if="!expanded"
                @click.stop="toggle"
                class="absolute top-0 right-0 group relative flex items-center justify-center size-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
                <!-- Pulse ring -->
                <span class="absolute inset-0 rounded-2xl animate-ping bg-primary/30 duration-1000" />
                <UIcon name="i-lucide-qr-code" class="size-6 relative z-10" />
            </button>
        </Transition>

        <!-- Expanded Card -->
        <Transition name="qr-card">
            <div
                v-if="expanded"
                class="absolute top-0 right-0 w-80 bg-elevated rounded-2xl shadow-2xl border border-default overflow-hidden"
            >
                <!-- Header -->
                <div class="bg-primary px-5 py-4 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4">
                        <UIcon name="i-lucide-qr-code" class="size-24 text-white/10" />
                    </div>
                    <div class="flex items-center justify-between relative z-10">
                        <div class="text-white">
                            <h3 class="font-bold text-lg leading-tight dark:text-neutral-800">Scan for Feedback</h3>
                            <p class="text-sm text-white/80 dark:text-neutral-800/80">Share your experience with us</p>
                        </div>
                        <button
                            @click="close"
                            class="flex items-center justify-center size-8 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        >
                            <UIcon name="i-lucide-x" class="size-4" />
                        </button>
                    </div>
                </div>

                <!-- QR Code -->
                <div class="p-5 flex flex-col items-center gap-4">
                    <div class="bg-white p-3 rounded-xl shadow-sm border border-default">
                        <img
                            v-if="qrUrl"
                            :src="qrUrl"
                            alt="Feedback QR Code"
                            class="size-44"
                        />
                        <div v-else class="size-44 flex items-center justify-center">
                            <UIcon name="i-lucide-loader-2" class="size-8 text-muted animate-spin" />
                        </div>
                    </div>

                    <div class="text-center space-y-1">
                        <p class="text-sm text-muted">Point your phone camera at the QR code</p>
                        <div class="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-[10px] text-muted font-medium font-mono">
                            <UIcon name="i-lucide-link" class="size-3" />
                            <span>/feedback/{{ kioskCode }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Transitions */
.fab-enter-active,
.fab-leave-active,
.qr-card-enter-active,
.qr-card-leave-active {
    transition: all 0.3s ease-out;
}

.fab-enter-from,
.fab-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.qr-card-enter-from,
.qr-card-leave-to {
    opacity: 0;
    transform: scale(0.1);
    transform-origin: top right;
}
</style>
