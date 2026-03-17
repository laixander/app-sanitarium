<template>
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
<script setup lang="ts">
const route = useRoute()

definePageMeta({
    layout: 'admin'
})
</script>