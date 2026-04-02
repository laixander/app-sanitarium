<script setup lang="ts">
import { useKioskLocale } from '~/composables/useKioskLocale'

const { t } = useKioskLocale()

defineEmits<{
    (e: 'select', method: string): void
    (e: 'back'): void
}>()
</script>

<template>
    <KioskPage :title="t('payment.title')" :description="t('payment.desc')" :footer="t('payment.footer')" back
        @back="$emit('back')">
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton icon="i-lucide-shield-check" :title="t('payment.hmo.title')"
                :description="t('payment.hmo.desc')" color="purple" layout="vertical"
                @click="$emit('select', 'HMO/Insurance')" />
            <KioskButton icon="i-lucide-wallet" :title="t('payment.cash.title')" :description="t('payment.cash.desc')"
                color="slate" layout="vertical" @click="$emit('select', 'Cash/Card')" />
        </div>
    </KioskPage>
</template>