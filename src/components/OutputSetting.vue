<script setup lang="ts">
const transparent = defineModel<boolean>('transparent')
const mimeType = defineModel<string>('mimeType')
const quality = defineModel<number>('quality')
const isSupportWebp = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0

watch(transparent, (t) => {
  if (t)
    mimeType.value = 'png'
})
</script>

<template>
  <div class="group">
    <div class="head">
      导出设置
    </div>
    <div class="body">
      <div class="radio">
        <span pr-2>图片格式</span>
        <label data-text="png" :data-checked="mimeType === 'png'">
          <input v-model="mimeType" type="radio" value="png">
        </label>
        <label data-text="jpg" :data-checked="mimeType === 'jpg'" :disabled="transparent">
          <input v-model="mimeType" type="radio" value="jpg" :disabled="transparent">
        </label>
        <label v-if="isSupportWebp" data-text="webp" :data-checked="mimeType === 'webp'">
          <input v-model="mimeType" type="radio" value="webp">
        </label>
      </div>
      <div v-if="mimeType !== 'png'" class="pt-4">
        <div>
          <span float-left>质量</span>
          <span float-right>{{ quality }}</span>
        </div>
        <input
          v-model.number="quality" type="range" step="0.1" min="0" max="1"
          appearance-none h-20px color-inherit bg-transparent cursor-pointer w-full
        >
      </div>
    </div>
  </div>
</template>
