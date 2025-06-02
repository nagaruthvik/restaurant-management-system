import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;

const AutoIncrement = AutoIncrementFactory(connection);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  timeOfOrder: {
    type: String,
    required: true,
  },
  tableNo: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  instructions: {
    type: String,
    default: " ",
  },
  orderItems: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  chefAssigned: {
    type: String,
    enum: ["manesh", "pritam", "yash", "tenzen"],
    required: true,
  },
  orderUserName: {
    type: String,
    required: true,
  },
  orderUserPhone: {
    type: String,
    required: true,
  },
  timeToDeliver: {
    type: Number,
    required: true,
  },
  isTakeaway: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: function () {
      return this.isTakeaway;
    },
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderId", start_seq: 100 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
