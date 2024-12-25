import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'icon-btn': 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none',
      'bg-base': 'bg-white dark:bg-truegray-900',
      'color-base': 'text-dark-100 dark:text-truegray-100:80',
      'border-base': 'border-gray/30 dark:border-gray/20',
      'btn-default': 'px-4 py-1.5 b rounded inline-block cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 transition duration-200 ease-in-out',
    },
    [/^input-(.*)$/, ([, c]) => `b rounded border-base focus:border-#158fc5 placeholder-dark/18 dark:placeholder-truegray/20 bg-transparent outline-none w-${c} flex-1`],
    [/^btn-plain-(.*)$/, ([, c]) => `btn-default b border-base border-${c} bg-${c}/10 text-${c} hover:text-white hover:bg-${c}`],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '780px',
      lg: '1024px',
      xl: '1306px',
      xxl: '1600px',
    },
  },
})
