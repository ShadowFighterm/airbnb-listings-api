// routes/listings.js
const express = require('express');
const Listing = require('../models/listings');
const router = express.Router();
// GET /api/listing - Fetch filtered, paginated, and sorted listings
router.get('/listing', async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Default page is 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
        const skip = (page - 1) * limit;

        // Build the query object dynamically based on query parameters
        const filters = {};

        if (req.query.minPrice || req.query.maxPrice) {
            filters.price = {};
            if (req.query.minPrice) filters.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filters.price.$lte = parseFloat(req.query.maxPrice);
        }

        if (req.query.property_type) {
            filters.property_type = req.query.property_type;
        }

        if (req.query.bedrooms) {
            filters.bedrooms = parseInt(req.query.bedrooms, 10);
        }

        // Determine the sorting order
        let sort = {};
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(':'); // Example: "price:asc" or "price:desc"
            sort[field] = order === 'desc' ? -1 : 1; // Use -1 for descending, 1 for ascending
        }

        // Fetch filtered, paginated, and sorted data
        const listings = await Listing.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get the total count of matching documents
        const totalCount = await Listing.countDocuments(filters);

        res.json({
            data: listings,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: 'An error occurred while fetching listings' });
    }
});


module.exports = router;