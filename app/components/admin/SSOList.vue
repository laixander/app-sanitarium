<script setup lang="ts">
import type { AppColor } from '~/types/ui'
import FBadge from '~/components/ui/FBadge.vue'

interface Props {
    name: string
    description: string
    status: string
    icon: string
    iconColor: AppColor
}

defineProps<Props>()

</script>
<template>
    <div class="flex justify-between items-center gap-2 p-4 sm:p-6">
        <div class="flex items-center gap-3">
            <UiFIcon :icon="icon" :color="iconColor" variant="soft" />
            <div class="flex flex-col">
                <h3 class="text-sm font-medium">{{ name }}</h3>
                <p class="text-xs text-muted">{{ description }}</p>
            </div>
        </div>
        <FBadge :value="status" type="sso" />
    </div>
</template>