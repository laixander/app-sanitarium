<script setup lang="ts">
definePageMeta({
    title: 'Create New Flow',
    fullWidth: true
})

const { addFlow, activateFlow } = useKioskSettings()
const toast = useToast()
const router = useRouter()

const handlePublish = (data: any) => {
    const newFlow = addFlow({ ...data, name: data.title || 'Untitled Flow' })
    activateFlow(newFlow.id)
    toast.add({ title: 'Flow Published', description: 'New kiosk configuration is now active.', color: 'success' })
    router.push('/admin/kiosk')
}

const handleSaveDraft = (data: any) => {
    addFlow({ ...data, name: data.title || 'Untitled Flow' })
    toast.add({ title: 'Draft Saved', description: 'Kiosk configuration saved as draft.', color: 'neutral' })
    router.push('/admin/kiosk')
}
</script>

<template>
    <AdminKioskFlowForm is-new @publish="handlePublish" @save-draft="handleSaveDraft"
        @cancel="router.push('/admin/kiosk')" />
</template>
