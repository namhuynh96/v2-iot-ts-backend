"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iot_device_sdk_1 = __importDefault(require("aws-iot-device-sdk"));
const keys_1 = __importDefault(require("../config/keys"));
const checkDeviceConnected = (deviceIds) => {
    const device = new aws_iot_device_sdk_1.default.device({
        host: keys_1.default.awsIotEndpoint,
        protocol: "wss",
        accessKeyId: keys_1.default.awsAccessKeyId,
        secretKey: keys_1.default.awsSecretKey
    });
    const topics = [];
    if (Array.isArray(deviceIds)) {
        deviceIds.forEach(id => {
            topics.push(`$aws/events/presence/connected/${id}`, `$aws/events/presence/disconnected/${id}`);
        });
    }
    else if (typeof deviceIds === "string") {
        topics.push(`$aws/events/presence/connected/${deviceIds}`, `$aws/events/presence/disconnected/${deviceIds}`);
    }
    device.subscribe(topics);
    device.on("message", function (_topic, payload) {
        const data = JSON.parse(payload.toString());
        device.publish(`$aws/things/${data.clientId}/shadow/update`, JSON.stringify({
            state: {
                reported: {
                    connected: data.eventType === "connected" ? true : false
                }
            }
        }));
    });
};
exports.checkDeviceConnected = checkDeviceConnected;
