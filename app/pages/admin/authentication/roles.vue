<script setup lang="ts">
import type { Role } from '~/types/role'

definePageMeta({
    title: 'Role-Based Access Control',
    showUserToolbar: true,
})

const { roles, deleteRole } = useRoles()
const { users } = useUsers()

const isEditModalOpen = ref(false)
const selectedRole = ref<Role | null>(null)

function getUserCount(roleTitle: string) {
    return users.value.filter(u => u.role === roleTitle).length
}

function onEdit(role: Role) {
    selectedRole.value = role
    isEditModalOpen.value = true
}

function onDelete(role: Role) {
    openConfirmModal({
        title: 'Delete Role',
        description: `Are you sure you want to delete the ${role.title} role? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => deleteRole(role.title)
    })
}

const isConfirmModalOpen = ref(false)
const confirmModalConfig = ref({
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    confirmColor: 'primary' as const,
    onConfirm: () => { }
})

function openConfirmModal(config: { title: string, description: string, confirmLabel?: string, confirmColor?: any, onConfirm: () => void }) {
    confirmModalConfig.value = {
        confirmLabel: 'Confirm',
        confirmColor: 'primary',
        ...config
    }
    isConfirmModalOpen.value = true
}
</script>
<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Role-Based Access Control" description="Manage user roles and permissions" variant="naked"
                orientation="horizontal">
                <AdminAddRole />
            </UPageCard>
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AdminRoleList v-for="role in roles" :key="role.title" :title="role.title"
                    :user-count="getUserCount(role.title)" :permissions="role.permissions" :color="role.color"
                    @edit="onEdit(role)" @delete="onDelete(role)" />
            </UCard>
        </div>
    </div>

    <AdminRoleFormModal v-model:open="isEditModalOpen" :role="selectedRole" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>