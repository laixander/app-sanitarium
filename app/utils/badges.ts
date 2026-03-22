import type { AppColor } from '~/types/ui'

export type BadgeType = 'role' | 'status' | 'category' | 'sso' | 'department'

export const BADGE_CONFIGS: Record<Exclude<BadgeType, 'role'>, Record<string, AppColor>> = {
    status: {
        // user status
        'Active': 'success',
        'Suspended': 'error',
        'Inactive': 'neutral',
        // agent status
        'Online': 'success',
        'Serving': 'blue',
        'On Break': 'amber',
        'Offline': 'error'
    },
    category: {
        'Account Management': 'indigo',
        'Queue Management': 'sky',
        'System': 'amber',
        'Agent Management': 'cyan',
        'System Configuration': 'violet',
        'Inventory': 'orange',
        'Patient Care': 'rose',
        'Security': 'red',
        'Staffing': 'blue',
        'Quality Assurance': 'fuchsia',
        'Facilities': 'lime',
        'Finance': 'emerald'
    },
    sso: {
        'Active': 'success',
        'Inactive': 'neutral',
        'Configuring': 'amber'
    },
    department: {
        'Consultation': 'purple',
        'Admission': 'sky',
        'Billing': 'emerald',
        'Outpatient': 'rose'
    }
}

export const getBadgeColor = (type: BadgeType, value: string): AppColor => {
    if (type === 'role') return 'neutral'
    return (BADGE_CONFIGS as any)[type]?.[value] || 'neutral'
}
