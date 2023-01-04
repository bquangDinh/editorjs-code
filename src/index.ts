import EditorJS from '@editorjs/editorjs'

import { CodeBlock, ICodeBlockConfigs } from './plugin'

window.onload = () => {
  const editorjs = new EditorJS({
    autofocus: true,
    holder: 'editorjs-holder',
    tools: {
      code: {
        class: CodeBlock,
        config: {
          allowValidation: true,
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
