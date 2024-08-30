const productModel = require("../../models/productModel")

const getProductAdminController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const sortField = req.query.sortField || 'productName';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const totalProducts = await productModel.countDocuments();

        const allProduct = await productModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ [sortField]: sortOrder });

        console.log("allProduct",allProduct);

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            message: "All Product",
            success: true,
            error: false,
            data: allProduct,
            totalPages: totalPages
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};


module.exports = getProductAdminController


// const handleSortProductStatus = async (sortField, sortOrder) => {
//     console.log("Sorting by:", sortField, sortOrder);

//     const queryParams = new URLSearchParams({
//         sortField: sortField,
//         sortOrder: sortOrder
//     });

//     const response = await fetch(`${SummaryApi.alladminProduct.url}?${queryParams.toString()}`);
//     const dataResponse = await response.json();

//     console.log(dataResponse);
// };
