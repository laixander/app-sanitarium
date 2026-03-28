<script setup lang="ts">
const isModalOpen = ref(false)
const appToast = useAppToast()

function handleSuccess() {
    appToast.created('Transaction')
}
</script>
<template>
    <UButton label="Add Transaction" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AgentTransactionFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>