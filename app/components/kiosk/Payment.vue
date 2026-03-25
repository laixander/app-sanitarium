<script setup lang="ts">
defineEmits<{
  (e: 'select', method: string): void
  (e: 'back'): void
}>()
</script>

<template>
    <KioskPage title="Payment Method" description="Are you using HMO or insurance?" footer="HMO patients may be directed to a dedicated verification counter" back @back="$emit('back')">
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton icon="i-lucide-shield-check" title="Yes, HMO" description="I have HMO or insurance coverage" color="purple" layout="vertical" @click="$emit('select', 'HMO/Insurance')" />
            <KioskButton icon="i-lucide-wallet" title="No, Cash/Card" description="I will pay out of pocket" color="slate" layout="vertical" @click="$emit('select', 'Cash/Card')" />
        </div>
    </KioskPage>
</template>