export const exportDocument = (documentString: string, fileName: string) => {
  const blob = new Blob([documentString], { type: 'text/html' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
