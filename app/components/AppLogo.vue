<script setup lang="ts">
const { branding } = useBranding()

defineOptions({
    inheritAttrs: false
})

defineProps<{
    collapsed?: boolean
}>()
</script>

<template>
    <div v-if="!collapsed" class="px-2.5 flex items-center gap-2" v-bind="$attrs">
        <!-- App Logo -->
        <UAvatar v-if="branding.appLogo" :src="branding.appLogo" size="lg" class="rounded-full" />
        <UAvatar v-else icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
            :ui="{ icon: 'text-white' }" />
        <div class="flex flex-col">
            <!-- App Name -->
            <h1 class="font-bold leading-tight tracking-wide mt-0.5">{{ branding.appName }}</h1>
            <!-- App Tagline -->
            <p class="text-xs text-muted leading-tight tracking-wide">{{ branding.appTagline }}</p>
        </div>
    </div>
    <div v-else class="mx-auto" v-bind="$attrs">
        <UAvatar v-if="branding.appLogo" :src="branding.appLogo" size="lg" class="rounded-none squircle" />
        <UAvatar v-else icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
            :ui="{ icon: 'text-white' }" />
    </div>
</template>
