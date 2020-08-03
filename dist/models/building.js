"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const room_1 = __importDefault(require("./room"));
const device_1 = __importDefault(require("./device"));
const buildingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
buildingSchema.pre("remove", async function (next) {
    const building = this;
    await room_1.default.deleteMany({ _buildingId: building._id });
    room_1.default.name;
    await device_1.default.deleteMany({ _buildingId: building._id });
    next();
});
const Building = mongoose_1.model("Building", buildingSchema);
exports.default = Building;
