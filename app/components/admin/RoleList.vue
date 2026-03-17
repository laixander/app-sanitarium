<script setup lang="ts">
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
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <UIcon :name="icon" class="shrink-0 text-primary" />
                    <span class="text-sm font-medium">{{ title }}</span>
                </div>
                <USeparator orientation="vertical" class="h-4" />
                <div class="flex items-center gap-1">
                    <!-- <UIcon :name="Number(userCount) > 0 ? 'i-lucide-users' : 'i-lucide-user'"
                        class="shrink-0 text-primary" /> -->
                    <!-- <UIcon name="i-lucide-user" class="shrink-0 text-primary" /> -->
                    <span class="text-xs font-medium">{{ userCount }} {{ userCount === 1 ? 'User' : 'Users' }}</span>
                </div>
            </div>
            <UDropdownMenu :items="items" :content="{ align: 'end' }">
                <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" size="sm" />
            </UDropdownMenu>
        </div>
        <div class="flex flex-wrap items-center gap-1">
            <!-- <UiFTag v-for="permission in permissions" :key="permission" :label="permission" color="neutral" /> -->
            <UBadge v-for="permission in permissions" :key="permission" :label="permission" variant="outline"
                color="neutral" />
        </div>
    </div>
</template>
