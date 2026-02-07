const Item = require('../models/Item');

const createItem = async (req,res) => {
    try {
        const {
            title, description, category, pricePerDay, securityDeposit
        } = req.body;

        // 1. Validation
        if(!title || !description || !category || !pricePerDay ){
            return res.status(400).json({message: "Please provide all required fields."});
        }
        // 1.1 Image Validation
        if(!req.files || req.files.length == 0){
            return res.status(400).json({message: "At least one image is required."});
        }

        // 2. Map through req.files to extract the Cloudinary URLs
        // 'file.path' is the direct URL Cloudinary provides
        const imageUrls = req.files.map(file => file.path);
        console.log(imageUrls);
        // 3. Create the Item
        const item = await Item.create({
            owner: req.user._id,
            collegeName: req.user.collegeName,
            title, description, category, pricePerDay, securityDeposit, images: imageUrls,
        });

        return res.status(201).json({
            message: "Item listed successfully!",
            item
        })

    } catch (error) {
        return res.status(500).json({message: "Failed to list item", error: error.message});
    }
}

module.exports = {
    createItem,
}