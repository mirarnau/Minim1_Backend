"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_1 = __importDefault(require("../models/Customer"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const VisualizationConfig_1 = __importDefault(require("../models/VisualizationConfig"));
class CustomerRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllCustomers(req, res) {
        const allCustomers = await Customer_1.default.find();
        if (allCustomers.length == 0) {
            res.status(404).send("There are no customers yet.");
        }
        else {
            res.status(200).send(allCustomers);
        }
    }
    async getCustomerById(req, res) {
        const customerFound = await Customer_1.default.findById(req.params._id).populate("listReservations visualizationConfig");
        if (customerFound == null) {
            res.status(404).send("Customer not found.");
        }
        else {
            res.status(200).send(customerFound);
        }
    }
    async getCustomerByName(req, res) {
        const customerFound = await Customer_1.default.findOne({ customerName: req.params.customerName }).populate("visualizationConfig");
        if (customerFound == null) {
            res.status(404).send("Customer not found.");
        }
        else {
            res.status(200).send(customerFound);
        }
    }
    async login(req, res) {
        const userFound = await Customer_1.default.findOne({ email: req.body.email });
        if (!userFound)
            return res.status(400).json({ message: "User not found" });
        const matchPassword = await bcryptjs_1.default.compare(req.body.password, userFound.password);
        if (!matchPassword)
            return res.status(401).json({ token: null, message: "Ivalid password" });
        const token = jsonwebtoken_1.default.sign({ id: userFound._id, username: userFound.username }, config_1.default.SECRET, {
            expiresIn: 3600
        });
        return res.json({ token });
        console.log(token);
    }
    async addCustomer(req, res) {
        const customerFound = await Customer_1.default.findOne({ customerName: req.body.customerName });
        if (customerFound != null) {
            res.status(409).send("This customer already exists.");
        }
        else {
            const { customerName, fullName, email, password } = req.body;
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashed = await bcryptjs_1.default.hash(password, salt);
            //Now, its default configuration has to be created.
            const newConfig = new VisualizationConfig_1.default({ customerName, colorMode: true, fontSize: 12 }); //Default values when first created.
            const newCustomer = new Customer_1.default({ customerName, fullName, email, password: hashed, visualizationConfig: newConfig });
            await newConfig.save();
            await newCustomer.save();
            res.status(200).json("Customer and default configuration added.");
        }
    }
    async updateCustomer(req, res) {
        const customerToUpdate = await Customer_1.default.findByIdAndUpdate(req.params._id, req.body);
        if (customerToUpdate == null) {
            res.status(404).send("Customer not found.");
        }
        else {
            res.status(201).send("Customer updated.");
        }
    }
    async addDiscount(req, res) {
        const customer = await Customer_1.default.findById(req.params._id);
        const restaurant = await Restaurant_1.default.find({ restaurantName: req.body.nameRestaurant });
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        if (restaurant == null) {
            res.status(404).send("Restaurant not found.");
            return;
        }
        let discountsBody = req.body.listDiscounts;
        for (let i = 0; i < discountsBody.length; i++) {
            let found = 0;
            const discount = discountsBody[i];
            for (let u = 0; u < customer.listDiscounts.length; u++) {
                if ((customer.listDiscounts[u].nameRestaurant == discount.nameRestaurant)
                    && (customer.listDiscounts[u].amount == discount.amount)
                    && (customer.listDiscounts[u].expirationDate == discount.expirationDate)) {
                    found = 1;
                }
            }
            if (found == 0) {
                await Customer_1.default.findByIdAndUpdate({ _id: req.params._id }, { $push: { listDiscounts: discount } });
            }
        }
        res.status(201).send("Discounts added.");
    }
    async removeDiscount(req, res) {
        const customer = await Customer_1.default.findById(req.params._id);
        const restaurant = await Restaurant_1.default.find({ restaurantName: req.body.nameRestaurant });
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        if (restaurant == null) {
            res.status(404).send("Restaurant not found.");
            return;
        }
        let listDiscountsCustomer = customer.listDiscounts;
        let found = 0;
        for (let i = 0; i < listDiscountsCustomer.length; i++) {
            if ((listDiscountsCustomer[i].nameRestaurant == req.body.nameRestaurant)
                && (listDiscountsCustomer[i].amount == req.body.amount)
                && (listDiscountsCustomer[i].timeReservation == req.body.timeReservation)) {
                listDiscountsCustomer.splice(i, 1);
                found = 1;
            }
        }
        if (found == 0) {
            res.status(404).send("The customer does not have this discount.");
            return;
        }
        await Customer_1.default.findByIdAndUpdate(req.params._id, { listDiscounts: listDiscountsCustomer });
        res.status(200).send("Discount removed.");
    }
    async addTaste(req, res) {
        const customer = await Customer_1.default.findById(req.params._id);
        let listTastesCustomer = customer.listTastes;
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        //Customer.findByIdAndUpdate({_id: req.params._id}, {$push: {listTastes: listTastesAdd}})
        const listTagsCustomer = listTastesCustomer.map(taste => taste.tagName);
        const listTagsAdd = req.body.listTastes.map(tagName => tagName.tagName);
        for (let i = 0; i < listTagsAdd.length; i++) {
            if (listTagsCustomer.includes(listTagsAdd[i])) {
                return res.status(409).send("Taste already exists.");
            }
            else {
                listTastesCustomer.push(req.body.listTastes[i]);
            }
        }
        await customer.updateOne({ listTastes: listTastesCustomer });
        res.status(201).send("Tastes added.");
    }
    async removeTaste(req, res) {
        const customer = await Customer_1.default.findById(req.params._id);
        if (customer == null) {
            res.status(404).send("Customer not found.");
            return;
        }
        let listTastesCustomer = customer.listTastes;
        const listTagsCustomer = listTastesCustomer.map(taste => taste.tagName);
        const listTagsRm = req.body.listTastes.map(tagName => tagName.tagName);
        for (let i = 0; i < listTagsRm.length; i++) {
            const index = listTagsCustomer.indexOf(listTagsRm[i]);
            if (index == -1) {
                return res.status(409).send("The user might not have some of these tastes yet.");
            }
            else {
                listTastesCustomer.splice(index, 1);
            }
        }
        await customer.updateOne({ listTastes: listTastesCustomer });
        return res.status(200).send("Taste deleted.");
    }
    async deleteCustomer(req, res) {
        const customerToDelete = await Customer_1.default.findByIdAndDelete(req.params._id);
        if (customerToDelete == null) {
            res.status(404).send("Customer not found.");
        }
        else {
            res.status(200).send('Customer deleted.');
        }
    }
    routes() {
        this.router.get('/', this.getAllCustomers);
        this.router.put('/discounts/add/:_id', this.addDiscount);
        this.router.get('/:_id', this.getCustomerById);
        this.router.get('/name/:customerName', this.getCustomerByName);
        this.router.post('/', this.addCustomer);
        this.router.post('/login', this.login);
        this.router.put('/:_id', this.updateCustomer);
        this.router.put('/tastes/add/:_id', this.addTaste);
        this.router.put('/tastes/remove/:_id', this.removeTaste);
        this.router.delete('/:_id', this.deleteCustomer);
    }
}
const customersRoutes = new CustomerRoutes();
exports.default = customersRoutes.router;
