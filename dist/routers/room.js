"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const building_1 = __importDefault(require("../models/building"));
const room_1 = __importDefault(require("../models/room"));
const checkName_1 = require("../middlewares/checkName");
const iot_1 = require("../middlewares/iot");
const router = express_1.Router();
router.post("/api/rooms/:buildingId", isAdmin_1.default, checkName_1.checkRoomName, async (req, res) => {
    try {
        const room = new room_1.default({
            name: req.body.name,
            _buildingId: req.params.buildingId
        });
        await room.save();
        res.status(201).send(room);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.get("/api/rooms/:buildingId", auth_1.default, async (req, res) => {
    try {
        if (!(await building_1.default.findById(req.params.buildingId))) {
            return res.status(404).send();
        }
        const rooms = await room_1.default.find({ _buildingId: req.params.buildingId });
        res.send(rooms);
    }
    catch (e) {
        res.status(500).send();
    }
});
router.patch("/api/rooms/:buildingId/:roomId", isAdmin_1.default, checkName_1.checkRoomName, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperaition = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperaition) {
        return res.status(404).send({ error: "Unvalid Updates" });
    }
    try {
        const room = await room_1.default.findById(req.params.roomId);
        if (!room) {
            return res.status(404).send();
        }
        updates.forEach(u => (room[u] = req.body[u]));
        await room.save();
        res.send(room);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.delete("/api/rooms/:id", isAdmin_1.default, iot_1.deleteAWSRoom, async (req, res) => {
    try {
        const room = await room_1.default.findById(req.params.id);
        await room.remove();
        res.send(room);
    }
    catch (e) {
        res.status(500).send();
    }
});
exports.default = router;
