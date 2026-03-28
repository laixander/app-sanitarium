<script setup lang="ts">
const isModalOpen = ref(false)
const appToast = useAppToast()

function handleSuccess() {
    appToast.created('User', 'New user account has been successfully created.')
}
</script>
<template>
    <UButton label="Add User" icon="i-lucide-plus" @click="isModalOpen = true" />
    <AdminUserFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>