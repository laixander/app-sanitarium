<template>
    <div class="flex items-start gap-4 p-4 sm:p-5 transition-colors">
        <div class="flex-shrink-0 mt-0.5">
            <UBadge icon="i-lucide-clipboard-list" variant="soft" size="lg" class="rounded-none squircle w-fit p-3">
            </UBadge>
        </div>

        <div class="flex-grow flex flex-col gap-1 min-w-0">
            <div class="flex items-center justify-between gap-4">
                <h3 class="font-semibold text-sm truncate">
                    {{ audit.title }}
                </h3>
                <span class="text-xs text-muted whitespace-nowrap">
                    {{ audit.time }}
                </span>
            </div>

            <p class="text-sm text-muted line-clamp-1">
                {{ audit.description }}
            </p>

            <div class="flex items-center gap-2 mt-1">
                <UBadge :label="audit.category" variant="outline" color="neutral" />
                <span class="text-xs text-dimmed">
                    by {{ audit.actor }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AuditLog } from '~/composables/useAudits'

defineProps<{
    audit: AuditLog
}>()
</script>
