const { v4: uuidv4 } = require("uuid");
let products = [];

exports.getAllProducts = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let result = [...products];

  if (category) result = result.filter((p) => p.category === category);

  const start = (page - 1) * limit;
  res.json(result.slice(start, start + Number(limit)));
};

exports.getProductById = (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) throw new Error("Product not found");
  res.json(product);
};

exports.createProduct = (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) throw new Error("Product not found");
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) throw new Error("Product not found");
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
};

exports.searchProducts = (req, res) => {
  const { name } = req.query;
  const result = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(result);
};

exports.getStats = (req, res) => {
  const stats = {};
  for (let p of products) {
    stats[p.category] = (stats[p.category] || 0) + 1;
  }
  res.json(stats);
};
