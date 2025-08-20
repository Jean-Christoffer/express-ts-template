export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500, options?: { cause?: unknown }) {
    super(message, options);
    this.statusCode = statusCode;
  }
}
