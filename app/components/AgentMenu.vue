<template>
    <UDropdownMenu :items="items" :ui="{
        content: 'w-48'
    }" :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 4
    }">
        <UButton :avatar="{
            src: 'https://github.com/benjamincanac.png',
            size: 'lg'
        }" color="neutral" variant="ghost" />
    </UDropdownMenu>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { counters } = useCounters()
const { users, updateUser } = useUsers()

const counter = computed(() => counters.value.find(c => c.id === route.params.id))
const agentRecord = computed(() =>
    users.value.find(u => u.role === 'Agent' && u.counter === counter.value?.name) ?? null
)

const handleLogout = () => {
    if (agentRecord.value) {
        updateUser(agentRecord.value.id, {
            agentStatus: 'Offline'
        })
    }
    router.push('/counter')
}

const items = computed(() => [
    [
        {
            label: 'Profile',
            icon: 'i-lucide-user'
        },
        {
            label: 'Settings',
            icon: 'i-lucide-settings'
        }
    ],
    [
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: handleLogout
        }
    ]
])
</script>