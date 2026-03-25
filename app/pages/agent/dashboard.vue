<script setup lang="ts">
import type { User } from '~/types/user'
import type { Ticket } from '~/types/queue'
import FBadge from '~/components/ui/FBadge.vue'
import { upperFirst } from 'scule'

definePageMeta({
    title: 'Dashboard'
})

const globalFilter = ref('')
const statusFilter = ref('All')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const toast = useToast()
const { users, assignCounter, setOnBreak, forceLogout, reloadUsers } = useUsers()
const { tickets, reloadTickets } = useTickets()
const queueData = tickets

const agents = computed(() => users.value.filter(u => u.role === 'Agent' && u.counter && u.counter !== '-'))

const stats = computed(() => [
    { title: 'Online Agents', value: String(agents.value.filter(a => a.agentStatus === 'Online').length), icon: 'i-lucide-users', iconColor: 'primary' },
    { title: 'Currently Serving', value: String(agents.value.filter(a => a.agentStatus === 'Serving').length), icon: 'i-lucide-check-circle', iconColor: 'blue' },
    { title: 'On Break', value: String(agents.value.filter(a => a.agentStatus === 'On Break').length), icon: 'i-lucide-coffee', iconColor: 'amber' },
    { title: 'Offline', value: String(agents.value.filter(a => a.agentStatus === 'Offline').length), icon: 'i-lucide-unplug', iconColor: 'error' }
] as const)

const filteredAgents = computed(() => {
    if (statusFilter.value === 'All') return agents.value
    if (statusFilter.value === 'Active') return agents.value.filter(a => a.agentStatus === 'Online' || a.agentStatus === 'Serving')
    return agents.value.filter(a => a.agentStatus === statusFilter.value)
})

const columns = [
    { accessorKey: 'name', header: 'Agent' },
    { accessorKey: 'agentStatus', header: 'Status' },
    { accessorKey: 'counter', header: 'Counter' },
    { accessorKey: 'ticket', header: 'Current Ticket' },
    { accessorKey: 'served', header: 'Served Today' },
    { accessorKey: 'avgService', header: 'Avg. Service' },
    { accessorKey: 'updatedAt', header: 'Last Update' },
    {
        id: 'actions',
        meta: {
            class: {
                td: 'text-right'
            }
        }
    }
]

// Assign Counter modal
const isAssignModalOpen = ref(false)
const selectedAgent = ref<User | null>(null)
const selectedCounter = ref('')

const availableCounters = [
    'Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5',
    'Counter 6', 'Counter 7', 'Counter 8'
]

function onAssignCounter(agent: User) {
    selectedAgent.value = agent
    selectedCounter.value = agent.counter && agent.counter !== '-' ? agent.counter : ''
    isAssignModalOpen.value = true
}

function onAssignSubmit() {
    if (selectedAgent.value && selectedCounter.value) {
        assignCounter(selectedAgent.value.id, selectedCounter.value)
        toast.add({
            title: 'Counter Assigned',
            description: `${selectedAgent.value.name} has been assigned to ${selectedCounter.value}.`,
            color: 'success'
        })
    }
    isAssignModalOpen.value = false
}

// Confirm modal (for Set On Break & Force Logout)
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

// Dropdown action items
const getActionItems = (row: User) =>
    [
        [{
            label: 'Reassign Counter',
            icon: 'i-lucide-monitor',
            onSelect: () => onAssignCounter(row)
        }],
        [{
            label: 'Set On Break',
            icon: 'i-lucide-coffee',
            color: 'warning' as const,
            onSelect: () => {
                openConfirmModal({
                    title: 'Set On Break',
                    description: `Are you sure you want to set ${row.name} on break?`,
                    confirmLabel: 'Set On Break',
                    confirmColor: 'warning',
                    onConfirm: () => {
                        setOnBreak(row.id)
                        toast.add({
                            title: 'Agent On Break',
                            description: `${row.name} has been set on break.`,
                            color: 'warning'
                        })
                    }
                })
            }
        }],
        [{
            label: 'Force Logout',
            icon: 'i-lucide-user-x',
            color: 'error' as const,
            onSelect: () => {
                openConfirmModal({
                    title: 'Force Logout',
                    description: `Are you sure you want to force logout ${row.name}? This will end their active session immediately.`,
                    confirmLabel: 'Force Logout',
                    confirmColor: 'error',
                    onConfirm: () => {
                        forceLogout(row.id)
                        toast.add({
                            title: 'Agent Logged Out',
                            description: `${row.name} has been forcefully logged out.`,
                            color: 'error'
                        })
                    }
                })
            }
        }]
    ]

