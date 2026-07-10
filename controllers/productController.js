const Product = require("../models/Product");


// CREATE PRODUCT

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            quantity,
            unit,
            location
        } = req.body;


        if (
            !name ||
            !category ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                message:
                    "Name, category, price and quantity are required"
            });
        }


        const product = await Product.create({
            farmer: req.user.id,
            name,
            category,
            description,
            price,
            quantity,
            unit,
            location
        });


        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to add product",
            error: error.message
        });
    }
};


// GET ALL PRODUCTS

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            available: true
        })
            .populate(
                "farmer",
                "name email location"
            )
            .sort({
                createdAt: -1
            });


        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch products",
            error: error.message
        });
    }
};


// GET LOGGED-IN FARMER PRODUCTS

exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            farmer: req.user.id
        }).sort({
            createdAt: -1
        });


        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch farmer products",
            error: error.message
        });
    }
};


// DELETE PRODUCT

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });


        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        await product.deleteOne();


        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete product",
            error: error.message
        });
    }
};