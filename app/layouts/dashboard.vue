<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const open = ref(false)

const items = computed<NavigationMenuItem[][]>(() => [
    [
        [
            {
                label: 'Workspace',
                type: 'label'
            },
            {
                label: 'Dashboard',
                icon: 'i-lucide-bar-chart-3',
                to: '/agent/dashboard'
            },
            {
                label: 'Ticket History',
                icon: 'i-lucide-history',
                to: '/agent/logs'
            },
            {
                label: 'Assignment Items',
                icon: 'i-lucide-clipboard-check',
                to: '/agent/assignment',
                defaultOpen: false,
                type: 'trigger',
                children: [
                    {
                        label: 'Transactions',
                        to: '/agent/assignment',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Counters',
                        to: '/agent/assignment/counters',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Schedules',
                        to: '/agent/assignment/schedules',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    }
                ]
            },
            {
                label: 'Feedback',
                icon: 'i-lucide-message-square-heart',
                to: '/agent/feedback',
                defaultOpen: false,
                type: 'trigger',
                children: [
                    {
                        label: 'Recent Feedback',
                        to: '/agent/feedback',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Kiosk Feedback',
                        to: '/agent/feedback/kiosk',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Form Settings',
                        to: '/agent/feedback/form',
                        onSelect: () => {
                            open.value = false
                        }
                    }
                ]
            }
        ],
        [
            {
                label: 'Identity & Access',
                type: 'label'
            },
            {
                label: 'User Management',
                icon: 'i-lucide-users',
                to: '/admin/user'
            },
            {
                label: 'Agent Management',
                icon: 'i-lucide-user',
                to: '/agent/management'
            },
            {
                label: 'Authentication & Roles',
                icon: 'i-lucide-shield',
                to: '/admin/authentication',
                defaultOpen: false,
                type: 'trigger',
                children: [
                    {
                        label: 'Security Settings',
                        to: '/admin/authentication',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Role-Based Access Control',
                        to: '/admin/authentication/roles',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    }
                ]
            },
            {
                label: 'SSO Integration',
                icon: 'i-lucide-shield-check',
                to: '/admin/sso'
            }
        ],
        [
            {
                label: 'System Administration',
                type: 'label'
            },
            {
                label: 'System Configuration',
                icon: 'i-lucide-settings',
                to: '/admin/configuration',
                defaultOpen: false,
                type: 'trigger',
                children: [
                    {
                        label: 'Queue Configuration',
                        to: '/admin/configuration',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Notification Settings',
                        to: '/admin/configuration/notification',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Panel Status',
                        to: '/admin/configuration/panels',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    }
                ]
            },
            {
                label: 'Kiosk Content',
                icon: 'i-lucide-monitor-smartphone',
                to: '/admin/kiosk',
                active: route.path.startsWith('/admin/kiosk')
            },
            {
                label: 'Branding',
                icon: 'i-lucide-palette',
                to: '/admin/branding'
            },
            {
                label: 'Audit Logs',
                icon: 'i-lucide-scroll-text',
                to: '/admin/audit'
            }
        ],
        [
            {
                label: 'Demo Pages',
                type: 'label'
            },
            {
                label: 'Display',
                icon: 'i-lucide-monitor',
                children: [
                    {
                        label: 'Kiosk',
                        to: '/kiosk',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Queue Display',
                        to: '/queue',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Counter Interface',
                        to: '/counter',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    },
                    {
                        label: 'Feedback Form',
                        to: '/feedback/preview',
                        exact: true,
                        onSelect: () => {
                            open.value = false
                        }
                    }
                ]
            },
            {
                label: 'Documentation',
                icon: 'i-lucide-book-open',
                to: '/docs'
            },
            {
                label: 'Landing Page',
                icon: 'i-lucide-globe',
                to: '/'
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
])
</script>
<template>
    <UDashboardGroup>
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
        <slot />
    </UDashboardGroup>
</template>