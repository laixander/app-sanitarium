export interface User {
    id: number
    name: string
    email: string
    role: string
    status: 'Active' | 'Suspended'
    lastLogin: string
    // Agent specific fields (optional)
    code?: string
    agentStatus?: 'Online' | 'Serving' | 'On Break' | 'Offline'
    counter?: string
    department?: string
    ticket?: string
    served?: number
    avgService?: string
    dateAssigned?: string
    dateUpdated?: string
    schedule?: string
}
