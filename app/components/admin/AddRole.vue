<script setup lang="ts">
const isModalOpen = ref(false)
const toast = useToast()

function handleSuccess() {
    toast.add({
        title: 'Role created',
        description: 'New role has been successfully created.',
        color: 'success',
        icon: 'i-lucide-check-circle'
    })
}
</script>
<template>
    <UButton label="Add Role" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AdminRoleFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>