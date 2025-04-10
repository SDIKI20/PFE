process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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

app.get("/", async (req, res) => {
    try{
        const officeRows = await pool.query(`
            SELECT * FROM office WHERE 1 = 1
        `)
        offices = officeRows.rows.length === 0?null:officeRows.rows
        res.render("index", {offices:offices});
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
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

app.get("/dashboard", async (req, res) => {
    const officesResult = await pool.query("SELECT * FROM office ORDER BY id ASC");
    const offices = officesResult.rows;
    res.render("dashboard", {section:"dashboard", o:offices})
})

app.get("/settings", async (req, res) => {
    res.render("dashboard", {section:"settings"})
})

app.get("/car/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;  // Assuming the user object is attached to the request
        
        // Query to fetch car details and review statistics
        const carResult = await pool.query(`
            SELECT 
                vehicles.*, 
                brands.name AS brand_name, 
                brands.logo, 
                office.country, 
                office.wilaya,  
                office.address, 
                office.city,
                office.latitude,
                office.longitude,
                ROUND(COALESCE(AVG(reviews.stars), 0), 1) AS stars,
                COUNT(DISTINCT reviews.id) AS reviews,
                COUNT(DISTINCT rentals.id) AS orders,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 1) AS s1,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 2) AS s2,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 3) AS s3,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 4) AS s4,
                COUNT(reviews.id) FILTER (WHERE reviews.stars = 5) AS s5,
                CASE WHEN COUNT(f.vehicle_id) > 0 THEN true ELSE false END AS is_favorite
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
            LEFT JOIN 
                favorites f ON f.user_id = $1 AND f.vehicle_id = vehicles.id
            WHERE 
                vehicles.id = $2
            GROUP BY 
                vehicles.id, brands.id, office.id
            LIMIT 1;
        `, [userId, id]);

        // Query to fetch reviews for the car
        const carReviews = await pool.query(`
            SELECT 
                reviews.*,
                users.id AS user_id, users.fname, users.lname, users.username, users.image,
                rentals.id AS rental_id, rentals.total_price
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            JOIN rentals ON reviews.rental_id = rentals.id
            WHERE reviews.vehicle_id = $1
        `, [id]);

        if (carResult.rows.length === 0) {
            return res.status(404).render("p404");
        } else {
            const car = carResult.rows[0];
            const reviews = carReviews.rows;
            res.render("home", { car: car, reviews: reviews, user: req.user, section: "detail" });
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
    try {
        const {
            search,
            brand,
            rtype,
            trans,
            capacity,
            body,
            fuel,
            availability,
            pricem,
            priceM,
            limit = 15,
            offset = 0
        } = req.query;

        const userId = req.user ? req.user.id : null; 
        
        let query = `
        SELECT v.*, 
                b.name AS brand_name, 
                b.logo AS brand_logo,
                o.wilaya, 
                COALESCE(r.stars, 0) AS stars,
                COALESCE(r.reviews, 0) AS reviews,
                COALESCE(rn.orders, 0) AS orders,
                CASE WHEN f.vehicle_id IS NOT NULL THEN true ELSE false END AS is_favorite
        FROM vehicles v
        JOIN brands b ON v.brand_id = b.id
        JOIN office o ON v.location = o.id
        LEFT JOIN (
            SELECT vehicle_id, 
                    ROUND(AVG(stars), 1) AS stars, 
                    COUNT(*) AS reviews
            FROM reviews
            GROUP BY vehicle_id
        ) r ON v.id = r.vehicle_id
        LEFT JOIN (
            SELECT vehicle_id, 
                    COUNT(*) AS orders
            FROM rentals
            GROUP BY vehicle_id
        ) rn ON v.id = rn.vehicle_id
        LEFT JOIN favorites f ON f.user_id = $1 AND f.vehicle_id = v.id
        WHERE 1=1
        `;

        const values = [userId];
        let index = 2; 

        if (search) {
            query += ` AND (LOWER(b.name) LIKE $${index} OR LOWER(v.model) LIKE $${index})`;
            values.push(`%${search.toLowerCase()}%`);
            index++;
        }

        if (brand) {
            const brands = Array.isArray(brand) ? brand : brand.split(',');
            const placeholders = brands.map(() => `$${index++}`);
            query += ` AND LOWER(b.name) IN (${placeholders.join(", ")})`;
            values.push(...brands.map(b => b.toLowerCase()));
        }

        if (rtype) {
            query += ` AND v.rental_type = $${index}`;
            values.push(rtype.toLowerCase());
            index++;
        }

        if (trans) {
            query += ` AND LOWER(v.transmission::TEXT) = $${index}`;
            values.push(trans.toLowerCase());
            index++;
        }

        if (capacity) {
            if (capacity > 4) {
                query += ` AND v.capacity > $${index}`;
            } else {
                query += ` AND v.capacity = $${index}`;
            }
            values.push(parseInt(capacity));
            index++;
        }

        if (body) {
            const bodies = Array.isArray(body) ? body : body.split(',');
            const placeholders = bodies.map(() => `$${index++}`);
            query += ` AND LOWER(v.body::TEXT) IN (${placeholders.join(", ")})`;
            values.push(...bodies.map(b => b.toLowerCase()));
        }

        if (fuel) {
            const fuels = Array.isArray(fuel) ? fuel : fuel.split(',');
            const placeholders = fuels.map(() => `$${index++}`);
            query += ` AND LOWER(v.fuel::TEXT) IN (${placeholders.join(", ")})`;
            values.push(...fuels.map(f => f.toLowerCase()));
        }

        if (availability !== undefined) {
            query += ` AND v.availability = $${index}`;
            values.push(parseInt(availability));
            index++;
        }

        if (pricem) {
            query += ` AND v.price >= $${index}`;
            values.push(parseFloat(pricem));
            index++;
        }

        if (priceM) {
            query += ` AND v.price <= $${index}`;
            values.push(parseFloat(priceM));
            index++;
        }

        query += ` ORDER BY stars DESC LIMIT $${index}`;
        values.push(parseInt(limit));
        index++;

        query += ` OFFSET $${index}`;
        values.push(parseInt(offset));

        const carsResult = await pool.query(query, values);
        const cars = carsResult.rows.length > 0 ? carsResult.rows : null;

        const brandsResult = await pool.query(`SELECT * FROM brands`);
        const brandsList = brandsResult.rows.length > 0 ? brandsResult.rows : null;

        const fuelResult = await pool.query(`SELECT unnest(enum_range(NULL::fuel_type))`);
        const fuelTypes = fuelResult.rows.length > 0 ? fuelResult.rows : null;

        const bodyResult = await pool.query(`SELECT unnest(enum_range(NULL::body_type))`);
        const bodyTypes = bodyResult.rows.length > 0 ? bodyResult.rows : null;

        const transResult = await pool.query(`SELECT unnest(enum_range(NULL::transmission_type))`);
        const transTypes = transResult.rows.length > 0 ? transResult.rows : null;

        res.render("home", {
            user: req.user,
            cars: cars,
            brands: brandsList,
            fuelTypes: fuelTypes,
            bodyTypes: bodyTypes,
            transTypes: transTypes,
            filters: req.query,
            section: "cars"
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("p404");
    }
});

app.get("/rentals", checkNotAuth, async (req, res) => {
    try {
        const {
            search,      // a general search input
            start_date,
            end_date,
            status
        } = req.query;

        const values = [req.user.id];
        const conditions = ["user_id = $1"];
        let index = values.length + 1;

        if (search) {
            conditions.push(`(
                brands.name ILIKE $${index} OR
                vehicles.model ILIKE $${index} OR
                CAST(vehicles.fab_year AS TEXT) ILIKE $${index}
            )`);
            values.push(`%${search}%`);
            index++;
        }

        if (start_date) {
            conditions.push(`rentals.start_date >= $${index++}`);
            values.push(start_date);
        }

        if (end_date) {
            conditions.push(`rentals.end_date <= $${index++}`);
            values.push(end_date);
        }

        if (status) {
            conditions.push(`rentals.status = $${index++}`);
            values.push(status);
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;

        const rentalsResult = await pool.query(`
            SELECT rentals.*,
                   vehicles.model, vehicles.fab_year, vehicles.rental_type,
                   brands.name AS brand_name
            FROM rentals 
            JOIN vehicles ON vehicles.id = rentals.vehicle_id
            JOIN brands ON vehicles.brand_id = brands.id
            ${whereClause}
            ORDER BY rentals.created_at DESC
        `, values);

        const rentals = rentalsResult.rows.length > 0 ? rentalsResult.rows : null;

        res.render("home", {
            user: req.user,
            section: "rentals",
            filters: req.query,
            rentals
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("p404");
    }
});

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
/*-----------dashboard.ejs----------------*/
app.get('/order',checkNotAuth, (req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"order"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
app.get('/dashboard',checkNotAuth,(req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"dashboard"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})

app.get('/customers',checkNotAuth,(req, res) => {
        try{
          res.render("dashboard",{user: req.user, section:"customers"}    
    )
    
    
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
app.get('/account',checkNotAuth,(req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"account"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
app.get('/report',checkNotAuth,(req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"report"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
app.get('/settings',checkNotAuth,(req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"settings"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
app.get('/vehicules',checkNotAuth,(req, res) => {
    try{
    res.render("dashboard",{user: req.user, section:"vehicules"})
    }catch(error){
        console.error(error);
        res.status(500).render("p404");
    }
})
/*--------*/ 

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