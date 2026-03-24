<script setup lang="ts">
import type { FeedbackSettings } from '~/composables/useFeedbackSettings'
import type { User } from '~/types/user'

const props = withDefaults(defineProps<{
    settings: FeedbackSettings
    agent?: User
    isPreview?: boolean
}>(), {
    isPreview: false
})

const emit = defineEmits<{
    submit: [feedback: { rating: number, comment: string }]
}>()

const rating = ref(0)
const comment = ref('')

function onSubmit() {
    if (rating.value === 0) return
    emit('submit', { rating: rating.value, comment: comment.value })
}
</script>

<template>
    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="w-full max-w-md overflow-hidden h-fit">
        <div class="bg-primary pt-12 pb-6 px-6 relative overflow-hidden">
            <div class="absolute -right-8 -top-8">
                <UIcon name="i-lucide-message-square-text" class="size-42 text-white/10" />
            </div>
            <div class="relative z-10 text-white">
                <h1 class="text-3xl font-bold mb-1 dark:text-neutral-800">{{ settings.title }}</h1>
                <p class="opacity-90 dark:text-neutral-800">{{ settings.description }}</p>
            </div>
        </div>

        <div v-if="!agent" class="p-4 sm:p-6 text-center animate-in fade-in zoom-in duration-300">
            <UIcon name="i-lucide-alert-circle" class="size-16 mx-auto text-neutral-400 mb-4" />
            <h2 class="text-xl font-semibold mb-2">Agent Not Found</h2>
            <p class="text-neutral-500">The QR code or link you accessed seems to be invalid or expired.</p>
        </div>

        <div v-else class="p-4 sm:p-6 flex flex-col gap-8 animate-in fade-in duration-300">
            <!-- Agent Info -->
            <div class="flex items-center gap-4 bg-muted p-4 rounded-xl border border-default/50">
                <UAvatar
                    :alt="agent.name"
                    size="lg"
                    class="bg-primary/10 text-primary font-bold shadow-sm"
                    :src="`https://i.pravatar.cc/128?u=${agent.id}`"
                />
                <div>
                    <p class="text-sm text-muted tracking-wide">You are rating</p>
                    <h3 class="text-lg font-semibold">{{ agent.name }}</h3>
                </div>
            </div>

            <!-- Rating -->
            <div class="space-y-4">
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium">{{ settings.ratingTitle }}</label>
                    <p class="text-xs text-dimmed">{{ settings.ratingDescription }}</p>
                </div>
                <div class="flex justify-between px-2">
                    <button 
                        v-for="star in 5" 
                        :key="star"
                        @click="rating = rating === star ? 0 : star"
                        class="p-2 transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                        :class="rating >= star ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-700'"
                    >
                        <UIcon 
                            :name="rating >= star ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
                            class="size-10"
                        />
                    </button>
                </div>
                <div class="flex justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400 px-3">
                    <span>{{ settings.ratingLowerLabel }}</span>
                    <span>{{ settings.ratingHigherLabel }}</span>
                </div>
            </div>

            <!-- Comment -->
            <div v-if="settings.showComment" class="flex flex-col gap-4 animate-in fade-in duration-300">
                <UFormField :label="settings.commentTitle">
                    <UTextarea 
                        v-model="comment" 
                        :placeholder="settings.commentPlaceholder" 
                        :rows="4"
                        variant="soft"
                        class="w-full"
                    />
                </UFormField>

                <div v-if="settings.showCommentPresets && settings.commentPresets.length" class="flex flex-wrap gap-2">
                    <UButton 
                        v-for="preset in settings.commentPresets" 
                        :key="preset"
                        :label="preset"
                        color="neutral"
                        variant="subtle"
                        size="xs"
                        class="rounded-full font-medium"
                        @click="comment = comment ? `${comment} ${preset}` : preset"
                    />
                </div>
            </div>

            <!-- Actions -->
            <UButton 
                :label="settings.submitButtonLabel" 
                color="primary" 
                size="xl" 
                block
                class="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                :disabled="rating === 0 || isPreview"
                @click="onSubmit"
            />
        </div>
    </UCard>
</template>
