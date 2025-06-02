import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  preparationTime: { type: Number, required: true }, 
  price: { type: Number, required: true },
  size: { type: String, required: true }, 
  section: {
    type: String,
    required: true,
    enum: ['burger', 'pizza', 'drinks', 'french fries', 'veggies']
  },
  img: {
    type: String,
    required: true
   
  }
});

const menu = mongoose.model("Menu", MenuItemSchema); 

export default menu;