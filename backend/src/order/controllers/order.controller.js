// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  // get order data from req body object
  const {
    shippingInfo,
    orderedItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
  } = req.body;

  const { _id: userId } = req.user;
  const paymentDate = new Date();

  try {
    const orderData = {
      user: userId,
      shippingInfo,
      orderedItems,
      paymentInfo,
      paidAt: paymentDate,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus,
    };

    // create new order
    const newOrder = await createNewOrderRepo(orderData);

    // send response to client
    res.status(201).send({ success: true, order: newOrder });
  } catch (error) {
    return next(new ErrorHandler(500, "Order does not created! Try again.."));
  }
};
