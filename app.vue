<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NuxtRouteAnnouncer />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-bar {
  position: absolute;
  bottom: 0;
  width: 7%;
  background: linear-gradient(to top, #0ea5e9, #38bdf8);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease;
}

.notification-badge {
  top: -5px;
  right: -5px;
}
</style>

<script setup>
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]')
    if (target) {
      const targetId = target.getAttribute('href')
      const element = document.querySelector(targetId)

      if (element) {
        e.preventDefault()
        const yOffset = -80
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  })
})
</script>
