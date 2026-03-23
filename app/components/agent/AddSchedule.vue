<script setup lang="ts">
const isModalOpen = ref(false)
const toast = useToast()

function handleSuccess() {
    toast.add({
        title: 'Schedule created',
        description: 'New schedule has been successfully created.',
        color: 'success',
        icon: 'i-lucide-check-circle'
    })
}
</script>
<template>
    <UButton label="Add Schedule" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AgentScheduleFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>
