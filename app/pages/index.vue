<template>
    <UDashboardPanel>
        <template #header>
            <UDashboardNavbar :title="(route.meta.title as string) || 'Page Title'"
                :ui="{ root: 'relative z-10 bg-default', title: 'text-default' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <UColorModeButton />
                    <UserMenu />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <NuxtPage />
        </template>
    </UDashboardPanel>
</template>
<script setup lang="ts">
const route = useRoute()

definePageMeta({
    layout: 'admin'
})
</script>