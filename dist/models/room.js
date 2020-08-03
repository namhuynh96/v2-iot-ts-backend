"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const device_1 = __importDefault(require("./device"));
const roomSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    _buildingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Building"
    }
}, {
    timestamps: true
});
roomSchema.pre("remove", async function (next) {
    const room = this;
    await device_1.default.deleteMany({ _roomId: room._id });
    next();
});
const Room = mongoose_1.model("Room", roomSchema);
exports.default = Room;
