"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dish_1 = __importDefault(require("../models/Dish"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
class DishesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllDishes(req, res) {
        const allMenus = await Dish_1.default.find();
        if (allMenus.length == 0) {
            res.status(404).send("There are no dishes yet.");
        }
        else {
            res.status(200).send(allMenus);
        }
    }
    async getDishById(req, res) {
        const menuFound = await Dish_1.default.findById(req.params._id).populate('restaurant');
        if (menuFound == null) {
            res.status(404).send("Menu not found.");
        }
        else {
            res.status(200).send(menuFound);
        }
    }
    async addDish(req, res) {
        const dishFound = await Dish_1.default.findOne({ restaurant: req.body.restaurant, title: req.body.title,
            type: req.body.type, description: req.body.description, price: req.body.price });
        if (dishFound != null) {
            res.status(409).send("Dish already added");
        }
        const { restaurant, title, type, description, price, imageUrl, rating } = req.body;
        const newMenu = new Dish_1.default({ restaurant, title, type, description, price, imageUrl, rating });
        await newMenu.save();
        const restaurantUpdated = await Restaurant_1.default.findByIdAndUpdate({ _id: req.body.restaurant }, { $push: { listDishes: newMenu } });
        res.status(201).send('Dish added and restaurant updated.');
    }
    async updateDish(req, res) {
        const menuToUpdate = await Dish_1.default.findByIdAndUpdate(req.params._id, req.body);
        if (menuToUpdate == null) {
            res.status(404).send("Dish not found.");
        }
        else {
            res.status(201).send("Dish updated.");
        }
    }
    async deleteDish(req, res) {
        const dishToDelete = await Dish_1.default.findById(req.params._id);
        const restaurant = await Restaurant_1.default.findById(dishToDelete.restaurant._id);
        let dishesUpdated = restaurant.listDishes;
        if (dishToDelete == null) {
            res.status(404).send("Dish not found.");
            return;
        }
        if (restaurant == null) {
            res.status(404).send("Restaurant not found.");
            return;
        }
        for (let i = 0; i < restaurant.listDishes.length; i++) {
            if (restaurant.listDishes[i]._id == req.params._id) {
                dishesUpdated.splice(i, 1);
                await Dish_1.default.findByIdAndRemove(req.params._id);
                await Restaurant_1.default.findByIdAndUpdate({ _id: dishToDelete.restaurant._id }, { listDishes: dishesUpdated });
                res.status(200).send('Dish deleted and restaurant updated.');
                return;
            }
        }
    }
    routes() {
        this.router.get('/', this.getAllDishes);
        this.router.get('/:_id', this.getDishById);
        this.router.post('/', this.addDish);
        this.router.put('/:_id', this.updateDish);
        this.router.delete('/:_id', this.deleteDish);
    }
}
const dishesRoutes = new DishesRoutes();
exports.default = dishesRoutes.router;
