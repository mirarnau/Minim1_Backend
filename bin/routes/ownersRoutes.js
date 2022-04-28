"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Owner_1 = __importDefault(require("../models/Owner"));
class OwnersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllOwners(req, res) {
        const allOwners = await Owner_1.default.find();
        if (allOwners.length == 0) {
            res.status(404).send("There are no owners yet.");
        }
        else {
            res.status(200).send(allOwners);
        }
    }
    async getOwnerById(req, res) {
        const ownerFound = await Owner_1.default.findById(req.params._id).populate("listRestaurants");
        if (ownerFound == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send(ownerFound);
        }
    }
    async getOwnerByName(req, res) {
        const ownerFound = await Owner_1.default.findOne({ ownerName: req.params.ownerName });
        if (ownerFound == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send(ownerFound);
        }
    }
    async addOwner(req, res) {
        const ownerFound = await Owner_1.default.findOne({ ownerName: req.body.ownerName });
        if (ownerFound != null) {
            res.status(409).send("This owner already exists.");
        }
        else {
            const { ownerName, fullName, email, password } = req.body;
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashed = await bcryptjs_1.default.hash(password, salt);
            const newOwner = new Owner_1.default({ ownerName, fullName, email, password: hashed });
            const savedOwner = await newOwner.save();
            /*const token = jwt.sign({id: savedOwner._id, username: savedOwner.ownerName}, config.SECRET,{
                expiresIn: 3600 //seconds
            })*/
            res.status(201).send("Owner added");
        }
    }
    async updateOwner(req, res) {
        const ownerToUpdate = await Owner_1.default.findOneAndUpdate({ ownerName: req.params.ownerName }, req.body);
        if (ownerToUpdate == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(201).send('Owner updated.');
        }
    }
    async deleteOwner(req, res) {
        const ownerToDelete = await Owner_1.default.findByIdAndDelete(req.params._id);
        if (ownerToDelete == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send('Owner deleted.');
        }
    }
    routes() {
        this.router.get('/', this.getAllOwners);
        this.router.get('/:_id', this.getOwnerById);
        this.router.get('/name/:ownerName', this.getOwnerByName);
        this.router.post('/', this.addOwner);
        this.router.put('/:ownerName', this.updateOwner);
        this.router.delete('/:_id', this.deleteOwner);
    }
}
const ownersRoutes = new OwnersRoutes();
exports.default = ownersRoutes.router;
