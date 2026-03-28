<script setup lang="ts">
const isModalOpen = ref(false)
const appToast = useAppToast()

function handleSuccess() {
    appToast.created('Schedule')
}
</script>
<template>
    <UButton label="Add Schedule" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AgentScheduleFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>
