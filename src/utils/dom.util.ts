export function make(
  tag: keyof HTMLElementTagNameMap,
  classNames?: string[] | string,
  attributes?: Record<string, string>,
) {
  if (!document) {
    throw new Error('No document instance found!')
  }

  const el = document.createElement(tag)

  if (classNames) {
    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else {
      el.classList.add(classNames)
    }
  }

  if (attributes) {
    for (const key of Object.keys(attributes)) {
      el.setAttribute(key, attributes[key])
    }
  }

  return el
}
