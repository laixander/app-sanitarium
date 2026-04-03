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
                            A comprehensive, step-by-step reference describing what each role does within the SSGH Queue Management System.
                        </p>
                    </div>

                    <!-- Administrator -->
                    <DocsSection id="administrator" title="Administrator" icon="i-lucide-shield-check">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            As an Administrator, your goal is to manage the system's infrastructure, handle personnel, and monitor analytics. Below is the step-by-step guide for setting up and managing the platform.
                        </p>
                        
                        <div class="space-y-6">
                            <DocsTimeline 
                                :items="[
                                    { title: 'System Setup & Roles', description: 'Start by visiting the Admin Console. Create necessary system Roles with varied permission sets to fit your organizational structure.', status: 'Step 1' },
                                    { title: 'Configure Counters & Transactions', description: 'Go to Queue Settings to declare service Counters (e.g., Counter 01). Map these to specific Transactions (e.g., Admission, Consultation) with unique ticket prefix codes.', status: 'Step 2' },
                                    { title: 'Design Kiosk Flow', description: 'Use the Kiosk Builder to design the self-service flow. Add multilingual support, modify UI grids, and upload idle screen media for when the lobby is quiet.', status: 'Step 3' },
                                    { title: 'Add Agents', description: 'Navigate to User Management to invite staff members. Assign them an Agent role and map them to their designated counter.', status: 'Step 4' },
                                    { title: 'Monitor & Audit', description: 'Regularly monitor the Live Queue layout and check System Audits for transparency. Review generated feedback reports to ensure service quality.', status: 'Step 5' }
                                ]" 
                            />
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Agent -->
                    <DocsSection id="agent" title="Agent" icon="i-lucide-user-cog">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            As an Agent, you are at the front lines managing the active queue and assisting patients. Here is your step-by-step operational workflow.
                        </p>

                        <div class="space-y-6">
                            <DocsTimeline 
                                :items="[
                                    { title: 'Sign In & Dashboard', description: 'Log into the application and open your Counter Dashboard. You will see a Kanban view of all Waiting, Serving, and Completed/Held tickets assigned to your counter.', status: 'Step 1' },
                                    { title: 'Call Next Patient', description: 'Click the Call Next button on your dashboard. The system will automatically broadcast your counter number and the ticket code on the public Lobby Display.', status: 'Step 2' },
                                    { title: 'Serve Patient', description: 'Once the patient arrives at your counter, the ticket transitions to the Serving state. The system will begin tracking your accumulated service time against hospital SLAs.', status: 'Step 3' },
                                    { title: 'Hold or Skip (If Needed)', description: 'If the patient is missing or lacks required files, you can pause or skip the ticket. You will be prompted to select a predefined or custom reason for this action.', status: 'Step 4' },
                                    { title: 'Complete Transaction', description: 'After successfully serving the patient, click Complete. This finalizes the ticket, updates your CounterStats, and clears you to call the next person.', status: 'Step 5' }
                                ]" 
                            />
                        </div>
                    </DocsSection>

                    <USeparator />

                    <!-- Patient / Visitor -->
                    <DocsSection id="patient" title="Patient / Visitor" icon="i-lucide-heart-handshake">
                        <p class="text-lg text-dimmed leading-relaxed mb-6">
                            For visitors, the experience is designed to be frictionless and intuitive. Here is the patient journey step-by-step.
                        </p>

                        <div class="space-y-6">
                            <DocsTimeline 
                                :items="[
                                    { title: 'Arrival & Kiosk', description: 'Upon arrival, proceed to the self-service Kiosk terminal. Select your preferred language and choose the specific transaction you need (e.g., Billing or Consultation).', status: 'Step 1' },
                                    { title: 'Ticket Generation', description: 'The kiosk will generate a queue ticket containing your number and a QR code. Alternatively, you can scan the QR code to track your status on your mobile device.', status: 'Step 2' },
                                    { title: 'Wait for Announcement', description: 'Find a seat in the waiting lobby and watch the main TV displays. Pay attention to the visual queues and automated text-to-speech audio announcements.', status: 'Step 3' },
                                    { title: 'Proceed to Counter', description: 'When your ticket number is called on the screen along with the designated counter number, walk over to that counter for service.', status: 'Step 4' },
                                    { title: 'Provide Feedback', description: 'After your transaction is completed, use the post-service tablet at the counter to rate your experience and provide optional comments.', status: 'Step 5' }
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
