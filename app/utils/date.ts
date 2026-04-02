export const formatDateStamp = (date: string | Date | number = new Date()) => {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    if (isNaN(d.getTime())) return '-'
    
    return d.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
}

export const getNowStamp = () => formatDateStamp(new Date())
