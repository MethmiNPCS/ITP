const Order = require("../Model/OrderModel");

//display data function
const getAllOrders = async (req, res, next) => {
    let Orders;
    //get all users
    try{
        orders = await Order.find();
    }catch(err){
        console.log.apply(err);
    }
    //not found
    if(!orders){
        return res.status(404).json({message:"Order not found"});
    }
    //Display all orders
    return res.status(200).json({orders});
};

//data insert - order
const addOrders = async (req, res, next) => {
    const{orderID,orderType, items, description, supplier} = req.body;
    let orders;

    try{
        orders = new Order({
            orderID,
            orderType,
            items,
            supplier,
            orderDate: new Date().toLocaleDateString(),
            description,
            status: "pending"
         });
         await orders.save();
    }catch(err){
        console.log(err);
    }

    //not inserting orders to db
    if(!orders){
        return res.status(404).json({message: "unable to add orders"});

    }
    return res.status(200).json({orders});
};

//retrive order data by using orderID
const getByorderID = async (req, res, next) => {
    
    const id = req.params.orderID;
    let order;

    try{
        order = await Order.findOne({orderID: id});
    }catch(err){
        console.log(err);
    }

    //order not available on db
    if(!order){
        return res.status(404).json({message: "Order not found"});
    }
    return res.status(200).json({order});
}

//update order data
const updateOrder = async (req, res, next) => {
    const id = req.params.orderID;
    const{items,itemId, quantity,unit, description} = req.body;

    let orders;

    try{
        orders = await Order.findOneAndUpdate({orderID: id},
            { description: description },
            
        );

        // Iterate over each item update and apply it
        for (const item of items) {
            await Order.updateOne(
                { orderID: id, "items._id": item._id },
                { $set: { "items.$.quantity": item.quantity } }
            );
        }
        await orders.save();

        
    }catch(err){
        console.log(err);
    }
    if(!orders){
        return res.status(404).json({message: "Unable to update order details"});

    }
    return res.status(200).json({orders});
    
};

//Delete an order
const deleteOrder = async (req, res, next) => {
    const id = req.params.orderID;

    let order;

    try{
        order = await Order.findOneAndDelete({orderID: id});
    }catch(err){
        console.log(err);
    }
    if(!order){
        return res.status(404).json({message: "Unable to delete the order"});

    }
    return res.status(200).json({order});
    
}

// Get Order Statistics: total orders, pending orders, and processed orders
const getOrderStats = async (req, res, next) => {
    try {
        // Count total orders
        const totalOrders = await Order.countDocuments();

        // Count pending orders
        const pendingOrders = await Order.countDocuments({ status: "pending" });

        // Count processed orders
        const processedOrders = await Order.countDocuments({ status: "processed" });

        // Send the response with the counts
        return res.status(200).json({ totalOrders, pendingOrders, processedOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving order stats" });
    }
};

const getOrderCategoryStats = async (req, res, next) => {
    try {
      const foodOrders = await Order.countDocuments({ orderType: 'Food' });
      const medicineOrders = await Order.countDocuments({ orderType: 'Medicine' });
      
      return res.status(200).json({
        foodOrders,
        medicineOrders,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed to retrieve order category stats" });
    }
  };

  // Update order status from pending to processed
const updateOrderStatus = async (req, res, next) => {
    const id = req.params.orderID; // Get orderID from the request parameters
    let order;

    try {
        // Find the order by orderID and update the status to 'processed'
        order = await Order.findOneAndUpdate(
            { orderID: id, status: "pending" }, // Match only if the status is 'pending'
            { status: "processed" }, // Update the status to 'processed'
            { new: true } // Return the updated order
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating order status" });
    }

    // If no order is found (maybe it's already processed or doesn't exist)
    if (!order) {
        return res.status(404).json({ message: "Order not found or already processed" });
    }

    return res.status(200).json({ message: "Order status updated successfully", order });
};




//export to the route
exports.getAllOrders = getAllOrders;
exports.addOrders = addOrders;
exports.getByorderID = getByorderID;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
exports.getOrderStats = getOrderStats;
exports.getOrderCategoryStats = getOrderCategoryStats;
exports.updateOrderStatus = updateOrderStatus;

