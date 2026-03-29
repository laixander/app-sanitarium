<script setup lang="ts">
import type { User } from '~/types/user'
import type { Ticket } from '~/types/queue'
import FBadge from '~/components/ui/FBadge.vue'
import { upperFirst } from 'scule'

definePageMeta({
    title: 'Dashboard',
    fullWidth: true
})

const globalFilter = ref('')
const statusFilter = ref('All')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const appToast = useAppToast()
const { users, assignCounter, setOnBreak, forceLogout, reloadUsers } = useUsers()
const { tickets, reloadTickets, getAverageServiceTime, getActiveTicket, getServedToday } = useTickets()
const { transactions } = useTransactions()
const queueData = tickets

const agents = computed(() => users.value.filter(u => u.role === 'Agent' && u.counter && u.counter !== '-'))

const getAgentDisplayStatus = (agent: User) => {
    if (agent.agentStatus === 'Offline' || agent.agentStatus === 'On Break') {
        return agent.agentStatus
    }
    return getActiveTicket(agent.counter) ? 'Serving' : 'Online'
}

const getTransactionColor = (name: string) => {
    return transactions.value.find(t => t.name === name)?.color || 'neutral'
}

const stats = computed(() => {
    const activeAgents = agents.value.filter(a => {
        const s = getAgentDisplayStatus(a)
        return s === 'Online' || s === 'Serving'
    }).length
    const servingCount = tickets.value.filter(t => t.status === 'serving').length
    const onBreakCount = agents.value.filter(a => getAgentDisplayStatus(a) === 'On Break').length
    const offlineCount = agents.value.filter(a => getAgentDisplayStatus(a) === 'Offline').length

    return [
        { title: 'Online Agents', value: String(activeAgents), icon: 'i-lucide-users', iconColor: 'green' },
        { title: 'Currently Serving', value: String(servingCount), icon: 'i-lucide-check-circle', iconColor: 'blue' },
        { title: 'On Break', value: String(onBreakCount), icon: 'i-lucide-coffee', iconColor: 'amber' },
        { title: 'Offline', value: String(offlineCount), icon: 'i-lucide-unplug', iconColor: 'neutral' }
    ] as const
})

const agentUtilization = computed(() => {
    const active = agents.value.filter(a => {
        const s = getAgentDisplayStatus(a)
        return s === 'Online' || s === 'Serving'
    }).length
    const serving = tickets.value.filter(t => t.status === 'serving').length
    return {
        serving,
        active,
        ratio: `${serving} / ${active}`,
        description: `${serving} of ${active} active agents are busy`
    }
})

const ticketStatusData = computed(() => {
    const statuses = ['waiting', 'serving', 'completed', 'missed']
    const data = statuses.map(s => tickets.value.filter(t => t.status === s).length)
    return {
        labels: ['Waiting', 'Serving', 'Completed', 'Missed'],
        data
    }
})

