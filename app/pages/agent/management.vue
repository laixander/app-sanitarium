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

const globalFilter = ref('')
const table = useTemplateRef('table')

const agents = computed(() => users.value.filter(u => u.role === 'Agent' && u.status === 'Active'))

// Assignment modal
const isAssignmentModalOpen = ref(false)
const selectedAgent = ref<User | null>(null)
const selectedCounter = ref('')
const selectedDepartment = ref('')
const selectedSchedule = ref('')

const availableCounters = [
    'Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5',
    'Counter 6', 'Counter 7', 'Counter 8'
]

const availableDepartments = [
    'Consultation', 'Admission', 'Billing', 'Outpatient'
]

const availableSchedules = [
    'Morning (7:00 AM - 3:00 PM)',
    'Afternoon (3:00 PM - 11:00 PM)',
    'Night (11:00 PM - 7:00 AM)'
]

function onAssignment(agent: User) {
    selectedAgent.value = agent
    selectedCounter.value = agent.counter && agent.counter !== '-' ? agent.counter : ''
    selectedDepartment.value = agent.department || ''
    selectedSchedule.value = agent.schedule || ''
    isAssignmentModalOpen.value = true
}

function onAssignmentSubmit() {
    if (selectedAgent.value) {
        updateUser(selectedAgent.value.id, {
            counter: selectedCounter.value || '-',
            department: selectedDepartment.value,
            schedule: selectedSchedule.value
        })
        toast.add({
            title: 'Assignment Updated',
            description: `${selectedAgent.value.name} assignment has been updated.`,
            color: 'success'
        })
    }
    isAssignmentModalOpen.value = false
}

const columns = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'department',
        header: 'Department'
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
const getActionItems = (row: User) => [
    [
        {
            label: 'Assignment',
            icon: 'i-lucide-user-cog',
            onSelect: () => onAssignment(row)
        }
    ]
]

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
        <template #department-cell="{ row }">
            <FBadge v-if="row.original.department && row.original.department !== '-'" type="department"
                :value="row.original.department" />
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
            <span>{{ row.original.schedule || '-' }}</span>
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
    <UModal v-model:open="isAssignmentModalOpen" title="Agent Assignment"
        :description="selectedAgent ? `Update assignment for ${selectedAgent.name}` : ''" :dismissible="false">
        <template #body>
            <UForm :state="{ counter: selectedCounter, department: selectedDepartment }" class="flex flex-col gap-4"
                @submit="onAssignmentSubmit">
                <UFormField label="Department" name="department" required>
                    <USelect v-model="selectedDepartment" :items="availableDepartments"
                        placeholder="Select a department" class="w-full" />
                </UFormField>
                <UFormField label="Counter" name="counter">
                    <USelect v-model="selectedCounter" :items="availableCounters" placeholder="Select a counter"
                        class="w-full" />
                </UFormField>
                <UFormField label="Schedule" name="schedule">
                    <USelect v-model="selectedSchedule" :items="availableSchedules" placeholder="Select a schedule"
                        class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isAssignmentModalOpen = false" />
                    <UButton type="submit" label="Save Changes" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>