<script setup lang="ts">
definePageMeta({
    title: 'Recent Feedback',
    showUserToolbar: true,
    fullWidth: true
})
</script>

<template>
    <UTable :columns="[]" :data="[]">
        <template #empty>
            <div class="flex flex-col items-center justify-center py-12 gap-2">
                <UIcon name="i-lucide-message-square" class="size-12 text-dimmed opacity-50" />
                <p class="text-dimmed">No feedback data recorded yet.</p>
            </div>
        </template>
    </UTable>
</template>