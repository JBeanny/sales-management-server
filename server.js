const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

const port = process.env.PORT || 8080;
const DB = process.env.DATABASE;

//connect to db
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
