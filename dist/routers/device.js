"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = express_1.Router();
const room_1 = __importDefault(require("../models/room"));
const device_1 = __importDefault(require("../models/device"));
const checkName_1 = require("../middlewares/checkName");
const iot_1 = require("../middlewares/iot");
const pubsub_1 = require("../aws/pubsub");
const iotConfig_1 = __importDefault(require("../aws/iotConfig"));
router.post("/api/devices/:buildingId/:roomId", isAdmin_1.default, checkName_1.checkDeviceName, async (req, res) => {
    try {
        const { name, configs } = req.body;
        const { buildingId, roomId } = req.params;
        const device = new device_1.default({
            name,
            configs,
            _buildingId: buildingId,
            _roomId: roomId
        });
        await device.save();
        iotConfig_1.default.createThing({ thingName: device._id.toString() }, (err, _data) => {
            if (err)
                throw new Error();
        });
        pubsub_1.checkDeviceConnected(device._id.toString());
        res.status(201).send(device);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.get("/api/devices/:roomId", auth_1.default, async (req, res) => {
    try {
        if (!(await room_1.default.findById(req.params.roomId))) {
            return res.status(404).send();
        }
        const devices = await device_1.default.find({ _roomId: req.params.roomId });
        res.send(devices);
    }
    catch (e) {
        res.status(500).send();
    }
});
router.get("/api/alldevicesid", auth_1.default, async (_req, res) => {
    try {
        const devices = await device_1.default.find({});
        const devicesId = devices.map(d => d._id);
        res.send(devicesId);
    }
    catch (e) {
        res.status(500).send();
    }
});
router.patch("/api/devices/:roomId/:deviceId", isAdmin_1.default, checkName_1.checkDeviceName, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "configs"];
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Unvalid updates" });
    }
    try {
        const device = await device_1.default.findById(req.params.deviceId);
        if (!device) {
            return res.status(404).send();
        }
        updates.forEach(u => (device[u] = req.body[u]));
        await device.save();
        res.send(device);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.patch("/api/deviceconfigs/:deviceId", isAdmin_1.default, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["configs"];
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Unvalid updates" });
    }
    try {
        const device = await device_1.default.findById(req.params.deviceId);
        if (!device) {
            return res.status(404).send();
        }
        updates.forEach(u => (device[u] = req.body[u]));
        await device.save();
        res.send(device);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.delete("/api/devices/:deviceId", isAdmin_1.default, iot_1.deleteAWSDevice, async (req, res) => {
    try {
        const device = await device_1.default.findByIdAndDelete(req.params.deviceId);
        res.send(device);
    }
    catch (e) {
        res.status(500).send();
    }
});
exports.default = router;
