import { computed } from 'vue'

export const useQueueTime = (createdAt?: string, servedAt?: string, status?: string, accumulated?: number) => {
    const { now } = useTimer()

    const waitingTime = computed(() => {
        if (!createdAt) return 'N/A'
    
        const start = new Date(createdAt).getTime()
        const end = (['serving', 'missed', 'completed', 'held', 'skipped'].includes(status || '') && servedAt)
            ? new Date(servedAt).getTime()
            : now.value
    
        const diffMs = Math.max(0, end - start)
        const diffMin = Math.floor(diffMs / 60000)
        const diffSec = Math.floor((diffMs % 60000) / 1000)
    
        if (diffMin > 0) return `${diffMin}m ${diffSec}s`
        return `${diffSec}s`
    })

    const serviceTime = computed(() => {
        const activeMs = (status === 'serving' && servedAt) 
            ? Math.max(0, now.value - new Date(servedAt).getTime()) 
            : 0
        const totalMs = (accumulated || 0) + activeMs
        
        const min = Math.floor(totalMs / 60000)
        const sec = Math.floor((totalMs % 60000) / 1000)
        
        if (totalMs === 0) return '0s'
        return min > 0 ? `${min}m ${sec}s` : `${sec}s`
    })

    return {
        waitingTime,
        serviceTime
    }
}
