import { CustomErrorAbstract } from "./CustomErrorsAbstract";

export class NotFoundError extends CustomErrorAbstract {
  statusCode = 404;

  constructor() {
    super("Route not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}
