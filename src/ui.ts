import { make } from './utils/dom.util'

export interface ISelectOption {
  label: string
  value: string
}

export interface IMakeSelectConfigs {
  classNames?: string[] | string
  attributes?: Record<string, string>
  /* Callbacks */
  onSelect: (value: string) => unknown
}

/* Helper functions */
function closeAllSelect(el?: HTMLElement) {
  const selectItems = document.querySelectorAll(
    '.editorjs-code-language-select .select-items',
  )
  const selecteds = document.querySelectorAll(
    '.editorjs-code-language-select .select-selected',
  )
  const arrNo: number[] = []

  for (let i = 0; i < selecteds.length; ++i) {
    if (el === selecteds[i]) {
      arrNo.push(i)
    } else {
      selecteds[i].classList.remove('select-arrow-active')
    }
  }

  for (let i = 0; i < selectItems.length; ++i) {
    if (arrNo.indexOf(i)) {
      selectItems[i].classList.add('select-hide')
    }
  }
}

export const makeSelect = (
  options: ISelectOption[],
  configs?: IMakeSelectConfigs,
) => {
  const classNames = ['editorjs-code-language-select']
  let attributes: Record<string, string> = {}

  if (configs) {
    if (configs.classNames) {
      Array.isArray(configs.classNames)
        ? classNames.push(...configs.classNames)
        : classNames.push(configs.classNames)
    }

    if (configs.attributes) {
      attributes = Object.assign(attributes, configs.attributes)
    }
  }

  let selectContainer: HTMLDivElement,
    select: HTMLSelectElement,
    opt: HTMLOptionElement,
    selected: HTMLDivElement,
    arrowIcon: SVGSVGElement,
    arrowIconPath: SVGPathElement,
    optionsContainer: HTMLDivElement,
    searchInput: HTMLInputElement,
    optionsListContainer: HTMLDivElement,
    optionDiv: HTMLDivElement,
    currentSelected: string

  /* Helper functions */
  const renderOptions = (opts: ISelectOption[], firstInit?: boolean) => {
    if (!optionsListContainer || !select || !selected) {
      throw new Error('Element not found')
    }

    if (!firstInit) {
      // Clear select
      select.replaceChildren()

      // Clear content inside the list
      optionsListContainer.replaceChildren()

      // Render select
      for (const option of opts) {
        opt = make('option') as HTMLOptionElement

        opt.value = option.value
        opt.innerText = option.label

        select.appendChild(opt)
      }
    }

    // Render options
    for (let i = 0; i < opts.length; ++i) {
      /* For each option in the original select element,
          create a new DIV that will act as an option item: */
      optionDiv = make('div', undefined, {
        'data-value': opts[i].value,
      }) as HTMLDivElement

      optionDiv.innerHTML = select.options[i].innerHTML

      if (opts[i].value === currentSelected) {
        optionDiv.setAttribute('class', 'same-as-selected')
      } else {
        optionDiv.removeAttribute('class')
      }

      optionDiv.addEventListener('click', (e) => {
        const target = e.target as HTMLDivElement

        const value = target.dataset.value

        currentSelected = value

        /* Update selected DIV */
        selected.innerHTML = target.innerHTML
        selected.appendChild(arrowIcon)

        // Clear the previous selected item in the option list
        const sameAsSelected =
          optionsListContainer.getElementsByClassName('same-as-selected')

        for (let k = 0; k < sameAsSelected.length; ++k) {
          sameAsSelected[k].removeAttribute('class')
        }

        // Update this target as current selected
        target.setAttribute('class', 'same-as-selected')

        selected.click()

        // Callback
        if (configs && configs.onSelect) {
          configs.onSelect(value)
        }
      })

      optionsListContainer.appendChild(optionDiv)
    }
  }

  selectContainer = make('div', classNames, attributes) as HTMLDivElement

  select = make('select') as HTMLSelectElement

  // Render select
  for (const option of options) {
    opt = make('option') as HTMLOptionElement

    opt.value = option.value
    opt.innerText = option.label

    select.appendChild(opt)
  }

  /* Build custom style select */
  selected = make('div', 'select-selected') as HTMLDivElement

  selected.innerHTML = select.options[select.selectedIndex].innerHTML

  /* Arrow icon */
  arrowIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  arrowIcon.setAttribute('viewBox', '0 0 448 512')

  arrowIcon.classList.add('arrow-icon')

  arrowIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  arrowIconPath.setAttribute(
    'd',
    'M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z',
  )

  arrowIcon.appendChild(arrowIconPath)

  selected.appendChild(arrowIcon)

  selectContainer.appendChild(selected)

  /* Create options container */
  optionsContainer = make('div', [
    'select-items',
    'select-hide',
  ]) as HTMLDivElement

  /* Search input */
  searchInput = make('input', 'search-input', {
    placeholder: 'Search',
  }) as HTMLInputElement

  searchInput.onclick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  searchInput.oninput = (e: Event) => {
    const search = (e.target as HTMLInputElement).value

    const filteredOptions =
      search.trim() !== ''
        ? options.filter((option) => {
            return option.label.toLowerCase().includes(search.toLowerCase())
          })
        : options

    renderOptions(filteredOptions)

    e.stopPropagation()
  }

  optionsContainer.appendChild(searchInput)

  /* Options List container */
  optionsListContainer = make('div', 'items-list') as HTMLDivElement

  currentSelected = options[0].value

  renderOptions(options, true)

  optionsContainer.appendChild(optionsListContainer)

  selectContainer.appendChild(optionsContainer)

  selected.addEventListener('click', (e) => {
    const target = e.target as HTMLDivElement

    /**
     * When the select box is clicked, close any other select boxes,
     * and open/close the current select box
     */

    closeAllSelect(selected)

    e.stopPropagation()

    optionsContainer.classList.toggle('select-hide')

    target.classList.toggle('select-arrow-active')

    if (searchInput.value.trim() !== '') {
      // Reset select options
      renderOptions(options)
    }
    // Clear search input
    searchInput.value = ''
  })

  return selectContainer
}

document.addEventListener('click', () => {
  closeAllSelect()
})
