"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const CustomerSchema = new mongoose_2.Schema({
    customerName: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    profilePic: { type: String },
    listTastes: [{
            tagName: { type: String },
            relevance: { type: Number } //This value will be dynamically updated with the user activity.
        }],
    listDiscounts: [{
            nameRestaurant: { type: String },
            amount: { type: Number },
            expirationDate: { type: String }
        }],
    listReservations: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Reservation" }],
    visualizationConfig: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "VisualizationConfig" }
});
exports.default = (0, mongoose_2.model)('Customer', CustomerSchema);
