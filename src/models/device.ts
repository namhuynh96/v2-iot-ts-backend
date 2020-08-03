import { Schema, model, Document } from "mongoose";
import { IRoom } from "./room";
import { IBuilding } from "./building";

enum DeviceTypes {
  digital = "digital",
  analog = "analog"
}

export interface IDevice extends Document {
  name: string;
  _roomId: IRoom["_id"];
  _building: IBuilding["_id"];
  configs: {
    type: string;
    max?: number;
    min?: number;
    step?: number;
    unit?: string;
  };
}

const deviceSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    _roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room"
    },
    _buildingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Building"
    },
    configs: {
      type: {
        type: String,
        required: true,
        validate(value: DeviceTypes) {
          if (value !== DeviceTypes.digital && value !== DeviceTypes.analog) {
            throw new Error("Invalid device type");
          }
        }
      },
      max: {
        type: Number,
        required: function() {
          return this.configs.type === "analog";
        }
      },
      min: {
        type: Number,
        required: function() {
          return this.configs.type === "analog";
        }
      },
      step: {
        type: Number,
        required: function() {
          return this.configs.type === "analog";
        }
      },
      unit: {
        type: String,
        required: function() {
          return this.configs.type === "analog";
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const Device = model<IDevice>("Device", deviceSchema);

export default Device;
