export interface FeedbackSettings {
    title: string
    description: string
    ratingTitle: string
    ratingDescription: string
    ratingLowerLabel: string
    ratingHigherLabel: string
    showComment: boolean
    showCommentPresets: boolean
    commentTitle: string
    commentPlaceholder: string
    commentPresets: string[]
    submitButtonLabel: string
}

export const useFeedbackSettings = () => {
    const defaultSettings: FeedbackSettings = {
        title: 'Feedback',
        description: 'Your opinion helps us improve.',
        ratingTitle: 'How would you rate the service?',
        ratingDescription: 'Tap a star to select your rating',
        ratingLowerLabel: 'Poor',
        ratingHigherLabel: 'Excellent',
        showComment: true,
        showCommentPresets: true,
        commentTitle: 'Additional Comments (Optional)',
        commentPlaceholder: 'Tell us what went well or what could be better...',
        commentPresets: ['Excellent service!', 'Very professional', 'Fast and efficient', 'Friendly staff', 'Helpful and kind'],
        submitButtonLabel: 'Submit Feedback'
    }

    const settings = useState<FeedbackSettings>('feedbackSettings', () => defaultSettings)

    const saveSettings = (newSettings: FeedbackSettings) => {
        settings.value = { ...newSettings }
        if (import.meta.client) {
            localStorage.setItem('sanitarium_feedback_settings', JSON.stringify(settings.value))
        }
    }

    const reloadSettings = () => {
        if (!import.meta.client) return
        const saved = localStorage.getItem('sanitarium_feedback_settings')
        if (saved) {
            settings.value = JSON.parse(saved)
        }
    }

    onMounted(() => {
        reloadSettings()
    })

    return {
        settings,
        defaultSettings,
        saveSettings,
        reloadSettings,
        resetSettings: () => saveSettings(defaultSettings)
    }
}
