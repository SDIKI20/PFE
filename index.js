var path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const { pool } = require("./dbConfig")
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");
const passport = require("passport")

const initializePassport = require("./passportConfig.js")

const userRoutes = require("./api/routes/users");
const verificationRoutes = require("./api/routes/verificationRoutes");
const emailRoutes = require('./api/routes/emailRoutes');
const orders = require("./api/routes/orderRoutes");
const vehicles = require("./api/routes/vehiclesRoutes");

require("dotenv").config();

initializePassport(passport);

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_images",
        format: async (req, file) => "png",
        public_id: (req, file) => file.fieldname + "-" + Date.now(),
    },
});

// ✅ Enable CORS and Allow Credentials
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5000", "https://pfe-server-sandy.vercel.app", "https://pjr.vercel.app"],
    credentials: true
}));

// API Routes
app.use("/api/users", userRoutes);
app.use('/api/email', emailRoutes);
app.use("/api/sms", verificationRoutes);
app.use('/api/orders', orders);
app.use('/api/vehicles', vehicles);

app.use(flash());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("p404");
});

app.get("/", (req, res) => {
    res.render("index");
})


app.get("/p404", (req, res) => {
    res.render("p404");
})

app.get("/login",checkAuth, (req, res) => {
    res.render("login")
})

app.get("/signup",checkAuth, (req, res) => {
    res.render("signup")
})

app.get("/car/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const carResult = await pool.query(`
            SELECT 
                vehicles.*, 
                brands.name AS brand_name, 
                brands.logo, 
                office.country, 
                office.wilaya,  
                office.address, 
                office.city,
                ROUND(COALESCE(AVG(reviews.stars), 0), 1) AS stars,
                COUNT(DISTINCT reviews.id) AS reviews,
                COUNT(DISTINCT rentals.id) AS orders,

                -- Count of each star rating
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 1) AS s1,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 2) AS s2,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 3) AS s3,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 4) AS s4,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 5) AS s5

            FROM 
                vehicles
            JOIN 
                brands ON vehicles.brand_id = brands.id
            JOIN 
                office ON vehicles.location = office.id
            LEFT JOIN 
                reviews ON vehicles.id = reviews.vehicle_id
            LEFT JOIN 
                rentals ON vehicles.id = rentals.vehicle_id
            WHERE 
                vehicles.id = $1
            GROUP BY 
                vehicles.id, brands.id, office.id
            LIMIT 1;
        `, [id]);

        const carReviews = await pool.query(`
            SELECT 
                reviews.*,
                users.id AS user_id, users.fname, users.lname, users.username, users.image,
                rentals.id AS rental_id, rentals.total_price
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            JOIN rentals ON reviews.rental_id = rentals.id
            WHERE reviews.vehicle_id = $1
        `, [id])

        if (carResult.rows.length === 0) {
            return res.status(404).render("p404");
        }else{
            const car = carResult.rows[0];
            const reviews = carReviews.rows;
            res.render("home", { car:car, reviews:reviews, user: req.user, section:"detail" });
        }

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).render("p404");
    }
});

app.get("/home", checkNotAuth, async (req, res) => {
    try {
        const brandsResult = await pool.query("SELECT * FROM brands ORDER BY id ASC LIMIT 3");
        const brands = brandsResult.rows;

        const reviewsResult = await pool.query(`
            SELECT reviews.stars, reviews.review, reviews.created_at AS cdate,
            users.username AS username, users.lname AS lname, users.fname AS fname, users.image AS image,
            vehicles.model, vehicles.fab_year,
            brands.name AS brand
                FROM reviews
                JOIN users ON reviews.user_id = users.id
                JOIN vehicles ON reviews.vehicle_id = vehicles.id
                JOIN brands ON vehicles.brand_id = brands.id
                ORDER BY reviews.created_at LIMIT 10;
            `);
        const reviews = reviewsResult.rows;

        const officesResult = await pool.query("SELECT * FROM office ORDER BY id ASC");
        const offices = officesResult.rows;

        const vehiclePromises = brands.map(async (b) => {
            const vehiclesResult = await pool.query(`
                SELECT vehicles.*, brands.name AS brand_name, brands.id AS brand_id, brands.logo AS logo
                FROM vehicles
                JOIN brands ON vehicles.brand_id = brands.id
                WHERE brands.id = $1
                ORDER BY vehicles.id ASC LIMIT 5;
            `, [b.id]);

            return vehiclesResult.rows.length > 0 ? [vehiclesResult.rows, b] : null;
        });

        const vehicles = (await Promise.all(vehiclePromises)).filter(v => v !== null);

        res.render("home", { 
            user: req.user,
            brands: brands,
            reviews:reviews,
            vehicles: vehicles,
            offices: offices,
            section: "home"
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).render("p404");
    }
});

app.get("/cars", async (req, res) => {
    try{
        success_msg = Array.from([])
        error_msg = Array.from([])
        info_msg = Array.from([])
        warning_msg = Array.from([])
        const brandsResult = await pool.query("SELECT * FROM brands ORDER BY id DESC");
        const brands = brandsResult.rows;
        res.render("home", { user: req.user, brands, section : "cars" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/orders",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "orders" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/recent",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "recent" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/fav",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "fav" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/profile",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "profile" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/docs",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "docs" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})


app.get("/help",checkNotAuth, (req, res) => {
    try{
        res.render("home", { user: req.user, section : "help" });
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get("/logout", (req, res, next) => {
    try{
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("info_msg", "You have logged out");
            res.redirect("/login");
        });
    }catch(error){
            console.error(error);
            res.status(500).render("p404");
        }
});

const upload = multer({ storage: storage });

app.post('/reg', upload.single("image"), async (req, res) => {
    try {
        const { fname, lname, email, address, country, wilaya, city, zipcode, phone, phone_country_code, birthdate, username, password } = req.body;
        const role = "Client";

        // Get Cloudinary Image URL
        const imageUrl = req.file ? req.file.path : "./assets/images/user.jpg";

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Store Data in Database
        const newUser = await pool.query(
            `INSERT INTO users (fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING id, email, fname, lname, role, image`,
            [fname, lname, imageUrl, email, address, country, wilaya, city, zipcode, `+${phone_country_code}${phone}`, birthdate, username, hashedPassword, role]
        );

        // Delete the used token from the database
        await pool.query(`DELETE FROM user_tokens WHERE email = $1`, [email]);

        console.log("User registered successfully & token deleted.");
        
        req.flash("success_msg", "Registered successfully! Please log in.");
        res.redirect('/login');

    } catch (err) {
        console.error(err.message);
        res.status(500).render("p404");
    }
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}))

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/home")
    }
    next();
}

function checkNotAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});