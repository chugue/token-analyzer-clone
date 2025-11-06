export type Result<T> =
  | {
      success: true;
      data: T;
      status?: number;
    }
  | {
      success: false;
      message: string;
      status?: number;
      error?: Error;
    };
