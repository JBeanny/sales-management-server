const Product = require("../controllers/product.controller");
const ErrorHandler = require("../helper/ErrorHandler");
const middlewares = require("../middlewares/middlewares");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(ErrorHandler(Product.getProducts))
  .post(middlewares.bodyValidator, ErrorHandler(Product.createProduct));

router
  .route("/:id")
  .get(middlewares.paramValidator, ErrorHandler(Product.getSingleProduct))
  .patch(
    middlewares.paramValidator,
    middlewares.bodyValidator,
    ErrorHandler(Product.updateProduct)
  )
  .delete(middlewares.paramValidator, ErrorHandler(Product.deleteProduct));

module.exports = router;
