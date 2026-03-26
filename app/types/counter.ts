import type { AppColor } from './ui'

export interface Counter {
    id: string
    name: string
    description?: string
    color: AppColor
    transactions?: string[]
    agent?: string
}
