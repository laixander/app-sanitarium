import type { AppColor } from './ui'

export interface TransactionCategory {
    id: string
    name: string
    code: string
    description?: string
    color: AppColor
    icon: string
}
