"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoomName = exports.checkDeviceName = exports.checkBuildingName = void 0;
const building_1 = __importDefault(require("../models/building"));
const room_1 = __importDefault(require("../models/room"));
const device_1 = __importDefault(require("../models/device"));
const checkBuildingName = async (req, res, next) => {
    try {
        const existingBuilding = await building_1.default.findOne({ name: req.body.name });
        if (existingBuilding) {
            throw new Error();
        }
        next();
    }
    catch (e) {
        res.status(400).send({ error: "Building name was taken" });
    }
};
exports.checkBuildingName = checkBuildingName;
const checkRoomName = async (req, res, next) => {
    try {
        const existingRoom = await room_1.default.findOne({
            name: req.body.name,
            _buildingId: req.params.buildingId
        });
        if (existingRoom) {
            throw new Error();
        }
        const building = await building_1.default.findById(req.params.buildingId);
        if (!building) {
            return res.status(404).send();
        }
        next();
    }
    catch (e) {
        res.status(400).send({ error: "Room name was taken" });
    }
};
exports.checkRoomName = checkRoomName;
const checkDeviceName = async (req, res, next) => {
    try {
        const existingDevice = await device_1.default.findOne({
            name: req.body.name,
            _roomId: req.params.roomId
        });
        if (existingDevice) {
            throw new Error();
        }
        const room = await room_1.default.findById(req.params.roomId);
        if (!room) {
            return res.status(404).send();
        }
        next();
    }
    catch (e) {
        res.status(400).send({ error: "Device name was taken" });
    }
};
exports.checkDeviceName = checkDeviceName;
