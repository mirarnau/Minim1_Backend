"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Owner_1 = __importDefault(require("../models/Owner"));
class RestaurantsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllRestaurants(req, res) {
        const allRestaurants = await Restaurant_1.default.find();
        if (allRestaurants.length == 0) {
            res.status(404).send("There are no restaurants yet.");
        }
        else {
            res.status(200).send(allRestaurants);
        }
    }
    async getRestaurantByName(req, res) {
        const restaurantFound = await Restaurant_1.default.findOne({ restaurantName: req.params.restaurantName });
        if (restaurantFound == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send(restaurantFound);
        }
    }
    async getRestaurantById(req, res) {
        const restaurantFound = await Restaurant_1.default.findById(req.params._id).populate('owner');
        if (restaurantFound == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send(restaurantFound);
        }
    }
    async addRestaurant(req, res) {
        const restaurantFound = await Restaurant_1.default.findOne({ restaurantName: req.body.restaurantName });
        if (restaurantFound != null) {
            res.status(409).send("This restaurant already exists.");
            return;
        }
        const ownerFound = await Owner_1.default.findById({ _id: req.body.owner });
        if (ownerFound == null) {
            res.status(404).send("Onwer not found.");
            return;
        }
        const { owner, restaurantName, email, address, description, listTags } = req.body;
        const newRestaurant = new Restaurant_1.default({ owner, restaurantName, email, address, description, listTags, rating: 0 });
        let newRestaurantID;
        await newRestaurant.save().then(restaurant => {
            newRestaurantID = restaurant._id.toString();
        });
        await Owner_1.default.findByIdAndUpdate({ _id: req.body.owner }, { $push: { listRestaurants: newRestaurantID } });
        res.status(201).send('Restaurant added and owner updated.');
    }
    async updateRestaurant(req, res) {
        const customerToUpdate = await Restaurant_1.default.findByIdAndUpdate(req.params._id, req.body);
        if (customerToUpdate == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(201).send('Restaurant updated.');
        }
    }
    async deleteRestaurant(req, res) {
        const restaurantToDelete = await Restaurant_1.default.findByIdAndDelete(req.params._id);
        if (restaurantToDelete == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send('Restaurant deleted.');
        }
    }
    async filterRestaurants(req, res) {
        const listTastesCustomer = req.body.tags;
        if (listTastesCustomer.length == 0) {
            res.status(409).send("No tags specidfied in the petition.");
        }
        else {
            const tagsList = listTastesCustomer.map(taste => taste.tagName);
            const allRestaurants = await (Restaurant_1.default.find());
            const filteredResutaurants = allRestaurants.filter((restaurant) => {
                let tagsMatches = 0;
                for (let i = 0; i < tagsList.length; i++) {
                    const tagsRestaurant = restaurant.listTags.map((tag) => tag.tagName);
                    console.log(tagsList[i]);
                    console.log(tagsRestaurant);
                    if (tagsRestaurant.includes(tagsList[i])) {
                        tagsMatches++;
                        if (tagsMatches == tagsList.length) {
                            return restaurant;
                        }
                    }
                }
            });
            if (filteredResutaurants.length == 0) {
                res.status(404).send("Any restaurant fulfills the requirements.");
            }
            else {
                res.status(200).send(filteredResutaurants);
            }
        }
    }
    async sortByRating(req, res) {
        const allRestaurants = await Restaurant_1.default.find();
        if (allRestaurants == null) {
            res.status(404).send("There are no restaurants yet.");
        }
        else {
            const sortedRestaurants = allRestaurants.sort((n1, n2) => {
                if (n1.rating > n2.rating) {
                    return -1;
                }
                if (n1.rating < n2.rating) {
                    return 1;
                }
                return 0;
            });
            res.status(200).send(sortedRestaurants);
        }
    }
    routes() {
        this.router.get('/', this.getAllRestaurants);
        this.router.get('/:_id', this.getRestaurantById);
        this.router.get('/name/:restaurantName', this.getRestaurantByName);
        this.router.get('/filters/tags', this.filterRestaurants);
        this.router.get('/filters/rating', this.sortByRating);
        this.router.post('/', this.addRestaurant);
        this.router.put('/:_id', this.updateRestaurant);
        this.router.delete('/:_id', this.deleteRestaurant);
    }
}
const restaurantsRoutes = new RestaurantsRoutes();
exports.default = restaurantsRoutes.router;
