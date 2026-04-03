import type { NavigationMenuItem } from '@nuxt/ui'

export const useManualMenu = () => {
    const activeSection = useState('manual-active-section', () => 'administrator')

    const sections = computed<NavigationMenuItem[]>(() => [
        {
            label: 'User Roles',
            icon: 'i-lucide-users',
            to: '/manual',
            defaultOpen: true,
            type: 'trigger',
            children: [
                { to: '#administrator', label: 'Administrator', exact: true, active: activeSection.value === 'administrator' },
                { to: '#agent', label: 'Agent', exact: true, active: activeSection.value === 'agent' },
                { to: '#patient', label: 'Patient / Visitor', exact: true, active: activeSection.value === 'patient' },
            ]
        },
    ])

    return {
        activeSection,
        sections
    }
}
