<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  datos: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => ({
  labels: props.datos.map((d) => d.genero),
  datasets: [
    {
      label: 'Cantidad de canciones',
      data: props.datos.map((d) => d.cantidad),
      backgroundColor: '#42A5F5'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Género'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Cantidad'
      },
      beginAtZero: true
    }
  }
}

watch(
  () => props.datos,
  () => {
  },
  { deep: true }
)
</script>

<style scoped>
div {
  position: relative;
  height: 300px; 
}
</style>
