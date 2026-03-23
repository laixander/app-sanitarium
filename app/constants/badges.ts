import type { AppColor } from '~/types/ui'
import type { BadgeType } from '~/utils/badges'

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
    transaction: {
        'Consultation': 'purple',
        'Admission': 'sky',
        'Billing': 'emerald',
        'Outpatient': 'rose'
    }
}
