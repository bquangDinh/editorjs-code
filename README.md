# editorjs-code
Code block for [EditorJS](https://editorjs.io/) using [highlight.js](https://highlightjs.org/) for highlighting

![](https://github.com/bquangDinh/editorjs-code/blob/main/imgs/preview.png)

## Features
- Supports up to **197** languages from [highlight.js](https://highlightjs.org/)
- Support copying code
- Support caption
- Easy selecting language with search
- Support readOnly mode

## Usage
```ts
import { CodeBlock, ICodeBlockConfigs } from 'editorjs-code'

const editorjs = new EditorJS({
    ...
    tools: {
      code: {
        class: CodeBlock,
        config: {
          allowValidation: true,
          supportedLanguages: [
            {
              label: 'C++',
              value: 'cpp
            },
            {
              label: 'Javascript',
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
| supportedLanguages | `{label: string, value: string}[]` | List of languages for highlighting. Default is [SUPPORTED_LANGUAGES](https://github.com/bquangDinh/editorjs-code/blob/main/src/constants/languages.constant.ts) Languages must be supported by highlight.js. `label` could be any name you want, but `value` must be highlight.js language alias. Please see more detail here [Highlight.js supported languages](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md) |
| defaultLanguage | `string` | The default language for highlighting when Code Block first initialized. If `supportedLanguages` param is presented, `defaultLanguage` must be presented in `supportedLanguages` values. Default is `bash` |
| onContentCopied | `(value: string) => void` | Callback when content is copied from Code Bloc. `value` is the current content of the Code Block |

## Saving Data

This is the saved data structure:

```ts
export interface ICodeBlockData {
  language: string
  code: string
  caption: string
}
```