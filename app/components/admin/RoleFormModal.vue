<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import type { Role } from '~/types/role'

const props = defineProps<{
    role?: Role | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { addRole, updateRole } = useRoles()

const form = ref({
    title: '',
    permissions: [] as string[],
    color: 'neutral' as any
})

import { appColors } from '~/constants/colors'

const availableColors = appColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
    chip: { color: color as any } // Cast to `any` because `ChipProps['color']` in @nuxt/ui might not perfectly align with AppColor locally or is complex
}))

const availablePermissions = [
    'Full System Access',
    'User Management',
    'Configuration',
    'Audit Logs',
    'Reports',
    'Queue Management',
    'Agent Management',
    'Feedback',
    'Queue Operations',
    'Customer Service',
    'View Own Stats',
    'Ticket Generation',
    'Queue Display'
]

// Sync state when role prop changes or modal opens
watch([() => props.role, isOpen], ([newRole, open]) => {
    if (open) {
        if (newRole) {
            form.value.title = newRole.title
            form.value.permissions = [...newRole.permissions]
            form.value.color = newRole.color || 'neutral'
        } else {
            form.value.title = ''
            form.value.permissions = []
            form.value.color = 'neutral'
        }
    }
}, { immediate: true })

function onSubmit() {
    if (props.role) {
        updateRole(props.role.title, { ...form.value })
    } else {
        addRole({ ...form.value })
    }
    isOpen.value = false
    emit('success')
}
</script>
<template>
    <UModal v-model:open="isOpen" :title="role ? 'Edit Role' : 'Add New Role'"
        :description="role ? 'Update role details below.' : 'Fill in the details below to create a new role.'"
        :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Role Title" name="title" required>
                    <UInput v-model="form.title" placeholder="e.g. Manager" class="w-full" required />
                </UFormField>

                <UFormField label="Permissions" name="permissions">
                    <USelectMenu v-model="form.permissions" :items="availablePermissions" multiple
                        placeholder="Select permissions" class="w-full" />
                </UFormField>

                <UFormField label="Role Color" name="color">
                    <USelectMenu v-model="form.color" :items="availableColors" value-key="value"
                        placeholder="Select color" class="w-full">
                        <template #leading="{ modelValue, ui }">
                            <UChip v-if="modelValue"
                                :color="((typeof modelValue === 'string' ? availableColors.find(c => c.value === modelValue)?.chip.color : (modelValue as any).chip?.color) as ChipProps['color'])"
                                inset standalone :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                                :class="ui.itemLeadingChip()" />
                        </template>
                    </USelectMenu>
                </UFormField>

                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isOpen = false" />
                    <UButton type="submit" :label="role ? 'Update Role' : 'Add Role'" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
