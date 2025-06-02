import express from "express";
import menu from "../models/menu.js";

const menuRouter = express.Router();

menuRouter.get("/item/:section", async (req, res) => {
  const section = req.params.section.toLowerCase();

  const validSections = [
    "burger",
    "pizza",
    "drinks",
    "french fries",
    "veggies",
  ];
  if (!validSections.includes(section)) {
    return res.status(400).json({ error: "Invalid section name" });
  }

  try {
    const items = await menu.find({ section });
    if (!items.length) {
      return res
        .status(404)
        .json({ message: `No items found in section: ${section}` });
    }
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Server error while fetching menu items" });
  }
});


menuRouter.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Please provide a name to search" });
  }

  try {
    const items = await menu.find({
      name: { $regex: name, $options: "i" },
    });
    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found matching your search" });
    }
    res.json(items);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error during search" });
  }
});


menuRouter.post("/addItem", async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Expected an array of items" });
    }

    const savedItems = await menu.insertMany(items);
    res.status(201).json({ message: "Menu items added!", items: savedItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding menu items" });
  }
});

export default menuRouter;
