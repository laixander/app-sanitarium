<template>
    <div class="flex flex-col flex-1 w-full">
        <div class="flex justify-between px-4 sm:px-6 py-3.5 border-b border-accented">
            <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            <div class="flex gap-2">
                <AdminAddUser />
                <UDropdownMenu :items="table?.tableApi
                        ?.getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => ({
                            label: upperFirst(column.id),
                            type: 'checkbox' as const,
                            checked: column.getIsVisible(),
                            onUpdateChecked(checked: boolean) {
                                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                            },
                            onSelect(e: Event) {
                                e.preventDefault()
                            }
                        }))
                    " :content="{ align: 'end' }">
                    <UButton label="Display" color="neutral" variant="outline" trailing-icon="i-lucide-settings-2" />
                </UDropdownMenu>
            </div>
        </div>
        <UTable :data="users" :columns="columns" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }" class="w-full"
            ref="table" v-model:global-filter="globalFilter" v-model:column-visibility="columnVisibility" @hover=""
            sticky>
            <template #name-cell="{ row }">
                <div class="flex items-center gap-3">
                    <UAvatar :alt="row.original.name" size="sm" class="bg-primary/10 text-primary font-bold"
                        :src="`https://i.pravatar.cc/128?u=${row.original.id}`" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</span>
                </div>
            </template>

            <template #email-cell="{ row }">
                <span class="text-gray-500">{{ row.original.email }}</span>
            </template>

            <template #role-cell="{ row }">
                <UBadge :label="row.original.role" :color="getRoleColor(row.original.role)" variant="subtle" />
                <!-- <UiFTag :label="row.original.role" :color="getRoleColor(row.original.role)" /> -->
            </template>

            <template #status-cell="{ row }">
                <UBadge :label="row.original.status" :color="row.original.status === 'Active' ? 'success' : 'error'"
                    variant="subtle" />
                <!-- <UiFTag :label="row.original.status" :color="row.original.status === 'Active' ? 'success' : 'error'" /> -->
            </template>

            <template #last_login-cell="{ row }">
                <span class="text-gray-500">{{ row.original.last_login }}</span>
            </template>

            <template #actions-cell="{ row }">
                <UDropdownMenu :items="getActionItems(row.original)" :content="{ align: 'end' }"
                    :ui="{ content: 'w-auto' }" size="sm">
                    <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
                </UDropdownMenu>
            </template>
        </UTable>
    </div>

    <AdminUserFormModal v-model:open="isEditModalOpen" :user="selectedUser" @success="selectedUser = null" />

    <AdminConfirmModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>

<script setup lang="ts">
import type { User } from '~/composables/useUsers'
import { upperFirst } from 'scule'

definePageMeta({
    title: 'Account Management',
    fullWidth: true,
    // showUserToolbar: true
})

const globalFilter = ref('')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const { users, getRoleColor, deleteUser, updateUser } = useUsers()

const isEditModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

function onEdit(user: User) {
    selectedUser.value = user
    isEditModalOpen.value = true
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

const getActionItems = (row: User) => [
    [
        {
            label: 'Edit',
            icon: 'i-lucide-square-pen',
            onSelect: () => onEdit(row)
        },
        row.status === 'Active' ? {
            label: 'Suspend Account',
            icon: 'i-lucide-user-minus',
            color: 'error' as const,
            onSelect: () => {
                openConfirmModal({
                    title: 'Suspend Account',
                    description: `Are you sure you want to suspend ${row.name}'s account?`,
                    confirmLabel: 'Suspend',
                    confirmColor: 'error',
                    onConfirm: () => updateUser(row.id, { status: 'Suspended' })
                })
            }
        } : {
            label: 'Activate Account',
            icon: 'i-lucide-user-plus',
            color: 'success' as const,
            onSelect: () => {
                updateUser(row.id, { status: 'Active' })
            }
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => {
                openConfirmModal({
                    title: 'Delete User',
                    description: `Are you sure you want to delete ${row.name}? This action cannot be undone.`,
                    confirmLabel: 'Delete',
                    confirmColor: 'error',
                    onConfirm: () => deleteUser(row.id)
                })
            }
        }
    ]
]

const columns = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'role',
        header: 'Role'
    },
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        accessorKey: 'last_login',
        header: 'Last Login'
    },
    {
        id: 'actions',
        meta: {
            class: {
                td: 'text-right'
            }
        }
    }
]
</script>