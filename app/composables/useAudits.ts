import type { AuditLog } from '~/types/audit'

export const useAudits = () => {
    const { data: audits } = useFetch<AuditLog[]>('/api/audits', {
        default: () => []
    })

    return {
        audits
    }
}
