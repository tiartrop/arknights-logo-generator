<script setup lang="ts">
import type { State } from './types'
import Header from './components/Header.vue'
import Image from './components/Image.vue'
import Sidebar from './components/Sidebar.vue'

const mainRef = useTemplateRef('main')
const sidebarRef = useTemplateRef('sidebar')

const drawImage = (config: State) => mainRef.value.drawImage(config)
const input = () => mainRef.value.input()
const output = () => mainRef.value.output()
const reset = () => sidebarRef.value.reset()
</script>

<template>
  <div bg-base color-base min-h-vh relative>
    <Header h-15 mb-9 max-sm="h-12" />
    <div lg="flex" style="min-height: calc(100vh - 6rem)">
      <div
        id="container"
        m-auto my-0 relative
        max-lg="mx-5 mb-5 sticky top-0 z-2"
        xxl="ml-[calc((100%-1600px)/2)]"
      >
        <Image ref="main" />
      </div>
      <Sidebar
        ref="sidebar"
        lg="flex-none w-90 relative"
        xxl="w-[calc((100%-1600px)/2+22.5rem)]"
        @draw-image="drawImage"
        @reset="reset"
        @input="input"
        @output="output"
      />
    </div>
  </div>
</template>
