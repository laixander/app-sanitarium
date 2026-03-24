<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

definePageMeta({
    layout: 'dashboard'
})

const items: NavigationMenuItem[][] = [
    [
        [
            {
                label: 'Modules',
                type: 'label'
            },
            {
                label: 'Dashboard',
                icon: 'i-lucide-bar-chart-3',
                to: '/agent/dashboard'
            },
            {
                label: 'Agent Management',
                icon: 'i-lucide-user',
                to: '/agent/management'
            },
            {
                label: 'Assignment Items',
                icon: 'i-lucide-clipboard-check',
                to: '/agent/assignment'
            },
            {
                label: 'Feedback',
                icon: 'i-lucide-message-square-heart',
                to: '/agent/feedback'
            }
        ]
    ],
    [
        {
            label: 'UI Playground',
            icon: 'i-lucide-palette',
            to: '/ui'
        }
    ]
]
</script>
<template>
    <UDashboardSidebar resizable collapsible :ui="{ root: 'w-auto divide-y divide-default bg-elevated/25' }">
        <template #header="{ collapsed }">
            <AppLogo :collapsed="collapsed" />
        </template>
        <template #default="{ collapsed }">
            <UNavigationMenu
                :ui="{ root: 'gap-2.5', label: 'text-default uppercase tracking-widest py-2.5', link: 'p-2.5 gap-2.5', list: 'space-y-0.5' }"
                :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover />
        </template>
        <template #footer="{ collapsed }">
            <UNavigationMenu :ui="{ root: 'w-full gap-2.5', link: 'p-2.5 gap-2.5', list: 'space-y-0.5' }"
                :collapsed="collapsed" :items="items[1]" orientation="vertical" tooltip class="mt-auto" />
        </template>
    </UDashboardSidebar>

    <UDashboardPanel :ui="route.meta.fullWidth ? { body: 'p-0 sm:p-0' } : {}">
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