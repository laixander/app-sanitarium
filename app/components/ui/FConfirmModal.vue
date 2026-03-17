<template>
  <UModal v-model:open="isOpen" :title="title" :description="description">
    <template #body>
      <div class="flex justify-end gap-3 pt-4">
        <UButton :label="cancelLabel" color="neutral" variant="ghost" @click="onCancel" />
        <UButton :label="confirmLabel" :color="confirmColor" @click="onConfirm" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: any
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'primary'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isOpen = defineModel<boolean>('open', { default: false })

function onConfirm() {
  isOpen.value = false
  emit('confirm')
}

function onCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>
