import type { AppColor } from './ui'

export interface Role {
    title: string
    userCount: number
    permissions: string[]
    color?: AppColor
}
