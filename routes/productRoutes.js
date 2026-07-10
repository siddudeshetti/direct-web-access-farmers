const express = require("express");

const {
    createProduct,
    getProducts,
    getMyProducts,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    farmerOnly
} = require("../middleware/authMiddleware");


const router = express.Router();


router.get(
    "/",
    getProducts
);


router.get(
    "/mine",
    protect,
    farmerOnly,
    getMyProducts
);


router.post(
    "/",
    protect,
    farmerOnly,
    createProduct
);


router.delete(
    "/:id",
    protect,
    farmerOnly,
    deleteProduct
);


module.exports = router;