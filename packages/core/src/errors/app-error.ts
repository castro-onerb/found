export class AppError extends Error {
    readonly message: string;
    readonly code: string;
    readonly detail?: string;

    constructor(
        message: string, options: { code: string; detail?: string; }
    ) {
        super(message);
        this.message = message;
        this.code = options.code;
        this.detail = options.detail;
    }
}