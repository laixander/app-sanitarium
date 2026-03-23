const now = ref(Date.now())
let timer: any = null
let subscribers = 0

export const useTimer = () => {
    onMounted(() => {
        subscribers++
        if (!timer) {
            timer = setInterval(() => {
                now.value = Date.now()
            }, 1000) // Update every second for accuracy
        }
    })

    onUnmounted(() => {
        subscribers--
        if (subscribers <= 0 && timer) {
            clearInterval(timer)
            timer = null
            subscribers = 0
        }
    })

    return {
        now
    }
}
