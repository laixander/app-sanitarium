<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    media?: string
    imageUrl?: string
    videoUrl?: string
}>()

defineEmits(['click'])

// Determine which source to use based on priority: videoUrl > imageUrl > media (upload)
const activeSource = computed(() => {
    return props.videoUrl || props.imageUrl || props.media || '';
});

// Check if the current source is a video
const isVideo = computed(() => {
    const src = activeSource.value;
    if (!src) return false;
    
    // Explicit video URL has highest priority
    if (props.videoUrl && src === props.videoUrl) return true;
    
    // Check if the source is a video data URL or has a video extension
    return src.startsWith('data:video/') || 
           src.match(/\.(mp4|webm|mkv|ogg)$/i) !== null;
});
</script>

<template>
    <div 
        class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden group" 
        @click="$emit('click')"
    >
        <template v-if="activeSource">
            <video 
                v-if="isVideo" 
                :src="activeSource" 
                autoplay loop muted playsinline
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            ></video>
            <img 
                v-else 
                :src="activeSource" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Idle Screen"
            />
        </template>
        
        <!-- Fallback if no media is provided -->
        <div v-else class="text-white text-center flex flex-col items-center">
            <UIcon name="i-lucide-hand" class="w-32 h-32 mb-8 mx-auto animate-bounce opacity-80" />
            <h1 class="text-4xl font-bold tracking-tight opacity-90">Touch anywhere to begin</h1>
        </div>
        
        <!-- Overlay text just to make sure users know it's interactive if there's media -->
        <div 
            v-if="activeSource" 
            class="absolute bottom-16 left-0 right-0 text-center text-white p-6 bg-black/40 backdrop-blur-sm mx-auto w-fit rounded-full border border-white/20 animate-pulse"
        >
            <span class="text-xl font-medium tracking-wider px-4 flex items-center gap-3">
                <UIcon name="i-lucide-touchpad" class="w-6 h-6" /> Touch screen to start
            </span>
        </div>
    </div>
</template>
