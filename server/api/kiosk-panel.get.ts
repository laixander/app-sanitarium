export default defineEventHandler(async () => {
    // Read connectivity status from storage (default to 'Online')
    const storage = useStorage('panels')
    const status = await storage.getItem('kiosk-panel') || 'Online'

    return { status }
})
