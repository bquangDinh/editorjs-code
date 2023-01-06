# editorjs-code
Code block for [EditorJS](https://editorjs.io/) using [highlight.js](https://highlightjs.org/) for highlighting

![](https://github.com/bquangDinh/editorjs-code/blob/main/imgs/preview.png)

## Features
- Supports up to **40** common languages from [highlight.js](https://highlightjs.org/)
- Support copying code
- Support caption
- Easy selecting language with search
- Support readOnly mode

## Install
`
npm install editorjs-code-highlight
`
## Usage
```ts
import CodeBlock, { ICodeBlockConfigs } from 'editorjs-code'

const editorjs = new EditorJS({
    ...
    tools: {
      code: {
        class: CodeBlock,
        config: {
          allowValidation: true,
          supportedLanguages: [
            {
              label: 'Ascii Doc', // name for asciidoc
              value: 'asciidoc'
            },
            {
              label: 'Javascript', // name for javascript
              value: 'javascript'
            },
          ],
          defaultLanguage: 'javascript',
          onContentCopied: (value: string) => {}
        } as ICodeBlockConfigs,
      },
    },
  })
```

## Config Parameters

Code Tool supports these config params:

| Field | Type        | Description         |
| ----- | ----------- | ------------------- |
| allowValidation | `boolean` | Set to false to disable EditorJS validation. Default is `false`. EditorJS validation set to true will ignore empty code when saving |
| supportedLanguages | `{label: string, value: string}[]` | If you want custom label names for languages (that shows in the select box). `value` must be the alias that is the same as highlightjs common language aliases. Read more detail [here](https://highlightjs.org/download/) about common languages in highlightjs, and their aliases can be found [here](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md) |
| defaultLanguage | `string` | The default language for highlighting when Code Block first initialized |
| onContentCopied | `(value: string) => void` | Callback when content is copied from Code Bloc. `value` is the current content of the Code Block |

### Example
```ts
const editorjs = new EditorJS({
    autofocus: true,
    holder: 'editorjs-holder',
    tools: {
      code: {
        class: CodeBlock,
        config: {
          allowValidation: true, // ignores code block that has empty code when saving
          supportedLanguages: [
            {
              label: 'myname', // custom name here. Then select box will show 'myname' for ascii instead of 'Ascii Doc'
              value: 'asciidoc', // make sure it's the same alias as highlightjs common language alias
            },
          ],
          defaultLanguage: 'typescript' // 'typescript' wil be the default when EditorJS first initialized
        } as ICodeBlockConfigs,
      },
    },
  })
```
## Saving Data

This is the saved data structure:

```ts
export interface ICodeBlockData {
  language: string
  code: string
  caption: string
}
```
