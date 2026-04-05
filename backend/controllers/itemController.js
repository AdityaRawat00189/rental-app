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

const getMyLendedItems = async(req,res) => {
    try {
        const items = (await Item.find({owner: req.user._id}).sort({createdAt: -1}));
        // console.log(items);

        return res.status(200).json({
            success: true,
            count: items.length,
            items,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch your lended items",
            error: error.message
        });
    }
};

const getItems = async(req,res) => {
    try {
        console.log('Fetching items for user:', req.user._id);
        const {category} = req.query;
        const query = {
            status: 'Available',
            owner: {$ne : req.user._id}
        }
        if(category && category !== 'All') {
            query.category = category;
        }

        const items = await Item.find(query).sort({createdAt: -1}).populate('owner');
        console.log(items);
        return res.status(200).json({
            success: true,
            count: items.length,
            items,
        })
    } catch (error) {
        return res.status(500).json({message: "Failed to Fetch Items", error: error.message});
    }
}

const getItemById = async(req,res) => {
    try {
        const item = await Item.findById(req.params.id).populate('owner', 'name email hostel roomNumber phoneNumber');

        if(!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }
        return res.status(200).json({
            success: true,
            item,
        })
    } catch (error) {
        return res.status(400).json({
            message: "Failed to fetch item",
            error: error.message
        })
    }
}

const deleteItem = async(req,res) => {
    try {
        const item = await Item.findById(req.params.id);

        if(!item){
            return res.status(404).json({message:"Item not found"});
        }

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to delete this listing"});
        }

        // LOGIC TO DELETE IMAGES FROM CLOUDINARY 

        // Delete the item
        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Deletion Failed",
            error: error.message,
        });
    }
}

const updateItem = async(req,res) => {
    try {
        let item = await Item.findById(req.params.id);

        if(!item){
            return res.status(404).json({
                message: "Item not found",
            })
        }

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to update this listing"});
        }

        item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in updation",
            error: error.message,
        })
    }
}

module.exports = {
    createItem,
    getMyLendedItems,
    getItemById,
    deleteItem,
    updateItem,
    getItems,
}