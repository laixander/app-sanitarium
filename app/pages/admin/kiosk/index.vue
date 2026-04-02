<script setup lang="ts">
const { flows, activateFlow, deleteFlow, clearAllFlows } = useKioskSettings()
const router = useRouter()

definePageMeta({
    title: 'Kiosk Management',
    fullWidth: true
})

const globalFilter = ref('')

const columns = [
    { accessorKey: 'name', header: 'Flow Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'idleEnabled', header: 'Idle Screen' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'updatedAt', header: 'Last Modified' },
    { id: 'actions', header: 'Actions', meta: { class: { th: 'text-right', td: 'text-right' } } }
]

const getActionItems = (row: any) => [
    [
        {
            label: 'Edit Flow',
            icon: 'i-lucide-square-pen',
            onSelect: () => router.push(`/admin/kiosk/${row.id}`)
        }
    ],
    [
        {
            label: 'Activate',
            icon: 'i-lucide-check-circle-2',
            disabled: row.status === 'Active',
            onSelect: () => activateFlow(row.id)
        }
    ],
    [
        {
            label: 'Delete',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => deleteFlow(row.id)
        }
    ]
]
</script>

<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <UInput v-model="globalFilter" class="max-w-full md:max-w-sm" placeholder="Filter..." />
        <div class="grid grid-cols-1 md:flex gap-2">
            <UButton label="Clear All" icon="i-lucide-trash" color="neutral" variant="ghost" @click="clearAllFlows" />
            <UButton label="Create New Flow" icon="i-lucide-plus" color="primary" to="/admin/kiosk/new" />
        </div>
    </div>

    <UTable :data="flows" :columns="columns" v-model:global-filter="globalFilter"
        :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }" class="w-full -mt-4 sm:-mt-6">
        <template #name-cell="{ row }">
            <span class="font-semibold text-default">{{ row.original.name }}</span>
        </template>

        <template #idleEnabled-cell="{ row }">
            <span class="text-sm font-medium" :class="row.original.idleEnabled ? 'text-primary' : 'text-gray-500'">
                {{ row.original.idleEnabled ? `Enabled (${row.original.idleTimeout}s)` : 'Disabled' }}
            </span>
        </template>

        <template #status-cell="{ row }">
            <UBadge v-if="row.original.status === 'Active'" color="primary" variant="solid">
                {{ row.original.status }}
            </UBadge>
            <UBadge v-else color="neutral" variant="subtle">
                {{ row.original.status }}
            </UBadge>
        </template>

        <template #updatedAt-cell="{ row }">
            <span class="whitespace-nowrap">{{ row.original.updatedAt }}</span>
        </template>

        <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-2 text-right">
                <UDropdownMenu :items="getActionItems(row.original)" size="sm">
                    <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" size="sm" />
                </UDropdownMenu>
            </div>
        </template>
        <template #empty>
            <div class="flex flex-col items-center justify-center py-12 gap-2">
                <UIcon name="i-lucide-monitor-smartphone" class="size-12 text-dimmed opacity-50" />
                <p class="text-dimmed">No kiosk flows recorded yet.</p>
            </div>
        </template>
    </UTable>
</template>
