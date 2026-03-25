<script setup lang="ts">
definePageMeta({
    title: 'Feedback',
    showUserToolbar: true,
    fullWidth: true
})

const columns = [
    {
        accessorKey: 'kiosk',
        header: 'Kiosk'
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
        kiosk: 'Main Lobby',
        code: 'KSK-001',
        rating: 5,
        comment: 'Very easy to navigate and intuitive.',
        ticket: 'P-123',
        date: 'Mar 20, 2024, 10:30 AM'
    },
    {
        id: '2',
        kiosk: 'North Wing',
        code: 'KSK-002',
        rating: 4,
        comment: 'The printer was jammed, but the interface is great.',
        ticket: 'B-123',
        date: 'Mar 21, 2024, 02:15 PM'
    },
    {
        id: '3',
        kiosk: 'West Clinic',
        code: 'KSK-003',
        rating: 3,
        comment: 'A bit slow to load my details.',
        ticket: 'C-123',
        date: 'Mar 22, 2024, 09:45 AM'
    },
    {
        id: '4',
        kiosk: 'Pharmacy',
        code: 'KSK-004',
        rating: 5,
        comment: 'Saved me so much time! Seamless check-in.',
        ticket: 'D-456',
        date: 'Mar 23, 2024, 11:20 AM'
    },
    {
        id: '5',
        kiosk: 'Lab Services',
        code: 'KSK-005',
        rating: 4,
        comment: 'Touchscreen is very responsive.',
        ticket: 'E-789',
        date: 'Mar 23, 2024, 03:50 PM'
    },
    {
        id: '6',
        kiosk: 'Main Lobby',
        code: 'KSK-001',
        rating: 5,
        comment: 'Clean and modern interface, very helpful.',
        ticket: 'F-012',
        date: 'Mar 24, 2024, 08:10 AM'
    },
    {
        id: '7',
        kiosk: 'North Wing',
        code: 'KSK-002',
        rating: 4,
        comment: 'Instructions were very clear and easy to follow.',
        ticket: 'G-345',
        date: 'Mar 24, 2024, 12:30 PM'
    },
    {
        id: '8',
        kiosk: 'West Clinic',
        code: 'KSK-003',
        rating: 5,
        comment: 'I like the new design! Much better than before.',
        ticket: 'H-678',
        date: 'Mar 24, 2024, 01:15 PM'
    },
    {
        id: '9',
        kiosk: 'Pharmacy',
        code: 'KSK-004',
        rating: 4,
        comment: 'Process was seamless and quick.',
        ticket: 'I-901',
        date: 'Mar 24, 2024, 04:45 PM'
    },
    {
        id: '10',
        kiosk: 'Lab Services',
        code: 'KSK-005',
        rating: 5,
        comment: 'Excellent addition to the clinic. Very convenient.',
        ticket: 'J-234',
        date: 'Mar 24, 2024, 05:30 PM'
    }
]
</script>

<template>
    <UTable :columns="columns" :data="feedback" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }">
        <template #kiosk-cell="{ row }">
            <div class="flex items-center gap-3">
                <UAvatar :alt="row.original.kiosk" size="sm" class="bg-primary/10 text-primary font-bold"
                    icon="i-lucide-monitor" />
                <div class="flex flex-col">
                    <span class="font-semibold text-default">{{ row.original.kiosk }}</span>
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