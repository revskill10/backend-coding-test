/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Nullable<T> = T | null;

class StandardError extends Error {
  public errorCode: string;
  public lastError: Nullable<StandardError>;
  public context: any;

  constructor(errorCode: string, message: any, lastError: Nullable<StandardError>, context: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.errorCode = errorCode;
    this.message = message;
    this.stack = Error().stack;
    this.lastError = lastError;
    this.context = context;

    if (this.lastError) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.stack += '\n-\n' + lastError!.stack;
    }
  }
}

export default StandardError;
