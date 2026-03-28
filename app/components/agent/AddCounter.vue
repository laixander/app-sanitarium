<script setup lang="ts">
const isModalOpen = ref(false)
const appToast = useAppToast()

function handleSuccess() {
    appToast.created('Counter')
}
</script>
<template>
    <UButton label="Add Counter" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AgentCounterFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>
