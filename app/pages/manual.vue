<script setup lang="ts">
const appConfig = useAppConfig()

definePageMeta({
    layout: "landing",
    showDocsMenu: true,
});

const { activeSection, sections } = useManualMenu();

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
                    <div class="space-y-4">
                        <h1 class="text-4xl font-extrabold tracking-tight">User Manual</h1>
                        <p class="text-lg text-muted max-w-2xl">
                            A comprehensive, step-by-step reference describing what each role can do within the SSGH Queue Management System.
                        </p>
                    </div>

                    <!-- Administrator -->
                    <DocsSection id="administrator" title="Administrator" icon="i-lucide-shield-check">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            Administrators possess full control over the application's configuration, user management, and system-wide monitoring.
                        </p>
                        
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                                    <UIcon name="i-lucide-users-round" class="text-primary size-5" />
                                    User & Role Management
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    From the Admin Console, administrators can provision new accounts, update information, and fully remove personnel from the system. They assign individuals as global <strong>Admins</strong> or as dedicated <strong>Agents</strong>, and can establish new roles with customizable permission models, allowing granular access over different application modules.
                                </p>
                            </div>
                            
                            <USeparator variant="dashed" />

                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                                    <UIcon name="i-lucide-store" class="text-primary size-5" />
                                    Department & Queue Configuration
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    Admins designate Counter settings—mapping service points (e.g., "Counter 01") to specific Transactions (e.g., Admission, Consultation). They manage the transaction codes (prefixes for tickets) to ensure operations align with hospital protocol.
                                </p>
                            </div>

                            <USeparator variant="dashed" />

                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                                    <UIcon name="i-lucide-layout-template" class="text-primary size-5" />
                                    Kiosk Experience Builder
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    Via the Kiosk Builder menu, Admins customize the complete screen flow that welcomes patients to the hospital. They can:
                                </p>
                                <ul class="list-disc list-inside mt-2 text-muted space-y-2">
                                    <li>Adjust the layout structure of ticket generation screens.</li>
                                    <li>Enable or disable multiple languages.</li>
                                    <li>Configure <strong>Idle Screens</strong>—setting timeouts and uploading dynamic media to display when kiosks are inactive.</li>
                                </ul>
                            </div>

                            <USeparator variant="dashed" />

                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                                    <UIcon name="i-lucide-clipboard-check" class="text-primary size-5" />
                                    Reports & Audits
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    Administrators monitor the entire ecosystem's transparency via System Audits, which trace back important lifecycle events (e.g., ticket generated, agent deleted) to the exact timeframe and actor.
                                </p>
                            </div>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Agent -->
                    <DocsSection id="agent" title="Agent" icon="i-lucide-user-cog">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            Agents represent the hospital's staff handling the line, such as receptionists and checkout personnel. They work primarily via the high-performance Agent Counter dashboard.
                        </p>

                        <div class="space-y-6">
                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                                    <UIcon name="i-lucide-calendar-clock" class="text-primary size-5" />
                                    Dashboard & Queue State
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    When logged in, an Agent is associated with a specific counter. Their kanban-style dashboard organizes active traffic into columns: waiting, currently serving, and held/skipped tickets. The dashboard reflects real-time status dynamically.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <UCard shadow="none" class="bg-neutral-800/20 ring-1 ring-white/10">
                                    <h4 class="font-bold mb-2 flex items-center gap-2">
                                        <UIcon name="i-lucide-play" class="text-emerald-500 size-4" />
                                        Calling Tickets
                                    </h4>
                                    <p class="text-sm text-muted">Agents pull the next ticket from the queue, immediately invoking an overarching announcement on the Lobby Display to guide the patient to their counter.</p>
                                </UCard>
                                <UCard shadow="none" class="bg-neutral-800/20 ring-1 ring-white/10">
                                    <h4 class="font-bold mb-2 flex items-center gap-2">
                                        <UIcon name="i-lucide-check-circle" class="text-primary size-4" />
                                        Service Completion
                                    </h4>
                                    <p class="text-sm text-muted">Upon helping the patient, completing the ticket finalizes the transaction, recording SLA statistics such as average and accumulated service metrics.</p>
                                </UCard>
                                <UCard shadow="none" class="bg-neutral-800/20 ring-1 ring-white/10">
                                    <h4 class="font-bold mb-2 flex items-center gap-2">
                                        <UIcon name="i-lucide-pause-circle" class="text-orange-500 size-4" />
                                        Hold / Skip
                                    </h4>
                                    <p class="text-sm text-muted">If a patient goes missing or lacks required files, Agents can pause or skip the request. The system prompts to select standard or custom resolution reasons.</p>
                                </UCard>
                                <UCard shadow="none" class="bg-neutral-800/20 ring-1 ring-white/10">
                                    <h4 class="font-bold mb-2 flex items-center gap-2">
                                        <UIcon name="i-lucide-tags" class="text-purple-500 size-4" />
                                        Ticket Tags
                                    </h4>
                                    <p class="text-sm text-muted">Agents can visually identify ticket attributes at a glance, like <em>HMO</em>, <em>Priority</em>, or <em>Regular</em> tags routing through the system.</p>
                                </UCard>
                            </div>

                            <div>
                                <h3 class="text-xl font-bold mb-3 flex items-center gap-2 mt-4">
                                    <UIcon name="i-lucide-user-round" class="text-primary size-5" />
                                    Profile Customization
                                </h3>
                                <p class="text-muted leading-relaxed">
                                    Agents can interact with the User Menu at the top right to customize their account avatar, switch interface styling (Light/Dark themes), and adjust display densities to suit their viewing preference.
                                </p>
                            </div>
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Patient / Visitor -->
                    <DocsSection id="patient" title="Patient / Visitor" icon="i-lucide-heart-handshake">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            The core end-users of the facility. They interact with intuitive touchpoints to get directed quickly.
                        </p>

                        <div class="space-y-6">
                            <DocsTimeline 
                                :items="[
                                    { title: 'Kiosk Interaction', description: 'Patients select their desired transaction directly on self-service Kiosk terminals. Designed for high accessibility, they can toggle UI languages or interact with embedded QR codes if scanning is required.', status: 'Step 1' },
                                    { title: 'Lobby Navigation', description: 'While seated in waiting areas, patients observe the Lobby Panel—a large TV display mirroring ongoing queue progress. It prominently features visual/audio announcements indicating exactly when and where they need to go.', status: 'Step 2' },
                                    { title: 'Post-Service Feedback', description: 'After their interaction concludes, patients may optionally be presented with an on-device Feedback survey, letting them rate the facility’s speed, staff helpfulness, and other customizable insights.', status: 'Step 3' }
                                ]" 
                            />
                        </div>
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
