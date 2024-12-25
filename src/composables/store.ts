import type { App } from 'vue'
import type { ClipState } from '../types.ts'
import { createPinia, defineStore } from 'pinia'

const store = createPinia()

export function setupStore(app: App<Element>) {
  app.use(store)
}

export const useLetterControlStore = defineStore('letter-control', () => {
  const letterControl = ref<ClipState[]>([])

  function init(mainText: string) {
    if (!mainText)
      return
    letterControl.value = Array.from({ length: mainText.length }, (_, i) => ({ content: mainText[i], show: false, selected: false }))
    letterControl.value[0].show = true
  }

  function letterClick(i: number) {
    letterControl.value.forEach((letter: ClipState, index: number) => {
      if (i !== index)
        letter.show = false
    })

    letterControl.value[i].show = !letterControl.value[i].show
  }

  function clipClick(i: number, isSelected: boolean) {
    letterControl.value[i].selected = isSelected
  }

  function selectFn<T extends (...args: any[]) => any>(
    fn: T,
    i: number,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    if (letterControl.value.length > 0 && letterControl.value[i].selected) {
      return fn(...args)
    }

    return undefined
  }

  return { letterControl, init, letterClick, clipClick, selectFn }
})
