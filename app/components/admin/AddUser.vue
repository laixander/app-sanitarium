<script setup lang="ts">
const isModalOpen = ref(false)
const toast = useToast()

function handleSuccess() {
    toast.add({
        title: 'User created',
        description: 'New user account has been successfully created.',
        color: 'success',
        icon: 'i-lucide-check-circle'
    })
}
</script>
<template>
    <UButton label="Add User" icon="i-lucide-plus" @click="isModalOpen = true" />
    <AdminUserFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>