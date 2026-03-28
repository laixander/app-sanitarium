// app/composables/useKioskSettings.ts
export interface KioskSettings {
    title: string
    description: string
    welcomeTitle: string
    welcomeDescription: string
    layout: string
    languages: string[]
    idleEnabled: boolean
    idleTimeout: number
    idleMedia: string
    idleImageUrl: string
    idleVideoUrl: string
    showQR: boolean
    showLanguageToggle: boolean
}

export interface KioskFlow extends KioskSettings {
    id: string
    name: string
    status: 'Active' | 'Draft'
    updatedAt: string
}

export const useKioskSettings = () => {
    const defaultSettings: KioskSettings = {
        title: '',
        description: '',
        welcomeTitle: '',
        welcomeDescription: '',
        layout: 'split',
        languages: [],
        idleEnabled: false,
        idleTimeout: 30,
        idleMedia: '',
        idleImageUrl: '',
        idleVideoUrl: '',
        showQR: true,
        showLanguageToggle: true
    }

    const flows = useState<KioskFlow[]>('kioskFlows', () => [])
    const activeFlowId = useState<string | null>('activeKioskFlowId', () => null)

    const settings = computed<KioskSettings>(() => {
        const active = flows.value.find(f => f.id === activeFlowId.value)
        return active ? { ...active } : defaultSettings
    })

    const saveFlows = () => {
        if (import.meta.client) {
            localStorage.setItem('sanitarium_kiosk_flows', JSON.stringify(flows.value))
            localStorage.setItem('sanitarium_active_flow_id', activeFlowId.value || '')
        }
    }

    const getNowFormatted = () => {
        const parts = new Date().toISOString().replace('T', ' ').split('.')
        const datePart = parts[0] || ''
        return datePart.slice(0, 16)
    }

    const addFlow = (config: KioskSettings & { name: string }) => {
        const newFlow: KioskFlow = {
            ...config,
            id: Date.now().toString(),
            status: 'Draft',
            updatedAt: getNowFormatted()
        }
        flows.value.push(newFlow)
        saveFlows()
        return newFlow
    }

    const updateFlow = (id: string, updates: Partial<KioskFlow>) => {
        const index = flows.value.findIndex(f => f.id === id)
        if (index !== -1) {
            const current = flows.value[index]
            if (current) {
                // To avoid TS errors with index access and KioskFlow type
                const updated: KioskFlow = { 
                    ...current, 
                    ...updates,
                    updatedAt: getNowFormatted()
                }
                flows.value[index] = updated
                saveFlows()
            }
        }
    }

    const deleteFlow = (id: string) => {
        flows.value = flows.value.filter(f => f.id !== id)
        if (activeFlowId.value === id) activeFlowId.value = null
        saveFlows()
    }

    const activateFlow = (id: string) => {
        flows.value.forEach(f => {
            f.status = f.id === id ? 'Active' : 'Draft'
        })
        activeFlowId.value = id
        saveFlows()
    }

    const reloadSettings = () => {
        if (!import.meta.client) return
        const savedFlows = localStorage.getItem('sanitarium_kiosk_flows')
        const savedActiveId = localStorage.getItem('sanitarium_active_flow_id')
        
        if (savedFlows) {
            try {
                flows.value = JSON.parse(savedFlows)
            } catch (e) {
                console.error('Error parsing kiosk flows', e)
                flows.value = []
            }
        }

        if (savedActiveId) {
            activeFlowId.value = savedActiveId
        } else {
            activeFlowId.value = null
        }
        
        if (!savedFlows) {
            flows.value = []
        }
    }

    const clearAllFlows = () => {
        flows.value = []
        activeFlowId.value = null
        if (import.meta.client) {
            localStorage.removeItem('sanitarium_kiosk_flows')
            localStorage.removeItem('sanitarium_active_flow_id')
        }
    }

    if (import.meta.client) {
        reloadSettings()
    }

    const resetSettings = () => {
        if (activeFlowId.value) {
            updateFlow(activeFlowId.value, defaultSettings)
        }
    }

    const getFlow = (id: string) => {
        return flows.value.find(f => f.id === id)
    }

    return {
        flows,
        settings,
        activeFlowId,
        defaultSettings,
        addFlow,
        updateFlow,
        deleteFlow,
        activateFlow,
        getFlow,
        clearAllFlows,
        reloadSettings,
        resetSettings,
        saveSettings: (s: KioskSettings) => {
            if (activeFlowId.value) {
                updateFlow(activeFlowId.value, s)
            }
        }
    }
}