<template>
    <UButton label="Add User" icon="i-lucide-plus" @click="isModalOpen = true" />
    <AdminUserFormModal v-model:open="isModalOpen" />
</template>

<script setup lang="ts">
const isModalOpen = ref(false)
</script>