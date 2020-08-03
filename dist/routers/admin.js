"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const iotConfig_1 = __importDefault(require("../aws/iotConfig"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.Router();
router.patch("/api/acceptUser/:id", isAdmin_1.default, async (req, res) => {
    try {
        const user = await user_1.default.findById(req.params.id);
        if (!user) {
            throw new Error("User not found");
        }
        iotConfig_1.default.attachPrincipalPolicy({
            policyName: "myIoTPolicy",
            principal: user.cognitoIdentityId
        }, async (err, _data) => {
            if (err)
                throw new Error();
            else {
                user.isRequesting = false;
                user.isAccepted = true;
                await user.save();
                res.send(user);
            }
        });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
router.patch("/api/detachUser/:id", isAdmin_1.default, async (req, res) => {
    try {
        const user = await user_1.default.findById(req.params.id);
        if (!user) {
            throw new Error("User not found");
        }
        iotConfig_1.default.detachPrincipalPolicy({
            policyName: "myIoTPolicy",
            principal: user.cognitoIdentityId
        }, async (err, _data) => {
            if (err)
                throw new Error();
            else {
                user.isAccepted = false;
                await user.save();
                res.send(user);
            }
        });
    }
    catch (e) {
        res.send(400).send(e.message);
    }
});
exports.default = router;
