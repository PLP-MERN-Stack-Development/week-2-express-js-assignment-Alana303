// controllers/productController.js

const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');

// In-memory array to store products
let products = [];

// Helper: filter, paginate, search, stats
function getProducts(req, res, next) {
  let result = [...products];

  // Filtering by category: ?category=electronics
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  // Search by name: ?search=phone
  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(term));
  }

  // Pagination: ?page=2&limit=5
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = result.slice(start, end);

  res.json({
    page,
    limit,
    total: result.length,
    data: paginated,
  });
}

function getProductById(req, res, next) {
  const { id } = req.params;
  const product = products.find(p => p.id === id);
  if (!product) {
    return next(new NotFoundError(`Product with id ${id} not found`));
  }
  res.json(product);
}

function createProduct(req, res, next) {
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
}

function updateProduct(req, res, next) {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return next(new NotFoundError(`Product with id ${id} not found`));
  }
  // ValidateProduct middleware ensures body is correct
  const { name, description, price, category, inStock } = req.body;
  const updated = { id, name, description, price, category, inStock };
  products[productIndex] = updated;
  res.json(updated);
}

function deleteProduct(req, res, next) {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return next(new NotFoundError(`Product with id ${id} not found`));
  }
  products.splice(productIndex, 1);
  res.status(204).send();
}

// Statistics: count by category
function getProductStats(req, res, next) {
  const stats = products.reduce((acc, p) => {
    const cat = p.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  res.json(stats); // e.g., { electronics: 5, books: 2 }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};
