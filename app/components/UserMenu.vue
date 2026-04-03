<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const route = useRoute()
const { users } = useUsers()

const currentUser = computed(() => {
    if (route.path.startsWith('/agent')) {
        return users.value.find(u => u.role === 'Manager') ?? users.value.find(u => u.role === 'Agent')
    }
    return users.value.find(u => u.role === 'Admin')
})

const handleLogout = () => {
    navigateTo('/login')
}

const items = ref([
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
    name: currentUser.value?.name ?? 'Peter Parker',
    description: currentUser.value?.role ?? 'Software Engineer',
    avatar: {
        src: currentUser.value ? `https://i.pravatar.cc/128?u=${currentUser.value.id}` : '/img/avatar.png',
        alt: currentUser.value?.name,
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