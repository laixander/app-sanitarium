<script setup lang="ts">
const appConfig = useAppConfig()

definePageMeta({
    layout: "landing",
    showDocsMenu: true,
});

const { activeSection, sections } = useDocsMenu();

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id;
                }
            });
        },
        {
            rootMargin: "-20% 0% -70% 0%",
        },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
        observer.observe(section);
    });
});

const apiEndpoints = [
    {
        method: "GET",
        path: "/api/users",
        description: "Fetch all users with their roles and agent status.",
    },
    {
        method: "DELETE",
        path: "/api/users/:id",
        description: "Remove an agent from the system with cascading cleanup.",
    },
    {
        method: "GET",
        path: "/api/queue",
        description:
            "Get live queue lines, including waiting, serving, and completed tickets.",
    },
    {
        method: "GET",
        path: "/api/audits",
        description: "Retrieve system-wide activity logs (Audits) for transparency.",
    },
    {
        method: "GET",
        path: "/api/queue-panel",
        description: "Fetch real-time data specifically for the Lobby Display Panel.",
    },
    {
        method: "POST",
        path: "/api/panel-status",
        description: "Manage lobby panel visibility and active announcement states.",
    },
    {
        method: "GET",
        path: "/api/roles",
        description: "List all available user roles and their permission sets.",
    },
];

const dataModels = [
    {
        name: "User",
        fields:
            "id, name, email, role, code, transaction, agentStatus, counter, ticket, served, avgService, schedule, createdAt, updatedAt",
    },
    {
        name: "Ticket",
        fields:
            "id, ticket, transactionType, status, counter, isHmo, isPriority, isRegular, tags, reason, accumulatedServiceDuration, createdAt, servedAt, completedAt",
    },
    { 
        name: "Audit", 
        fields: "id, title, description, category, actor, time" 
    },
    {
        name: "KioskFlow",
        fields:
            "id, name, status, title, description, layout, languages, idleEnabled, idleTimeout, idleMedia, updatedAt",
    },
];

const workflowSteps = [
    {
        title: "Ticket Generation",
        description: "Patient selects a transaction at the Kiosk. Audit: Ticket Created.",
        status: "Waiting",
    },
    {
        title: "Queue Entry",
        description: "Ticket enters the system. Real-time sync across all dashboards.",
        status: "Queued",
    },
    {
        title: "Agent Call",
        description: "Agent calls ticket. Lobby Panel announces current ticket & counter. Supports hold/skip with reasons.",
        status: "Calling",
    },
    {
        title: "Service",
        description: "Agent serves patient. Performance metrics (SLA) and accumulated service time are tracked.",
        status: "Serving",
    },
    {
        title: "Completion",
        description: "Agent completes ticket with optional outcome notes. Audit: Ticket Completed.",
        status: "Completed",
    },
    {
        title: "Feedback",
        description: "Optional patient feedback gathered via post-service module.",
        status: "Feedback",
    },
];

const changelogItems = [
    {
        date: "April 02, 2026",
        version: "v1.7.0",
        title: "Transaction Codes & Kanban Workflow",
        changes: [
            "Implemented unique Transaction Codes for ticket prefixes (e.g., LT for Lab Tests)",
            "Standardized ticket formatting by removing dash separators (e.g., LT001)",
            "Enhanced Agent Dashboard with 'Held/Skipped' column and visibility toggles",
            "Improved redirection flow for unassigned agents with dedicated landing states",
            "Optimized performance with ticket card limiting and memoized service metrics",
            "Added 'Regular' ticket status and support for custom skip/hold reasons",
            "Integrated agent deletion capability in the management console",
        ],
    },
    {
        date: "March 31, 2026",
        version: "v1.6.1",
        title: "Documentation Alignment",
        changes: [
            "Synchronized documentation with current application architecture",
            "Refined TOC and content alignment for improved readability",
            "Updated API and Data Model references to match production schema",
        ],
    },
    {
        date: "March 30, 2026",
        version: "v1.6.0",
        title: "Lobby Panel & Dynamic Audits",
        changes: [
            "Launched Lobby Queue Display for patient-facing announcements",
            "Implemented persistent system-wide Audit Logging (useAudits)",
            "Integrated real-time state synchronization via localStorage and API",
            "Added support for dynamic transaction-based ticket prefixes (e.g., LT001)",
        ],
    },
    {
        date: "March 29, 2026",
        version: "v1.5.5",
        title: "Counter Interface Refinement",
        changes: [
            "Introduced CounterStats for real-time performance tracking",
            "Enhanced counter status visibility with transaction-specific themes",
            "Optimized ticket call workflow with session persistence",
        ],
    },
    {
        date: "March 28, 2026",
        version: "v1.5.0",
        title: "Advanced Kiosk Features",
        changes: [
            "Implemented Kiosk Idle Screen with timeout and automatic flow reset",
            "Added media file upload support for Idle Screen configuration",
            "Improved Kiosk Flow builder with full lifecycle management (Save Draft, Publish)",
            "Integrated multi-language support with smart real-time translation toggle",
        ],
    },
    {
        date: "March 28, 2026",
        version: "v1.4.0",
        title: "Kiosk & Core Updates",
        changes: [
            "New Kiosk Content Management module for building dynamic visitor flows",
            "Integrated real-time data sync for counter and agent dashboards",
            "Centralized transaction branding in `useTransactions`",
            "Added support for `isHmo` and `isPriority` ticket attributes",
            "Enhanced landing page with modern mesh background",
        ],
    },
];

