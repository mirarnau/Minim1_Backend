"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Reservation_1 = __importDefault(require("../models/Reservation"));
class ReservationsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllReservations(req, res) {
        const allReservations = await Reservation_1.default.find();
        if (allReservations.length == 0) {
            res.status(404).send("There are no reservations yet.");
        }
        else {
            res.status(200).send(allReservations);
        }
    }
    async getReservationById(req, res) {
        const ownerFound = await Reservation_1.default.findById(req.params._id);
        if (ownerFound == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send(ownerFound);
        }
    }
    async getOwnerByName(req, res) {
        const ownerFound = await Owner.findOne({ ownerName: req.params.ownerName });
        if (ownerFound == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send(ownerFound);
        }
    }
    async addOwner(req, res) {
        const ownerFound = await Owner.findOne({ ownerName: req.body.ownerName });
        if (ownerFound != null) {
            res.status(409).send("This owner already exists.");
        }
        else {
            const { ownerName, fullName, email, password } = req.body;
            const newOwner = new Owner({ ownerName, fullName, email, password });
            await newOwner.save();
            res.status(201).send('Owner added.');
        }
    }
    async updateOwner(req, res) {
        const ownerToUpdate = await Owner.findOneAndUpdate({ ownerName: req.params.ownerName }, req.body);
        if (ownerToUpdate == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(201).send('Owner updated.');
        }
    }
    async deleteOwner(req, res) {
        const ownerToDelete = await Owner.findOneAndDelete({ ownerName: req.params.ownerName }, req.body);
        if (ownerToDelete == null) {
            res.status(404).send("Owner not found.");
        }
        else {
            res.status(200).send('Owner deleted.');
        }
    }
    routes() {
        this.router.get('/', this.getAllReservations);
        this.router.get('/:_id', this.getReservationById);
        this.router.get('/name/:ownerName', this.getOwnerByName);
        this.router.post('/', this.addOwner);
        this.router.put('/:ownerName', this.updateOwner);
        this.router.delete('/:ownerName', this.deleteOwner);
    }
}
const ownersRoutes = new ReservationsRoutes();
exports.default = ownersRoutes.router;
