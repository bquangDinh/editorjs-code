import EditorJS from '@editorjs/editorjs'

import CodeBlock from './plugin'

window.onload = () => {
  const editorjs = new EditorJS({
    autofocus: true,
    holder: 'editorjs-holder',
    tools: {
      code: CodeBlock,
    },
    data: {
      time: 1674513178002,
      blocks: [
        {
          id: 'XCdGRi0n5W',
          type: 'code',
          data: {
            language: 'typescript',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n ch := make(chan float64)\n ch <- 1.0e10 // magic number\n x, ok := <- ch\n defer fmt.Println(`exitting now\\`)\n go println(len("hello world!"))\n return\n}',
            caption: '',
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
