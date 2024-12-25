<script setup lang="ts">
import type { State } from '../types.js'
import settings from '../settings.js'
import Footer from './Footer.vue'
import LetterSetting from './LetterSetting.vue'
import OutputSetting from './OutputSetting.vue'
import WarpSetting from './WarpSetting.vue'

const emit = defineEmits<{
  drawImage: [config: State]
  reset: []
  input: []
  output: []
}>()

const mainText = toRef(storage.value, 'mainText')
const subText = toRef(storage.value, 'subText')
const mainTextOffset = toRef(storage.value, 'mainTextOffset')
const mainTextSpacing = toRef(storage.value, 'mainTextSpacing')
const letterOffsetY = toRef(storage.value, 'letterOffsetY')
const clipOffset = toRef(storage.value, 'clipOffset')
const transparent = toRef(storage.value, 'transparentBg')
const textShadow = toRef(storage.value, 'textShadow')
const textInvert = toRef(storage.value, 'textInvert')
const sizeOrigin = toRef(storage.value, 'sizeOrigin')
const wide = toRef(storage.value, 'wide')
const fit = toRef(storage.value, 'fit')
const mimeType = toRef(storage.value, 'mimeType')
const quality = toRef(storage.value, 'quality')

const mySettings = reactive({ mainText, subText, mainTextOffset, mainTextSpacing, letterOffsetY, clipOffset, transparent, textShadow, textInvert, sizeOrigin, wide, fit, mimeType, quality })

const subInputRef = useTemplateRef('subInput')
const letterSettingRef = useTemplateRef('letterSetting')

useEventListener(subInputRef, 'compositionstart', () => subInputRef.value.setAttribute('composing', ''))
useEventListener(subInputRef, 'compositionend', () => subInputRef.value.removeAttribute('composing'))
useEventListener(subInputRef, 'input', () => {
  if (subInputRef.value.hasAttribute('composing'))
    return
  subText.value = subText.value.replace(/[^A-Z0-9\s\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/gi, '').toUpperCase()
})

function reset() {
  const _settings = JSON.parse(JSON.stringify(settings))
  Object.assign(storage.value, _settings)
  letterSettingRef.value.init(mainText.value)
}

function _drawImage() {
  emit('drawImage', { ...storage.value })
}

watch(mySettings, () => {
  _drawImage()
})

defineExpose({ reset })
</script>

<template>
  <div>
    <div
      flex flex-col gap-3 text-sm
      max-lg="px-3 gap-2.5" lg="px-4 of-y-auto absolute top-0 right-0 bottom-0 left-0" xxl="pr-[calc(100%-23.5rem)]"
    >
      <div relative>
        <input v-model="mainText" type="text" placeholder="明日方舟" p="x3 y2" maxlength="4" max-lg="text-lg" text-xl input-full>
        <button v-if="mainText" max-lg="text-lg" text-xl w-10 right-0 top-2 bottom-2 opacity-30 hover:opacity-90 absolute @click="() => mainText = ''">
          <span i-carbon-close block ma />
        </button>
      </div>
      <div relative>
        <input
          ref="subInput" v-model="subText" type="text" placeholder="-    ARKNIGHTS    -" p="x3 y2" maxlength="80" max-lg="text-lg" text-xl input-full
          spellcheck="false" title="只能输入英文字母、数字、符号和空格"
        >
        <button v-if="subText" max-lg="text-lg" text-xl w-10 right-0 top-2 bottom-2 opacity-30 hover:opacity-90 absolute @click="() => subText = ''">
          <span i-carbon-close block ma />
        </button>
      </div>
      <div pt-0.5>
        <label flex items-center>
          <input v-model="transparent" class="toggle" type="checkbox" name="transparent">
          <span for="transparent" cursor-pointer pl-2>透明背景</span>
        </label>
      </div>
      <LetterSetting
        ref="letterSetting"
        v-model:main-text="mainText"
        v-model:main-text-spacing="mainTextSpacing"
        v-model:main-text-offset="mainTextOffset"
        v-model:letter-offset-y="letterOffsetY"
        v-model:clip-offset="clipOffset"
        v-model:text-shadow="textShadow"
        v-model:text-invert="textInvert"
        @draw-image="_drawImage"
      />
      <WarpSetting
        v-model:transparent="transparent"
        v-model:size-origin="sizeOrigin"
        v-model:wide="wide"
        v-model:fit="fit"
      />
      <OutputSetting
        v-model:transparent="transparent"
        v-model:mime-type="mimeType"
        v-model:quality="quality"
      />
      <Footer />
      <div class="btn-box">
        <button class="text-#158fc5" @click="emit('reset')">
          重置
        </button>
        <button class="text-#158fc5" @click="emit('input')">
          打开图像
        </button>
        <button class="bg-#158fc5 text-white" @click="emit('output')">
          导出图像
        </button>
      </div>
    </div>
  </div>
</template>
