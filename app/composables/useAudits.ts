import type { AuditLog } from '~/types/audit'
import { getNowStamp } from '~/utils/date'

export const useAudits = () => {
    const audits = useState<AuditLog[]>('audits', () => [])
    const isInitialized = useState<boolean>('audits_initialized', () => false)

    // Initialize from API if empty
    const { data: initialAudits } = useFetch<AuditLog[]>('/api/audits', {
        key: 'audits-data-fetch',
        immediate: audits.value.length === 0 && !isInitialized.value
    })

    const reloadAudits = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_audits')
        if (saved) {
            try {
                audits.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to parse audit logs from localStorage', e)
                // If corrupted, initialize as empty to avoid further errors
                audits.value = []
            }
        }
    }

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_audits', JSON.stringify(audits.value))
        }
    }

    const logActivity = (log: Omit<AuditLog, 'id' | 'time'>) => {
        const id = String(Date.now())
        const time = getNowStamp()

        const newLog: AuditLog = {
            id,
            time,
            ...log
        }

        audits.value = [newLog, ...audits.value]
        saveToLocal()
    }

    const clearAudits = () => {
        audits.value = []
        saveToLocal()
    }

    // Initialize once per component mount (but sync across app via isInitialized)
    onMounted(() => {
        if (import.meta.client && !isInitialized.value) {
            reloadAudits()
            isInitialized.value = true
        }

        // Sync initial API data if no local data exists
        // Watcher is local to the component instance but checks global state
        const stopWatch = watch(initialAudits, (newData) => {
            if (newData && audits.value.length === 0) {
                audits.value = newData
                saveToLocal()
            }
        }, { immediate: true })

        // Real-time sync across tabs
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'sanitarium_audits') {
                reloadAudits()
            }
        }
        window.addEventListener('storage', onStorage)
        
        onUnmounted(() => {
            stopWatch()
            window.removeEventListener('storage', onStorage)
        })
    })

    return {
        audits,
        logActivity,
        clearAudits,
        reloadAudits
    }
}
