import type { State } from '../types.js'
import settings from '../settings.js'

export const storage = useStorage('logo-state', JSON.parse(JSON.stringify(settings)))

const tempWidth = 1280
const tempHeight = 720
const halfWidth = tempWidth / 2

const zoomCanvas = createTempCanvas(250, 250)
const zoomCtx = zoomCanvas.getContext('2d')
zoomCanvas.style.position = 'absolute'
zoomCanvas.style.top = '0'
zoomCanvas.style.zIndex = '3'
zoomCanvas.style.backgroundColor = 'rgba(0,0,0,.5)'

export async function draw(img: HTMLImageElement, config: State) {
  if (!img || !config)
    return

  const { wide, fit, sizeOrigin, mainText, subText, mainFontSize, subFontSize, mainTextOffset, mainTextSpacing, letterOffsetY, verticalTilt, textShadow, textInvert, transparentBg, clipOffset, mimeType, quality } = config

  let width = 853
  let height = 480
  let scale = width / height
  const { _width, _height } = getDims(wide)

  const imgWidth = img.naturalWidth
  const imgHeight = img.naturalHeight

  if (!sizeOrigin) {
    width = _width
    height = _height
  }
  else {
    width = imgWidth
    height = imgHeight
    if (width > 1920) {
      height = 1920 / width * height
      width = 1920
    }
  }

  const imgEle = document.querySelector('#app img') as HTMLImageElement
  imgEle.style.width = `${_width}px`
  imgEle.style.height = `${_height}px`

  const canvas = document.createElement('canvas')

  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  // draw
  let tempCanvas = createTempCanvas(tempWidth, tempHeight)
  const tempCtx = tempCanvas.getContext('2d')

  const font = ', apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif'
  await laodFonts('Source Han Serif SC Heavy', mainText)
  await laodFonts('Maged LT Regular', subText)

  ctx.clearRect(0, 0, width, height)
  ctx.save()

  const store = useLetterControlStore()
  const { selectFn } = (store)

  // mainText
  tempCtx.font = `${mainFontSize}px Source Han Serif SC Heavy${font}`
  tempCtx.textAlign = 'start'

  const backupData = tempCtx.createImageData(tempWidth, tempHeight)
  const baseImageData = tempCtx.createImageData(tempWidth, tempHeight);

  [...mainText].forEach((t: string, i: number) => {
    const x = (halfWidth - ((mainTextSpacing * (mainText.length - 1) + mainFontSize) * 0.9) / 2) / 0.9 + i * mainTextSpacing
    const y = tempHeight * 0.3 - letterOffsetY.slice(0, mainText.length)[i] - mainTextOffset

    tempCtx.fillStyle = 'white'
    tempCtx.setTransform(0.9, verticalTilt, 0, 1.22, 0, 0)

    const imageData = drawMainText(tempCtx, i, t, x, y, tempWidth, tempHeight)
    blendImageData(baseImageData, imageData)
  })

  tempCtx.putImageData(baseImageData, 0, 0)

  // shadow
  if (textShadow) {
    tempCtx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    tempCtx.shadowOffsetX = -10
    tempCtx.shadowOffsetY = -5
    tempCtx.shadowBlur = 45
  }

  tempCtx.drawImage(tempCanvas, 0, 0)

  function drawMainText(ctx: CanvasRenderingContext2D, i: number, t: string, x: number, y: number, w: number, h: number) {
    ctx.putImageData(backupData, 0, 0)
    ctx.fillText(t, x, y)

    const imageData = ctx.getImageData(0, 0, tempWidth, tempHeight)
    const data = imageData.data

    let rightmostX = 0
    let bottommostY = 0

    for (let y = 0; y < tempHeight; y++) {
      for (let x = 0; x < tempWidth; x++) {
        const index = (y * tempWidth + x) * 4
        const alpha = data[index + 3]

        if (alpha > 0) {
          rightmostX = Math.max(rightmostX, x)
          bottommostY = Math.max(bottommostY, y)
        }
      }
    }

    drawTriangle(ctx, i, rightmostX, bottommostY)
    selectFn(zoom, i, ctx, rightmostX, bottommostY)
    // selectFn(drawLine, i, ctx, i, rightmostX, bottommostY)
    // drawLine(ctx, i, rightmostX, bottommostY)

    return ctx.getImageData(0, 0, w, h)
  }

  function drawTriangle(ctx: CanvasRenderingContext2D, i: number, x: number, y: number) {
    ctx.resetTransform()
    ctx.globalCompositeOperation = 'destination-out'

    ctx.beginPath()
    ctx.moveTo(x + 105 - clipOffset[i], y + 25)
    ctx.lineTo(x - 15 - clipOffset[i], y + 25)
    ctx.lineTo(x + 125 - clipOffset[i], y - 150)
    ctx.lineTo(x + 255 - clipOffset[i], y - 150)
    ctx.closePath()
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  function drawLine(ctx: CanvasRenderingContext2D, i: number, x: number, y: number) {
    ctx.beginPath()
    ctx.moveTo(x - 15 - clipOffset[i], y + 25)
    ctx.lineTo(x + 125 - clipOffset[i], y - 150)
    ctx.closePath()

    ctx.strokeStyle = '#00cccc'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  function zoom(ctx: CanvasRenderingContext2D, x: number, y: number) {
    if (window.innerWidth < 1024)
      return
    const imageData = ctx.getImageData(
      Math.max(0, x - Math.floor(mainFontSize * 0.9) - 60),
      Math.max(0, y - Math.floor(mainFontSize * 1.22) - 35),
      Math.floor(mainFontSize * 1.22 * (1 + verticalTilt)),
      Math.floor(mainFontSize * 1.22 * (1 + verticalTilt)),
    )

    zoomCtx.putImageData(imageData, 0, 0)
    document.querySelector('#container').appendChild(zoomCanvas)
  };

  // subText
  tempCtx.font = `${subFontSize}px` + ` Maged LT Regular${font}`
  tempCtx.textAlign = 'center'
  tempCtx.fillStyle = 'white'
  tempCtx.shadowColor = 'transparent'

  const subtextMetrics = tempCtx.measureText(subText)
  if (subText.trim()) {
    tempCtx.fillRect(halfWidth - subtextMetrics!.width / 2 - tempHeight / 20, 472, subtextMetrics!.width + tempHeight / 10, 20)
    tempCtx.globalCompositeOperation = 'destination-out'
    tempCtx.letterSpacing = '-0.5px'
    tempCtx.fillText(subText, halfWidth, 488.5)
  }

  // invert
  if (textInvert)
    invertColor(tempCtx, tempWidth, tempHeight)

  // calcSize
  scale = width / height

  function calcImageSize(setFit: string, oriWidth: number, oriHeight: number) {
    const oriScale = oriWidth / oriHeight

    let cutLeft = 0
    let cutTop = 0

    let calcWidth = oriWidth
    let calcHeight = oriHeight

    let setLeft = 0
    let setTop = 0

    let setWidth = width
    let setHeight = height

    if (setFit === 'cover') {
      if (oriScale > scale) {
        cutLeft = (oriWidth - oriHeight * scale) / 2
        calcWidth = oriHeight * scale
        calcHeight = oriHeight
      }
      else {
        cutTop = (oriHeight - oriWidth / scale) / 2
        calcHeight = oriWidth / scale
        calcWidth = oriWidth
      }
    }
    else if (setFit === 'contain') {
      if (oriScale > scale) {
        setWidth = width
        setHeight = width / oriScale
        setTop = (height - setHeight) / 2
      }
      else {
        setWidth = height * oriScale
        setHeight = height
        setLeft = (width - setWidth) / 2
      }
    }

    return { cutLeft, cutTop, calcWidth, calcHeight, setLeft, setTop, setWidth, setHeight }
  }

  const { cutLeft, cutTop, calcWidth, calcHeight, setLeft, setTop, setWidth, setHeight } = calcImageSize(sizeOrigin && (imgWidth < imgHeight) ? 'contain' : 'cover', tempWidth, tempHeight)
  ctx.drawImage(tempCanvas, cutLeft, cutTop, calcWidth, calcHeight, setLeft, setTop, setWidth, setHeight)
  tempCanvas = null

  // bg
  ctx.globalCompositeOperation = 'destination-over'
  if (!transparentBg) {
    const { cutLeft, cutTop, calcWidth, calcHeight, setLeft, setTop, setWidth, setHeight } = calcImageSize(sizeOrigin ? 'contain' : fit, imgWidth, imgHeight)
    ctx.drawImage(img, cutLeft, cutTop, calcWidth, calcHeight, setLeft, setTop, setWidth, setHeight)
    if (fit === 'contain' && !sizeOrigin) {
      ctx.fillRect(0, 0, width, height)
    }
  }

  ctx.restore()

  // toURL
  function imageOutput(canvas: HTMLCanvasElement) {
    const src = canvas.toDataURL(`image/${mimeType === 'jpg' ? 'jpeg' : mimeType}`, quality)
    imgEle.src = src
  }

  imageOutput(canvas)
}

function getDims(aspectRatio: string): { _width: number, _height: number } {
  const dims = {
    '21:9': { _width: 945, _height: 405 },
    '16:9': { _width: 853, _height: 480 },
    '3:2': { _width: 720, _height: 480 },
    '4:3': { _width: 640, _height: 480 },
    '1:1': { _width: 480, _height: 480 },
  }

  return dims[aspectRatio] || dims['16:9']
}

function createTempCanvas(width: number, height: number): HTMLCanvasElement {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  return tempCanvas
}

function blendImageData(baseImageData: ImageData, overlayImageData: ImageData): ImageData {
  const baseData = baseImageData.data
  const overlayData = overlayImageData.data

  for (let i = 0; i < baseData.length; i += 4) {
    const r1 = baseData[i]
    const g1 = baseData[i + 1]
    const b1 = baseData[i + 2]
    const a1 = baseData[i + 3] / 255
    const r2 = overlayData[i]
    const g2 = overlayData[i + 1]
    const b2 = overlayData[i + 2]
    const a2 = overlayData[i + 3] / 255

    const alphaOut = a1 + a2 * (1 - a1) // 输出像素的透明度
    baseData[i] = (r1 * a1 + r2 * a2 * (1 - a1)) / alphaOut || 0 // 计算红色通道
    baseData[i + 1] = (g1 * a1 + g2 * a2 * (1 - a1)) / alphaOut || 0 // 计算绿色通道
    baseData[i + 2] = (b1 * a1 + b2 * a2 * (1 - a1)) / alphaOut || 0 // 计算蓝色通道
    baseData[i + 3] = alphaOut * 255 // 计算透明度
  }
  return baseImageData
}

function invertColor(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const pixel = ctx.getImageData(0, 0, width, height)
  const pixelData = pixel.data

  for (let i = 0; i < pixelData.length; i += 4) {
    pixelData[i] = 255 - pixelData[i] // 红色通道
    pixelData[i + 1] = 255 - pixelData[i + 1] // 绿色通道
    pixelData[i + 2] = 255 - pixelData[i + 2] // 蓝色通道
  }

  ctx.putImageData(pixel, 0, 0)
}
