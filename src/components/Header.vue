<script setup lang="ts">
import DarkSwitcher from './DarkSwitcher.vue'
</script>

<template>
  <header class="bg-base flex items-center border-b border-base">
    <h1 flex-auto text-center font-400 text-xl tracking-wider max-sm="text-base text-left pl-3" max-lg="pl-20">
      明日方舟标题生成器
    </h1>
    <div flex items-center justify-end gap-4 pr-8 w-90 max-lg="pr-3 w-20">
      <a i-carbon-logo-github href="https://github.com/tiartrop/arknights-logo-generator" title="GitHub" target="_blank" />
      <DarkSwitcher />
    </div>
  </header>
</template>
