<script setup lang="ts">
const isModalOpen = ref(false)
const appToast = useAppToast()

function handleSuccess() {
    appToast.created('Role')
}
</script>
<template>
    <UButton label="Add Role" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AdminRoleFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>