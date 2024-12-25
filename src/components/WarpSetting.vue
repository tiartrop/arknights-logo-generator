<script setup lang="ts">
const transparent = defineModel<boolean>('transparent')
const sizeOrigin = defineModel<boolean>('sizeOrigin')
const wide = defineModel<string>('wide')
const fit = defineModel<string>('fit')
</script>

<template>
  <div class="group">
    <div class="head">
      变形设置
    </div>
    <div class="body">
      <div pb-4>
        <label inline-flex items-center>
          <span cursor-pointer pr-2>原始尺寸</span>
          <input v-model="sizeOrigin" class="checkbox" type="checkbox">
        </label>
      </div>
      <div class="radio pb-4">
        <span pr-2>画布比例</span>
        <label v-for="(w, i) of ['21:9', '16:9', '3:2', '4:3', '1:1']" :key="i" :disabled="sizeOrigin" :data-text="w" :data-checked="wide === w">
          <input v-model="wide" type="radio" :value="w" :disabled="sizeOrigin">
        </label>
      </div>
      <div class="radio">
        <span pr-2>画布拉伸</span>
        <label v-for="(val, key, i) of { cover: '填充', contain: '适应', fill: '拉伸' }" :key="i" :disabled="sizeOrigin || transparent" :data-text="val" :data-checked="fit === key">
          <input v-model="fit" type="radio" :value="key" :disabled="sizeOrigin || transparent">
        </label>
      </div>
    </div>
  </div>
</template>
