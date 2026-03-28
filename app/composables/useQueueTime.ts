import { computed } from 'vue'

export const useQueueTime = (createdAt?: string, servedAt?: string, status?: string) => {
    const { now } = useTimer()

    const waitingTime = computed(() => {
        if (!createdAt) return 'N/A'
    
        const start = new Date(createdAt).getTime()
        const end = (['serving', 'missed', 'completed'].includes(status || '') && servedAt)
            ? new Date(servedAt).getTime()
            : now.value
    
        const diffMs = Math.max(0, end - start)
        const diffMin = Math.floor(diffMs / 60000)
        const diffSec = Math.floor((diffMs % 60000) / 1000)
    
        if (diffMin > 0) return `${diffMin}m ${diffSec}s`
        return `${diffSec}s`
    })

    return {
        waitingTime
    }
}
