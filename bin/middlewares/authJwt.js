"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.verifyToken = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const Owner_1 = __importDefault(require("../models/Owner"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import Role from '../models/Role';
const config_1 = __importDefault(require("../config"));
const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({ message: "No token" });
        return;
    }
    //Check if the user exists
    const { id, username, password } = jwtPayload;
    const customer = await Customer_1.default.findById(id);
    if (!customer) {
        const owner = await Owner_1.default.findById(id);
        if (!owner)
            return res.status(404).json({ message: "No user found" });
    }
    //Call the next middleware or controller
    next();
};
exports.verifyToken = verifyToken;
const isOwner = async (req, res, next) => {
    const owner = await Owner_1.default.findById(res.locals.jwtPayload.id);
    if (!owner)
        return res.status(403).json({ message: "You need to be an owner" });
    next();
};
exports.isOwner = isOwner;
