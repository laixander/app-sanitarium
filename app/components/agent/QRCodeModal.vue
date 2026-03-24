<script setup lang="ts">
import type { User } from '~/types/user'

const props = defineProps<{
    user: User | null
}>()

const open = defineModel<boolean>('open', { default: false })

const url = useRequestURL()

const qrData = computed(() => {
    if (!props.user?.code) return ''
    return `${url.origin}/feedback/${props.user.code}`
})

const qrUrl = computed(() => {
    if (!qrData.value) return ''
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData.value}`
})

function onClose() {
    open.value = false
}

function onDownload() {
    if (!qrUrl.value) return
    const link = document.createElement('a')
    link.href = qrUrl.value
    link.download = `${props.user?.code}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>

<template>
    <UModal v-model:open="open" title="Agent QR Code" :description="user?.name" :ui="{ footer: 'flex-col' }"
        class="max-w-sm">
        <template #body>
            <div class="flex flex-col items-center justify-center py-6 gap-4">
                <div class="bg-white p-4 rounded-xl shadow-sm border border-default">
                    <img v-if="qrUrl" :src="qrUrl" alt="Agent QR Code" class="size-48 sm:size-64" />
                    <div v-else class="size-48 sm:size-64 flex items-center justify-center bg-gray-100 rounded-lg">
                        <UIcon name="i-lucide-qr-code" class="size-12 text-gray-400" />
                    </div>
                </div>

                <div class="text-center">
                    <p class="font-bold text-lg text-default">{{ user?.name }}</p>
                    <p class="text-xs text-gray-500 font-mono mb-2">{{ user?.code || 'No Code' }}</p>
                    <div
                        class="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-[10px] text-muted font-medium">
                        <UIcon name="i-lucide-link" class="size-3" />
                        <span>/feedback/{{ user?.code }}</span>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <UButton label="Download" variant="solid" @click="onDownload" block />
            <UButton label="Close" color="neutral" variant="ghost" @click="onClose" block />
        </template>
    </UModal>
</template>
