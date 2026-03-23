<script setup lang="ts">
import type { Role } from '~/types/role'

definePageMeta({
    title: 'Authentication & Roles'
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

const state = reactive<{ [key: string]: boolean }>({
    twoFactorAuth: true,
    sessionTimeout: true,
    passwordComplexity: false,
    loginLockout: true,
})

const fields = [
    {
        name: 'twoFactorAuth',
        label: 'Two-Factor Authentication',
        description: 'Require 2FA for all admin accounts',
        type: 'boolean'
    },
    {
        name: 'sessionTimeout',
        label: 'Session Timeout',
        description: 'Auto-logout after 30 minutes of inactivity',
        type: 'boolean'
    },
    {
        name: 'passwordComplexity',
        label: 'Password Complexity',
        description: 'Require minimum 8 chars with special characters',
        type: 'boolean'
    },
    {
        name: 'loginLockout',
        label: 'Login Attempt Lockout',
        description: 'Lock account after 5 failed login attempts',
        type: 'boolean'
    }
]

const toast = useToast()

async function onChange() {
    // Do something with data
    toast.add({
        title: 'Settings Updated',
        description: 'Security settings have been updated successfully.',
        color: 'success'
    })
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

        <div class="flex flex-col gap-4">
            <UPageCard title="Security Settings" description="Manage security settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <UFormField v-for="field in fields" :key="field.name" :name="field.name" :label="field.label"
                    :description="field.description" class="flex items-center justify-between p-4 sm:p-6 gap-2">
                    <USwitch v-model="state[field.name]" @update:model-value="onChange" />
                </UFormField>
            </UCard>
        </div>

    </div>

    <AdminRoleFormModal v-model:open="isEditModalOpen" :role="selectedRole" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>