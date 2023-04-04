const express = require('express');
const router = express.Router();
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require("mongoose");

const InventoryModel = require("../models/InventoryModel");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


router.get('/inventory', async (req, res) => {
  try {
    const inventory = await InventoryModel.find();
    if (inventory.length > 0) {
      res.status(200).json(inventory);
    } else {
      res.status(404).send({ status: false, message: "No such data found " });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});

router.get('/inventory/:id', async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid userId"
      });
    }
    const inventory = await InventoryModel.findById(userId);
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).send({ status: false, message: "No such data found " });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});

router.post('/inventory', async (req, res) => {
  try {
    const data = req.body;
    const { name, description, quantity } = data;
    if (!name || name == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide name"
      });
    }
    if (!description || description == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide description"
      });
    }
    if (!quantity || quantity == "") {
      return res.status(400).send({
        status: false,
        message: "Please provide quantity"
      });
    }
    const item = await InventoryModel.create(data);
    io.emit('inventory-update', item);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});

router.put('/inventory/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid userId"
      });
    }
    const item = await InventoryModel.findByIdAndUpdate(userId, req.body);
    io.emit('inventory-update', item);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});


router.delete('/inventory/:id', async (req, res) => {
  try {
    let userId = req.params.id
    if (userId) {
      if (!mongoose.isValidObjectId(userId))
        return res
          .status(400)
          .send({ Status: false, message: "Please enter valid userId" });
    }
    const item = await InventoryModel.findByIdAndDelete(userId);
    io.emit('inventory-update', item);
    res.status(200).json(item);
     
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});


io.on('connection', (socket) => {
  console.log('Client connected');
});

module.exports = router; 