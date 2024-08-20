const productModel = require("../../models/productModel");
const { Parser } = require('json2csv');

const exportProductController = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await productModel.find();

        // Define the fields to be included in the CSV file
        const fields = [
            { label: 'Product Name', value: 'productName' },
            { label: 'Brand Name', value: 'brandName' },
            { label: 'Category', value: 'category' },
            { label: 'Price', value: 'price' },
            { label: 'Selling Price', value: 'sellingPrice' },
            { label: 'Description', value: 'description' },
        ];

        // Create a new parser object and convert data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(products);

        // Set the correct headers to download the CSV file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

        // Send the CSV file
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting products:", error);
        res.status(500).json({ error: "Failed to export products" });
    }
};

module.exports = exportProductController;
