export class AppError extends Error {
  readonly code: string;
  readonly detail?: string;

  constructor(message: string, options: { code: string; detail?: string }) {
    super(message);
    this.name = 'AppError';
    this.code = options.code;
    this.detail = options.detail;
  }
}
