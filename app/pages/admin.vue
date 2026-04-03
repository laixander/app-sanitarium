<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const route = useRoute()

definePageMeta({
    layout: 'dashboard'
})

const authenticationLinks: NavigationMenuItem[] = [
    {
        label: 'Security Settings',
        to: '/admin/authentication'
    },
    {
        label: 'Role-Based Access Control',
        to: '/admin/authentication/roles'
    }
]

const configurationLinks: NavigationMenuItem[] = [
    {
        label: 'Queue Configuration',
        to: '/admin/configuration'
    },
    {
        label: 'Notification Settings',
        to: '/admin/configuration/notification'
    },
    {
        label: 'Panel Status',
        to: '/admin/configuration/panels'
    }
]

const toolbarLinks = computed(() => {
    if (route.path.startsWith('/admin/authentication')) return authenticationLinks
    if (route.path.startsWith('/admin/configuration')) return configurationLinks
    return []
})
</script>
<template>
    <UDashboardPanel :ui="route.meta.fullWidth ? { body: 'p-0 sm:p-0' } : {}">
        <template #header>
            <UDashboardNavbar :title="(route.meta.title as string) || 'Page Title'"
                :ui="{ root: 'relative z-10 bg-default', title: 'text-default' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <!-- <UColorModeButton /> -->
                    <UserMenu />
                </template>
            </UDashboardNavbar>
            <UDashboardToolbar v-if="route.meta.showUserToolbar && toolbarLinks.length > 0">
                <UNavigationMenu :items="toolbarLinks" highlight class="-mx-1 flex-1" />
            </UDashboardToolbar>
        </template>
        <template #body>
            <NuxtPage />
        </template>
    </UDashboardPanel>
</template>
