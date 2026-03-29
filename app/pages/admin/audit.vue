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
    },
    {
        accessorKey: 'time',
        header: 'Time'
    }
]
</script>
<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <UInput v-model="globalFilter" class="max-w-full md:max-w-sm" placeholder="Filter..." />
        <div class="grid grid-cols-1 md:flex gap-2">
            <Export filename="Audit Logs" />
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

        <template #time-cell="{ row }">
            <span class="whitespace-nowrap">{{ row.original.time }}</span>
        </template>
        <template #empty>
            <div class="flex flex-col items-center justify-center py-12 gap-2">
                <UIcon name="i-lucide-scroll-text" class="size-12 text-dimmed opacity-50" />
                <p class="text-dimmed">No audit logs recorded yet.</p>
            </div>
        </template>
    </UTable>
</template>