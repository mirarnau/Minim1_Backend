"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ReservationSchema = new mongoose_2.Schema({
    _idCustomer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Customer" },
    _idRestaurant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Restaurant" },
    dateReservation: { type: String, required: true },
    timeReservation: { type: String, required: true },
    creationDate: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_2.model)('Reservation', ReservationSchema);
