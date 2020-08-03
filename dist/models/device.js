"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["digital"] = "digital";
    DeviceTypes["analog"] = "analog";
})(DeviceTypes || (DeviceTypes = {}));
const deviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: true
    },
    _roomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Room"
    },
    _buildingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Building"
    },
    configs: {
        type: {
            type: String,
            required: true,
            validate(value) {
                if (value !== DeviceTypes.digital && value !== DeviceTypes.analog) {
                    throw new Error("Invalid device type");
                }
            }
        },
        max: {
            type: Number,
            required: function () {
                return this.configs.type === "analog";
            }
        },
        min: {
            type: Number,
            required: function () {
                return this.configs.type === "analog";
            }
        },
        step: {
            type: Number,
            required: function () {
                return this.configs.type === "analog";
            }
        },
        unit: {
            type: String,
            required: function () {
                return this.configs.type === "analog";
            }
        }
    }
}, {
    timestamps: true
});
const Device = mongoose_1.model("Device", deviceSchema);
exports.default = Device;
