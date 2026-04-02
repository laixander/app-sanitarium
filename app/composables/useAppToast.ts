export const useAppToast = () => {
    const toast = useToast()

    const add = (options: { title: string; description?: string; color?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'neutral' }) => {
        toast.add(options)
    }

    const success = (title: string, description?: string) => {
        add({ title, description, color: 'success' })
    }

    const error = (title: string, description?: string) => {
        add({ title, description, color: 'error' })
    }

    const warning = (title: string, description?: string) => {
        add({ title, description, color: 'warning' })
    }

    const info = (title: string, description?: string) => {
        add({ title, description, color: 'info' })
    }

    const refreshed = (type: string) => {
        if (type === 'Dashboard') {
            success('Refreshed', 'Dashboard data has been synchronized.')
        } else {
            success('Refreshed', `${type} data has been refreshed.`)
        }
    }

    const counterAssigned = (agentName: string, counter: string) => {
        success('Counter Assigned', `${agentName} has been assigned to ${counter}.`)
    }

    const agentOnBreak = (agentName: string) => {
        warning('Agent On Break', `${agentName} has been set on break.`)
    }

    const agentLoggedOut = (agentName: string) => {
        error('Agent Logged Out', `${agentName} has been forcefully logged out.`)
    }

    const saved = (type: string, description?: string) => {
        success(`${type} Saved`, description || `${type} has been updated successfully.`)
    }

    const updated = (type: string, description?: string) => {
        success(`${type} Updated`, description || `${type} settings have been updated successfully.`)
    }

    const reset = (type: string, description?: string) => {
        info(`${type} Reset`, description || `${type} settings have been reset to default.`)
    }

    const exporting = (filename: string) => {
        success('Exporting...', `Your ${filename} are being prepared for export.`)
    }

    const created = (type: string, description?: string) => {
        success(`${type} created`, description || `New ${type.toLowerCase()} has been successfully created.`)
    }

    const assignmentUpdated = (agentName: string) => {
        success('Assignment Updated', `${agentName} has been assigned.`)
    }

    const logsRefreshed = () => {
        success('Logs Refreshed', 'Ticket logs have been refreshed.')
    }

    return {
        add,
        success,
        error,
        warning,
        info,
        refreshed,
        counterAssigned,
        agentOnBreak,
        agentLoggedOut,
        saved,
        updated,
        reset,
        exporting,
        created,
        assignmentUpdated,
        logsRefreshed
    }
}
