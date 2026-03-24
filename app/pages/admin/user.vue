<script setup lang="ts">
import type { User } from '~/types/user'
import { upperFirst } from 'scule'
import FBadge from '~/components/ui/FBadge.vue'

definePageMeta({
    title: 'User Management',
    fullWidth: true,
    // showUserToolbar: true
})

const globalFilter = ref('')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const { users, deleteUser, updateUser } = useUsers()

const isEditModalOpen = ref(false)
const isViewDrawerOpen = ref(false)
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
            label: 'View Details',
            icon: 'i-lucide-eye',
            onSelect: () => {
                selectedUser.value = row
                isViewDrawerOpen.value = true
            }
        },
        {
            label: 'Edit',
            icon: 'i-lucide-square-pen',
            onSelect: () => onEdit(row)
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
        accessorKey: 'createdAt',
        header: 'Created At'
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At'
    },
    {
        accessorKey: 'createdBy',
        header: 'Created By'
    },
    {
        accessorKey: 'updatedBy',
        header: 'Updated By'
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
<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <UInput v-model="globalFilter" class="max-w-full md:max-w-sm" placeholder="Filter..." />
        <div class="grid grid-cols-1 md:flex gap-2">
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
    <UTable :data="users" :columns="columns" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }"
        class="w-full -mt-4 sm:-mt-6" ref="table" v-model:global-filter="globalFilter"
        v-model:column-visibility="columnVisibility" @hover="" sticky>
        <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
                <UAvatar :alt="row.original.name" size="sm" class="bg-primary/10 text-primary font-bold"
                    :src="`https://i.pravatar.cc/128?u=${row.original.id}`" />
                <span class="font-semibold text-default">{{ row.original.name }}</span>
            </div>
        </template>

        <template #email-cell="{ row }">
            <span>{{ row.original.email }}</span>
        </template>

        <template #role-cell="{ row }">
            <FBadge type="role" :value="row.original.role" />
        </template>



        <template #actions-cell="{ row }">
            <UDropdownMenu :items="getActionItems(row.original)" :content="{ align: 'end' }" :ui="{ content: 'w-auto' }"
                size="sm">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
            </UDropdownMenu>
        </template>
    </UTable>

    <AdminUserFormModal v-model:open="isEditModalOpen" :user="selectedUser" @success="selectedUser = null" />
    <AdminUserDetails v-model:open="isViewDrawerOpen" :user="selectedUser" @success="selectedUser = null" />

    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>