const modules = [
    {
        name: "Kiosk",
        desc: "Omni-channel interface for ticket generation and priority routing.",
        icon: "i-lucide-monitor",
    },
    {
        name: "Lobby Display",
        desc: "Large-screen dashboard showing live queue maps and announcements.",
        icon: "i-lucide-users",
    },
    {
        name: "Agent Counter",
        desc: "High-performance interface for calling and managing active tickets.",
        icon: "i-lucide-user-cog",
    },
    {
        name: "Kiosk Builder",
        desc: "Low-code visual editor for customizing visitor flows and idle media.",
        icon: "i-lucide-layout-template",
    },
    {
        name: "Admin Console",
        desc: "Unified center for audits, role configuration, and system logs.",
        icon: "i-lucide-shield-check",
    },
    {
        name: "Counter Display",
        desc: "Point-of-service screens for individual counter number visibility.",
        icon: "i-lucide-tv-2",
    },
    {
        name: "Feedback",
        desc: "Embedded satisfaction surveys for post-service patient analytics.",
        icon: "i-lucide-heart-handshake",
    },
];

const techStack = [
    {
        name: "Nuxt 4",
        desc: "Full-stack framework for Vue.js",
        icon: "i-simple-icons-nuxtdotjs",
    },
    {
        name: "Tailwind CSS",
        desc: "Utility-first styling system",
        icon: "i-simple-icons-tailwindcss",
    },
    {
        name: "Nuxt UI",
        desc: "Ready-to-use premium components",
        icon: "i-lucide-component",
    },
    {
        name: "TypeScript",
        desc: "Type-safe development",
        icon: "i-simple-icons-typescript",
    },
];
</script>

