"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Restaurant_1 = __importDefault(require("./Restaurant"));
const OwnerSchema = new mongoose_2.Schema({
    ownerName: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    listRestaurants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: Restaurant_1.default }] //Array containing the IDs of the restaurants.
});
exports.default = (0, mongoose_2.model)('Owner', OwnerSchema);
