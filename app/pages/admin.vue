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
                label: 'User Management',
                icon: 'i-lucide-user',
                to: '/admin/user'
            },
            {
                label: 'Authentication & Roles',
                icon: 'i-lucide-shield',
                to: '/admin/authentication'
            },
            {
                label: 'Audit Logs',
                icon: 'i-lucide-scroll-text',
                to: '/admin/audit'
            },
            {
                label: 'System Configuration',
                icon: 'i-lucide-settings',
                to: '/admin/configuration'
            },
            {
                label: 'Branding',
                icon: 'i-lucide-palette',
                to: '/admin/branding'
            },
            {
                label: 'SSO Integration',
                icon: 'i-lucide-shield-check',
                to: '/admin/sso'
            }
        ]
    ],
    // [
    //     {
    //         label: 'Kiosk View',
    //         icon: 'i-lucide-monitor',
    //         to: '/kiosk'
    //     }
    // ]
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
            <!-- <UDashboardToolbar>
                <template v-if="route.meta.showUserToolbar">
                    <div class="font-semibold">User Accounts</div>
                    <div class="flex items-center gap-2">
                        <UInput placeholder="Search users..." icon="i-lucide-search" />
                        <AdminAddUser />
                    </div>
                </template>
            </UDashboardToolbar> -->
        </template>
        <template #body>
            <NuxtPage />
        </template>
    </UDashboardPanel>
</template>