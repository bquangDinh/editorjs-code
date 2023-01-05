import './style.scss'

/* EditorJS */
import { API, BlockTool } from '@editorjs/editorjs'

/* Utils */
import { make } from './utils/dom.util'
import { makeSelect } from './ui'
import { Utils } from './utils/util'

/* Libs */
import hljs from 'highlight.js/lib/core'
import { HIGHLIGHTJS_LANGUAGES } from './constants/highlightjs-languages'

export interface ISupportedLanguage {
  label: string
  value: string
}

export interface ICodeBlockData {
  language: string
  code: string
  caption: string
}

export interface ICodeBlockConfigs {
  allowValidation?: boolean
  supportedLanguages?: ISupportedLanguage[]
  defaultLanguage?: string
  onContentCopied?: (content: string) => unknown
}

export interface ICodeBlockConstructorParams {
  data?: ICodeBlockData
  config?: ICodeBlockConfigs
  api?: API
  readOnly?: boolean
}

export default class CodeBlock implements BlockTool {
  /**
   * Reference for editing area
   */
  private inputRef: HTMLTextAreaElement | null = null

  /**
   * Reference for higlighting area
   */
  private codeRef: HTMLElement | null = null

  /**
   * Reference for block container
   */
  private containerRef: HTMLDivElement | null = null

  /**
   * Reference for caption input
   */
  private captionInputRef: HTMLTextAreaElement | null = null

  /**
   * List of supported languages for highlighting syntax
   * Please check more information at: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
   */
  private supportedLanguages: ISupportedLanguage[] = []

  /**
   * Current language used for highlighting
   */
  private currentSelectedLanguage = ''

  /**
   * A flag to check whether user just copied code
   */
  private copiedContent = false

  /**
   * A flag to check whether the block has caption
   */
  private useCaption = false

  /**
   * Saved data
   */
  private data: ICodeBlockData | null = null

  /**
   * Configs when EditorJS initializes
   */
  private configs: ICodeBlockConfigs = {
    allowValidation: true,
  }

  /**
   * EditorJS API
   */
  private api: API | null = null

  /**
   * A flag to check whether the content is for readOnly
   */
  private readOnly = false

  constructor({ data, config, api, readOnly }: ICodeBlockConstructorParams) {
    /* Check saved data */
    if (this.isDataValid(data)) {
      // Saved data is valid, initialize block from the saved data
      this.data = data

      this.currentSelectedLanguage = data.language
    }

    /* Build supported languages based on hljs registered languages */
    this.buildSupportedLanguages(config.supportedLanguages)

    /* Save Config */
    /* When readOnly mode is true, then there's no point to set config here */
    if (config && !readOnly) {
      this.configs = Object.assign(this.configs, config)

      if (config.defaultLanguage) {
        const index = this.supportedLanguages.findIndex(
          (l) => l.value === config.defaultLanguage,
        )

        if (index !== -1) {
          this.currentSelectedLanguage = config.defaultLanguage
        } else {
          throw new Error(
            'The default language you provided is not existed in the given supported languages. More detail about supported languages from highlight.js: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md',
          )
        }
      } else {
        this.currentSelectedLanguage = this.supportedLanguages[0].value
      }
    }

    /* Save API */
    if (api) {
      this.api = api
    }

    /* Save readOnly */
    this.readOnly = Boolean(readOnly)
  }

