import { CustomErrorAbstract } from "./CustomErrorsAbstract";

export class NotAuthorizedError extends CustomErrorAbstract {
  statusCode = 401;

  constructor() {
    super("Unauthorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Unauthorized" }];
  }
}
