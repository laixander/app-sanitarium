<script setup lang="ts">
const isModalOpen = ref(false)
const toast = useToast()

function handleSuccess() {
    toast.add({
        title: 'Transaction created',
        description: 'New transaction has been successfully created.',
        color: 'success',
        icon: 'i-lucide-check-circle'
    })
}
</script>
<template>
    <UButton label="Add Transaction" icon="i-lucide-plus" @click="isModalOpen = true" class="w-full lg:w-fit lg:ml-auto" />
    <AgentTransactionFormModal v-model:open="isModalOpen" @success="handleSuccess" />
</template>