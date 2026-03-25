<script setup lang="ts">
defineEmits<{
  (e: 'select', isPriority: boolean): void
  (e: 'back'): void
}>()
</script>

<template>
    <KioskPage title="Priority Lane" description="Do you qualify for priority service?" back @back="$emit('back')">
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton icon="i-lucide-heart" title="Yes, Priority" description="Senior Citizen, PWD, or Pregnant" color="rose" layout="vertical" @click="$emit('select', true)" />
            <KioskButton icon="i-lucide-users" title="No, Regular Lane" description="Standard queue" color="slate" layout="vertical" @click="$emit('select', false)" />
        </div>
        <template #footer>
            <UAlert description="Priority lane is available for Senior Citizens (60+), Persons with Disabilities, and Pregnant Women. Please be ready to present valid ID." variant="outline" color="rose" class="text-base py-3 px-6" />
        </template>
    </KioskPage>
</template>