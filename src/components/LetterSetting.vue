<script setup lang="ts">
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  drawImage: []
}>()

const mainText = defineModel<string>('mainText')
const mainTextSpacing = defineModel<number>('mainTextSpacing')
const mainTextOffset = defineModel<number>('mainTextOffset')
const letterOffsetY = defineModel<number[]>('letterOffsetY')
const clipOffset = defineModel<number[]>('clipOffset')
const textShadow = defineModel<boolean>('textShadow')
const textInvert = defineModel<boolean>('textInvert')

const mainFontSize = toRef(storage.value, 'mainFontSize')

const store = useLetterControlStore()
const { letterControl } = storeToRefs(store)
const { init, letterClick, clipClick } = (store)

init(mainText.value)

function onMouseDown(i: number) {
  clipClick(i, true)
  emit('drawImage')
}

function onMouseUp(i: number) {
  clipClick(i, false)
  emit('drawImage')

  const container = document.querySelector('#container')
  if (container.lastElementChild && container.lastElementChild.tagName.toUpperCase() === 'CANVAS') {
    container.removeChild(container.lastChild)
  }
}

watch(() => mainText.value, (t) => {
  init(t)
})

defineExpose({ init })
</script>

<template>
  <div v-if="mainText" class="group  relative">
    <div class="head">
      文字设置
    </div>
    <div class="body" cursor-default>
      <div pb-4>
        <label inline-flex items-center pr-3>
          <input v-model="textShadow" class="checkbox" type="checkbox">
          <span cursor-pointer pl-2>阴影</span>
        </label>
        <label inline-flex items-center>
          <input v-model="textInvert" class="checkbox" type="checkbox">
          <span cursor-pointer pl-2>反色</span>
        </label>
      </div>
      <div pb-1>
        <div>
          <span float-left>间距</span>
          <span float-right>{{ mainTextSpacing }}</span>
        </div>
        <input
          v-model.number="mainTextSpacing" type="range" step="1" :min="Math.floor(mainFontSize * 0.8)" :max="Math.floor(mainFontSize * 1.8)"
          appearance-none h-20px color-inherit bg-transparent cursor-pointer w-full
        >
      </div>
      <div pb-1>
        <div>
          <span float-left>位置</span>
          <span float-right>{{ mainTextOffset }}</span>
        </div>
        <input
          v-model.number="mainTextOffset" type="range" step="1" min="-50" max="50"
          appearance-none h-20px color-inherit bg-transparent cursor-pointer w-full
        >
      </div>
      <div of-auto flex flex-col>
        <div flex flex-row justify-center py-5>
          <div
            v-for="(_, i) of letterControl" :key="i" mx-3 :class="letterControl[i].show ? 'main-letter checked' : 'main-letter'"
            @click="letterClick(i)"
          >
            {{ [...letterControl][i].content }}
          </div>
        </div>
        <div v-for="(_, i) of letterControl" :key="i" w-full :class="letterControl[i].show ? 'block' : 'hidden'">
          <div pb-1>
            <div>
              <span float-left>位置 </span>
              <span float-right>{{ letterOffsetY[i] }}</span>
            </div>
            <input
              v-model.number="letterOffsetY[i]" type="range" min="-200" step="1" max="200"
              appearance-none h-20px color-inherit bg-transparent cursor-pointer w-full
            >
          </div>
          <div>
            <div>
              <span float-left>剪裁 </span>
              <span float-right>{{ clipOffset[i] }}</span>
            </div>
            <input
              v-model.number="clipOffset[i]" type="range" min="0" step="1" max="100"
              appearance-none h-20px color-inherit bg-transparent cursor-pointer w-full
              @mousedown="onMouseDown(i)" @mouseup="onMouseUp(i)"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
