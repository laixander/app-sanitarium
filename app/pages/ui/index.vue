<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-xl font-bold">Custom UI Components</h2>
            <p class="text-sm text-muted">Custom UI Components</p>
        </div>
        <div class="flex flex-wrap gap-4">

            <UiFIcon icon="i-lucide-heart" color="green" />
            <UiFIcon icon="i-lucide-heart" color="primary" />
            <UiFIcon icon="i-lucide-heart" color="secondary" />
            <UiFIcon icon="i-lucide-heart" color="success" />
            <UiFIcon icon="i-lucide-heart" color="info" />
            <UiFIcon icon="i-lucide-heart" color="warning" />
            <UiFIcon icon="i-lucide-heart" color="error" />
            <UiFIcon icon="i-lucide-heart" color="neutral" />
            <UiFIcon icon="i-lucide-heart" color="purple" />
            <UiFIcon icon="i-lucide-heart" color="pink" />
            <UiFIcon icon="i-lucide-heart" color="orange" />
            <UiFIcon icon="i-lucide-heart" color="amber" />
            <UiFIcon icon="i-lucide-heart" color="yellow" />
            <UiFIcon icon="i-lucide-heart" color="lime" />
            <UiFIcon icon="i-lucide-heart" color="emerald" />
            <UiFIcon icon="i-lucide-heart" color="teal" />
            <UiFIcon icon="i-lucide-heart" color="cyan" />
            <UiFIcon icon="i-lucide-heart" color="sky" />
            <UiFIcon icon="i-lucide-heart" color="blue" />
            <UiFIcon icon="i-lucide-heart" color="indigo" />
            <UiFIcon icon="i-lucide-heart" color="violet" />
            <UiFIcon icon="i-lucide-heart" color="fuchsia" />
            <UiFIcon icon="i-lucide-heart" color="rose" />

        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            <UiFStatCard title="Total Patients" value="100" description="Total number of patients" icon="i-lucide-heart"
                iconColor="primary" trendValue="10" />
            <UiFStatCard title="Total Doctors" value="10" description="Total number of doctors" icon="i-lucide-heart"
                iconColor="secondary" trendValue="-5" />
            <UiFStatCard title="Total Staff" icon="i-lucide-activity">
                <template #customValue>
                    <div class="h-16 w-full mt-2">
                        <ChartBarChart />
                    </div>
                </template>
            </UiFStatCard>
            <UiFStatCard title="Total Staff" icon="i-lucide-activity" iconColor="purple">
                <template #customValue>
                    <div class="h-16 w-full mt-2">
                        <ChartFilledLineChart />
                    </div>
                </template>
            </UiFStatCard>
        </div>
        <div class="flex flex-wrap gap-4">
            <UiFTag label="Badge" color="green" showChip />
            <UiFTag label="Badge" color="green" />
            <UiFTag label="Badge" color="purple" showChip />
            <UiFTag label="Badge" color="purple" />
            <UiFTag label="Badge" color="pink" showChip />
            <UiFTag label="Badge" color="pink" />
            <UiFTag label="Badge" color="orange" showChip />
            <UiFTag label="Badge" color="orange" />
            <UiFTag label="Badge" color="amber" showChip />
            <UiFTag label="Badge" color="amber" />
            <UiFTag label="Badge" color="yellow" showChip />
            <UiFTag label="Badge" color="yellow" />
            <UiFTag label="Badge" color="lime" showChip />
            <UiFTag label="Badge" color="lime" />
            <UiFTag label="Badge" color="emerald" showChip />
            <UiFTag label="Badge" color="emerald" />
            <UiFTag label="Badge" color="teal" showChip />
            <UiFTag label="Badge" color="teal" />
            <UiFTag label="Badge" color="cyan" showChip />
            <UiFTag label="Badge" color="cyan" />
            <UiFTag label="Badge" color="sky" showChip />
            <UiFTag label="Badge" color="sky" />
            <UiFTag label="Badge" color="blue" showChip />
            <UiFTag label="Badge" color="blue" />
            <UiFTag label="Badge" color="indigo" showChip />
            <UiFTag label="Badge" color="indigo" />
            <UiFTag label="Badge" color="violet" showChip />
            <UiFTag label="Badge" color="violet" />
            <UiFTag label="Badge" color="fuchsia" showChip />
            <UiFTag label="Badge" color="fuchsia" />
            <UiFTag label="Badge" color="rose" showChip />
            <UiFTag label="Badge" color="rose" />
        </div>

        <UiFCard title="Card Title with Right Content"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." icon="i-lucide-heart"
            color="primary">
            <template #actions>
                <UiFTag label="Badge" color="green" showChip />
            </template>
            <UTable :data="data" :columns="columns" class="table-fixed w-full">
                <template #status-cell="{ row }">
                    <UiFTag :label="row.original.status" :color="getStatusColor(row.original.status)" showChip />
                </template>
                <template #actions-cell="{ row }">
                    <UDropdownMenu :items="getActionItems(row.original)" :content="{ align: 'end' }"
                        :ui="{ content: 'w-48' }">
                        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                    </UDropdownMenu>
                </template>
            </UTable>
        </UiFCard>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    title: 'UI Playground'
})

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
        meta: { class: { th: 'w-1/5', td: 'w-1/5' } }
    },
    {
        accessorKey: 'age',
        header: 'Age',
        meta: { class: { th: 'w-1/5', td: 'w-1/5' } }
    },
    {
        accessorKey: 'gender',
        header: 'Gender',
        meta: { class: { th: 'w-1/5', td: 'w-1/5' } }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        meta: { class: { th: 'w-1/5', td: 'w-1/5' } }
    },
    {
        id: 'actions',
        header: 'Actions',
        meta: {
            class: {
                th: 'text-right w-1/5',
                td: 'text-right w-1/5'
            }
        }
    }
]

const data = [
    {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        status: 'Active'
    },
    {
        name: 'Jane Doe',
        age: 25,
        gender: 'Female',
        status: 'Inactive'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'error'
        case 'Pending': return 'warning'
        default: return 'neutral'
    }
}

const getActionItems = (row: any) => [
    [
        {
            label: 'View details',
            icon: 'i-lucide-eye',
            onSelect: () => console.log('View', row)
        },
        {
            label: 'Edit',
            icon: 'i-lucide-pencil',
            onSelect: () => console.log('Edit', row)
        }
    ],
    [
        {
            label: 'Delete',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => console.log('Delete', row)
        }
    ]
]
</script>