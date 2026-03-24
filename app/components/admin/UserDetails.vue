<script setup lang="ts">
import type { User } from '~/types/user'
import FBadge from '~/components/ui/FBadge.vue'

const isOpen = defineModel<boolean>('open', { default: false })

const props = defineProps<{
    user: User | null
}>()

const emit = defineEmits<{ success: [void] }>()
</script>

<template>
    <USlideover v-model:open="isOpen" :title="user?.name || 'User Details'" :description="user?.email" :ui="{ header: 'relative' }">
        <template #header>
            <div class="flex items-center gap-4">
                <UAvatar :alt="user?.name" size="xl" :src="`https://i.pravatar.cc/256?u=${user?.id}`" />
                <span class="font-semibold">{{ user?.name }}</span>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isOpen = false" class="absolute top-4 end-4" />
        </template>
        <template #body>
            <div v-if="user" class="flex flex-col gap-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</span>
                        <FBadge type="role" :value="user.role" class="w-fit" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
                        <span class="text-sm font-medium"><ULink :to="`mailto:${user.email}`" class="flex items-center gap-1 text-primary hover:underline hover:text-primary/80"><UIcon name="i-lucide-mail" class="size-4" /> {{ user.email }}</ULink></span>
                    </div>
                </div>

                <USeparator />

                <div class="grid grid-cols-1 gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</span>
                        <span class="text-sm font-medium">{{ user.createdAt }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created By</span>
                        <span class="text-sm font-medium">{{ user.createdBy }}</span>
                    </div>
                </div>

                <USeparator />

                <div class="grid grid-cols-1 gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated At</span>
                        <span class="text-sm font-medium">{{ user.updatedAt }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated By</span>
                        <span class="text-sm font-medium">{{ user.updatedBy }}</span>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-2 w-full">
                <UButton color="neutral" variant="ghost" label="Close" @click="isOpen = false" />
            </div>
        </template>
    </USlideover>
</template>