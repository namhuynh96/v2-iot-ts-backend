"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("./pubsub");
const device_1 = __importDefault(require("../models/device"));
const checkDevicesConnected = async () => {
    const device = await device_1.default.find({});
    const deviceIds = device.map(d => d._id);
    pubsub_1.checkDeviceConnected(deviceIds);
};
exports.default = checkDevicesConnected;
