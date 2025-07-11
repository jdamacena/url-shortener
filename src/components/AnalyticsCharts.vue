<template>
  <div>
    <div v-if="!analytics || !analytics.accessLogs || analytics.accessLogs.length === 0" class="text-gray-500 text-center py-8">
      No analytics data to display.
    </div>
    <div v-else>
      <div class="mb-8">
        <h4 class="font-bold mb-2">Clicks Over Time</h4>
        <Line :data="clicksChartData" :options="chartOptions" height="120" />
      </div>
      <div class="mb-8">
        <h4 class="font-bold mb-2">Referrers</h4>
        <Bar :data="referrersChartData" :options="chartOptions" height="120" />
      </div>
      <div class="mb-8">
        <h4 class="font-bold mb-2">User Agents</h4>
        <Doughnut :data="userAgentsChartData" :options="chartOptions" height="120" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'

Chart.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, Filler)

const props = defineProps({
  analytics: Object
})

const { analytics } = toRefs(props)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false }, beginAtZero: true }
  }
}

const clicksChartData = computed(() => {
  if (!analytics.value || !analytics.value.accessLogs) return { labels: [], datasets: [] }
  // Group by day
  const dayCounts = {}
  analytics.value.accessLogs.forEach(log => {
    const day = new Date(log.date).toLocaleDateString()
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })
  return {
    labels: Object.keys(dayCounts),
    datasets: [
      {
        label: 'Clicks',
        data: Object.values(dayCounts),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const referrersChartData = computed(() => {
  if (!analytics.value || !analytics.value.accessLogs) return { labels: [], datasets: [] }
  const refCounts = {}
  analytics.value.accessLogs.forEach(log => {
    const ref = log.referer || 'Direct/None'
    refCounts[ref] = (refCounts[ref] || 0) + 1
  })
  return {
    labels: Object.keys(refCounts),
    datasets: [
      {
        label: 'Referrers',
        data: Object.values(refCounts),
        backgroundColor: ['#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a78bfa', '#fbbf24', '#6ee7b7', '#f87171']
      }
    ]
  }
})

const userAgentsChartData = computed(() => {
  if (!analytics.value || !analytics.value.accessLogs) return { labels: [], datasets: [] }
  const agentCounts = {}
  analytics.value.accessLogs.forEach(log => {
    let agent = log.userAgent || 'Unknown'
    if (agent.includes('Chrome')) agent = 'Chrome'
    else if (agent.includes('Firefox')) agent = 'Firefox'
    else if (agent.includes('Safari')) agent = 'Safari'
    else if (agent.includes('Edge')) agent = 'Edge'
    else if (agent.includes('Opera')) agent = 'Opera'
    agentCounts[agent] = (agentCounts[agent] || 0) + 1
  })
  return {
    labels: Object.keys(agentCounts),
    datasets: [
      {
        label: 'User Agents',
        data: Object.values(agentCounts),
        backgroundColor: ['#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a78bfa', '#fbbf24', '#6ee7b7', '#f87171']
      }
    ]
  }
})
</script>
