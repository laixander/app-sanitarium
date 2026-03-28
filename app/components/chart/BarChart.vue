<template>
    <Bar :data="computedChartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps<{
    data?: number[]
    labels?: string[]
    color?: string | string[]
    label?: string
}>()

const computedChartData = computed(() => ({
    labels: props.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: props.label || 'Data',
            backgroundColor: props.color || '#3b82f6',
            data: props.data || [40, 39, 10, 40, 39, 80, 40],
            borderRadius: 4
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
