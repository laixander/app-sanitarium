import type { AppColor } from './ui'

export interface TransactionCategory {
    id: string
    name: string
    description?: string
    color: AppColor
    icon: string
}
