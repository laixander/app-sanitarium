<script setup lang="ts">
const route = useRoute()
const type = computed(() => route.query.type as string || 'ended')
const counterName = computed(() => route.query.name as string || 'Unknown Counter')
</script>

<template>
    <div class="fixed inset-0 flex justify-center items-center bg-elevated/50">
        <UPageCard class="w-full max-w-sm shadow-sm">
            <!-- Session Ended View -->
            <div v-if="type === 'ended'" class="text-center space-y-6">
                <div class="relative w-20 h-20 mx-auto">
                    <div class="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-20">
                    </div>
                    <div
                        class="relative flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-900/40 rounded-full">
                        <UIcon name="i-lucide-shield-off" class="size-10 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-2xl font-bold tracking-tight">Session Ended</h2>
                    <p class="text-muted text-pretty">
                        Your session at <span class="font-bold text-default">{{ counterName }}</span> has been
                        terminated. This happens if you logout or are force-logged out by an administrator.
                    </p>
                </div>

                <div class="pt-4 flex flex-col gap-2">
                    <UButton label="Login to Counter" icon="i-lucide-log-in" size="lg" block to="/login" />
                    <!-- <UButton label="Return to Portal" variant="ghost" color="neutral" size="lg" block to="/" /> -->
                </div>

                <p class="text-xs text-muted/60 italic">
                    If this was a mistake, please contact your administrator.
                </p>
            </div>

            <!-- Counter Not Found View -->
            <div v-else class="text-center space-y-6">
                <div class="relative w-20 h-20 mx-auto">
                    <div class="relative flex items-center justify-center w-20 h-20 bg-muted rounded-full">
                        <UIcon name="i-lucide-monitor-x" class="size-10 text-muted" />
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-2xl font-bold tracking-tight">Counter Not Found</h2>
                    <p class="text-muted text-pretty">
                        The counter workstation you're trying to access doesn't exist or has been removed.
                    </p>
                </div>

                <div class="pt-4 flex flex-col gap-3">
                    <UButton label="Back to Counters" icon="i-lucide-arrow-left" size="lg" block to="/login" />
                    <!-- <UButton label="Return to Portal" variant="ghost" color="neutral" to="/" /> -->
                </div>
            </div>
        </UPageCard>
    </div>
</template>
