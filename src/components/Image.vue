<script setup lang="ts">
import type { State } from '../types.js'
import arknights from '../assets/image/arknights.png'

const el = ref<HTMLImageElement>()

const transparent = toRef(storage.value, 'transparentBg')
const mimeType = toRef(storage.value, 'mimeType')

let bgUrl = arknights

function drawImage(config: State) {
  loadImg(bgUrl).then((img: HTMLImageElement) => {
    draw(img, config)
  })
}

function readFileToURL(file: File, onOver: (src: string) => void) {
  const reader = new FileReader()
  reader.onload = () => {
    const src = reader.result as string
    onOver(src)
  }

  reader.onerror = (error) => {
    console.error('文件读取错误', error)
  }

  reader.readAsDataURL(file)
}

function readFileAndSetImgSrc(file: File) {
  readFileToURL(file, (src) => {
    bgUrl = src
    transparent.value = false
    drawImage({ ...storage.value })
  })
}

function chooseFile(callback: (file: File) => void) {
  chooseFile.form.reset()

  chooseFile.input.onchange = function (this: HTMLInputElement) {
    if (!this.files || this.files.length === 0)
      return
    callback(this.files[0])
  }

  chooseFile.input.click()
}

chooseFile.form = document.createElement('form')
chooseFile.input = document.createElement('input')
chooseFile.input.type = 'file'
chooseFile.form.appendChild(chooseFile.input)

const isImageRegex = /^image\/(?:jpeg|gif|png|bmp|webp)$/

document.addEventListener('paste', (e) => {
  const clipboardData = e.clipboardData
  if (clipboardData.items[0]) {
    const file = clipboardData.items[0].getAsFile()

    if (file && isImageRegex.test(file.type)) {
      return readFileAndSetImgSrc(file)
    }
  }

  if (clipboardData.files.length) {
    for (let i = 0; i < clipboardData.files.length; i++) {
      if (isImageRegex.test(clipboardData.files[i].type)) {
        readFileAndSetImgSrc(clipboardData.files[i])
      }
    }
  }
})

document.addEventListener('drop', (e) => {
  e.preventDefault()

  const file = e.dataTransfer.files[0]

  if (file && file.type.match(isImageRegex)) {
    readFileAndSetImgSrc(file)
  }
})

document.addEventListener('dragover', (e) => {
  e.preventDefault()
})

function input() {
  chooseFile(readFileAndSetImgSrc)
}

function output() {
  const a = document.createElement('a')
  document.body.appendChild(a)
  const url = el.value.src
  a.href = url
  a.download = `arknights-logo-generator-${+Date.now()}.${mimeType.value}`
  a.click()
  document.body.removeChild(a)
}

onMounted(() => {
  drawImage({ ...storage.value })
})

defineExpose({ drawImage, input, output })
</script>

<template>
  <img ref="el" max-lg="!h-auto" max-xl="max-w-full" class="max-w-[945px] b border-base bg-[#9ca3af33] object-contain">
  <!-- <div id="loading" class="absolute w-full h-full top--9 left-0 backdrop-blur-sm bg-slate-400/5 z-3 hidden" /> -->
  <div hidden lg="block absolute bottom-7 left-50% translate-x--50% " text-base>
    💡&nbsp;
    <span class="text-#158fc5 hover:op-85 hover:cursor-pointer" @click="input">「打开图像」</span>
    <span op-65>即可更换背景，支持拖拽及粘贴图片</span>
  </div>
</template>>
