<script setup lang="ts">
defineOptions({
    inheritAttrs: false
})

defineProps<{
    collapsed?: boolean
}>()
</script>

<template>
    <div v-if="!collapsed" class="px-2.5 flex items-center gap-2" v-bind="$attrs">
        <UAvatar icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
            :ui="{ icon: 'text-white' }" />
        <div class="flex flex-col">
            <h1 class="font-bold leading-tight tracking-wide mt-0.5">Sulu Sanitarium</h1>
            <p class="text-xs text-muted leading-tight tracking-wide">Hospital Management System</p>
        </div>
    </div>
    <div v-else class="mx-auto" v-bind="$attrs">
        <UAvatar icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
            :ui="{ icon: 'text-white' }" />
    </div>
</template>
