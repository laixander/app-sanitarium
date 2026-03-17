<template>
    <UDashboardGroup>
        <UDashboardSidebar resizable collapsible :ui="{ root: 'w-auto divide-y divide-default bg-elevated/25' }">
            <template #header="{ collapsed }">
                <div v-if="!collapsed" class="px-2.5 flex items-center gap-2">
                    <UAvatar icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
                        :ui="{ icon: 'text-white' }" />
                    <div class="flex flex-col">
                        <h1 class="font-bold leading-tight tracking-wide mt-0.5">Sulu Sanitarium</h1>
                        <p class="text-xs text-muted leading-tight tracking-wide">Hospital Management System</p>
                    </div>
                </div>
                <div v-else class="mx-auto">
                    <UAvatar icon="i-lucide-heart" size="lg" class="bg-primary rounded-none squircle"
                        :ui="{ icon: 'text-white' }" />
                </div>
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
        <slot />
    </UDashboardGroup>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
    [
        [
            {
                label: 'Modules',
                type: 'label'
            },
            {
                label: 'Account Management',
                icon: 'i-lucide-users',
                to: '/admin/account'
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