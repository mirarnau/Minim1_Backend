"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VisualizationConfig = new mongoose_1.Schema({
    customerName: { type: String, required: true },
    colorMode: { type: Boolean, required: true },
    fontSize: { type: Number, required: true } //0: small size (7), 1: medium size (12), 2: big size (18) (Default is medium)
});
exports.default = (0, mongoose_1.model)('VisualizationConfig', VisualizationConfig);
