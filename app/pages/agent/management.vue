<script setup lang="ts">
import FBadge from '~/components/ui/FBadge.vue'
import type { User } from '~/types/user'
import { upperFirst } from 'scule'

definePageMeta({
    title: 'Agent Management',
    fullWidth: true
})

const toast = useToast()
const { users, updateUser, reloadUsers } = useUsers()
const { schedules } = useSchedules()

const globalFilter = ref('')
const table = useTemplateRef('table')

const agents = computed(() => users.value.filter(u => u.role === 'Agent'))

// Assignment modal
const isAssignmentModalOpen = ref(false)
const selectedAgent = ref<User | null>(null)

function onAssignment(agent: User) {
    selectedAgent.value = agent
    isAssignmentModalOpen.value = true
}

// QR Code modal
const isQRCodeModalOpen = ref(false)
const selectedQRCodeAgent = ref<User | null>(null)

function onShowQRCode(agent: User) {
    selectedQRCodeAgent.value = agent
    isQRCodeModalOpen.value = true
}

function formatTime(timeStr?: string) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hours = parts[0] || '0';
    const minutes = parts[1] || '00';
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

function getScheduleDisplay(scheduleName?: string) {
    if (!scheduleName || scheduleName === '-') return '-'
    const schedule = schedules.value.find(s => s.name === scheduleName)
    if (!schedule) return scheduleName
    return `${schedule.name} (${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)})`
}

const columns = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'transaction',
        header: 'Transaction'
    },
    {
        accessorKey: 'counter',
        header: 'Counter'
    },
    {
        accessorKey: 'schedule',
        header: 'Schedule'
    },
    {
        accessorKey: 'dateAssigned',
        header: 'Date Assigned'
    },
    {
        accessorKey: 'dateUpdated',
        header: 'Date Updated'
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

// Assignment action
const getActionItems = (row: User) => {
    const hasAssignment = (row.transaction && row.transaction !== '-') ||
        (row.counter && row.counter !== '-') ||
        (row.schedule && row.schedule !== '-')

    return [
        [
            {
                label: hasAssignment ? 'Reassignment' : 'Assignment',
                icon: 'i-lucide-user-cog',
                onSelect: () => onAssignment(row)
            }
        ],
        [
            {
                label: 'QR Code',
                icon: 'i-lucide-qr-code',
                onSelect: () => onShowQRCode(row)
            }
        ]
    ]
}

function refresh() {
    reloadUsers()
    // toast success
    toast.add({
        title: 'Refreshed',
        description: 'Agents data has been refreshed.',
        color: 'success'
    })
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
    <UTable :columns="columns" :data="agents" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }"
        class="w-full -mt-4 sm:-mt-6" ref="table" v-model:global-filter="globalFilter" @hover="" sticky>
        <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
                <UAvatar :alt="row.original.name" size="sm" class="bg-primary/10 text-primary font-bold"
                    :src="`https://i.pravatar.cc/128?u=${row.original.id}`" />
                <div class="flex flex-col">
                    <span class="font-semibold text-default">{{ row.original.name }}</span>
                    <span class="text-xs">{{ row.original.code || 'NO CODE' }}</span>
                </div>
            </div>
        </template>
        <template #transaction-cell="{ row }">
            <FBadge v-if="row.original.transaction && row.original.transaction !== '-'" type="transaction"
                :value="row.original.transaction" />
            <span v-else>-</span>
        </template>
        <template #counter-cell="{ row }">
            <div v-if="row.original.counter && row.original.counter !== '-'">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-monitor" class="size-5 shrink-0" />
                    <span>{{ row.original.counter }}</span>
                </div>
            </div>
            <span v-else>-</span>
        </template>
        <template #schedule-cell="{ row }">
            <span>{{ getScheduleDisplay(row.original.schedule) }}</span>
        </template>
        <template #dateAssigned-cell="{ row }">
            <span>{{ row.original.dateAssigned || '-' }}</span>
        </template>
        <template #dateUpdated-cell="{ row }">
            <span>{{ row.original.dateUpdated || '-' }}</span>
        </template>
        <template #actions-cell="{ row }">
            <UDropdownMenu :items="getActionItems(row.original)" :content="{ align: 'end' }" :ui="{ content: 'w-auto' }"
                size="sm">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
            </UDropdownMenu>
        </template>
    </UTable>

    <!-- Assignment Modal -->
    <AgentAssignmentFormModal v-model:open="isAssignmentModalOpen" :user="selectedAgent" @success="selectedAgent = null" />

    <!-- QR Code Modal -->
    <AgentQRCodeModal v-model:open="isQRCodeModalOpen" :user="selectedQRCodeAgent" />
</template>