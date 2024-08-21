const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number,
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },

},{
    timestamps : true
})

const productModel = mongoose.model("product",productSchema)

module.exports = productModel