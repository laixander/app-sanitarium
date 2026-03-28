export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id, status } = body

    if (!id || !status) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Panel ID and status are required.'
        })
    }

    const storage = useStorage('panels')
    await storage.setItem(id, status)

    return { success: true, id, status }
})
