<script setup>
const { branding } = useBranding()
const appConfig = useAppConfig()

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: branding.value.appLogo || '/favicon.ico' }
    ],
    htmlAttrs: {
        lang: 'en'
    }
})

// Sync app theme with branding colors
watch([() => branding.value.primaryColor, () => branding.value.neutralColor], ([primary, neutral]) => {
    appConfig.ui.colors.primary = primary
    appConfig.ui.colors.neutral = neutral
}, { immediate: true })

const title = computed(() => `${branding.value.appName} — Hospital Management System`)
const description = 'Comprehensive dual-interface hospital management system featuring patient queuing kiosk and professional admin dashboard.'

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description
})
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
