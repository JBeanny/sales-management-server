const BadRequestError = require("../helper/ErrorMessages");
const NotFoundError = require("../helper/ErrorMessages");

class Middlewares {
  bodyValidator(req, res, next) {
    if (!req.body) {
      return next(new BadRequestError(`Invalid/Undefined Body`));
    }
    return next();
  }

  paramValidator(req, res, next) {
    if (!req.params) {
      return next(new BadRequestError("Parameter is required"));
    }
    return next();
  }
}

module.exports = new Middlewares();
