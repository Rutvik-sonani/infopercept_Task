const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

const { faker } = require('@faker-js/faker');

function createRandomUser() {
    return {
        productName: faker.string.productName,
        brandName: faker.string.brandName,
        category: faker.string.category,
        productImage: [
            faker.image.avatar
        ],
        description: faker.string.description,
        price: faker.number.int(),
        sellingPrice: faker.number.int()
    };
}

async function FackProductController(req, res) {
    try {
        const sessionUserId = req.userId

        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied")
        }

        console.log("Hello")

        const uploadProduct = new productModel({
            productName: faker.commerce.productName(),
            brandName: faker.commerce.productMaterial(),
            category: faker.commerce.productAdjective(),
            productImage: [
                faker.image.business() 
            ],
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({ min: 11111, max: 99999 }) ,
            sellingPrice: faker.commerce.price({ min: 11111, max: 99999 })
        })

        console.log("uploadProduct : ", uploadProduct)

        console.log("FackData : ", createRandomUser)

        console.log("Hello2")

        

        setTimeout( async () => {
            const saveProduct = await uploadProduct.save()
            res.status(201).json({
                message: "Product upload successfully",
                error: false,
                success: true,
                data: saveProduct
            })
        },5000)

        

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = FackProductController