<script setup lang="ts">
import { useKioskLocale } from '~/composables/useKioskLocale'

const { t } = useKioskLocale()

defineEmits<{
    (e: 'select', isPriority: boolean): void
    (e: 'back'): void
}>()
</script>

<template>
    <KioskPage :title="t('priority.title')" :description="t('priority.desc')" back @back="$emit('back')">
        <div class="grid gap-6 md:grid-cols-2">
            <KioskButton icon="i-lucide-heart" :title="t('priority.yes.title')" :description="t('priority.yes.desc')"
                color="rose" layout="vertical" @click="$emit('select', true)" />
            <KioskButton icon="i-lucide-users" :title="t('priority.no.title')" :description="t('priority.no.desc')"
                color="slate" layout="vertical" @click="$emit('select', false)" />
        </div>
        <template #footer>
            <UAlert :description="t('priority.footer')" variant="outline" color="rose" class="text-base py-3 px-6" />
        </template>
    </KioskPage>
</template>