  /* Getters */

  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'Code',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>',
    }
  }

  /**
   * Whether validating on block is allowed
   * @returns {boolean}
   */
  get allowValidation() {
    return this.configs.allowValidation
  }

  /**
   * Check whether the saved data is valid to display
   * @param data
   * @returns {boolean}
   */
  isDataValid(data: ICodeBlockData) {
    if (typeof data === 'object') {
      return (
        'language' in data &&
        'code' in data &&
        'caption' in data &&
        typeof data.language === 'string' &&
        typeof data.caption === 'string' &&
        typeof data.code === 'string'
      )
    }

    return false
  }

  buildSupportedLanguages(custom?: ISupportedLanguage[]) {
    let lang: ISupportedLanguage

    const usingCustom = Boolean(custom)

    for (const l of HIGHLIGHTJS_LANGUAGES) {
      if (hljs.getLanguage(l.value)) {
        if (usingCustom) {
          // Check whether user want differet name for this language
          lang = custom.find((lg) => lg.value === l.value)

          lang = lang ?? l
        } else {
          lang = l
        }

        this.supportedLanguages.push(lang)
      }
    }
  }

  /**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */
  render(): HTMLElement {
    const codeContainer = make('div', 'editorjs-code-block')

    /* Build control container */
    const controlContainer = make('div', 'control-container')

    if (this.readOnly) {
      const language = make('span', 'language')

      const lang = this.supportedLanguages.find(
        (l) => l.value === this.currentSelectedLanguage,
      )

      language.innerHTML = lang ? lang.label : ''

      controlContainer.appendChild(language)
    } else {
      const languageSelect = makeSelect(this.supportedLanguages, {
        defaultOption: this.currentSelectedLanguage,
        onSelect: this.onSelectLanguage.bind(this),
      })

      controlContainer.appendChild(languageSelect)
    }

    /* Buttons */
    const btnDiv = make('div', 'btn-div')

    /* Copy Button */
    const copyButton = make('button', ['control-btn', 'copy-btn'])

    if (this.readOnly) {
      copyButton.classList.add('copy-btn-only')
    }

    const copyBtnText = this.api ? this.api.i18n.t('Copy') : 'Copy'

    copyButton.innerHTML = `
    <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H224c-53 0-96-43-96-96V160H64c-35.3 0-64 28.7-64 64V448zm224-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/></svg>
    ${copyBtnText}
    `

    copyButton.onclick = this.onCopyContent.bind(this)

    btnDiv.appendChild(copyButton)

    /* Caption Button */
    if (!this.readOnly) {
      const captionButton = make('button', ['control-btn', 'caption-btn'])

      captionButton.innerText = this.api
        ? this.api.i18n.t('Caption')
        : 'Caption'

      captionButton.onclick = this.onAddCaption.bind(this)

      btnDiv.appendChild(captionButton)
    }

    controlContainer.appendChild(btnDiv)

    codeContainer.appendChild(controlContainer)

    const contentLayer = make('div', 'content-container')

    /* Build the rendered layer */
    const renderedLayer = make('div', 'rendered-layer')

    const pre = make('pre', undefined, {
      'aria-hidden': 'true',
    })

    const code = make('code', `language-${this.currentSelectedLanguage}`)

    pre.appendChild(code)

    renderedLayer.appendChild(pre)

    /* Build the input layer */
    const inputLayer = make('textarea', 'input-layer', {
      placeholder: this.api
        ? this.api.i18n.t('Enter your code')
        : 'Enter your code',
    }) as HTMLTextAreaElement

    inputLayer.disabled = this.readOnly

    inputLayer.spellcheck = false

    contentLayer.appendChild(renderedLayer)

    contentLayer.appendChild(inputLayer)

    codeContainer.appendChild(contentLayer)

    // Save refs
    this.inputRef = inputLayer as HTMLTextAreaElement
    this.codeRef = code
    this.containerRef = codeContainer as HTMLDivElement

    /* Fetch data if present */
    if (this.data) {
      this.inputRef.value = this.data.code

      // wait until the input ref value is all set
      setTimeout(() => {
        this.updateContent(this.data.code)
      }, 500)

      if (this.data.caption && this.data.caption.trim() !== '') {
        this.addCaption(this.data.caption)
      }
    }

    // Initialize events
    this.inputRef.oninput = this.onContentUpdated.bind(this)

    this.inputRef.onkeydown = this.onInputAreaKeyDown.bind(this)

    return codeContainer
  }

  /**
   * Return Block data
   *
   * @public
   *
   * @returns {ICodeBlockData}
   */
  save() {
    if (!this.inputRef || !this.captionInputRef) {
      throw new Error('No ref found! You may forgot to call render()')
    }

    return {
      language: this.currentSelectedLanguage,
      code: this.inputRef.value,
      caption: this.captionInputRef.value,
    }
  }

  /**
   * Validate date: Check if code is not empty
   * @param blockData
   * @returns
   */
  validate(blockData: ICodeBlockData): boolean {
    if (this.allowValidation) {
      return blockData.code.trim() !== ''
    }

    // allowValidation is disabled,
    // always returns true
    return true
  }

  /* Events */

  /* Fired when content in the editing area is updated */
  onContentUpdated(ev: Event) {
    const target = ev.target as HTMLTextAreaElement

    const value = target.value

    this.updateContent(value)
  }

  /* Fired when keydown event is detected in the editing area */
  onInputAreaKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      ev.stopPropagation()
    } else if (ev.key === 'Tab') {
      ev.preventDefault()

      const target = ev.target as HTMLTextAreaElement

      const value = target.value

      const beforeTab = value.slice(0, target.selectionStart)
      const afterTab = value.slice(target.selectionEnd, value.length)
      const curPos = target.selectionEnd + 1

      // Add tab character
      target.value = beforeTab + '\t' + afterTab

      // Move cursor
      target.selectionStart = curPos
      target.selectionEnd = curPos

      this.updateContent(target.value)

      ev.stopPropagation()
    }
  }

  /* Fired when a language is selected from the select box */
  onSelectLanguage(language: string) {
    if (!this.codeRef || !this.inputRef) {
      throw new Error('No ref found! You may forgot to call render()')
    }

    this.codeRef.classList.replace(
      `language-${this.currentSelectedLanguage}`,
      `language-${language}`,
    )

    this.currentSelectedLanguage = language

    // rerender code
    this.updateContent(this.inputRef.value)
  }

  /* Fired when the copy button is clicked */
  async onCopyContent(e: MouseEvent) {
    if (!this.inputRef) {
      throw new Error('No ref found! You may forgot to call render()')
    }

    const target = e.target as HTMLButtonElement

    const value = this.inputRef.value

    const success = await Utils.CopyTextToClipBoard(value)

    if (success) {
      target.innerHTML = `
        <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
        ${this.api ? this.api.i18n.t('Copied') : 'Copied'}
        `

      if (!this.copiedContent) {
        setTimeout(() => {
          target.innerHTML = `
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H224c-53 0-96-43-96-96V160H64c-35.3 0-64 28.7-64 64V448zm224-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/></svg>
                ${this.api ? this.api.i18n.t('Copy') : 'Copy'}
                `

          this.copiedContent = false
        }, 1000)

        this.copiedContent = true

        // Callback
        if (
          this.configs.onContentCopied &&
          typeof this.configs.onContentCopied === 'function'
        ) {
          this.configs.onContentCopied(value)
        }
      }
    }
  }

  /* Fired when the caption button is clicked */
  onAddCaption() {
    if (!this.containerRef) {
      throw new Error('No ref found! You may forgot to call render()')
    }

    this.addCaption()
  }

  /* Fired when keydown event is detected in the caption input field */
  onCaptionKeyDown(e: KeyboardEvent) {
    if (!this.captionInputRef) {
      throw new Error('No ref found!')
    }

    if (e.key === 'Backspace') {
      const value = (e.target as HTMLTextAreaElement).value

      if (value === '') {
        this.containerRef.removeChild(this.captionInputRef)

        this.useCaption = false
      }
    }
  }

  /* Add caption input field */
  addCaption(caption = '') {
    if (!this.useCaption) {
      const input = make('textarea', 'caption-input', {
        placeholder: this.api
          ? this.api.i18n.t('Write your caption')
          : 'Write your caption',
      }) as HTMLTextAreaElement

      input.disabled = this.readOnly

      input.onkeydown = this.onCaptionKeyDown.bind(this)

      this.containerRef.appendChild(input)

      this.captionInputRef = input as HTMLTextAreaElement

      // auto focus on the element
      input.focus()

      // prevent creating another one
      this.useCaption = true
    }

    this.captionInputRef.value = caption
  }

  /**
   * Render highlighted code based on given value
   * @param value
   */
  updateContent(value: string) {
    if (!this.codeRef || !this.inputRef) {
      throw new Error('No reference found! You may forgot to call render()')
    }

    if (value[value.length - 1] == '\n') {
      value += ' '
    }

    // Update code
    this.codeRef.innerHTML = value
      .replace(new RegExp('&', 'g'), '&amp;')
      .replace(new RegExp('<', 'g'), '&lt;')

    // Highlight
    hljs.highlightElement(this.codeRef)

    // Update textarea height
    this.inputRef.style.height = '5px'
    this.inputRef.style.height = this.inputRef.scrollHeight + 'px'
  }
}