const ticketsOverTime = computed(() => {
    const currentHour = new Date().getHours()
    const shiftLabels = Array.from({ length: 6 }, (_, i) => {
        const h = (currentHour - 5 + i + 24) % 24
        return `${String(h).padStart(2, '0')}:00`
    })

    const hourly = tickets.value.reduce((acc, t) => {
        if (!t.createdAt) return acc
        const d = new Date(t.createdAt)
        const hour = d.getHours()
        const label = `${String(hour).padStart(2, '0')}:00`
        acc[label] = (acc[label] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return { labels: shiftLabels, data: shiftLabels.map(k => hourly[k] || 0) }
})

const agentStatusData = computed(() => {
    const active = agents.value.filter(a => {
        const s = getAgentDisplayStatus(a)
        return s === 'Online' || s === 'Serving'
    }).length
    const serving = tickets.value.filter(t => t.status === 'serving').length
    const onBreak = agents.value.filter(a => getAgentDisplayStatus(a) === 'On Break').length
    const offlineCount = agents.value.filter(a => getAgentDisplayStatus(a) === 'Offline').length

    return {
        labels: ['Total Online', 'Currently Serving', 'On Break', 'Offline'],
        data: [active, serving, onBreak, offlineCount]
    }
})

const completedOverTime = computed(() => {
    const currentHour = new Date().getHours()
    const shiftLabels = Array.from({ length: 6 }, (_, i) => {
        const h = (currentHour - 5 + i + 24) % 24
        return `${String(h).padStart(2, '0')}:00`
    })

    const completedHourly = tickets.value.filter(t => t.status === 'completed').reduce((acc, t) => {
        if (!t.servedAt && !t.createdAt) return acc
        const d = new Date(t.servedAt || t.createdAt!)
        const hour = d.getHours()
        const label = `${String(hour).padStart(2, '0')}:00`
        acc[label] = (acc[label] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const missedHourly = tickets.value.filter(t => t.status === 'missed').reduce((acc, t) => {
        if (!t.servedAt && !t.createdAt) return acc
        const d = new Date(t.servedAt || t.createdAt!)
        const hour = d.getHours()
        const label = `${String(hour).padStart(2, '0')}:00`
        acc[label] = (acc[label] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return {
        labels: shiftLabels,
        datasets: [
            {
                label: 'Completed',
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue/20
                borderColor: '#3b82f6', // blue
                data: shiftLabels.map(k => completedHourly[k] || 0),
                tension: 0.4,
                fill: true
            },
            {
                label: 'Missed',
                backgroundColor: 'rgba(239, 68, 68, 0.2)', // red/20
                borderColor: '#ef4444', // red
                data: shiftLabels.map(k => missedHourly[k] || 0),
                tension: 0.4,
                fill: true
            }
        ]
    }
})

const filteredAgents = computed(() => {
    if (statusFilter.value === 'All') return agents.value
    if (statusFilter.value === 'Active') return agents.value.filter(a => {
        const s = getAgentDisplayStatus(a)
        return s === 'Online' || s === 'Serving'
    })
    return agents.value.filter(a => getAgentDisplayStatus(a) === statusFilter.value)
})

const columns = [
    { accessorKey: 'name', header: 'Agent' },
    { accessorKey: 'agentStatus', header: 'Status' },
    { accessorKey: 'counter', header: 'Counter' },
    { accessorKey: 'transaction', header: 'Transaction' },
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
        appToast.counterAssigned(selectedAgent.value.name, selectedCounter.value)
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
                        appToast.agentOnBreak(row.name)
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
                        appToast.agentLoggedOut(row.name)
                    }
                })
            }
        }]
    ]

function refresh() {
    reloadUsers()
    reloadTickets()

    appToast.refreshed('Dashboard')
}

const sections = [
    { label: 'Chart', value: 'chart' },
    { label: 'Queue Overview', value: 'queue-overview' },
    { label: 'Stats', value: 'stats' },
    { label: 'Agent Status', value: 'agent-status' }
]

const selectedSections = ref(sections.map(s => s.value))

const kioskPanelStatus = ref('Offline')
const queuePanelStatus = ref('Offline')

// fetch kiosk panel status and queue panel status
const fetchPanelStatus = async () => {
    try {
        const kioskPanel = await $fetch('/api/kiosk-panel')
        const queuePanel = await $fetch('/api/queue-panel')
        kioskPanelStatus.value = kioskPanel.status
        queuePanelStatus.value = queuePanel.status
    } catch (e) {
        kioskPanelStatus.value = 'Offline'
        queuePanelStatus.value = 'Offline'
    }
}

fetchPanelStatus()
</script>
<template>
    <div class="px-4 sm:px-6 py-3.5 border-b border-default">
        <!-- create multi-select menu that can toggle sections -->
        <div class="flex justify-between gap-2">
            <USelect v-model="selectedSections" :items="sections" value-key="value" label-key="label"
                placeholder="Select Sections" multiple trailing-icon="i-lucide-monitor" class="w-64" />
            <div class="flex items-center gap-2">
                <UiFTag :label="`Kiosk: ${kioskPanelStatus}`"
                    :color="kioskPanelStatus === 'Online' ? 'green' : 'neutral'" show-chip
                    :ping="kioskPanelStatus === 'Online'" />
                <UiFTag :label="`Queue: ${queuePanelStatus}`"
                    :color="queuePanelStatus === 'Online' ? 'green' : 'neutral'" show-chip
                    :ping="queuePanelStatus === 'Online'" />
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-4 sm:gap-6 w-full -mt-4 sm:-mt-6 p-6 overflow-y-auto">

        <!-- section: chart -->
        <div v-if="selectedSections.includes('chart')"
            class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 shrink-0">
            <UiFStatCard title="Tickets by Status" icon="i-lucide-activity" iconColor="amber">
                <template #customValue>
                    <!-- <div class="text-3xl font-bold flex items-center gap-2">
                        {{ tickets.length }}
                        <span class="text-sm font-normal text-muted-foreground">Total</span>
                    </div> -->
                    <div class="w-full mt-2" :class="tickets.length === 0 ? 'h-full pb-6' : 'h-20'">
                        <ChartBarChart v-if="tickets.length > 0" :data="ticketStatusData.data"
                            :labels="ticketStatusData.labels" :color="['#f59e0b', '#3b82f6', '#10b981', '#ef4444']"
                            label="Tickets" />
                        <UEmpty v-else description="No Data" variant="naked"
                            :ui="{ root: 'h-full p-0 sm:p-0 lg:p-0' }" />
                    </div>
                </template>
            </UiFStatCard>
            <UiFStatCard title="Ticket Volume" icon="i-lucide-trending-up" iconColor="purple">
                <template #customValue>
                    <!-- <div class="text-3xl font-bold flex items-center gap-2">
                        {{ tickets.length }}
                        <span class="text-sm font-normal text-muted-foreground">Queue</span>
                    </div> -->
                    <div class="w-full mt-2" :class="tickets.length === 0 ? 'h-full pb-6' : 'h-20'">
                        <ChartFilledLineChart v-if="tickets.length > 0" :data="ticketsOverTime.data"
                            :labels="ticketsOverTime.labels" color="#a855f7" backgroundColor="rgba(168, 85, 247, 0.2)"
                            label="Tickets Generated" />
                        <UEmpty v-else description="No Data" variant="naked"
                            :ui="{ root: 'h-full p-0 sm:p-0 lg:p-0' }" />
                    </div>
                </template>
            </UiFStatCard>
            <UiFStatCard title="Agent Status" icon="i-lucide-users" iconColor="teal" :value="agentUtilization.ratio"
                :description="agentUtilization.description">
                <template #customValue>
                    <!-- <div class="text-3xl font-bold flex items-center gap-2">
                        {{ users.filter(u => u.role === 'Agent' && (u.agentStatus === 'Online' || u.agentStatus === 'Serving')).length }}
                        <span class="text-sm font-normal text-muted-foreground flex items-center">
                            <UIcon name="i-lucide-circle-dot" class="mr-1 text-green-500 size-3" /> Active
                        </span>
                    </div> -->
                    <div class="w-full mt-2" :class="agents.length === 0 ? 'h-full pb-6' : 'h-20'">
                        <ChartBarChart v-if="agents.length > 0" :data="agentStatusData.data"
                            :labels="agentStatusData.labels" :color="['#10b981', '#3b82f6', '#f59e0b', '#64748b']"
                            label="Count" />
                        <UEmpty v-else description="No Data" variant="naked"
                            :ui="{ root: 'h-full p-0 sm:p-0 lg:p-0' }" />
                    </div>
                </template>
            </UiFStatCard>
            <UiFStatCard title="Completed & Missed Output" icon="i-lucide-check-circle" iconColor="blue">
                <template #customValue>
                    <!-- <div class="text-3xl font-bold flex items-center gap-2">
                        {{tickets.filter(t => t.status === 'completed').length}}
                        <span class="text-sm font-normal text-muted-foreground flex items-center">
                            <UIcon name="i-lucide-check" class="mr-1 text-purple-500 size-3" /> Done
                        </span>
                    </div> -->
                    <div class="w-full mt-2"
                        :class="tickets.filter(t => t.status === 'completed' || t.status === 'missed').length === 0 ? 'h-full pb-6' : 'h-20'">
                        <ChartFilledLineChart
                            v-if="tickets.filter(t => t.status === 'completed' || t.status === 'missed').length > 0"
                            :datasets="completedOverTime.datasets" :labels="completedOverTime.labels" />
                        <UEmpty v-else description="No Data" variant="naked"
                            :ui="{ root: 'h-full p-0 sm:p-0 lg:p-0' }" />
                    </div>
                </template>
            </UiFStatCard>
        </div>

        <!-- section: queue overview -->
        <div v-if="selectedSections.includes('queue-overview')" class="grid grid-cols-1 shrink-0">
            <UiFCard title="Queue Overview" description="Monitor and manage queue" as-table>
                <template #actions>
                    <UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="subtle"
                        @click="refresh" />
                </template>
                <AgentQueueKanban :tickets="queueData || []" />
            </UiFCard>
        </div>

        <!-- section: stats -->
        <div v-if="selectedSections.includes('stats')"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shrink-0">
            <UiFStatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value"
                :icon="stat.icon" :icon-color="stat.iconColor" counter />
        </div>

        <!-- section: agent status -->
        <UiFCard v-if="selectedSections.includes('agent-status')" title="Counter Overview" class="shrink-0"
            description="Monitor and manage agent availability and counter assignments" as-table>
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
                    <FBadge type="status" :value="getAgentDisplayStatus(row.original)" />
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
                <template #transaction-cell="{ row }">
                    <UBadge v-if="row.original.transaction" :label="row.original.transaction" variant="soft"
                        :color="getTransactionColor(row.original.transaction)" />
                    <span v-else>-</span>
                </template>
                <template #ticket-cell="{ row }">
                    <div v-if="getActiveTicket(row.original.counter)" class="flex items-center gap-2">
                        <UBadge :label="getActiveTicket(row.original.counter)?.ticket" variant="outline"
                            color="neutral" />
                    </div>
                    <span v-else>-</span>
                </template>
                <template #served-cell="{ row }">
                    <span>{{ getServedToday(row.original.counter) }}</span>
                </template>
                <template #avgService-cell="{ row }">
                    <span>{{ getAverageServiceTime(row.original.counter) }}</span>
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
                <template #empty>
                    <div class="flex flex-col items-center justify-center py-12 gap-2">
                        <UIcon name="i-lucide-user" class="size-12 text-dimmed opacity-50" />
                        <p class="text-dimmed">No agents found.</p>
                    </div>
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