export interface ISelectOption {
    label: string;
    value: string;
}
export interface IMakeSelectConfigs {
    classNames?: string[] | string;
    attributes?: Record<string, string>;
    onSelect: (value: string) => unknown;
}
export declare const makeSelect: (options: ISelectOption[], configs?: IMakeSelectConfigs) => HTMLDivElement;
