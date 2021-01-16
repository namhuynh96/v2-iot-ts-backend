"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAWSDevice = void 0;
const iotConfig_1 = __importDefault(require("../../aws/iotConfig"));
const device_1 = __importDefault(require("../../models/device"));
// const createAWSDevice: RequestHandler<{
//   buildingId: string;
//   roomId: string;
//   deviceId: string;
// }> = async (req, res, next) => {
//   try {
//     const { name, configs } = req.body as IDevice;
//     const { buildingId, roomId } = req.params;
//     const device = new Device({
//       name,
//       configs,
//       _buildingId: buildingId,
//       _roomId: roomId
//     });
//     req.device = device;
//     iot.createThing({ thingName: device._id.toString() }, (err, _data) => {
//       if (err) throw new Error();
//     });
//     next();
//   } catch (e) {
//     res.status(503).send();
//   }
// };
const deleteAWSDevice = async (req, res, next) => {
    try {
        const device = await device_1.default.findById(req.params.deviceId);
        if (!device) {
            return res.status(404).send();
        }
        iotConfig_1.default.deleteThing({
            thingName: device._id.toString()
        }, (err, _data) => {
            if (err)
                throw new Error();
        });
        next();
    }
    catch (e) {
        res.status(503).send();
    }
};
exports.deleteAWSDevice = deleteAWSDevice;
