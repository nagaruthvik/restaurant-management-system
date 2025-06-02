import express from "express";
import Order from "../models/order.js";
import e from "express";

const orderRouter = express.Router();
orderRouter.post("/new", async (req, res) => {
  try {
    let { chefAssigned } = req.body;

    const orders = await Order.find({ orderStatus: "pending" });
    const usedTableNumbers = new Set(orders.map((order) => order.tableNo));
    let nextTableNo = 1;
    while (usedTableNumbers.has(nextTableNo)) {
      nextTableNo++;
    }

    if (!chefAssigned) {
      const chefs = ["manesh", "pritam", "yash", "tenzen"];

      const chefOrderCounts = await Promise.all(
        chefs.map(async (chef) => {
          const count = await Order.countDocuments({
            chefAssigned: chef,
            orderStatus: { $in: ["pending", "in-progress"] },
          });
          return { chef, count };
        })
      );
      const minCount = Math.min(...chefOrderCounts.map((c) => c.count));
      const availableChefs = chefOrderCounts.filter(
        (c) => c.count === minCount
      );
      chefAssigned =
        availableChefs[Math.floor(Math.random() * availableChefs.length)].chef;
    }

    const newOrder = new Order({
      ...req.body,
      tableNo: nextTableNo,
      chefAssigned: chefAssigned,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
  }
});

orderRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { orderStatus, chefAssigned } = req.body;

  try {
    const updateData = { orderStatus };
    if (orderStatus === "delivered" || orderStatus === "cancelled") {
      updateData.tableNo = undefined;
      updateData.chefAssigned = "none";
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating order", error: error.message });
  }
});

orderRouter.get("/today", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all orders", error: error.message });
  }
});
orderRouter.get("/stats", async (req, res) => {
  try {
    const [orderAgg, clientAgg] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalOrder: { $sum: 1 },
            chefs: { $addToSet: "$chefAssigned" },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$orderUserPhone",
          },
        },
      ]),
    ]);
    const totalChef = orderAgg[0]?.chefs?.length || 0;
    const totalRevenue = orderAgg[0]?.totalRevenue || 0;
    const totalOrder = orderAgg[0]?.totalOrder || 0;
    const totalClients = clientAgg.length;

    res.json({ totalChef, totalRevenue, totalOrder, totalClients });
  } catch (err) {
    res
      .status(500)
      .json({ totalChef: 0, totalRevenue: 0, totalOrder: 0, totalClients: 0 });
  }
});

orderRouter.get("/summary", async (req, res) => {
  try {
    const { type = "daily" } = req.query;
    let dateFrom;
    const now = new Date();

    if (type === "daily") {
      dateFrom = new Date(now);
      dateFrom.setDate(now.getDate() - 6);
      dateFrom.setHours(0, 0, 0, 0);
    } else if (type === "monthly") {
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    } else if (type === "yearly") {
      dateFrom = new Date(now.getFullYear() - 6, 0, 1);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const summary = await Order.aggregate([
      { $match: { date: { $gte: dateFrom } } },
      {
        $group: {
          _id: null,
          takeawayCount: {
            $sum: { $cond: ["$isTakeaway", 1, 0] },
          },
          servedCount: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          dineInCount: {
            $sum: { $cond: ["$isTakeaway", 0, 1] },
          },
        },
      },
    ]);

    const result = summary[0] || {
      takeawayCount: 0,
      servedCount: 0,
      dineInCount: 0,
    };

    res.json({
      takeaway: result.takeawayCount,
      served: result.servedCount,
      dineIn: result.dineInCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
orderRouter.get("/revenue-summary", async (req, res) => {
  try {
    const { type = "daily" } = req.query;
    let groupId, dateFrom;
    const now = new Date();

    if (type === "daily") {
      groupId = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      };
      dateFrom = new Date(now);
      dateFrom.setDate(now.getDate() - 6);
      dateFrom.setHours(0, 0, 0, 0);
    } else if (type === "monthly") {
      groupId = {
        year: { $year: "$date" },
        month: { $month: "$date" },
      };
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    } else if (type === "yearly") {
      groupId = {
        year: { $year: "$date" },
      };
      dateFrom = new Date(now.getFullYear() - 6, 0, 1);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const summary = await Order.aggregate([
      { $match: { date: { $gte: dateFrom } } },
      {
        $group: {
          _id: groupId,
          totalRevenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.get("/table-status", async (req, res) => {
  try {
    const activeOrders = await Order.find({
      orderStatus: { $in: ["pending", "in-progress"] },
    });

    const occupiedTables = new Set(activeOrders.map((order) => order.tableNo));
    res.json({ occupiedTables: Array.from(occupiedTables) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.get("/chef-stats", async (req, res) => {
  try {
    const allChefs = ["manesh", "pritam", "yash", "tenzen"];
    const chefs = await Order.aggregate([
      {
        $group: {
          _id: "$chefAssigned",
          count: { $sum: 1 },
        },
      },
    ]);
    const chefMap = {};
    chefs.forEach((c) => {
      chefMap[c._id] = c.count;
    });
    const result = allChefs.map((name) => ({
      name,
      count: chefMap[name] || 0,
    }));
    res.json({ chefs: result });
  } catch (err) {
    res.status(500).json({ chefs: [] });
  }
});
export default orderRouter;
