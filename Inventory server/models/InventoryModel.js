const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
    },
   
  },
  { timestamps: true }
);


module.exports = mongoose.model('Inventory', inventorySchema);



