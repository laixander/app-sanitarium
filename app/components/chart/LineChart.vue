<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            data: [40, 39, 10, 40, 39, 80, 40],
            tension: 0.4
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