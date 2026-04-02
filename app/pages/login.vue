<template>
    <div class="fixed inset-0 flex justify-center items-center bg-elevated/50">
        <UPageCard class="w-full max-w-sm shadow-sm">
            <UAuthForm :key="formKey" title="Login" description="Enter your credentials to access your account."
                :fields="fields" :state="state" @submit="onSubmit" :submit="{
                    size: 'lg'
                }" :ui="{
            description: 'text-sm'
        }">
                <template #leading>
                    <UButton icon="i-lucide-hospital" color="primary" variant="soft" :ui="ui" square disabled
                        class="rounded-none squircle w-fit" />
                </template>
                <template #footer>
                    Unable to login? Contact your administrator.
                </template>
            </UAuthForm>
        </UPageCard>

        <!-- Mock Login FAB -->
        <div class="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
            <Transition name="fab-menu">
                <div v-if="fabOpen" class="flex flex-col items-end gap-2 mb-2">
                    <UButton v-for="item in mockRoles" :key="item.role" :icon="item.icon" :label="item.label" size="lg"
                        :color="item.color" variant="soft" class="shadow-lg" @click="mockLogin(item)" />
                </div>
            </Transition>
            <UButton icon="i-lucide-flask-conical" size="xl" color="primary"
                class="rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95 ring-4 ring-primary-500/20"
                :class="{ 'rotate-45': fabOpen }" @click="fabOpen = !fabOpen" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { AuthFormField } from '@nuxt/ui'

const { users, updateUser } = useUsers()
const { counters } = useCounters()

const state = reactive({
    email: '',
    password: ''
})

const routeToRedirect = ref('')
const formKey = ref(0)

const fields = ref<AuthFormField[]>([
    {
        name: 'email',
        type: 'text',
        label: 'Email',
        variant: 'soft',
        size: 'lg'
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        variant: 'soft',
        size: 'lg'
    }
])

const ui = {
    base: 'p-5 disabled:cursor-default aria-disabled:cursor-default disabled:opacity-100 aria-disabled:opacity-100',
    leadingIcon: 'size-8'
}

// Mock Login FAB
const fabOpen = ref(false)

interface MockRole {
    role: string
    label: string
    icon: string
    color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'neutral'
    route: string
    email?: string
}

const mockRoles = computed(() => {
    const base: MockRole[] = [
        {
            role: 'admin',
            label: 'Admin',
            icon: 'i-lucide-shield',
            color: 'error',
            route: '/admin'
        },
        {
            role: 'manager',
            label: 'Manager',
            icon: 'i-lucide-briefcase',
            color: 'warning',
            route: '/agent'
        }
    ]

    // Add dynamic agents
    const agents = users.value
        .filter(u => u.role === 'Agent')
        .map(agent => {
            const counter = counters.value.find(c => c.name === agent.counter)
            return {
                role: 'agent',
                label: `Agent ${agent.name}`,
                icon: 'i-lucide-headset',
                color: 'success' as const,
                route: counter ? `/counter/${counter.id}` : '/counter/unassigned',
                email: agent.email
            }
        })

    return [...base, ...agents]
})

function mockLogin(item: MockRole) {
    fabOpen.value = false

    const email = item.email || `${item.role}@sanitarium.com`
    const password = 'password123'

    state.email = email
    state.password = password

    // Attempt prefill by setting field values internally depending on UAuthForm implementation
    const emailField = fields.value[0] as any
    const passwordField = fields.value[1] as any
    if (emailField) {
        emailField.value = email
        emailField.defaultValue = email
    }
    if (passwordField) {
        passwordField.value = password
        passwordField.defaultValue = password
    }

    routeToRedirect.value = item.route
    
    // Set agent status to Online on login
    const user = users.value.find(u => u.email === email)
    if (user && user.role === 'Agent') {
        updateUser(user.id, { agentStatus: 'Online' })
    }

    formKey.value++
}

function onSubmit() {
    let route = routeToRedirect.value
    const user = users.value.find(u => u.email.toLowerCase() === state.email.toLowerCase())

    if (!route) {
        if (user) {
            if (user.role === 'Agent') {
                const counter = counters.value.find(c => c.name === user.counter)
                route = counter ? `/counter/${counter.id}` : '/counter/unassigned'
            } else if (user.role === 'Admin') {
                route = '/admin'
            } else if (user.role === 'Manager') {
                route = '/agent'
            }
        } else {
            // Fallback for manual login without a found user
            if (state.email.includes('agent')) route = '/counter/unassigned'
            else route = '/admin'
        }
    }

    // Set agent status to Online on login if role is agent
    if (user && user.role === 'Agent') {
        updateUser(user.id, { agentStatus: 'Online' })
    }

    navigateTo(route)
}
</script>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
    transition: all 0.25s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.9);
}
</style>