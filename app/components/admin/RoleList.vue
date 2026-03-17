<script setup lang="ts">
import { color } from 'chart.js/helpers';

interface Props {
    icon?: string
    title: string
    userCount?: number | string
    permissions: string[]
}

withDefaults(defineProps<Props>(), {
    icon: 'i-lucide-shield',
    userCount: 0
})

const emit = defineEmits(['edit', 'delete'])

const items = [
    {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        onSelect: () => {
            emit('edit')
        }
    },
    {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error' as const,
        onSelect: () => {
            emit('delete')
        }
    }
]
</script>

<template>
    <div class="flex flex-col gap-2 p-4 sm:p-6">
        <div class="flex justify-between items-center gap-2">
            <div class="flex items-center gap-2">
                <UIcon :name="icon" class="shrink-0 text-primary" />
                <span class="text-sm font-semibold">{{ title }}</span>
                <UiFTag :label="`${userCount} Users`" color="neutral" />
            </div>
            <UDropdownMenu :items="items" :content="{ align: 'end' }">
                <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" size="sm" />
            </UDropdownMenu>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <UiFTag
                v-for="permission in permissions"
                :key="permission"
                :label="permission"
            />
        </div>
    </div>
</template>
