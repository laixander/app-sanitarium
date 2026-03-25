<template>
    <div class="min-h-screen bg-muted/30 p-8">
        <main class="container mx-auto px-6">

            <UCard :ui="{ header: 'bg-muted' }" class="rounded-2xl shadow-sm max-w-3xl mx-auto ring-2 ring-green/20">
                <template #header>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <UBadge icon="i-lucide-monitor" color="green" :ui="{ leadingIcon: 'size-8' }" class="p-4 rounded-none squircle" />
                            <div>
                                <div class="font-bold text-2xl">Counter 2</div>
                                <div class="flex items-center gap-1 text-muted">
                                    <!-- <UIcon name="i-lucide-user" class="size-5" /> -->
                                    <span>Juan Cruz</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <div class="flex items-center gap-2">
                                <UChip standalone inset color="green" size="lg" />
                                <UBadge variant="soft" color="green" size="lg">Available</UBadge>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="space-y-8">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-sm font-medium text-muted mr-2">Handling:</span>
                        <UBadge color="sky" variant="outline">Consultation</UBadge>
                        <UBadge color="indigo" variant="outline">Outpatient</UBadge>
                    </div>
                    <div class="min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-8 bg-muted">
                        <div class="text-center space-y-6">
                            <UBadge icon="i-lucide-ticket" color="sky" variant="soft" :ui="{ leadingIcon: 'size-10' }" class="p-6 rounded-full" />
                            <div>
                                <h3 class="text-xl font-bold">Waiting for Next Ticket</h3>
                                <p class="text-muted mt-1">There are 6 people waiting in your queue.</p>
                            </div>
                            <UButton icon="i-lucide-play" label="Call Next Ticket" :ui="{ base: 'gap-3', leadingIcon: 'size-6' }" class="shadow-xl shadow-primary/20 py-4 px-8 text-lg rounded-2xl" />
                        </div>
                    </div>
                    <USeparator />
                    <div>
                        <div class="flex items-center gap-2 text-sm text-muted mb-4">
                            <UIcon name="i-lucide-history" class="size-4" />
                            <div class="font-semibold uppercase tracking-wider text-xs">Recently Completed</div>
                        </div>
                        <div class="space-y-3">
                            <div class="text-center py-6 border border-dashed border-default rounded-xl bg-muted"><p class="text-sm text-dimmed">No tickets served yet today.</p></div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t font-medium">
                        <div class="flex items-center gap-8 text-muted-foreground">
                            <div class="space-y-1">
                                <p class="text-xs uppercase tracking-wider">Served Today</p>
                                <div class="flex items-center gap-2 text-foreground font-bold text-lg">
                                    <UIcon name="i-lucide-circle-check-big" class="h-4 w-4 text-accent" />
                                    16
                                </div>
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs uppercase tracking-wider">Waiting</p>
                                <div class="flex items-center gap-2 text-foreground font-bold text-lg">
                                    <UIcon name="i-lucide-ticket" class="h-4 w-4 text-primary" />
                                    6
                                </div>
                            </div>
                        </div>
                        <button
                            class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 h-10 rounded-md has-[&gt;svg]:px-4 w-full sm:w-auto px-8 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <UIcon name="i-lucide-power-off" class="h-5 w-5 text-destructive" />
                            Go Offline
                        </button>
                    </div>
                </div>
            </UCard>
        </main>
        <div class="container mx-auto px-6 mt-12 text-center">
            <p class="text-xs text-muted-foreground bg-background/50 py-2 inline-block px-4 rounded-full border"><span
                    class="font-medium">System Note:</span> Ticket data is simulated and will reset on page refresh. Use
                this screen to manage patient flow at your assigned counter.</p>
        </div>
    </div>
</template>