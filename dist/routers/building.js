"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const building_1 = __importDefault(require("../models/building"));
const checkName_1 = require("../middlewares/checkName");
const iot_1 = require("../middlewares/iot");
const router = express_1.Router();
router.post("/api/buildings", isAdmin_1.default, checkName_1.checkBuildingName, async (req, res) => {
    try {
        const building = new building_1.default({ name: req.body.name });
        await building.save();
        res.status(201).send(building);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.get("/api/buildings", auth_1.default, async (_req, res) => {
    try {
        const buildings = await building_1.default.find({});
        res.send(buildings);
    }
    catch (e) {
        res.status(400).send();
    }
});
router.patch("/api/buildings/:id", isAdmin_1.default, checkName_1.checkBuildingName, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperation) {
        return res.status(404).send({ error: "Unvalid updates" });
    }
    try {
        const building = await building_1.default.findById(req.params.id);
        if (!building) {
            return res.status(404).send();
        }
        updates.forEach(update => (building[update] = req.body[update]));
        await building.save();
        res.send(building);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.delete("/api/buildings/:id", isAdmin_1.default, iot_1.deleteAWSBuilding, async (req, res) => {
    try {
        const building = await building_1.default.findById(req.params.id);
        await building.remove();
        res.send(building);
    }
    catch (e) {
        res.status(500).send();
    }
});
exports.default = router;
