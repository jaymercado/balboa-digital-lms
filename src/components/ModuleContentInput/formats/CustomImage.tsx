import Quill from 'quill'
const ImageBase = Quill.import('formats/image') as any

const ATTRIBUTES = ['alt', 'height', 'width', 'style'] as const

type AttributeType = (typeof ATTRIBUTES)[number]

export default class CustomImage extends ImageBase {
  declare domNode: HTMLElement

  static formats(domNode: HTMLElement) {
    return ATTRIBUTES.reduce((formats: Record<AttributeType, string>, attribute) => {
      const copy = { ...formats }

      if (domNode.hasAttribute(attribute)) {
        copy[attribute] = domNode.getAttribute(attribute) || ''
      }

      return copy
    }, {} as Record<AttributeType, string>)
  }

  format(name: string, value: string | null) {
    if (ATTRIBUTES.includes(name as AttributeType)) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

Quill.register('formats/image', CustomImage)
