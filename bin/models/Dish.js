"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const DishSchema = new mongoose_2.Schema({
    restaurant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String },
    rating: { type: Number }
});
exports.default = (0, mongoose_2.model)('Menu', DishSchema);
