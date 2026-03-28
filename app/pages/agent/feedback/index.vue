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
        accessorKey: 'date',
        header: 'Date'
    }
]

const { feedbackList } = useFeedback()
const { users } = useUsers()

const filteredFeedback = computed(() => {
    return feedbackList.value
        .filter(f => f.agentId !== 0)
        .map(f => {
            const agent = users.value.find(u => u.id === f.agentId || u.code === f.agentCode)
            return {
                ...f,
                agent: agent?.name || 'Unknown Agent',
                code: f.agentCode,
                date: f.createdAt
            }
        })
})
</script>

<template>
    <UTable :columns="columns" :data="filteredFeedback" :ui="{ th: 'px-4 sm:px-6', td: 'px-4 sm:px-6' }">
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
        <template #empty>
            <div class="flex flex-col items-center justify-center py-12 gap-2">
                <UIcon name="i-lucide-message-square" class="size-12 text-dimmed opacity-50" />
                <p class="text-dimmed">No feedback data recorded yet.</p>
            </div>
        </template>
    </UTable>
</template>