"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const RestaurantSchema = new mongoose_2.Schema({
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Owner" },
    restaurantName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    photos: [],
    rating: { type: Number },
    creationDate: { type: Date, default: Date.now },
    listTags: [{
            tagName: { type: String }
        }],
    listDishes: [] //Array containing the IDs of the menus.
});
exports.default = (0, mongoose_2.model)('Restaurant', RestaurantSchema);
