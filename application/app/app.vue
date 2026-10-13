<template>
  <NuxtLayout>
      <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script setup>
const { setLocale } = useI18n()
setLocale(localStorage.getItem('scrcpyplus.locale') || 'en')

useHead({
  htmlAttrs: {
    'data-theme': 'scrcpyplus'
  }
})
</script>