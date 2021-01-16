"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAWSBuilding = void 0;
const iotConfig_1 = __importDefault(require("../../aws/iotConfig"));
const building_1 = __importDefault(require("../../models/building"));
const device_1 = __importDefault(require("../../models/device"));
const deleteAWSBuilding = async (req, res, next) => {
    try {
        const building = await building_1.default.findById(req.params.id);
        if (!building) {
            return res.status(404).send();
        }
        const devices = await device_1.default.find({ _buildingId: building._id });
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
exports.deleteAWSBuilding = deleteAWSBuilding;
