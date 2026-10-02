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
            language: 'python',
            code: "#!/usr/bin/env python3\n\"\"\"Module docstring: a tiny demo for syntax highlighting.\"\"\"\n\nfrom __future__ import annotations\nimport math\nfrom dataclasses import dataclass, field\nfrom typing import Iterator\n\nPI_ISH = 3.14159  # float\nFLAGS = 0b1010 | 0xFF  # binary and hex\n\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    tags: list[str] = field(default_factory=list)\n\n    def distance(self, other: Point) -> float:\n        \"\"\"Euclidean distance.\"\"\"\n        return math.hypot(self.x - other.x, self.y - other.y)\n\n    def __repr__(self) -> str:\n        return f\"Point({self.x:.2f}, {self.y:.2f})\"\n\n\ndef fibonacci(n: int) -> Iterator[int]:\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\n\nasync def fetch(name: str) -> dict:\n    return {\"name\": name, \"ok\": True, \"value\": None}\n\n\ndef main() -> None:\n    p1, p2 = Point(0, 0), Point(3, 4, tags=[\"origin\"])\n    print(f\"{p1} -> {p2}: {p1.distance(p2)}\")\n\n    squares = [i ** 2 for i in range(10) if i % 2 == 0]\n    lookup = {k: v for k, v in zip(\"abc\", squares)}\n    path = r\"C:\\temp\\new_folder\"  # raw string\n\n    try:\n        result = 10 / len(squares)\n    except ZeroDivisionError as err:\n        print(f\"error: {err!r}\")\n    else:\n        print(f\"result = {result}\")\n    finally:\n        print(list(fibonacci(8)), lookup, path, FLAGS)\n\n    match p2:\n        case Point(x=0, y=0):\n            print(\"at origin\")\n        case Point(x=x, y=y) if x > 0:\n            print(f\"right side at y={y}\")\n        case _:\n            print(\"elsewhere\")\n\n    square = lambda n: n * n\n    assert square(4) == 16, \"math is broken\"\n\n\nif __name__ == \"__main__\":\n    main()",
            caption: 'Hello',
          },
        },
      ],
      version: '2.26.4',
    },
  })

  const saveBtn = document.getElementById('save-btn')!

  const output = document.getElementById('output')!

  saveBtn.addEventListener('click', () => {
    editorjs.save().then((savedData) => {
      output.textContent = JSON.stringify(savedData, null, 4)
      output.style.whiteSpace = 'pre-wrap'
    })
  })
}
