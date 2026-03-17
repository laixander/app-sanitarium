<script setup lang="ts">
const isModalOpen = ref(false)
</script>

<template>
    <UButton label="Add Role" icon="i-lucide-plus" @click="isModalOpen = true" class="w-fit ml-auto" />
    <AdminRoleFormModal v-model:open="isModalOpen" />
</template>