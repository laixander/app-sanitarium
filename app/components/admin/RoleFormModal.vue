<script setup lang="ts">
import type { Role } from '~/composables/useRoles'

const props = defineProps<{
    role?: Role | null
}>()

const isOpen = defineModel<boolean>('open', { default: false })

const { addRole, updateRole } = useRoles()

const form = ref({
    title: '',
    permissions: [] as string[]
})

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
        } else {
            form.value.title = ''
            form.value.permissions = []
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
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="role ? 'Edit Role' : 'Add New Role'" :dismissible="false">
        <template #body>
            <UForm :state="form" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Role Title" name="title" required>
                    <UInput v-model="form.title" placeholder="e.g. Manager" class="w-full" required />
                </UFormField>

                <UFormField label="Permissions" name="permissions">
                    <USelectMenu v-model="form.permissions" :items="availablePermissions" multiple
                        placeholder="Select permissions" class="w-full" />
                </UFormField>

                <div class="flex justify-end gap-2 mt-4">
                    <UButton label="Cancel" variant="ghost" color="neutral" @click="isOpen = false" />
                    <UButton type="submit" :label="role ? 'Update Role' : 'Add Role'" color="primary" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
