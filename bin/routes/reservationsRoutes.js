"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_1 = __importDefault(require("../models/Customer"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
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
        const ownerFound = await Reservation_1.default.findById(req.params._id).populate('_idCustomer _idRestaurant');
        if (ownerFound == null) {
            res.status(404).send("Reservation not found.");
        }
        else {
            res.status(200).send(ownerFound);
        }
    }
    async addReservation(req, res) {
        const reservationFound = await Reservation_1.default.findOne({ _idCustomer: req.body._idCustomer, _idRestaurant: req.body._idRestaurant, dateReservation: req.body.dateReservation });
        if (reservationFound != null) {
            res.status(409).send("This reservation already exists.");
            return;
        }
        const { _idCustomer, _idRestaurant, dateReservation, timeReservation } = req.body;
        const newReservation = new Reservation_1.default({ _idCustomer, _idRestaurant, dateReservation, timeReservation });
        const customer = await Customer_1.default.findById(_idCustomer);
        const restaurant = await Restaurant_1.default.findById(_idRestaurant);
        if ((customer == null) || (restaurant == null)) {
            res.status(404).send("Customer or Restaurant not found.");
            return;
        }
        let listReservationsCustomer;
        listReservationsCustomer = customer.listReservations;
        let newReservationID;
        await newReservation.save().then(reservation => {
            newReservationID = reservation._id.toString();
            listReservationsCustomer.push(newReservationID);
        });
        await Customer_1.default.findByIdAndUpdate({ _id: _idCustomer }, { listReservations: listReservationsCustomer });
        res.status(201).send('Reservation added and customer updated.');
    }
    async updateReservation(req, res) {
        const reservation = await Reservation_1.default.findById(req.params._id);
        if (reservation == null) {
            res.status(404).send("Reservation not found");
            return;
        }
        const customer = await Customer_1.default.findById(req.body._idCustomer);
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        const restaurant = Restaurant_1.default.findById(req.body._idRestaurant);
        if (restaurant == null) {
            res.status(404).send("Restaurant not found");
            return;
        }
        await Reservation_1.default.findByIdAndUpdate({ _id: req.params._id }, req.body);
        let listReservationsCustomer = customer.listReservations;
        for (let i = 0; i < listReservationsCustomer.length; i++) {
            if (listReservationsCustomer[i]._id == reservation._id) {
                listReservationsCustomer.splice(i, 1);
            }
        }
        await Customer_1.default.findByIdAndUpdate({ _id: req.body._idCustomer }, { listReservations: listReservationsCustomer });
        res.status(201).send('Reservation updated.');
    }
    async deleteReservation(req, res) {
        const reservationToDelete = await Reservation_1.default.findById(req.params._id);
        if (reservationToDelete == null) {
            res.status(404).send("Reservation not found.");
            return;
        }
        let customer = await Customer_1.default.findById({ _id: reservationToDelete._idCustomer });
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        let listReservationsCustomer = customer.listReservations;
        for (let i = 0; i < listReservationsCustomer.length; i++) {
            if (listReservationsCustomer[i].toString() == reservationToDelete._id.toString()) {
                listReservationsCustomer.splice(i, 1);
            }
        }
        await Customer_1.default.findByIdAndUpdate({ _id: reservationToDelete._idCustomer }, { listReservations: listReservationsCustomer });
        await Reservation_1.default.findByIdAndDelete({ _id: reservationToDelete._id });
        res.status(200).send('Reservation deleted.');
        //await Reservation.findByIdAndDelete({_id: req.params._id});
    }
    routes() {
        this.router.get('/', this.getAllReservations);
        this.router.get('/:_id', this.getReservationById);
        this.router.post('/', this.addReservation);
        this.router.put('/:_id', this.updateReservation);
        this.router.delete('/:_id', this.deleteReservation);
    }
}
const ownersRoutes = new ReservationsRoutes();
exports.default = ownersRoutes.router;
