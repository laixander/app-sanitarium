<script setup lang="ts">
definePageMeta({
    layout: false,
    title: 'Queue Display'
})

const { tickets } = useTickets()
const { transactions } = useTransactions()

const getTransactionMetadata = (name?: string) => {
    if (!name) return null
    return transactions.value.find(t => t.name === name)
}

const servingTickets = computed(() => {
    return tickets.value
        .filter(t => t.status === 'serving')
        .sort((a, b) => {
            const timeA = a.servedAt ? new Date(a.servedAt).getTime() : 0
            const timeB = b.servedAt ? new Date(b.servedAt).getTime() : 0
            return timeB - timeA // Newest first
        })
})

const waitingTickets = computed(() => {
    return tickets.value
        .filter(t => t.status === 'waiting')
        .sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return timeA - timeB // Oldest first
        })
})

const currentTime = ref(new Date())
let timer: any

onMounted(() => {
    timer = setInterval(() => {
        currentTime.value = new Date()
    }, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
})

const formattedDate = computed(() => {
    return currentTime.value.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    })
})

const getDisplayTickets = (transactionName: string) => {
    const filtered = waitingTickets.value.filter(t => t.transactionType === transactionName)
    return filtered.slice(0, 10)
}

const hasMoreThanLimit = (transactionName: string) => {
    return waitingTickets.value.filter(t => t.transactionType === transactionName).length > 10
}
</script>

