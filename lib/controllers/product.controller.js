const ProductModel = require("../models/product.model");
const NotFoundError = require("../helper/ErrorMessages");
const uuid = require("uuid");

class Product {
  async getProducts(req, res) {
    try {
      const queryObj = { ...req.query };
      const excludedFields = ["page", "sort", "limit", "field"];
      excludedFields.forEach((field) => delete queryObj[field]);

      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );

      let query = ProductModel.find(JSON.parse(queryString));

      // sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-price");
      }

      // fields limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      // pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      if (req.query.page) {
        const numProducts = ProductModel.countDocuments();
        if (skip >= numProducts) {
          throw new Error("This page does not exist");
        }
      }

      const products = await query;

      res.status(200).json({
        status: "Success",
        result: products.length,
        data: products,
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
