const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HELLO FROM SERVER😁");
});

const PRODUCT_ROUTES = require("./lib/routes/product.routes");
app.use("/api/v1/products", PRODUCT_ROUTES);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "Fail",
    message: err.message,
  });
});

module.exports = app;
