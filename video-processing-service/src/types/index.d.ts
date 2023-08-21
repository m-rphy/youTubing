export {};

declare global {
  namespace Express {
    interface Response {
      locals: any;
    }
  }
}