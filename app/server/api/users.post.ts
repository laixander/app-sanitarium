export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    if (!body.name || !body.email || !body.role) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: name, email, or role'
        })
    }

    const newUser = addUserToStore(body)
    return newUser
})
