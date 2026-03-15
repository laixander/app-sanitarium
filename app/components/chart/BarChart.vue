<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
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

const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Staff Count',
            backgroundColor: '#3b82f6',
            data: [40, 39, 10, 40, 39, 80, 40],
            borderRadius: 4
        }
    ]
}

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
