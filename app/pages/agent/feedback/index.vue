<script setup lang="ts">
definePageMeta({
    title: 'Feedback',
    showUserToolbar: true,
    fullWidth: true
})

const columns = [
    {
        accessorKey: 'agent',
        header: 'Agent'
    },
    {
        accessorKey: 'rating',
        header: 'Rating'
    },
    {
        accessorKey: 'comment',
        header: 'Comment'
    },
    {
        accessorKey: 'ticket',
        header: 'Ticket'
    },
    {
        accessorKey: 'date',
        header: 'Date'
    }
]

const feedback = [
    {
        id: '1',
        agent: 'John Doe',
        code: 'AGT001',
        rating: 5,
        comment: 'Great service!',
        ticket: 'P-123',
        date: 'Mar 20, 2024, 10:30 AM'
    },
    {
        id: '2',
        agent: 'Jane Doe',
        code: 'AGT002',
        rating: 4,
        comment: 'Good service.',
        ticket: 'B-123',
        date: 'Mar 21, 2024, 02:15 PM'
    },
    {
        id: '3',
        agent: 'Bob Smith',
        code: 'AGT003',
        rating: 3,
        comment: 'Average service.',
        ticket: 'C-123',
        date: 'Mar 22, 2024, 09:45 AM'
    },
    {
        id: '4',
        agent: 'Alice Johnson',
        code: 'AGT004',
        rating: 5,
        comment: 'Very professional. Highly recommended!',
        ticket: 'D-456',
        date: 'Mar 23, 2024, 11:20 AM'
    },
    {
        id: '5',
        agent: 'Michael Brown',
        code: 'AGT005',
        rating: 2,
        comment: 'Took too long to respond.',
        ticket: 'E-789',
        date: 'Mar 23, 2024, 03:50 PM'
    },
    {
        id: '6',
        agent: 'Sarah Miller',
        code: 'AGT006',
        rating: 4,
        comment: 'Helpful and polite.',
        ticket: 'F-012',
        date: 'Mar 24, 2024, 08:10 AM'
    },
    {
        id: '7',
        agent: 'David Wilson',
        code: 'AGT007',
        rating: 5,
        comment: 'Excellent assistance with my query.',
        ticket: 'G-345',
        date: 'Mar 24, 2024, 12:30 PM'
    },
    {
        id: '8',
        agent: 'Emily Davis',
        code: 'AGT008',
        rating: 1,
        comment: 'Very dismissive and not helpful at all.',
        ticket: 'H-678',
        date: 'Mar 24, 2024, 01:15 PM'
    },
    {
        id: '9',
        agent: 'James Taylor',
        code: 'AGT009',
        rating: 4,
        comment: 'Quick resolution to my problem.',
        ticket: 'I-901',
        date: 'Mar 24, 2024, 04:45 PM'
    },
    {
        id: '10',
        agent: 'Emma Garcia',
        code: 'AGT010',
        rating: 5,
        comment: 'Friendly and knowledgeable.',
        ticket: 'J-234',
        date: 'Mar 24, 2024, 05:30 PM'
    }
]
</script>

<template>
    <UTable :columns="columns" :data="feedback" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }">
        <template #agent-cell="{ row }">
            <div class="flex items-center gap-3">
                <UAvatar :alt="row.original.agent" size="sm" class="bg-primary/10 text-primary font-bold"
                    :src="`https://i.pravatar.cc/128?u=${row.original.id}`" />
                <div class="flex flex-col">
                    <span class="font-semibold text-default">{{ row.original.agent }}</span>
                    <span class="text-xs text-dimmed">{{ row.original.code }}</span>
                </div>
            </div>
        </template>
        <template #rating-cell="{ row }">
            <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-star-solid" class="size-4 text-yellow-500" v-for="i in row.original.rating" />
            </div>
        </template>
        <template #ticket-cell="{ row }">
            <UBadge :label="row.original.ticket" variant="outline" color="neutral" />
        </template>
        <template #empty>
            <div class="flex flex-col items-center justify-center py-12 gap-2">
                <UIcon name="i-lucide-message-square" class="size-12 text-dimmed opacity-50" />
                <p class="text-dimmed">No feedback data recorded yet.</p>
            </div>
        </template>
    </UTable>
</template>