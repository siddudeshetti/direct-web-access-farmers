const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// DATABASE

connectDB();


// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// API ROUTES

app.use(
    "/api/auth",
    authRoutes
);
app.use("/api/orders", orderRoutes);
app.use(
    "/api/products",
    productRoutes
);


// PAGE ROUTES

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "index.html"
        )
    );
});


app.get("/register", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "register.html"
        )
    );
});


app.get("/login", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "login.html"
        )
    );
});


app.get("/farmer/dashboard", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "farmer",
            "dashboard.html"
        )
    );
});


app.get("/farmer/add-product", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "farmer",
            "add-product.html"
        )
    );
});


app.get("/farmer/products", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "farmer",
            "products.html"
        )
    );
});


app.get("/buyer/dashboard", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "buyer",
            "dashboard.html"
        )
    );
});


app.get("/buyer/products", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "buyer",
            "products.html"
        )
    );
});


// 404

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});