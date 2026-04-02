<script setup lang="ts">
// This page is shown when an agent logs in but has no counter assigned yet.
</script>

<template>
    <div class="fixed inset-0 flex justify-center items-center bg-elevated/50">
        <UPageCard class="w-full max-w-sm shadow-sm">
            <div class="text-center space-y-6">
                <!-- Icon with a subtle pulse effect to draw attention -->
                <div class="relative w-20 h-20 mx-auto">
                    <div class="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full animate-ping opacity-20">
                    </div>
                    <div
                        class="relative flex items-center justify-center w-20 h-20 bg-amber-50 dark:bg-amber-900/40 rounded-full">
                        <UIcon name="i-lucide-user-cog" class="size-10 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>

                <div class="space-y-3">
                    <h2 class="text-2xl font-bold tracking-tight text-default">Counter Assignment Required</h2>
                    <p class="text-muted text-sm leading-relaxed px-4">
                        Your account is currently active, but it hasn't been assigned to a specific counter yet. 
                    </p>
                    <UAlert variant="soft" color="warning" class="mt-4 text-left" icon="i-lucide-info">
                        <template #description>
                            Please contact the <strong>Administration</strong> or your <strong>Supervisor</strong> to complete your workstation setup.
                        </template>
                    </UAlert>
                </div>

                <div class="pt-6 flex flex-col gap-3">
                    <UButton label="Return to Login" icon="i-lucide-log-out" size="lg" block to="/login" variant="solid" color="primary" />
                    <p class="text-[10px] text-muted/50 uppercase tracking-widest font-medium">Session ID: {{ Math.random().toString(36).substring(7).toUpperCase() }}</p>
                </div>
            </div>
        </UPageCard>
    </div>
</template>
