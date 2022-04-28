"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
