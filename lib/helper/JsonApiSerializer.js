const JSONAPISerializer = require("jsonapi-serializer").Serializer;

const JsonApiSerializer = (data, links) => {
  return new JSONAPISerializer("products", {
    id: "pid",
    attributes: ["name", "subname", "price", "unit", "added_date", "category"],
    keyForAttribute: "underscore_case",
    topLevelLinks: {
      self: links?.self || "",
      previous: links?.previous || "",
      next: links?.next || "",
      last: links?.last || "",
    },
    typeForAttribute: () => {
      return "Product";
    },
  }).serialize(data);
};

module.exports = JsonApiSerializer;
