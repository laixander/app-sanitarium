import type { AppColor } from '~/types/ui'

export type BadgeType = 'role' | 'status' | 'category' | 'sso' | 'transaction'

import { BADGE_CONFIGS } from '~/constants/badges'

export const getBadgeColor = (type: BadgeType, value: string): AppColor => {
    if (type === 'role') return 'neutral'
    return (BADGE_CONFIGS as any)[type]?.[value] || 'neutral'
}