<template>
    <div class="min-h-screen flex flex-col font-sans overflow-hidden">
        <!-- Header -->
        <header class="border-b border-default px-8 py-6 flex items-center justify-between z-10 shrink-0">
            <AppLogo class="scale-130 ml-6" />
            <div class="text-right">
                <div class="text-xl font-bold tracking-tight">{{ formattedTime }}</div>
                <div class="text-sm font-medium text-primary">{{ formattedDate }}</div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 flex overflow-hidden">
            <!-- Now Serving -->
            <section class="flex-1 p-8 flex flex-col bg-muted">
                <div class="flex items-center gap-3 mb-8 shrink-0">
                    <div class="size-3 rounded-full bg-green-500 animate-pulse" />
                    <h2 class="text-3xl font-extrabold tracking-tight uppercase">Now Serving</h2>
                </div>

                <div class="flex-1 pr-4">
                    <div v-if="servingTickets.length === 0"
                        class="h-full flex flex-col items-center justify-center text-muted">
                        <UIcon name="i-lucide-monitor-pause" class="size-24 mb-4 opacity-50" />
                        <p class="text-2xl font-medium">No counters currently serving</p>
                    </div>

                    <TransitionGroup name="list" tag="div" class="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
                        <UCard v-for="ticket in servingTickets" :key="ticket.id"
                            :ui="{ body: 'flex justify-between items-center p-6 sm:p-8' }"
                            class="rounded-3xl shadow-sm transform transition-all duration-500 hover:scale-[1.02]">
                            <p class="text-7xl font-black tracking-tighter">
                                {{ ticket.ticket }}
                            </p>
                            <div class="flex flex-col gap-2 relative z-10 w-full">
                                <p
                                    class="text-lg text-muted font-bold uppercase tracking-wider flex items-center justify-end gap-2">
                                    <UIcon name="i-lucide-monitor" class="size-6" />
                                    {{ ticket.counter || 'Counter' }}
                                </p>
                                <div class="flex flex-col gap-3 items-end relative z-10 shrink-0">
                                    <!-- <UBadge v-if="ticket.isPriority" label="Priority" color="amber"
                                        icon="i-lucide-heart"
                                        class="rounded-full uppercase text-sm font-semibold tracking-wider px-4 py-2"
                                        :ui="{ leadingIcon: 'size-4' }" /> -->
                                    <UBadge :label="ticket.transactionType || 'Transaction'"
                                        :color="getTransactionMetadata(ticket.transactionType)?.color || 'primary'"
                                        :icon="getTransactionMetadata(ticket.transactionType)?.icon || 'i-lucide-activity'"
                                        class="rounded-full uppercase text-sm font-semibold tracking-wider px-4 py-2"
                                        :ui="{ leadingIcon: 'size-4' }" />
                                </div>
                            </div>
                        </UCard>
                    </TransitionGroup>
                </div>
            </section>

            <!-- Waiting / Next in Line -->
            <aside class="w-[450px] border-l border-default flex flex-col z-10 shadow-sm shrink-0">
                <div class="p-8 border-b border-default backdrop-blur shrink-0">
                    <h2 class="text-2xl font-extrabold flex items-center gap-3 tracking-tight uppercase">
                        <!-- <UIcon name="i-lucide-user" class="size-6 text-primary" /> -->
                        Next in line
                        <span
                            class="ml-auto bg-primary/10 text-primary py-0.5 px-3 rounded-full text-base font-semibold">
                            {{ waitingTickets.length }}
                        </span>
                    </h2>
                </div>

                <div class="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <div v-if="waitingTickets.length === 0"
                        class="absolute inset-0 flex items-center justify-center text-muted">
                        <p class="text-lg font-medium">Queue is empty</p>
                    </div>

                    <div class="grid grid-cols-4 gap-4 h-full">
                        <div v-for="transaction in transactions" :key="transaction.id"
                            class="flex-1 overflow-y-auto custom-scrollbar-mini flex flex-col gap-4 py-1 min-w-0">
                            <TransitionGroup name="fade" tag="div" class="flex flex-col gap-4 relative">
                                <div v-for="(ticket, index) in getDisplayTickets(transaction.name)" :key="ticket.id">
                                    <span v-if="index === 9 && hasMoreThanLimit(transaction.name)"
                                        class="font-bold text-lg text-muted italic block">
                                        ...more
                                    </span>
                                    <span v-else :class="ticket.isPriority ? 'text-amber-600 dark:text-amber-400' : ''"
                                        class="font-extrabold text-2xl block">
                                        {{ ticket.ticket }}
                                    </span>
                                </div>
                            </TransitionGroup>
                        </div>
                    </div>

                    <!-- <TransitionGroup name="fade" tag="div" class="flex flex-col gap-4 relative">
                        <UCard v-for="(ticket, index) in waitingTickets" :key="ticket.id" class="rounded-2xl" :ui="{
                            body: 'flex items-center justify-between'
                        }" :class="[
                            index === 0
                                ? 'bg-primary/5 ring-3 ring-primary/20 dark:ring-primary/30 shadow-sm'
                                : 'bg-gray-50 dark:bg-gray-800/50 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors'
                        ]">
                            <div class="flex items-center gap-5 overflow-hidden">
                                <div class="size-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                                    :class="index === 0 ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'">
                                    {{ index + 1 }}
                                </div>
                                <div class="flex items-center min-w-0 gap-1.5">
                                    <span class="text-2xl font-extrabold tracking-tight truncate">{{
                                        ticket.ticket }}</span>
                                    <UBadge :label="ticket.transactionType" variant="soft"
                                        :color="getTransactionMetadata(ticket.transactionType)?.color || 'primary'"
                                        class="rounded-full uppercase font-bold tracking-wider px-3 py-1.5 w-fit" />
                                    <UBadge v-if="ticket.isPriority" label="Priority" variant="soft" color="amber"
                                        class="rounded-full uppercase font-bold tracking-wider px-3 py-1.5 w-fit" />
                                </div>
                            </div>
                            <UIcon v-if="ticket.isPriority" name="i-lucide-heart" class="size-6 text-amber shrink-0" />
                        </UCard>
                    </TransitionGroup> -->
                </div>
            </aside>
        </main>
    </div>
</template>

<style scoped>
/* List transitions - for Now Serving grid */
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
}

.list-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}

/* List transitions - for waiting list */
.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-leave-active {
    position: absolute;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 20px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.4);
}
</style>