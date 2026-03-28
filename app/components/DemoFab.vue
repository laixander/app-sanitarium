<script setup lang="ts">
const { seedAll, resetAll } = useDemoSeeder()
const toast = useAppToast()
const isLoading = ref(false)

const handleSeed = async () => {
    isLoading.value = true
    try {
        // Add a small delay for dramatic effect/perceived realism
        await new Promise(resolve => setTimeout(resolve, 1500))
        seedAll()
        toast.success('System Populated', 'Massive mock data deployed successfully across all modules.')
    } catch (e) {
        toast.error('Error', 'Failed to deploy demo data.')
    } finally {
        isLoading.value = false
    }
}

const handleReset = async () => {
    isLoading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        resetAll()
        toast.success('System Reset', 'All local data has been cleared.')
    } catch (e) {
        toast.error('Error', 'Failed to reset system.')
    } finally {
        isLoading.value = false
    }
}

const items = [
    [
        {
            label: 'Deploy Demo Data',
            icon: 'i-lucide-database-zap',
            onSelect: handleSeed
        }
    ],
    [
        {
            label: 'Reset System',
            icon: 'i-lucide-trash-2',
            class: 'text-red-500',
            onSelect: handleReset
        }
    ]
] as any[][]

// Draggable logic
const position = ref({ x: 24, y: 24 }) // relative to bottom-right initially
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })
const hasMoved = ref(false)

const handleMouseDown = (e: MouseEvent) => {
    isDragging.value = true
    dragStart.value = { x: e.clientX, y: e.clientY }
    initialPosition.value = { ...position.value }
    hasMoved.value = false

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const dx = e.clientX - dragStart.value.x
    const dy = e.clientY - dragStart.value.y

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved.value = true
    }

    position.value = {
        x: initialPosition.value.x - dx,
        y: initialPosition.value.y - dy
    }
}

const handleMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
}
</script>

<template>
    <div class="fixed z-[999] group select-none" :style="{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
        // When relative to bottom-right, we use negative for 'away' from corner if we want it to stay there, 
        // but simpler to use positive bottom/right.
        // Let's refine the initial position.
    }">
        <!-- Main FAB -->
        <UDropdownMenu :items="items" :content="{ align: 'end', side: 'top', sideOffset: 12 }" :ui="{ content: 'w-56' }"
            :prevent-close="hasMoved">
            <UButton square size="xl" variant="solid" color="primary" :loading="isLoading"
                class="rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-primary-500/20 cursor-move"
                :class="{ 'animate-pulse': isLoading }" @mousedown="handleMouseDown"
                @click.capture="hasMoved ? $event.stopPropagation() : null">
                <template #leading>
                    <UIcon v-if="!isLoading" name="i-lucide-database" class="w-6 h-6" />
                </template>
                <span class="sr-only">Demo Tools</span>
            </UButton>

            <template #item="{ item }">
                <div class="flex items-center gap-2 w-full">
                    <UIcon :name="item.icon" class="w-4 h-4" :class="item.class" />
                    <span>{{ item.label }}</span>
                </div>
            </template>
        </UDropdownMenu>

        <!-- Tooltip hint (visible on hover) -->
        <span
            class="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-neutral-800">
            Demo Control Center
        </span>
    </div>
</template>

<style scoped>
.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(var(--color-primary-500), 0.5);
}
</style>
