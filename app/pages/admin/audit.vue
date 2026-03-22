<script setup lang="ts">
import { upperFirst } from 'scule'
import FBadge from '~/components/ui/FBadge.vue'

definePageMeta({
    title: 'Audit Logs',
    fullWidth: true
})

const { audits } = useAudits()
const globalFilter = ref('')
const table = useTemplateRef('table')
const columnVisibility = ref({})

const columns = [
    {
        accessorKey: 'time',
        header: 'Time'
    },
    {
        accessorKey: 'title',
        header: 'Activity'
    },
    {
        accessorKey: 'description',
        header: 'Description'
    },
    {
        accessorKey: 'category',
        header: 'Category'
    },
    {
        accessorKey: 'actor',
        header: 'Actor'
    }
]
</script>
<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <UInput v-model="globalFilter" class="max-w-full md:max-w-sm" placeholder="Filter..." />
        <div class="grid grid-cols-1 md:flex gap-2">
            <AdminExport filename="Audit Logs" />
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
    <UTable :data="audits" :columns="columns" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }"
        class="w-full -mt-4 sm:-mt-6" ref="table" v-model:global-filter="globalFilter"
        v-model:column-visibility="columnVisibility" sticky>

        <template #time-cell="{ row }">
            <span class="whitespace-nowrap">{{ row.original.time }}</span>
        </template>

        <template #title-cell="{ row }">
            <span class="font-semibold text-default">{{ row.original.title }}</span>
        </template>

        <template #description-cell="{ row }">
            <span class="line-clamp-1">{{ row.original.description }}</span>
        </template>

        <template #category-cell="{ row }">
            <FBadge type="category" :value="row.original.category" />
        </template>

        <template #actor-cell="{ row }">
            <span>{{ row.original.actor }}</span>
        </template>
    </UTable>
</template>