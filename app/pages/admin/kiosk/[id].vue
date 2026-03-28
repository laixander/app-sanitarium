<script setup lang="ts">
import type { KioskFlow } from '~/composables/useKioskSettings'

definePageMeta({
    title: 'Edit Flow',
    fullWidth: true
})

const route = useRoute()
const router = useRouter()
const { getFlow, updateFlow, activateFlow } = useKioskSettings()
const toast = useToast()

const flowId = route.params.id as string
const flow = ref<KioskFlow | undefined>(getFlow(flowId))

// If flow not found, redirect to list
onMounted(() => {
    if (!flow.value) {
        toast.add({ title: 'Error', description: 'Flow not found.', color: 'error' })
        router.push('/admin/kiosk')
    }
})

const handlePublish = (data: any) => {
    updateFlow(flowId, { ...data, status: 'Active' })
    activateFlow(flowId)
    toast.add({ title: 'Flow Published', description: 'Kiosk configuration is now active.', color: 'success' })
    router.push('/admin/kiosk')
}

const handleSaveDraft = (data: any) => {
    updateFlow(flowId, data)
    toast.add({ title: 'Changes Saved', description: 'Kiosk configuration updated successfully.', color: 'neutral' })
    router.push('/admin/kiosk')
}
</script>

<template>
    <template v-if="flow">
        <AdminKioskFlowForm :initial-data="flow" @publish="handlePublish" @save-draft="handleSaveDraft"
            @cancel="router.push('/admin/kiosk')" />
    </template>
</template>
