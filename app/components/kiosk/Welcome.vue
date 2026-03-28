<script setup lang="ts">
const { transactions } = useTransactions()
const { settings } = useKioskSettings()
const { t } = useKioskLocale()

defineEmits<{
  (e: 'select', transaction: string): void
}>()
</script>

<template>
    <KioskPage :title="settings.welcomeTitle" :description="settings.welcomeDescription" :footer="t('kiosk.welcome.footer')">
        <template #highlight>
            <UBadge :label="t('kiosk.patients_waiting', { count: 16 })" variant="outline" color="info" class="text-base py-3 px-6" />
        </template>
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton 
                v-for="tx in transactions"
                :key="tx.id"
                :icon="tx.icon" 
                :title="tx.name" 
                :description="tx.description || ''" 
                :color="tx.color" 
                @click="$emit('select', tx.name)" 
            />
        </div>
    </KioskPage>
</template>