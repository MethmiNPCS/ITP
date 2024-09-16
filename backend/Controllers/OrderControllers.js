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

//data insert
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

//retrive data by using orderID
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


//export to the route
exports.getAllOrders = getAllOrders;
exports.addOrders = addOrders;
exports.getByorderID = getByorderID;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
