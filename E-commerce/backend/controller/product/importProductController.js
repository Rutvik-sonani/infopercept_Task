const fs = require('fs');
const csv = require('csv-parser');
const productModel = require('../../models/productModel');

const importProductController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false
      });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const insertedProducts = [];

          for (const product of results) {
            // Check if the product already exists in the database
            const existingProduct = await productModel.findOne(product);
            if (!existingProduct) {
              const newProduct = new productModel(product);
              await newProduct.save();
              insertedProducts.push(newProduct);
            }
          }

          res.status(201).json({
            message: `${insertedProducts.length} products imported successfully`,
            error: false,
            success: true,
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            message: 'Error importing products',
            error: true,
            success: false,
          });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: 'Error importing products',
      error: true,
      success: false,
    });
  }
};

module.exports = importProductController;


// const productModel = require('../../models/productModel');
// const XLSX = require('xlsx');

// const importProductController = async (req, res) => {
//   console.log("Hello1");
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No file uploaded",
//         error: true,
//         success: false
//       });
//     }

//     console.log("Hello2");

//     const workbook = XLSX.readFile(req.file.path);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     console.log(worksheet);
//     const products = XLSX.utils.sheet_to_json(worksheet);


//     console.log("Hello3");
//     console.log(products);

//     for (const product of products) {
//       const newProduct = new productModel(product);
//       console.log("np",newProduct);
//       await newProduct.save();
//     }

//     console.log("p",products);

//     res.status(201).json({
//       message: "Products imported successfully",
//       error: false,
//       success: true,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       message:  'Error importing products',
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = importProductController;
