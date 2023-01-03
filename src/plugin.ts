import EditorJS, { API, ToolSettings, BlockTool } from "@editorjs/editorjs";
import "./style.scss";
import { make } from "./utils/dom.util";
import hljs from "highlight.js";
import { makeSelect } from "./ui";

export class CodeBlock implements BlockTool {
  private inputRef: HTMLTextAreaElement | null = null;
  private codeRef: HTMLElement | null = null;

  private lastEnterKeyStroke = 0;

  private readonly DOUBLE_ENTER_THRESHOLD = 500; // 500 miliseconds

  constructor() {
    hljs.initHighlightingOnLoad();
    console.log("init");
  }

  static get toolbox() {
    return {
      title: "Code",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  render(): HTMLElement {
    const codeContainer = make("div", "editorjs-code-block");

    /* Build control container */
    const controlContainer = make("div", "control-container")

    const languageSelect = makeSelect([
        {
            label: 'Javascript',
            value: 'javascript'
        },
        {
            label: 'Typescript',
            value: 'typescript'
        }
    ])

    controlContainer.appendChild(languageSelect)

    codeContainer.appendChild(controlContainer)

    const contentLayer = make("div", "content-container")

    /* Build the rendered layer */
    const renderedLayer = make("div", "rendered-layer");

    const pre = make("pre", undefined, {
      "aria-hidden": "true",
    });

    const code = make("code", "language-typescript");

    pre.appendChild(code);

    renderedLayer.appendChild(pre);

    /* Build the input layer */
    const inputLayer = make("textarea", "input-layer");

    contentLayer.appendChild(renderedLayer);

    contentLayer.appendChild(inputLayer);

    codeContainer.appendChild(contentLayer)

    // Save refs
    this.inputRef = inputLayer as HTMLTextAreaElement;
    this.codeRef = code;

    // Initialize events
    this.inputRef.oninput = this.onContentUpdated.bind(this);

    this.inputRef.onkeydown = this.onInputAreaKeyDown.bind(this);

    return codeContainer;
  }

  save(block: HTMLElement) {
    return {
      test: "hello",
    };
  }

  onContentUpdated(ev: Event) {
    const target = ev.target as HTMLTextAreaElement;

    let value = target.value;

    this.updateContent(value);
  }

  onInputAreaKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Enter") {
      const now = Date.now();

      const elapsed = now - this.lastEnterKeyStroke;

      if (elapsed > this.DOUBLE_ENTER_THRESHOLD) {
        // If user only pressed Enter once
        // that would likely mean user wants to enter a new line in the code editor
        // not escaping the block
        // so stop event propogation here
        ev.stopPropagation();
      }

      this.lastEnterKeyStroke = now;
    } else if (ev.key === "Tab") {
      ev.preventDefault();

      const target = ev.target as HTMLTextAreaElement;

      const value = target.value;

      const beforeTab = value.slice(0, target.selectionStart);
      const afterTab = value.slice(target.selectionEnd, value.length);
      const curPos = target.selectionEnd + 1;

      // Add tab character
      target.value = beforeTab + "\t" + afterTab;

      // Move cursor
      target.selectionStart = curPos;
      target.selectionEnd = curPos;

      this.updateContent(target.value);

      ev.stopPropagation();
    }
  }

  updateContent(value: string) {
    if (!this.codeRef || !this.inputRef) {
      throw new Error("No reference found! You may forgot to call render()");
    }

    if (value[value.length - 1] == "\n") {
      value += " ";
    }

    // Update code
    this.codeRef.innerHTML = value
      .replace(new RegExp("&", "g"), "&amp;")
      .replace(new RegExp("<", "g"), "&lt;");

    // Highlight
    hljs.highlightElement(this.codeRef);

    // Update textarea height
    this.inputRef.style.height = "5px";
    this.inputRef.style.height = this.inputRef.scrollHeight + "px";
  }
}
