export interface State {
  wide: '21:9' | '16:9' | '3:2' | '4:3' | '1:1'
  fit: 'cover' | 'contain' | 'fit'
  sizeOrigin: boolean
  mainText: string
  subText?: string
  mainFontSize: number
  subFontSize: number
  mainTextOffset: number
  mainTextSpacing: number
  letterOffsetY: number[]
  verticalTilt: number
  textShadow: boolean
  textInvert: boolean
  transparentBg: boolean
  clipOffset: number[]
  mimeType: 'png' | 'jpg' | 'webp'
  quality: number
}

export interface ClipState {
  content: string
  show: boolean
  selected: boolean
}
