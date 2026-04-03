<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

definePageMeta({
    layout: 'dashboard'
})

const feedbackLinks: NavigationMenuItem[] = [
    {
        label: 'Recent Feedback',
        to: '/agent/feedback'
    },
    {
        label: 'Kiosk Feedback',
        to: '/agent/feedback/kiosk'
    },
    {
        label: 'Form Settings',
        to: '/agent/feedback/form'
    }
]

const assignmentLinks: NavigationMenuItem[] = [
    {
        label: 'Transactions',
        to: '/agent/assignment'
    },
    {
        label: 'Counters',
        to: '/agent/assignment/counters'
    },
    {
        label: 'Schedules',
        to: '/agent/assignment/schedules'
    }
]

const toolbarLinks = computed(() => {
    if (route.path.startsWith('/agent/feedback')) return feedbackLinks
    if (route.path.startsWith('/agent/assignment')) return assignmentLinks
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
