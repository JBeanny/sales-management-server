const ProductModel = require("../models/product.model");
const NotFoundError = require("../helper/ErrorMessages");
const ApiFeatures = require("../helper/ApiFeatures");
const uuid = require("uuid");
const JsonApiSerializer = require("../helper/JsonApiSerializer");
const buildUrl = require("../helper/BuildUrl");

class Product {
  async getProducts(req, res) {
    try {
      const data = new ApiFeatures(ProductModel, req.query)
        .filter(["name"])
        .sort()
        .limitFields()
        .paginate();
      let products = await data.model;
      const productCount = await ProductModel.countDocuments();
      const queryOptions = await data.model.options;

      // limit per page
      const limitPerPage = queryOptions.limit;
      // get current page
      const page = queryOptions.skip / limitPerPage + 1;

      // get current url
      const currentUrl = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
      );

      //next page
      const hasNextPage =
        limitPerPage * page < productCount
          ? buildUrl(currentUrl, { "page[offset]": page + 1 })
          : null;

      //previous page
      const hasPreviousPage =
        queryOptions.skip / limitPerPage + 1 > 1
          ? buildUrl(currentUrl, { "page[offset]": page - 1 })
          : null;

      // last page
      const hasLastPage = buildUrl(currentUrl, {
        "page[offset]": (productCount * 1) / limitPerPage,
      });

      const links = {
        self: currentUrl,
        next: hasNextPage,
        previous: hasPreviousPage,
        last: hasLastPage,
      };

      products = await JsonApiSerializer(products, links);

      res.status(200).json({
        status: "Success",
        result: products.length,
        ...products,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createProduct(req, res) {
    try {
      const body = req.body;
      const data = {
        pid: uuid.v4(),
        name: body.name,
        subname: body.subname,
        price: body.price,
        unit: body.unit,
        added_date: new Date(),
        category: body.category,
      };

      const product = new ProductModel(data);
      product.save();

      res.status(201).json({
        status: "Success",
        message: "Successfully Created",
        data: product,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSingleProduct(req, res, next) {
    const id = req.params.id;
    try {
      const product = await ProductModel.findOne({ pid: id });
      if (!product) {
        return next(new NotFoundError(`Product ${id} is not found`));
      }
      res.status(200).json({
        status: "Success",
        data: product,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    try {
      const product = await ProductModel.findOneAndUpdate({ pid: id }, data, {
        runValidators: true,
      });

      if (!product) {
        return next(new NotFoundError(`Product ${id} is not found`));
      }

      res.status(200).json({
        status: "Success",
        message: "Successfully Updated",
        data: product,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(req, res, next) {
    const id = req.params.id;

    try {
      const product = await ProductModel.findOneAndDelete({ pid: id });
      if (!product) {
        return next(new NotFoundError(`Product ${id} is not found`));
      }

      res.status(200).json({
        status: "Success",
        message: "Successfully Deleted",
        data: product,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new Product();
