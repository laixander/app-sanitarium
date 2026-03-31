export interface BrandingState {
    appName: string
    appTagline: string
    primaryColor: string
    neutralColor: string
    appLogo: string | null
}

export const DEFAULT_BRANDING: BrandingState = {
    appName: 'Sanitarium App',
    appTagline: 'Queue Management System',
    primaryColor: 'blue',
    neutralColor: 'neutral',
    appLogo: null
}

export const useBranding = () => {
    const branding = useState<BrandingState>('branding', () => DEFAULT_BRANDING)
    const isLoaded = useState<boolean>('branding_loaded', () => false)
    const { logActivity } = useAudits()

    if (import.meta.client && !isLoaded.value) {
        onMounted(() => {
            const saved = localStorage.getItem('branding_settings')
            if (saved) {
                try {
                    branding.value = { ...DEFAULT_BRANDING, ...JSON.parse(saved) }
                } catch (e) {
                    console.error('Failed to parse branding settings', e)
                }
            }
            isLoaded.value = true
        })
    }

    const updateBranding = (newState: Partial<BrandingState>) => {
        branding.value = { ...branding.value, ...newState }
        if (import.meta.client) {
            localStorage.setItem('branding_settings', JSON.stringify(branding.value))
        }

        logActivity({
            title: 'Branding Updated',
            description: `Global branding and theme settings were modified`,
            category: 'System Configuration',
            actor: 'Admin'
        })
    }

    const resetBranding = () => {
        branding.value = { ...DEFAULT_BRANDING }
        if (import.meta.client) {
            localStorage.removeItem('branding_settings')
        }

        logActivity({
            title: 'Branding Reset',
            description: `Global branding settings were reset to defaults`,
            category: 'System Configuration',
            actor: 'Admin'
        })
    }

    return {
        branding: readonly(branding),
        updateBranding,
        resetBranding,
        DEFAULT_BRANDING
    }
}
