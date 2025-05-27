const { pool } = require("../config/dbConfig");

const useCoupon = async (req, res) => {
    try {
        const { cid, uid } = req.body

        if (!cid || !uid) return res.status(400).json({error: "ID REQUIRED!"})

        await pool.query(`
            INSERT INTO coupons_use (coupon_id, user_id) VALUES ($1, $2)
        `, [cid, uid])
        res.status(200).json({
            message: "Coupon Used Successfully!"
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getCoupon = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({error: "ID REQUIRED!"})

        const discounts = await pool.query(`
            SELECT * FROM coupons
            WHERE id = $1
        `, [id])
        res.status(200).json({
            data: discounts.rows[0]
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getDiscount = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({error: "ID REQUIRED!"})

        const discounts = await pool.query(`
            SELECT * FROM coupons
            WHERE id = $1
        `, [id])
        res.status(200).json({
            data: discounts.rows[0]
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getCoupons = async (req, res) => {
    try {
        const {limit = 5, offset = 0, order = "created_at" } = req.query

        const discounts = await pool.query(`
            SELECT * FROM coupons
            WHERE 1=1
            ORDER BY $3 DESC LIMIT $1 OFFSET $2
        `, [limit, offset, order])

        const total = await pool.query(`
            SELECT count(id) FROM coupons WHERE 1=1
        `)

        res.status(200).json({
            data: discounts.rows,
            total: total.rows[0]
            
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getDiscounts = async (req, res) => {
    try {
        const {limit = 5, offset = 0, order = "created_at" } = req.query

        const discounts = await pool.query(`
            SELECT * FROM promo
            WHERE 1=1
            ORDER BY $3 DESC LIMIT $1 OFFSET $2
        `, [limit, offset, order])

        const total = await pool.query(`
            SELECT count(id) FROM promo WHERE 1=1
        `)

        res.status(200).json({
            data: discounts.rows,
            total: total.rows[0]
            
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAll = async (req, res) => {
    try {
        const { limit = 5, offset = 0, order = "created_at" } = req.query;

        const discounts = await pool.query(`
            SELECT * FROM (
                SELECT
                    'Coupon' AS type,
                    c.id,
                    c.name,
                    c.expires_at AS expire_on,
                    CASE 
                        WHEN c.expires_at IS NULL OR c.expires_at > NOW() THEN 'active'
                        ELSE 'expired'
                    END AS status,
                    c.code,
                    c.value AS discount,
                    COALESCE(c.usage_limit, 0) AS usage_limit,
                    c.created_at,
                    COALESCE(cu.uses, 0) AS uses
                FROM coupons c
                LEFT JOIN (
                    SELECT coupon_id, COUNT(*) AS uses
                    FROM coupons_use
                    GROUP BY coupon_id
                ) cu ON cu.coupon_id = c.id

                UNION ALL

                SELECT
                    'Discount' AS type,
                    p.id,
                    p.name,
                    p.expires_at AS expire_on,
                    CASE 
                        WHEN p.expires_at IS NULL OR p.expires_at > NOW() THEN 'active'
                        ELSE 'expired'
                    END AS status,
                    '' AS code,
                    p.value AS discount,
                    0 AS usage_limit,
                    p.created_at,
                    0 AS uses
                FROM promo p
            ) AS combined
            ORDER BY ${order} DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        const totalCoupons = await pool.query(`SELECT count(id) FROM coupons`);
        const totalDiscounts = await pool.query(`SELECT count(id) FROM promo`);

        res.status(200).json({
            discounts: discounts.rows,
            total: parseInt(totalCoupons.rows[0].count) + parseInt(totalDiscounts.rows[0].count)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addDiscount = async (req, res) => {
    try {
        const {expire, val, name} = req.body

        await pool.query(`
            INSERT INTO 
                promo (name, value, expires_at) 
            VALUES ($1, $2, $3)
        `,[name, val, expire])

        res.status(200).json({message: "Discount Added!"})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addCoupon = async (req, res) => {
    try {
        const {expire, val, code, limit, name} = req.body

        await pool.query(`
            INSERT INTO 
                coupons (name, code, value, usage_limit, expires_at) 
            VALUES ($1, $2, $3, $4, $5)
        `,[name, code, val, limit, expire])

        res.status(200).json({message: "Coupon Added!"})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const removeCoupon = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) return res.status(400).json({error: "ID Required!"})

        await pool.query(`
            DELETE FROM coupons WHERE id = $1
        `,[id])

        res.status(200).json({message: "Coupon deleted"})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const removeDiscount = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) return res.status(400).json({error: "ID Required!"})

        await pool.query(`
            DELETE FROM promo WHERE id = $1
        `,[id])

        res.status(200).json({message: "Discount deleted"})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { 
    useCoupon,
    getCoupon,
    getDiscount,
    getCoupons,
    getDiscounts,
    getAll,
    addDiscount,
    addCoupon,
    removeCoupon,
    removeDiscount
};