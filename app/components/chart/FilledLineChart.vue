<template>
    <Line :data="computedChartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const props = defineProps<{
    data?: number[]
    labels?: string[]
    color?: string
    backgroundColor?: string
    label?: string
    datasets?: any[]
}>()

const computedChartData = computed(() => ({
    labels: props.labels || ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: props.datasets || [
        {
            label: props.label || 'Data',
            backgroundColor: props.backgroundColor || 'rgba(168, 85, 247, 0.2)',
            borderColor: props.color || '#a855f7',
            data: props.data || [40, 39, 10, 40, 39, 80, 40],
            tension: 0.4,
            fill: true
        }
    ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            display: false
        },
        y: {
            display: false
        }
    }
}
</script>
