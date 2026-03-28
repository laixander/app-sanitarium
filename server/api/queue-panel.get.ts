export default defineEventHandler(async () => {
    // Read connectivity status from storage (default to 'Online')
    const storage = useStorage('panels')
    const status = await storage.getItem('queue-panel') || 'Online'

    return { status }
})
