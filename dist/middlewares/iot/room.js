"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const iotConfig_1 = __importDefault(require("../../aws/iotConfig"));
const room_1 = __importDefault(require("../../models/room"));
const device_1 = __importDefault(require("../../models/device"));
const deleteAWSRoom = async (req, res, next) => {
    try {
        const room = await room_1.default.findById(req.params.id);
        if (!room) {
            return res.status(404).send();
        }
        const devices = await device_1.default.find({ _roomId: room._id });
        devices.forEach(device => {
            iotConfig_1.default.deleteThing({
                thingName: device._id.toString()
            }, (err, _data) => {
                if (err)
                    throw new Error();
            });
        });
        next();
    }
    catch (e) {
        res.status(503).send();
    }
};
exports.deleteAWSRoom = deleteAWSRoom;
