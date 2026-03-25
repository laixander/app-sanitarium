<script setup lang="ts">
interface Props {
    title: string;
    description: string;
    highlight?: string;
    footer?: string;
    back?: boolean;
}

defineEmits<{
  (e: 'back'): void
}>()

const props = defineProps<Props>();
</script>
<template>
    <div class="min-h-screen bg-gradient-to-b from-primary/5 to-primary/15 relative">
        <KioskBack v-if="props.back" @click="$emit('back')" />
        <div class="flex min-h-screen flex-col">
            <main class="flex flex-1 flex-col items-center justify-center p-6">
                <div class="w-full max-w-4xl space-y-12">
                    <div class="text-center space-y-4">
                        <h2 class="text-5xl font-bold">{{ props.title }}</h2>
                        <p class="text-lg text-muted leading-none">{{ props.description }}</p>
                    </div>
                    <div v-if="$slots.highlight || props.highlight" class="text-center text-muted">
                        <slot name="highlight">
                            {{ props.highlight }}
                        </slot>
                    </div>
                    <slot />
                    <p v-if="$slots.footer || props.footer" class="text-center text-sm text-muted">
                        <slot name="footer">
                            {{ props.footer }}
                        </slot>
                    </p>
                </div>
            </main>
        </div>
    </div>
</template>