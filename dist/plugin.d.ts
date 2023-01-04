import './style.scss';
import { API, BlockTool } from '@editorjs/editorjs';
import { ISupportedLanguage } from './constants/languages.constant';
export interface ICodeBlockData {
    language: string;
    code: string;
    caption: string;
}
export interface ICodeBlockConfigs {
    allowValidation?: boolean;
    supportedLanguages?: ISupportedLanguage[];
    defaultLanguage?: string;
    onContentCopied?: (content: string) => unknown;
}
export interface ICodeBlockConstructorParams {
    data?: ICodeBlockData;
    config?: ICodeBlockConfigs;
    api?: API;
    readOnly?: boolean;
}
export default class CodeBlock implements BlockTool {
    /**
     * Reference for editing area
     */
    private inputRef;
    /**
     * Reference for higlighting area
     */
    private codeRef;
    /**
     * Reference for block container
     */
    private containerRef;
    /**
     * Reference for caption input
     */
    private captionInputRef;
    /**
     * List of supported languages for highlighting syntax
     * Please check more information at: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
     */
    private supportedLanguages;
    /**
     * Current language used for highlighting
     */
    private currentSelectedLanguage;
    /**
     * A flag to check whether user just copied code
     */
    private copiedContent;
    /**
     * A flag to check whether the block has caption
     */
    private useCaption;
    /**
     * Saved data
     */
    private data;
    /**
     * Configs when EditorJS initializes
     */
    private configs;
    /**
     * EditorJS API
     */
    private api;
    /**
     * A flag to check whether the content is for readOnly
     */
    private readOnly;
    constructor({ data, config, api, readOnly }: ICodeBlockConstructorParams);
    /**
     * Notify core that read-only mode is supported
     *
     * @returns {boolean}
     */
    static get isReadOnlySupported(): boolean;
    /**
     * Get Tool toolbox settings
     * icon - Tool icon's SVG
     * title - title to show in toolbox
     *
     * @returns {{icon: string, title: string}}
     */
    static get toolbox(): {
        title: string;
        icon: string;
    };
    /**
     * Whether validating on block is allowed
     * @returns {boolean}
     */
    get allowValidation(): boolean;
    /**
     * Check whether the saved data is valid to display
     * @param data
     * @returns {boolean}
     */
    isDataValid(data: ICodeBlockData): boolean;
    /**
     * Renders Block content
     *
     * @public
     *
     * @returns {HTMLDivElement}
     */
    render(): HTMLElement;
    /**
     * Return Block data
     *
     * @public
     *
     * @returns {ICodeBlockData}
     */
    save(): {
        language: string;
        code: string;
        caption: string;
    };
    /**
     * Validate date: Check if code is not empty
     * @param blockData
     * @returns
     */
    validate(blockData: ICodeBlockData): boolean;
    onContentUpdated(ev: Event): void;
    onInputAreaKeyDown(ev: KeyboardEvent): void;
    onSelectLanguage(language: string): void;
    onCopyContent(e: MouseEvent): Promise<void>;
    onAddCaption(): void;
    onCaptionKeyDown(e: KeyboardEvent): void;
    addCaption(caption?: string): void;
    /**
     * Render highlighted code based on given value
     * @param value
     */
    updateContent(value: string): void;
}
