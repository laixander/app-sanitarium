<script setup lang="ts">
definePageMeta({
    title: 'SSO Integration'
})

const defaultState = {
    sso: false,
    idpUrl: 'https://idp.ssgh.ph/saml2',
    entityId: 'ssgh-queueflow',
    certificate: '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgI...\n-----END CERTIFICATE-----',
}

const state = ref<{ [key: string]: any }>({ ...defaultState })
const initialState = ref<{ [key: string]: any }>({ ...defaultState })

const samlFields = [
    {
        name: 'idpUrl',
        label: 'Identity Provider URL',
        description: 'The SSO URL from your Identity Provider',
        type: 'text'
    },
    {
        name: 'entityId',
        label: 'Entity ID',
        description: 'Your application\'s globally unique Entity ID',
        type: 'text'
    },
    {
        name: 'certificate',
        label: 'Certificate (PEM)',
        description: 'Public certificate in PEM format',
        type: 'textarea'
    }
]

const ssos = [
    {
        name: 'sso',
        label: 'SAML 2.0',
        description: 'Enterprise SSO via SAML',
        icon: 'i-lucide-globe',
        iconColor: 'blue',
        status: 'Active'
    },
    {
        name: 'sso',
        label: 'OAuth 2.0 / OpenID Connect',
        description: 'Social and enterprise login',
        icon: 'i-lucide-key',
        iconColor: 'orange',
        status: 'Inactive'
    },
    {
        name: 'sso',
        label: 'LDAP / Active Directory',
        description: 'Integrate with hospital AD',
        icon: 'i-lucide-lock',
        iconColor: 'purple',
        status: 'Configuring'
    }
]

const appToast = useAppToast()

async function onChange() {
    // Update initial state to match current state after saving
    initialState.value = { ...state.value }

    // Do something with data
    appToast.updated('Settings', 'SSO settings have been updated successfully.')
}

function resetToDefault() {
    state.value = { ...defaultState }
}

const isUnchanged = computed(() => {
    return JSON.stringify(state.value) === JSON.stringify(initialState.value)
})
</script>
<template>
    <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div class="flex flex-col gap-4">
            <UPageCard title="Single Sign-On (SSO) Configuration" description="Manage SSO settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <AdminSSOList v-for="sso in ssos" :key="sso.name" :name="sso.label" :description="sso.description"
                    :status="sso.status" :icon="sso.icon" :iconColor="(sso.iconColor as any)" />
            </UCard>
        </div>

        <div class="flex flex-col gap-4">
            <UPageCard title="SAML Configuration" description="Configure SAML settings" variant="naked" />
            <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
                <DynamicField v-for="field in samlFields" :key="field.name" :field="field"
                    v-model="state[field.name]" />
            </UCard>
        </div>

        <div class="flex justify-end gap-2">
            <UButton label="Reset to Default" variant="outline" @click="resetToDefault" />
            <UButton :disabled="isUnchanged" label="Save SSO Settings" @click="onChange" />
        </div>
    </div>
</template>