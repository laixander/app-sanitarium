import type { Schedule } from '~/types/schedule'

export const useSchedules = () => {
    const schedules = useState<Schedule[]>('schedules', () => [])

    const reloadSchedules = () => {
        if (!import.meta.client) return

        const saved = localStorage.getItem('sanitarium_schedules')
        if (saved) {
            schedules.value = JSON.parse(saved)
        } else {
            // Default ones
            schedules.value = [
                { id: '1', name: 'Morning Shift', startTime: '08:00', endTime: '12:00', color: 'blue' },
                { id: '2', name: 'Afternoon Shift', startTime: '13:00', endTime: '17:00', color: 'orange' }
            ]
            saveToLocal()
        }
    }

    onMounted(() => {
        reloadSchedules()
    })

    const saveToLocal = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_schedules', JSON.stringify(schedules.value))
        }
    }

    const addSchedule = (data: Omit<Schedule, 'id'>) => {
        const id = Date.now().toString()
        schedules.value = [...schedules.value, { ...data, id }]
        saveToLocal()
    }

    const updateSchedule = (id: string, data: Partial<Omit<Schedule, 'id'>>) => {
        const index = schedules.value.findIndex(t => t.id === id)
        if (index !== -1) {
            schedules.value[index] = { ...schedules.value[index], ...data } as Schedule
            saveToLocal()
        }
    }

    const deleteSchedule = (id: string) => {
        schedules.value = schedules.value.filter(t => t.id !== id)
        saveToLocal()
    }

    return {
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        reloadSchedules
    }
}
