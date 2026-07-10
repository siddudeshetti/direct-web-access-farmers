const express = require("express");

const {
    createOrder,
    getMyOrders,
    getFarmerOrders
} = require("../controllers/orderController");

const {
    protect,
    farmerOnly
} = require("../middleware/authMiddleware");


const router = express.Router();


router.post("/", protect, createOrder);

router.get("/mine", protect, getMyOrders);

router.get(
    "/farmer",
    protect,
    farmerOnly,
    getFarmerOrders
);


module.exports = router;