function refresh() {
    reloadUsers()
    reloadTickets()
    
    toast.add({
        title: 'Refreshed',
        description: 'Dashboard data has been synchronized.',
        color: 'success'
    })
}

</script>
<template>
    <div class="flex flex-col gap-4 sm:gap-6">

        <div class="grid grid-cols-1">
            <UiFCard title="Queue Overview" description="Monitor and manage queue" as-table>
                <template #actions>
                    <UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="subtle"
                        @click="refresh" />
                </template>
                <AgentQueueKanban :tickets="queueData || []" />
            </UiFCard>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <UiFStatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value"
                :icon="stat.icon" :icon-color="stat.iconColor" counter />
        </div>

        <UiFCard title="Counter Overview" description="Monitor and manage agent availability and counter assignments"
            as-table>
            <template #actions>
                <div class="flex items-center gap-2">
                    <UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="subtle"
                        @click="refresh" />
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
                        <UButton label="Display" color="neutral" variant="outline"
                            trailing-icon="i-lucide-settings-2" />
                    </UDropdownMenu>
                </div>
            </template>
            <UTable :data="filteredAgents" :columns="columns" ref="table" v-model:global-filter="globalFilter"
                v-model:column-visibility="columnVisibility" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }" @hover="">
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
                <template #agentStatus-cell="{ row }">
                    <FBadge type="status" :value="row.original.agentStatus || 'Offline'" />
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
                <template #ticket-cell="{ row }">
                    <div v-if="row.original.ticket && row.original.ticket !== '-'" class="flex items-center gap-2">
                        <UBadge :label="row.original.ticket" variant="outline" color="neutral" />
                    </div>
                    <span v-else>-</span>
                </template>
                <template #served-cell="{ row }">
                    <span>{{ row.original.served || 0 }}</span>
                </template>
                <template #avgService-cell="{ row }">
                    <span>{{ row.original.avgService || '0:00' }}</span>
                </template>
                <template #updatedAt-cell="{ row }">
                    <span>{{ row.original.updatedAt || '-' }}</span>
                </template>
                <template #actions-cell="{ row }">
                    <UDropdownMenu :items="getActionItems(row.original)" :content="{ align: 'end' }"
                        :ui="{ content: 'w-auto' }" size="sm">
                        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
                    </UDropdownMenu>
                </template>
            </UTable>
        </UiFCard>
    </div>

    <!-- Assign Counter Modal -->
    <UModal v-model:open="isAssignModalOpen" title="Assign Counter"
        :description="selectedAgent ? `Assign a counter to ${selectedAgent.name}` : ''" :dismissible="false">
        <template #body>
            <UForm :state="{ counter: selectedCounter }" class="flex flex-col gap-4" @submit="onAssignSubmit">
                <UFormField label="Counter" name="counter" required>
                    <USelect v-model="selectedCounter" :items="availableCounters" placeholder="Select a counter"
                        class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isAssignModalOpen = false" />
                    <UButton type="submit" label="Assign" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>

    <!-- Confirm Modal (Set On Break / Force Logout) -->
    <ConfirmationModal v-model:open="isConfirmModalOpen" :title="confirmModalConfig.title"
        :description="confirmModalConfig.description" :confirm-label="confirmModalConfig.confirmLabel"
        :confirm-color="confirmModalConfig.confirmColor" @confirm="confirmModalConfig.onConfirm" />
</template>