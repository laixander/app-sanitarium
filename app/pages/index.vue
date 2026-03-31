<script setup lang="ts">
const appConfig = useAppConfig()
definePageMeta({
    layout: 'landing'
})
</script>
<template>
    <div class="relative overflow-hidden">
        <!-- Subtle mesh background blobs -->
        <!-- <div class="absolute inset-0 z-[-1] pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[var(--ui-primary)]/20 blur-[100px] md:blur-[150px] opacity-70 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" />
            <div
                class="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[var(--ui-info)]/20 blur-[100px] md:blur-[150px] opacity-70 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" />
            <div
                class="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-violet-500/10 blur-[100px] md:blur-[150px] opacity-70 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" />
        </div> -->
        <UPageHero description="Eliminate wait-time frustration with an intelligent queue platform built for modern healthcare. Real-time tracking, smart routing, and actionable analytics — all in one place."
            :links="[{
                label: 'Launch Patient Kiosk',
                to: '/kiosk',
                target: '_blank',
                trailingIcon: 'i-lucide-arrow-right',
                size: 'xl',
                class: 'py-4 px-8 min-w-full lg:min-w-64 justify-center'
            }, {
                label: 'Request a Demo',
                to: '/login',
                target: '_blank',
                trailingIcon: 'i-lucide-chevron-right',
                size: 'xl',
                color: 'neutral',
                variant: 'subtle',
                class: 'py-4 px-8 min-w-full lg:min-w-64 justify-center'
            }]">
            <template #title>
                Smarter Queues. <span class="bg-linear-to-l from-primary-400 to-primary-500 text-transparent bg-clip-text">Happier
                    Patients.</span>
            </template>
            <template #headline>
                <UBadge icon="i-lucide-box" variant="soft" size="lg" class="rounded-full px-4 py-2 font-mono">
                    {{ appConfig.version }}
                </UBadge>
            </template>
            <template #top>
        <LandingHeroBackground />
      </template>

            <UColorModeImage light="/img/img_light.png" dark="/img/img_dark.png" alt="App screenshot"
                class="rounded-lg shadow-2xl ring ring-default" />
        </UPageHero>

        <UPageSection id="features" title="Comprehensive Queue Management for Healthcare"
            description="Our platform is designed to streamline every step of the patient journey, ensuring efficiency for staff and clarity for patients."
            :features="[{
                icon: 'i-lucide-monitor',
                title: 'Self-Service Kiosks',
                description: 'Intuitive touchscreens for patients to select services and receive immediate queue tickets.'
            }, {
                icon: 'i-lucide-layout-dashboard',
                title: 'Real-Time Monitoring',
                description: 'Live tracking of queue lengths, wait times, and agent performance across all departments.'
            }, {
                icon: 'i-lucide-user-cog',
                title: 'Smart Agent Interface',
                description: 'A powerful dashboard for healthcare staff to call, serve, and manage patients with ease.'
            }, {
                icon: 'i-lucide-tv-2',
                title: 'Counter Displays',
                description: 'High-visibility digital signage to notify patients of their turn with clear audio-visual cues.'
            }, {
                icon: 'i-lucide-message-square-heart',
                title: 'Integrated Feedback',
                description: 'Capturing patient satisfaction instantly to help maintain the highest standards of care.'
            }, {
                icon: 'i-lucide-shield-check',
                title: 'Secure Administration',
                description: 'Advanced role-based access control and detailed audit logs for hospital-grade security.'
            }]" />

        <UPageSection>
            <UPageCTA title="Ready to transform your patient experience?"
                description="Join Sulu Sanitarium in delivering world-class healthcare with our intelligent queue management solution."
                orientation="horizontal" :links="[{
                    label: 'Get Started',
                    to: '/login',
                    trailingIcon: 'i-lucide-arrow-right',
                    color: 'neutral',
                    class: 'py-4 px-8 min-w-full lg:min-w-56 justify-center'
                }, {
                    label: 'View Documentation',
                    to: '/docs',
                    icon: 'i-lucide-book-open',
                    color: 'neutral',
                    variant: 'outline',
                    class: 'py-4 px-8 min-w-full lg:min-w-56 justify-center'
                }]" variant="naked">
                <UColorModeImage light="/img/img_light.png" dark="/img/img_dark.png" alt="App screenshot"
                    class="rounded-lg shadow-2xl ring ring-default" width="100%" />
            </UPageCTA>
            <LazyLandingStarsBackground />
        </UPageSection>
    </div>
</template>