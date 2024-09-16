const express = require("express");
const router = express.Router();
//insert model
const Order = require("../Model/OrderModel")
//insert order controller
const OrderController = require("../Controllers/OrderControllers");

//create route path
router.get("/",OrderController.getAllOrders);
router.post("/",OrderController.addOrders);
router.get("/:orderID",OrderController.getByorderID);
router.put("/:orderID",OrderController.updateOrder);
router.delete("/:orderID",OrderController.deleteOrder);

//export
module.exports = router;