export interface IImport {
  default: unknown
}

export const Utils = {
  CopyTextToClipBoard: async (text: string) => {
    if (!document) {
      throw new Error('Trying to access document from node environment')
    }

    if (!navigator.clipboard) {
      // Fall back to old version
      const textArea = document.createElement('textarea')
      textArea.value = text

      // Avoid scrolling to bottom
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        const msg = successful ? 'successful' : 'unsuccessful'
        console.log('Fallback: Copying text command was ' + msg)

        return successful
      } catch (err) {
        console.error('Unable to copy', err)
      }

      return false
    }

    const done = await navigator.clipboard
      .writeText(text)
      .then(() => {
        return true
      })
      .catch((err) => {
        console.error('Async: unable to copy', err)
        return false
      })

    return done
  },
  IsImport: (obj: unknown): obj is IImport => {
    return typeof obj === 'object' && typeof 'default' in obj
  },
}
