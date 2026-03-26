<script setup lang="ts">
defineProps<{
    isOnline: boolean
    isBusy?: boolean
}>()

defineEmits<{
    (e: 'update:isOnline', value: boolean): void
}>()
</script>

<template>
    <div class="flex items-center">
        <UButton
            v-if="isOnline"
            label="Go Offline"
            icon="i-lucide-power-off"
            color="error"
            variant="outline"
            size="lg"
            :disabled="isBusy"
            :ui="{ leadingIcon: 'size-4' }"
            @click="$emit('update:isOnline', false)"
        />
        <UButton
            v-else
            label="Go Online"
            icon="i-lucide-power"
            color="success"
            size="lg"
            :disabled="isBusy"
            :ui="{ leadingIcon: 'size-4' }"
            @click="$emit('update:isOnline', true)"
        />
    </div>
</template>
