import type { AppColor } from './ui'

export interface Schedule {
    id: string
    name: string
    startTime: string // e.g., "08:00"
    endTime: string   // e.g., "17:00"
    color: AppColor
}
