import { Schema, model, Document } from "mongoose";
import Room from "./room";
import Device from "./device";

export interface IBuilding extends Document {
  name: string;
}

const buildingSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

buildingSchema.pre("remove", async function(next) {
  const building = this;
  await Room.deleteMany({ _buildingId: building._id });
  Room.name
  await Device.deleteMany({ _buildingId: building._id });
  next();
});

const Building = model<IBuilding>("Building", buildingSchema);

export default Building;
