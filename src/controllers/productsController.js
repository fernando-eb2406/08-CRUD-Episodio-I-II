const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const controller = {
  // Root - Show all products
  index: (req, res) => {
    // Do the magic
    const products = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'data', 'productsDataBase.json'))
    );
    return res.render('products', {products});
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    // Do the magic
    const {id} = req.params;
    const product = products.find((product) => product.id === +id);
    return res.render('detail', {product});
  },

  // Create - Form to create
  create: (req, res) => {
    // Do the magic
    return res.render('product-create-form');
  },

  // Create -  Method to store
  store: (req, res) => {
    // Do the magic
    const products = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'data', 'productsDataBase.json'))
    );
    const {name, price, discount, category, description} = req.body;
    const lastId = products[products.length - 1].id;

    products.push({
      name,
      category,
      discount,
      price,
      description,
      image: req.file && req.file.filename ? req.file.filename : 'default-image.png',
      id: +lastId + 1,
    });

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'data', 'productsDataBase.json'),
      JSON.stringify(products, null, 3),
      'utf-8'
    );

    return res.redirect('/products');
  },

  // Update - Form to edit
  edit: (req, res) => {
    // Do the magic
    const {id} = req.params;
    let product = products.find((product) => product.id === +id);
    return res.render('product-edit-form', {product});
  },
  // Update - Method to update
  update: (req, res) => {
    // Do the magic
    let oldProduct = products.find((product) => product.id == req.params.id);
    const {name, price, discount, category, description} = req.body;
    let {id} = req.params;
    let productact = products.map((product) => {
      if (product.id === +id) {
        let productact = {
          ...product,
          name,
          discount,
          category: +category,
          price: +price,
          description,
          image: req.file && req.file.filename ? req.file.filename : oldProduct.image,
        };
        return productact;
      }
      return product;
    });

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'data', 'productsDataBase.json'),
      JSON.stringify(productact, null, 3),
      'utf-8'
    );
    return res.redirect('/products');
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    // Do the magic
    const {id} = req.params;

    const productFilter = products.filter((product) => product.id !== +id);

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'data', 'productsDataBase.json'),
      JSON.stringify(productFilter, null, 3),
      'utf-8'
    );

    return res.redirect('/products');
  },
};

module.exports = controller;
