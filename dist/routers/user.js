"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const user_1 = __importDefault(require("../models/user"));
const admin_1 = __importDefault(require("../models/admin"));
const router = express_1.Router();
router.get("/api/users", auth_1.default, async (req, res) => {
    try {
        const admin = await admin_1.default.findOne({
            cognitoUsername: req.user.cognitoUsername
        });
        if (admin) {
            return res.send({ isAdmin: true });
        }
        const existingUser = await user_1.default.findOne({
            cognitoUsername: req.user.cognitoUsername
        });
        if (!existingUser) {
            const newUser = new user_1.default(req.user);
            await newUser.save();
            return res.send(newUser);
        }
        res.send(existingUser);
    }
    catch (e) {
        res.status(400).send();
    }
});
router.get("/api/allUsers", isAdmin_1.default, async (req, res) => {
    try {
        let match = {};
        const emailQuery = req.query.email;
        if (emailQuery) {
            match.email = emailQuery;
        }
        const users = await user_1.default.find({ ...match });
        res.send(users);
    }
    catch (e) {
        res.status(400).send();
    }
});
router.post("/api/requestControll", auth_1.default, async (req, res) => {
    try {
        const user = await user_1.default.findOne({
            cognitoUsername: req.user.cognitoUsername
        });
        if (user) {
            user.isRequesting = true;
            user.cognitoIdentityId = req.body.cognitoIdentityId;
            await user.save();
        }
        res.send(user);
    }
    catch (e) {
        res.status(400).send();
    }
});
exports.default = router;
