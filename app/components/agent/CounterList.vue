<script setup lang="ts">
import type { AppColor } from '~/types/ui'

interface Props {
    title: string
    description?: string
    color?: AppColor
}

withDefaults(defineProps<Props>(), {
    color: 'primary'
})

const emit = defineEmits(['edit', 'delete'])

const items = [
    [{
        label: 'Edit',
        icon: 'i-lucide-pencil',
        onSelect: () => {
            emit('edit')
        }
    }],
    [{
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error' as const,
        onSelect: () => {
            emit('delete')
        }
    }]
]
</script>

<template>
    <div class="flex flex-col gap-2 p-4 sm:p-6 hover:bg-default/5 transition-colors">
        <div class="flex justify-between items-start gap-2">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <UBadge icon="i-lucide-monitor" :color="color" variant="soft" />
                    <span class="text-sm font-semibold">{{ title }}</span>
                </div>
                <div v-if="description" class="text-sm text-dimmed">{{ description }}</div>
            </div>

            <UDropdownMenu :items="items" :content="{ align: 'end' }" size="sm">
                <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" size="sm" />
            </UDropdownMenu>
        </div>
    </div>
</template>
