export interface IImport {
    default: unknown;
}
export declare const Utils: {
    CopyTextToClipBoard: (text: string) => Promise<boolean>;
    IsImport: (obj: unknown) => obj is IImport;
};
