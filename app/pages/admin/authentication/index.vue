<script setup lang="ts">
definePageMeta({
    title: 'Authentication & Roles',
    showUserToolbar: true,
})

const state = reactive<{ [key: string]: boolean }>({
    twoFactorAuth: true,
    sessionTimeout: true,
    passwordComplexity: false,
    loginLockout: true,
})

const fields = [
    {
        name: 'twoFactorAuth',
        label: 'Two-Factor Authentication',
        description: 'Require 2FA for all admin accounts',
        type: 'boolean'
    },
    {
        name: 'sessionTimeout',
        label: 'Session Timeout',
        description: 'Auto-logout after 30 minutes of inactivity',
        type: 'boolean'
    },
    {
        name: 'passwordComplexity',
        label: 'Password Complexity',
        description: 'Require minimum 8 chars with special characters',
        type: 'boolean'
    },
    {
        name: 'loginLockout',
        label: 'Login Attempt Lockout',
        description: 'Lock account after 5 failed login attempts',
        type: 'boolean'
    }
]

const appToast = useAppToast()

async function onChange() {
    appToast.updated('Security', 'Security settings have been updated successfully.')
}
</script>
<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Security Settings" description="Manage security settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <UFormField v-for="field in fields" :key="field.name" :name="field.name" :label="field.label"
                    :description="field.description" class="flex items-center justify-between p-4 sm:p-6 gap-2">
                    <USwitch v-model="state[field.name]" @update:model-value="onChange" />
                </UFormField>
            </UCard>
        </div>
    </div>
</template>