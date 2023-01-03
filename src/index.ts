import EditorJS from '@editorjs/editorjs'

import { CodeBlock } from './plugin'

window.onload = () => {
    new EditorJS({
        autofocus: true,
        holder: 'editorjs-holder',
        tools: {
            code: CodeBlock
        }
    })
}