<template>
    <UPage>
        <UContainer>
            <div class="flex flex-col lg:flex-row lg:items-start gap-8 px-4 lg:px-8 py-8">
                <!-- Sidebar TOC -->
                <aside class="hidden lg:block w-64 sticky top-24 shrink-0">
                    <div class="flex flex-col gap-4">
                        <div class="px-2 mb-2">
                            <UBadge variant="soft" size="md" class="rounded-full px-3 font-mono">
                                v{{ appConfig.version }}
                            </UBadge>
                        </div>
                        <UNavigationMenu :ui="{ linkTrailingIcon: 'hidden' }" orientation="vertical"
                            :items="sections" />
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="flex-1 max-w-4xl space-y-16">
                    <!-- Platform Overview -->
                    <DocsSection id="overview" title="Platform Overview" icon="i-lucide-info">
                        <p class="text-lg text-dimmed leading-relaxed italic">
                            "Smarter Queues. Happier Patients."
                        </p>
                        <p class="mt-4 leading-relaxed">
                            The SSGH Queue Management System (app-sanitarium) is an
                            intelligent platform designed specifically for modern healthcare
                            facilities. It eliminates wait-time frustration through real-time
                            tracking, smart routing, and actionable analytics.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <UCard shadow="sm">
                                <h3 class="font-semibold text-primary mb-2">Patient First</h3>
                                <p class="text-sm">
                                    Seamless ticket generation and status visibility reduces
                                    perceived wait times and anxiety.
                                </p>
                            </UCard>
                            <UCard shadow="sm">
                                <h3 class="font-semibold text-primary mb-2">
                                    Operational Excellence
                                </h3>
                                <p class="text-sm">
                                    Empower staff with real-time dashboards and efficient ticket
                                    handling workflows.
                                </p>
                            </UCard>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- System Architecture -->
                    <DocsSection id="architecture" title="System Architecture" icon="i-lucide-layers">
                        <div class="space-y-4">
                            <p>
                                The application is built on a modern, high-performance tech
                                stack:
                            </p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <UCard v-for="tech in techStack" :key="tech.name" :ui="{ body: 'sm:p-4 flex gap-3' }"
                                    variant="subtle">
                                    <UIcon :name="tech.icon" class="w-5 h-5 mt-0.5 text-primary" />
                                    <div>
                                        <span class="font-semibold">{{ tech.name }}</span>
                                        <p class="text-xs text-muted">{{ tech.desc }}</p>
                                    </div>
                                </UCard>
                            </div>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Module Reference -->
                    <DocsSection id="modules" title="Module Reference" icon="i-lucide-box">
                        <div class="grid grid-cols-1 gap-4">
                            <UCard v-for="mod in modules" :key="mod.name" :ui="{ body: 'sm:p-4 flex gap-4' }">
                                <UBadge :icon="mod.icon" color="primary" variant="soft" :ui="{ leadingIcon: 'size-6' }"
                                    class="size-12 flex items-center justify-center rounded-none squircle" />
                                <div>
                                    <h4 class="font-bold text-lg">{{ mod.name }}</h4>
                                    <p class="text-sm text-muted">{{ mod.desc }}</p>
                                </div>
                            </UCard>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Data Models & Schema -->
                    <DocsSection id="data-models" title="Data Models & Schema" icon="i-lucide-database">
                        <div class="space-y-6">
                            <div v-for="model in dataModels" :key="model.name">
                                <label class="font-mono text-xs uppercase tracking-widest text-dimmed">{{ model.name }}
                                    Model</label>
                                <div class="mt-2 p-4 rounded-lg bg-neutral-800 overflow-x-auto">
                                    <code class="text-xs text-primary-400 break-all">{{
                                        model.fields
                                    }}</code>
                                </div>
                            </div>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Workflow -->
                    <DocsSection id="workflow" title="Workflow" icon="i-lucide-git-branch">
                        <DocsTimeline :items="workflowSteps" />
                    </DocsSection>

                    <USeparator />

                    <!-- API Reference -->
                    <DocsSection id="api" title="API Reference" icon="i-lucide-webhook">
                        <div class="space-y-4">
                            <UCard v-for="api in apiEndpoints" :key="api.path" variant="subtle"
                                :ui="{ body: 'sm:p-4' }">
                                <div class="flex items-center gap-3 mb-1">
                                    <UBadge color="primary" variant="subtle" size="sm" class="font-mono">{{ api.method
                                    }}
                                    </UBadge>
                                    <span class="font-mono font-bold">{{ api.path }}</span>
                                </div>
                                <p class="text-sm text-muted">{{ api.description }}</p>
                            </UCard>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Design System -->
                    <DocsSection id="design" title="Design System" icon="i-lucide-palette">
                        <div class="space-y-8">
                            <div>
                                <h4 class="font-semibold mb-4 text-sm uppercase tracking-widest text-dimmed">
                                    Color Palette
                                </h4>
                                <div class="flex flex-wrap gap-4">
                                    <div class="space-y-2">
                                        <div class="w-20 h-20 rounded-2xl bg-primary shadow-lg" />
                                        <p class="text-xs text-center font-mono">Primary</p>
                                    </div>
                                    <div class="space-y-2">
                                        <div
                                            class="w-20 h-20 rounded-2xl bg-neutral-800 dark:bg-neutral-200 shadow-lg" />
                                        <p class="text-xs text-center font-mono">Neutral</p>
                                    </div>
                                    <div class="space-y-2">
                                        <div
                                            class="w-20 h-20 rounded-2xl bg-white border border-default shadow-lg dark:bg-neutral-900" />
                                        <p class="text-xs text-center font-mono">Background</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 class="font-semibold mb-4 text-sm uppercase tracking-widest text-dimmed">
                                    Typography & Spacing
                                </h4>
                                <p class="text-sm">
                                    We use <span class="font-bold">Geist</span> as our primary
                                    font, with consistent 4, 8, 12, and 16 module spacing based on
                                    Tailwind's defaults.
                                </p>
                            </div>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Changelog -->
                    <DocsSection id="changelog" title="Changelog" icon="i-lucide-history">
                        <DocsTimeline :items="changelogItems">
                            <template #item="{ item, index }">
                                <div :class="index > 0 ? 'opacity-60' : ''">
                                    <span class="text-xs font-mono text-neutral-500">{{
                                        item.date
                                    }}</span>
                                    <h5 class="font-bold mt-1">
                                        {{ item.version }} - {{ item.title }}
                                    </h5>
                                    <ul class="mt-2 space-y-1 list-disc list-inside text-sm text-neutral-500">
                                        <li v-for="change in item.changes" :key="change">
                                            {{ change }}
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </DocsTimeline>
                    </DocsSection>
                </div>
            </div>
        </UContainer>
    </UPage>
</template>

<style scoped>
:global(html) {
    scroll-behavior: smooth;
}

.scroll-mt-24 {
    scroll-margin-top: 6rem;
}
</style>
