import EditorJS from '@editorjs/editorjs'

import CodeBlock from './plugin'

window.onload = () => {
  const editorjs = new EditorJS({
    autofocus: true,
    holder: 'editorjs-holder',
    tools: {
      code: CodeBlock,
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
