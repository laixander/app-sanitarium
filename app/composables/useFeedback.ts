import { getNowStamp } from '~/utils/date'
export interface Feedback {
    id: number
    agentCode: string
    agentId: number
    rating: number
    comment: string
    createdAt: string
}

export const useFeedback = () => {
    const feedbackList = useState<Feedback[]>('feedbackList', () => [])

    const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
        const id = feedbackList.value.length + 1
        const now = getNowStamp()

        const newFeedback: Feedback = {
            ...feedbackData,
            id,
            createdAt: now
        }

        feedbackList.value = [newFeedback, ...feedbackList.value]
        
        if (import.meta.client) {
            localStorage.setItem('sanitarium_feedback', JSON.stringify(feedbackList.value))
        }
    }

    const reloadFeedback = () => {
        if (!import.meta.client) return
        const saved = localStorage.getItem('sanitarium_feedback')
        if (saved) {
            feedbackList.value = JSON.parse(saved)
        } else {
            feedbackList.value = []
        }
    }

    onMounted(() => {
        reloadFeedback()
    })

    return {
        feedbackList,
        addFeedback,
        reloadFeedback
    }
}
