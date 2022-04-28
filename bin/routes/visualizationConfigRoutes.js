"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VisualizationConfig_1 = __importDefault(require("../models/VisualizationConfig"));
class VisualizationConfigRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    async getAllConfigs(req, res) {
        const allConfigs = await VisualizationConfig_1.default.find();
        if (allConfigs.length == 0) {
            res.status(404).send("There are no visualization configurations yet");
        }
        else {
            res.status(200).send(allConfigs);
        }
    }
    async getConfigCustomer(req, res) {
        const configFound = await VisualizationConfig_1.default.findOne({ customerName: req.params.customerName });
        if (configFound == null) {
            res.status(404).send("Restaurant not found");
        }
        else {
            res.status(200).send(configFound);
        }
    }
    async addConfig(req, res) {
        const configFound = await VisualizationConfig_1.default.findOne({ customerName: req.body.customerName });
        if (configFound != null) {
            res.status(409).send("Configuration already created");
            return;
        }
        const { customerName, colorMode, fontsize } = req.body;
        const newConfig = new VisualizationConfig_1.default({ customerName, colorMode: true, fontSize: 12 }); //Default values when first created.
        await newConfig.save();
        res.status(201).send('Configuration added');
    }
    async updateConfig(req, res) {
        const configToUpdate = await VisualizationConfig_1.default.findOneAndUpdate({ customerName: req.body.customerName, colorMode: req.body.colorMode,
            fontsize: req.body.fontSize });
        if (configToUpdate == null) {
            VisualizationConfig_1.default.findByIdAndUpdate({ customerName: req.body.customerName }, req.body);
            res.status(404).send("Configuration updated");
        }
        else {
            res.status(201).send('No changes detected, configuration already in use');
        }
    }
    async deleteConfigCustomer(req, res) {
        const configToDelete = await VisualizationConfig_1.default.findOneAndDelete({ customerName: req.params.customerName });
        if (configToDelete == null) {
            res.status(404).send("Configuration for selected customer not found.");
        }
        else {
            res.status(200).send('Restaurant deleted.');
        }
    }
    routes() {
        this.router.get('/', this.getAllConfigs);
        this.router.get('/customerName', this.getConfigCustomer);
        this.router.post('/', this.addConfig);
        this.router.put('/', this.updateConfig);
        this.router.delete('/customerName', this.deleteConfigCustomer);
    }
}
const visualizationConfigRoutes = new VisualizationConfigRoutes();
exports.default = visualizationConfigRoutes.router;
