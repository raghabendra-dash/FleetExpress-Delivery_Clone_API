import { ErrorHandler } from "../../../utils/errorHandler.js";
import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data) => {
  // Write your code here for placing a new order
  try {
    const newOrder = await OrderModel.create(data);
    return newOrder;
  } catch (error) {
    throw new ErrorHandler(500, error)
  }
};