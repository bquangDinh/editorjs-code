import EditorJS from '@editorjs/editorjs'

import CodeBlock, { ICodeBlockConfigs } from './plugin'

import hljs from 'highlight.js/lib/core'

import AsciiDoc from 'highlight.js/lib/languages/asciidoc'
import Typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('asciidoc', AsciiDoc)
hljs.registerLanguage('typescript', Typescript)

window.onload = () => {
  const editorjs = new EditorJS({
    autofocus: true,
    holder: 'editorjs-holder',
    tools: {
      code: {
        class: CodeBlock,
        config: {
          allowValidation: true,
          supportedLanguages: [
            {
              label: 'Ascii', // custom name
              value: 'asciidoc', // make sure it's the same alias as you registered above
            },
          ],
        } as ICodeBlockConfigs,
      },
    },
    data: {
      time: 1672811648409,
      blocks: [
        {
          id: 'vowYXM_n62',
          type: 'code',
          data: {
            language: 'typescript',
            code: "window.onload = () => {\n const editorjs = new EditorJS({\n autofocus: true,\n holder: 'editorjs-holder',\n tools: {\n code: CodeBlock\n }\n })\n\n const saveBtn = document.getElementById('save-btn')\n\n const output = document.getElementById('output')\n\n saveBtn.addEventListener('click', (e) => {\n editorjs.save().then((savedData) => {\n output.innerHTML = JSON.stringify(savedData, null, 4)\n })\n })\n}",
            caption: 'Test',
          },
        },
      ],
      version: '2.26.4',
    },
  })

  const saveBtn = document.getElementById('save-btn')

  const output = document.getElementById('output')

  saveBtn.addEventListener('click', () => {
    editorjs.save().then((savedData) => {
      output.innerHTML = JSON.stringify(savedData, null, 4)
    })
  })
}
