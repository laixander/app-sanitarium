<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Audit Logs" description="View audit logs" variant="naked" orientation="horizontal">
                <UButton label="Export" icon="i-lucide-download" class="w-fit ml-auto" />
            </UPageCard>
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AdminAuditList v-for="audit in audits" :key="audit.id" :audit="audit" />
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Audit Logs'
})

const { audits } = useAudits()
</script>