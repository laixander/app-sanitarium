<script setup lang="ts">
import type { User } from '~/types/user'

const props = defineProps<{
    user?: User | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { addUser, updateUser } = useUsers()
const { roles: roleList } = useRoles()

const roles = computed(() => roleList.value.map(r => r.title))

const state = reactive({
    name: '',
    email: '',
    role: 'Agent'
})

// Sync state when user prop changes or modal opens
watch([() => props.user, isOpen], ([newUser, open]) => {
    if (open) {
        if (newUser) {
            state.name = newUser.name
            state.email = newUser.email
            state.role = newUser.role
        } else {
            state.name = ''
            state.email = ''
            state.role = 'Agent'
        }
    }
}, { immediate: true })

function onSubmit() {
    if (props.user) {
        updateUser(props.user.id, {
            name: state.name,
            email: state.email,
            role: state.role
        })
    } else {
        addUser({
            name: state.name,
            email: state.email,
            role: state.role
        })
    }

    isOpen.value = false
    emit('success')
}
</script>
<template>
    <UModal v-model:open="isOpen" :title="user ? 'Edit User' : 'Add New User'"
        :description="user ? 'Update user details below.' : 'Fill in the details below to create a new user account.'"
        :dismissible="false">
        <template #body>
            <UForm :state="state" @submit="onSubmit" class="space-y-4">
                <UFormField label="Name" name="name" required>
                    <UInput v-model="state.name" placeholder="Full Name" class="w-full" icon="i-lucide-user" size="lg"
                        required />
                </UFormField>

                <UFormField label="Email" name="email" required>
                    <UInput v-model="state.email" type="email" placeholder="email@ssgh.ph" class="w-full"
                        icon="i-lucide-mail" size="lg" required />
                </UFormField>

                <UFormField label="Role" name="role" required>
                    <USelect v-model="state.role" :items="roles" placeholder="Select a role" class="w-full"
                        icon="i-lucide-shield" size="lg" required />
                </UFormField>

                <div class="flex justify-end gap-3 pt-4">
                    <UButton label="Cancel" color="neutral" variant="ghost" @click="isOpen = false" />
                    <UButton type="submit" :label="user ? 'Update User' : 'Create User'" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
