<script setup lang="ts">
import FBadge from '~/components/ui/FBadge.vue'
import { statusColors } from '~/constants/queue'
import { upperFirst } from 'scule'

definePageMeta({
    title: 'Ticket History',
    fullWidth: true
})

const appToast = useAppToast()
const { tickets, reloadTickets } = useTickets()
const { transactions } = useTransactions()

const globalFilter = ref('')
const table = useTemplateRef('table')

const getTransactionColor = (name: string) => {
    return transactions.value.find(t => t.name === name)?.color || 'neutral'
}

const columns = [
    { accessorKey: 'ticket', header: 'Ticket' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'transactionType', header: 'Transaction' },
    { accessorKey: 'counter', header: 'Counter' },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'servedAt', header: 'Served At' },
    { accessorKey: 'completedAt', header: 'Completed At' },
    { id: 'duration', header: 'Duration' }
]

const formatTime = (iso?: string) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`
}

const tableData = computed(() => {
    return [...tickets.value].sort((a, b) => {
        const dateA = new Date(b.createdAt || 0).getTime()
        const dateB = new Date(a.createdAt || 0).getTime()
        return dateA - dateB
    })
})

function refresh() {
    reloadTickets()
    appToast.logsRefreshed()
}
</script>

<template>
    <div class="grid grid-cols-1 md:flex justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-default">
        <UInput v-model="globalFilter" class="max-w-full md:max-w-sm" placeholder="Filter agents..." />
        <div class="flex items-center gap-2">
            <UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="subtle" @click="refresh" />
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
    <UTable :data="tableData" :columns="columns" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }"
        class="w-full -mt-4 sm:-mt-6" ref="table" v-model:global-filter="globalFilter" @hover="" sticky>
        <template #ticket-cell="{ row }">
            <span class="font-bold">{{ row.original.ticket }}</span>
        </template>
        <template #status-cell="{ row }">
            <FBadge v-if="row.original.status" type="status" :value="row.original.status" />
        </template>
        <template #transactionType-cell="{ row }">
            <FBadge v-if="row.original.transactionType" type="transaction" :value="row.original.transactionType" />
        </template>
        <template #createdAt-cell="{ row }">
            <span>{{ formatTime(row.original.createdAt) }}</span>
        </template>
        <template #servedAt-cell="{ row }">
            <span>{{ formatTime(row.original.servedAt) }}</span>
        </template>
        <template #completedAt-cell="{ row }">
            <span>{{ formatTime(row.original.completedAt) }}</span>
        </template>
        <template #duration-cell="{ row }">
            <span class="font-mono tabular-nums">{{ formatDuration(row.original.accumulatedServiceDuration)
            }}</span>
        </template>
    </UTable>
</template>
