<script setup lang="ts">
import { useUsers } from '~/composables/useUsers'
import { useFeedback } from '~/composables/useFeedback'

definePageMeta({
    title: 'Provide Feedback'
})

const route = useRoute()
const code = computed(() => route.params.code as string)

const { users } = useUsers()
const { feedbackList, addFeedback } = useFeedback()
const { settings } = useFeedbackSettings()

const alreadySubmitted = computed(() => feedbackList.value.some(f => f.agentCode === code.value))
const agent = computed(() => users.value.find(u => u.code === code.value && u.role === 'Agent'))

const isSubmitted = ref(false)

const handleFeedbackSubmit = (data: { rating: number, comment: string }) => {
    if (agent.value) {
        addFeedback({
            agentCode: code.value,
            agentId: agent.value.id,
            rating: data.rating,
            comment: data.comment
        })
        isSubmitted.value = true
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">

        <div v-if="isSubmitted || alreadySubmitted" class="w-full max-w-md">
            <UCard class="text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <UIcon name="i-lucide-check-circle" class="w-10 h-10 text-success" />
                </div>
                <h2 class="text-2xl font-bold mb-2">Thank You!</h2>
                <p class="text-neutral-500 mb-8">
                    Your feedback for <span class="font-semibold">{{ agent?.name || 'the agent' }}</span> has been successfully submitted. We appreciate your time.
                </p>
                <UButton label="Go Back Home" to="/" color="neutral" variant="ghost" icon="i-lucide-arrow-left" />
            </UCard>
        </div>

        <AgentFeedbackForm 
            v-else
            :settings="settings" 
            :agent="agent" 
            @submit="handleFeedbackSubmit" 
        />
        
        <div class="mt-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-medium">
            Powered by Sanitarium Health
        </div>
    </div>
</template>

