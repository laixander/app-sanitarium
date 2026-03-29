<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

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
        description: "Fetch all users with their roles and current status.",
    },
    {
        method: "GET",
        path: "/api/queue",
        description:
            "Get live queue data including waiting, serving, and completed tickets.",
    },
    {
        method: "GET",
        path: "/api/audits",
        description: "Retrieve system-wide audit logs for security and tracking.",
    },
    {
        method: "GET",
        path: "/api/roles",
        description: "List all available user roles and permissions.",
    },
];

const dataModels = [
    {
        name: "User",
        fields:
            "id, name, email, role, code, transaction, agentStatus, counter, ticket, served, avgService, schedule, createdAt, updatedAt, createdBy, updatedBy",
    },
    {
        name: "Ticket",
        fields:
            "id, ticket, transactionType, tags, status, counter, isHmo, isPriority, createdAt, servedAt, completedAt",
    },
    { name: "Audit", fields: "id, user, action, timestamp" },
    {
        name: "KioskFlow",
        fields:
            "id, name, status, title, description, welcomeTitle, welcomeDescription, layout, languages, showQR, showLanguageToggle, idleEnabled, idleTimeout, idleMedia, updatedAt",
    },
];

const workflowSteps = [
    {
        title: "Ticket Generation",
        description: "Patient selects a transaction type at the Kiosk.",
        status: "Waiting",
    },
    {
        title: "Queue Entry",
        description: "Ticket is assigned a number and enters the system queue.",
        status: "Queued",
    },
    {
        title: "Agent Call",
        description: "Agent notifies the next patient via the Counter Display.",
        status: "Calling",
    },
    {
        title: "Service Delivery",
        description: "Agent serves the patient at the designated counter.",
        status: "Serving",
    },
    {
        title: "Completion",
        description: "Agent marks the transaction as finished.",
        status: "Completed",
    },
    {
        title: "Feedback",
        description: "Patient provides optional feedback on the service.",
        status: "Feedback",
    },
];

const changelogItems = [
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
    {
        date: "March 27, 2026",
        version: "v1.3.0",
        title: "Queue Display Update",
        changes: ["Added Queue Lobby Panel for patient-facing queue display"],
    },
    {
        date: "March 27, 2026",
        version: "v1.2.0",
        title: "Operations Update",
        changes: [
            "Added centralized Toast Notification system (`useAppToast`)",
            'Introduced "Quick Guide" documentation page',
            "Updated Dashboard sidebar with improved navigation",
        ],
    },
    {
        date: "March 24, 2026",
        version: "v1.1.0",
        title: "Feedback",
        changes: [
            "Enhanced Feedback Management for agents",
            "Added QR Code generation for kiosks",
        ],
    },
];

const modules = [
    {
        name: "Kiosk",
        desc: "Patient-facing interface for selecting services and printing tickets.",
        icon: "i-lucide-monitor",
    },
    {
        name: "Queue Lobby Panel",
        desc: "Patient-facing display showing live queue lines and serving counters.",
        icon: "i-lucide-users",
    },
    {
        name: "Agent Dashboard",
        desc: "Interface for staff to call, serve, and complete patient tickets.",
        icon: "i-lucide-user-cog",
    },
    {
        name: "Kiosk Content",
        desc: "Dynamic flow builder for customizing the patient kiosk experience.",
        icon: "i-lucide-layout-template",
    },
    {
        name: "Admin Console",
        desc: "System-wide configuration, user management, and audit tracking.",
        icon: "i-lucide-shield-check",
    },
    {
        name: "Counter Display",
        desc: "Public-facing screens showing current tickets being served.",
        icon: "i-lucide-tv-2",
    },
    {
        name: "Feedback System",
        desc: "Captures patient satisfaction data post-service.",
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
                        <UNavigationMenu :ui="{ linkTrailingIcon: 'hidden' }" orientation="vertical"
                            :items="sections" />
                    </div>
                </aside>

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

.scroll-mt-20 {
    scroll-margin-top: 5rem;
}
</style>
