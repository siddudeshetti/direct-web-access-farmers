const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");


exports.createOrder = async (req, res) => {

    try {

        const {
            items,
            deliveryAddress
        } = req.body;


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Order must contain at least one product"

            });
        }


        if (
            !deliveryAddress ||
            !deliveryAddress.trim()
        ) {

            return res.status(400).json({

                message:
                    "Delivery address is required"

            });
        }


        const orderItems = [];

        let totalAmount = 0;



        for (const item of items) {

            const quantity =
                Number(item.quantity);


            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                return res.status(400).json({

                    message:
                        "Invalid product quantity"

                });
            }


            const product =
                await Product.findById(
                    item.productId
                );


            if (
                !product ||
                !product.available
            ) {

                return res.status(400).json({

                    message:
                        "Product is not available"

                });
            }


            if (
                quantity >
                product.quantity
            ) {

                return res.status(400).json({

                    message:
                        `Insufficient stock for ${product.name}`

                });
            }


            orderItems.push({

                product:
                    product._id,

                farmer:
                    product.farmer,

                name:
                    product.name,

                quantity,

                unit:
                    product.unit,

                price:
                    product.price

            });


            totalAmount +=
                product.price *
                quantity;


            product.quantity -= quantity;


            if (product.quantity === 0) {

                product.available = false;
            }


            await product.save();
        }



        const order =
            await Order.create({

                buyer:
                    req.user.id,

                items:
                    orderItems,

                totalAmount,

                deliveryAddress:
                    deliveryAddress.trim()

            });



        res.status(201).json({

            message:
                "Order placed successfully",

            order

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Unable to place order",

            error:
                error.message

        });
    }
};


exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            buyer: req.user.id
        })
            .populate("items.farmer", "name email location")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch orders",
            error: error.message
        });
    }
};


exports.getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            "items.farmer": req.user.id
        })
            .populate("buyer", "name email location")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch farmer orders",
            error: error.message
        });
    }
};