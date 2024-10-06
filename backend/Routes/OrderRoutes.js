const express = require("express");
const orderrouter = express.Router();
//insert model
const Order = require("../Model/OrderModel")
//insert order controller
const OrderController = require("../Controllers/OrderControllers");

//create route path
orderrouter.get("/stats", OrderController.getOrderStats);
orderrouter.get("/category-stats", OrderController.getOrderCategoryStats);
orderrouter.get("/",OrderController.getAllOrders);
orderrouter.post("/",OrderController.addOrders);
orderrouter.get("/:orderID",OrderController.getByorderID);
orderrouter.put("/:orderID",OrderController.updateOrder);
orderrouter.delete("/:orderID",OrderController.deleteOrder);
orderrouter.patch("/update-status/:orderID", OrderController.updateOrderStatus);




//export
module.exports = orderrouter;