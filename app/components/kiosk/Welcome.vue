<script setup lang="ts">
defineEmits<{
  (e: 'select', transaction: string): void
}>()
</script>

<template>
    <KioskPage title="Sulu Sanitarium General Hospital" description="Please select the type of transaction you need" footer="Touch the screen to select your transaction type">
        <template #highlight>
            <UBadge label="16 patients currently waiting" variant="outline" color="info" class="text-base py-3 px-6" />
        </template>
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton icon="i-lucide-stethoscope" title="Consultation" description="Doctor consultations and check-ups" color="sky" @click="$emit('select', 'Consultation')" />
            <KioskButton icon="i-lucide-bed-double" title="Admission" description="Hospital admission and room assignment" color="pink" @click="$emit('select', 'Admission')" />
            <KioskButton icon="i-lucide-credit-card" title="Billing" description="Payment and billing inquiries" color="teal" @click="$emit('select', 'Billing')" />
            <KioskButton icon="lucide-clipboard-list" title="Outpatient" description="Outpatient services and procedures" color="indigo" @click="$emit('select', 'Outpatient')" />
        </div>
    </KioskPage>
</template>