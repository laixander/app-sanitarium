export interface User {
    id: number
    name: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    // Agent specific fields (optional)
    code?: string
    agentStatus?: 'Online' | 'Serving' | 'On Break' | 'Offline'
    counter?: string
    transaction?: string
    ticket?: string
    served?: number
    avgService?: string
    dateAssigned?: string
    dateUpdated?: string
    schedule?: string
}
