<script setup lang="ts">
</script>

<template>
    <UApp>
        <UHeader :toggle="{
            class: $route.name === 'index' ? 'hidden' : ''
        }">
            <template #left>
                <NuxtLink to="/">
                    <AppLogo class="w-auto h-6 shrink-0" />
                </NuxtLink>
            </template>

            <template #right>
                <UColorModeButton />
                <!-- for simulation only -->
                <AgentMenu />
            </template>
        </UHeader>

        <UMain>
            <slot />
        </UMain>

        <!-- <USeparator icon="i-simple-icons-nuxtdotjs" /> -->

        <USeparator />

        <UFooter>
            <template #left>
                <p class="text-sm text-muted">
                    Built by Laix • © {{ new Date().getFullYear() }}
                </p>
            </template>

            <template #right>
                <UButton to="https://github.com/laixander" target="_blank" icon="i-simple-icons-github"
                    aria-label="GitHub" color="neutral" variant="ghost" />
            </template>
        </UFooter>
    </UApp>
</template>