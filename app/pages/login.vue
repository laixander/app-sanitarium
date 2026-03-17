<template>
    <div class="fixed inset-0 flex justify-center items-center bg-elevated/50">
        <UPageCard class="w-full max-w-sm shadow-sm">
            <UAuthForm
                title="Login"
                description="Enter your credentials to access your account."
                :fields="fields"
                :submit="{
                    size: 'lg'
                }"
                :ui="{
                    description: 'text-sm'
                }"
            >
                <template #leading>
                    <UButton icon="i-lucide-hospital" color="primary" variant="soft" :ui="ui" square disabled
                        class="rounded-none squircle w-fit" />
                </template>
                <template #footer>
                    Unable to login? Contact your administrator.
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>
<script setup lang="ts">
import type { AuthFormField } from '@nuxt/ui'

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
  },
  {
    name: 'role',
    type: 'select',
    label: 'User Role',
    placeholder: 'Select your role',
    variant: 'soft',
    size: 'lg',
    searchInput: false,
    items: [
      {
        label: 'Admin',
        value: 'admin'
      },
      {
        label: 'Agent',
        value: 'agent'
      },
      {
        label: 'Staff',
        value: 'staff'
      }
    ]
  }
])

const ui = {
    base: 'p-5 disabled:cursor-default aria-disabled:cursor-default disabled:opacity-100 aria-disabled:opacity-100',
    leadingIcon: 'size-8'
}
</script>