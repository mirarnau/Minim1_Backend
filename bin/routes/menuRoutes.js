"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Menu_1 = __importDefault(require("../models/Menu"));
class MenuRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllMenus(req, res) {
        const allMenus = await Menu_1.default.find();
        if (allMenus.length == 0) {
            res.status(404).send("There are no menus yet.");
        }
        else {
            res.status(200).send(allMenus);
        }
    }
    async getMenuById(req, res) {
        const menuFound = await Menu_1.default.findById(req.params._id).populate('restaurant');
        if (menuFound == null) {
            res.status(404).send("Menu not found.");
        }
        else {
            res.status(200).send(menuFound);
        }
    }
    async addMenu(req, res) {
        const { restaurant, title, type, description, price } = req.body;
        const newMenu = new Menu_1.default({ restaurant, title, type, description, price });
        await newMenu.save();
        res.status(201).send('Menu added.');
    }
    async updateMenu(req, res) {
        const menuToUpdate = await Menu_1.default.findByIdAndUpdate(req.params._id, req.body);
        if (menuToUpdate == null) {
            res.status(404).send("Menu not found.");
        }
        else {
            res.status(201).send("Menu updated.");
        }
    }
    async deleteMenu(req, res) {
        const menuToDelete = await Menu_1.default.findByIdAndDelete(req.params._id);
        if (menuToDelete == null) {
            res.status(404).send("Menu not found.");
        }
        else {
            res.status(200).send('Menu deleted.');
        }
    }
    routes() {
        this.router.get('/', this.getAllMenus);
        this.router.get('/:_id', this.getMenuById);
        this.router.post('/', this.addMenu);
        this.router.put('/:_id', this.updateMenu);
        this.router.delete('/:_id', this.deleteMenu);
    }
}
const menusRoutes = new MenuRoutes();
exports.default = menusRoutes.router;
