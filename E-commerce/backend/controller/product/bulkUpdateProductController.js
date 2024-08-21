const productModel = require('../../models/productModel');

const bulkUpdateProductController = async (req, res) => {
    try {
        const { productIds, status } = req.body;

        if (!productIds || productIds.length === 0) {
            return res.status(400).json({
                message: 'No products selected',
                error: true,
                success: false,
            });
        }

        console.log("req.body",req.body);

        // Update status of selected products
        const result = await productModel.updateMany(
            { _id: { $in: productIds } },
            { $set: { status } }
        );

        console.log("result",result)

        res.json({
            message: `${result._id} products1 updated successfully`,
            success: true,
            error: false,
        });
    } catch (err) {
        console.error('Bulk update error:', err);
        res.status(500).json({
            message: 'Error updating products',
            error: true,
            success: false,
        });
    }
};


module.exports = bulkUpdateProductController;
