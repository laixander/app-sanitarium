<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const route = useRoute()
const { counters } = useCounters()
const { users, updateUser } = useUsers()

const counter = computed(() => counters.value.find(c => c.id === route.params.id))
const agentRecord = computed(() =>
    users.value.find(u => u.role === 'Agent' && u.counter === counter.value?.name) ?? null
)

const handleLogout = () => {
    if (agentRecord.value) {
        updateUser(agentRecord.value.id, {
            agentStatus: 'Offline',
            ticket: '-'
        })
    }
    navigateTo('/login')
}

const items = computed(() => [
    [
        {
            label: 'Profile',
            icon: 'i-lucide-user'
        },
        {
            label: isDark.value ? 'Light mode' : 'Dark mode',
            icon: isDark.value ? 'i-lucide-sun' : 'i-lucide-moon',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = isDark.value ? 'light' : 'dark'
            }
        } as any,
    ],
    [
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            color: 'error',
            onSelect: handleLogout
        }
    ]
])

const user = computed(() => ({
    name: agentRecord.value?.name ?? 'Unknown Agent',
    description: agentRecord.value?.role ?? 'Agent',
    avatar: {
        src: agentRecord.value ? `https://i.pravatar.cc/128?u=${agentRecord.value.id}` : 'img/avatar.png',
        alt: agentRecord.value?.name,
        class: 'bg-primary/10 text-primary font-bold',
        loading: 'lazy',
    } as any
}))

const userUiConfig = {
    name: 'hidden md:block',
    description: 'hidden md:block'
}
</script>
<template>
    <UDropdownMenu v-slot="open" :items="items" :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 4
    }">
        <UUser :name="user.name" :description="user.description" :avatar="user.avatar" :class="[open]"
            :ui="userUiConfig" />
    </UDropdownMenu>
</template>