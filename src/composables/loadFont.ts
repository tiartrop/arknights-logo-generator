export async function laodFonts(font: string, content: string) {
  await document.fonts.load(
    `14px ${font}`,
    content,
  )
}
