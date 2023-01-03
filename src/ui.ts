import { make } from "./utils/dom.util";

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IMakeSelectConfigs {
  classNames?: string[] | string;
  attributes?: Record<string, string>;
}

/* Helper functions */
function closeAllSelect(el?: HTMLElement) {
  const selectItems = document.querySelectorAll(
    ".editorjs-code-language-select .select-items"
  );
  const selecteds = document.querySelectorAll(
    ".editorjs-code-language-select .select-selected"
  );
  const arrNo: number[] = [];

  for (let i = 0; i < selecteds.length; ++i) {
    if (el === selecteds[i]) {
      arrNo.push(i);
    } else {
      selecteds[i].classList.remove("select-arrow-active");
    }
  }

  for (let i = 0; i < selectItems.length; ++i) {
    if (arrNo.indexOf(i)) {
      selectItems[i].classList.add("select-hide");
    }
  }
}

export const makeSelect = (
  options: ISelectOption[],
  configs?: IMakeSelectConfigs
) => {
  let classNames = ["editorjs-code-language-select"];
  let attributes: Record<string, string> = {};

  if (configs) {
    if (configs.classNames) {
      Array.isArray(configs.classNames)
        ? classNames.push(...configs.classNames)
        : classNames.push(configs.classNames);
    }

    if (configs.attributes) {
      attributes = Object.assign(attributes, configs.attributes);
    }
  }

  const selectContainer = make("div", classNames, attributes);

  const select = make("select") as HTMLSelectElement;

  let opt: HTMLOptionElement;

  for (const option of options) {
    opt = make("option") as HTMLOptionElement;

    opt.value = option.value;
    opt.innerText = option.label;

    select.appendChild(opt);
  }

  selectContainer.append(select);

  /* Build custom style select */
  const selected = make("div", "select-selected");

  selected.innerHTML = select.options[select.selectedIndex].innerHTML;

  /* Arrow icon */
  const arrowIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  arrowIcon.setAttribute("viewBox", "0 0 448 512");

  arrowIcon.classList.add("arrow-icon");

  const arrowIconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  arrowIconPath.setAttribute(
    "d",
    "M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
  );

  arrowIcon.appendChild(arrowIconPath);

  selected.appendChild(arrowIcon);

  selectContainer.appendChild(selected);

  /* Create options container */
  const optionsContainer = make("div", ["select-items", "select-hide"]);

  let optionDiv: HTMLDivElement;

  for (let i = 0; i < options.length; ++i) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    optionDiv = make("div", undefined, {
      "data-value": options[i].value,
    }) as HTMLDivElement;

    optionDiv.innerHTML = select.options[i].innerHTML;

    optionDiv.addEventListener("click", (e) => {
      const target = e.target as HTMLDivElement;

      const value = target.dataset.value;

      /*
            When an item is clicked, update the original select box, and the selected item
        */
      for (let j = 0; j < options.length; ++j) {
        if (select.options[j].value === value) {
          select.selectedIndex = j;
          selected.innerHTML = target.innerHTML;
          selected.appendChild(arrowIcon);

          // Clear the previous selected item in the option list
          const sameAsSelected =
            optionsContainer.getElementsByClassName("same-as-selected");

          for (let k = 0; k < sameAsSelected.length; ++k) {
            sameAsSelected[k].removeAttribute("class");
          }

          // Update this target as current selected
          target.setAttribute("class", "same-as-selected");

          break;
        }
      }

      selected.click();
    });

    optionsContainer.appendChild(optionDiv);
  }

  selectContainer.appendChild(optionsContainer);

  selected.addEventListener("click", (e) => {
    const target = e.target as HTMLDivElement;

    /**
     * When the select box is clicked, close any other select boxes,
     * and open/close the current select box
     */

    closeAllSelect(selected);

    e.stopPropagation();

    optionsContainer.classList.toggle("select-hide");

    target.classList.toggle("select-arrow-active");
  });

  return selectContainer;
};

document.addEventListener('click', () => {
    closeAllSelect()
})
