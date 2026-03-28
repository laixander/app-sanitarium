import type { NavigationMenuItem } from '@nuxt/ui'

export const useDocsMenu = () => {
    const activeSection = useState('docs-active-section', () => 'overview')

    const sections = computed<NavigationMenuItem[]>(() => [
        {
            label: 'Quick Guide',
            icon: 'i-lucide-book-open',
            to: '/docs',
            defaultOpen: true,
            type: 'trigger',
            children: [
                { to: '#overview', label: 'Platform Overview', exact: true, active: activeSection.value === 'overview' },
                { to: '#architecture', label: 'System Architecture', exact: true, active: activeSection.value === 'architecture' },
                { to: '#modules', label: 'Module Reference', exact: true, active: activeSection.value === 'modules' },
                { to: '#data-models', label: 'Data Models & Schema', exact: true, active: activeSection.value === 'data-models' },
                { to: '#workflow', label: 'Workflow', exact: true, active: activeSection.value === 'workflow' },
                { to: '#api', label: 'API Reference', exact: true, active: activeSection.value === 'api' },
                { to: '#design', label: 'Design System', exact: true, active: activeSection.value === 'design' },
                { to: '#changelog', label: 'Changelog', exact: true, active: activeSection.value === 'changelog' }
            ]
        },
    ])

    return {
        activeSection,
        sections
    }
}
