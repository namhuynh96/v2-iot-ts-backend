import { Schema, model, Document } from "mongoose";
import Device from "./device";
import { IBuilding } from "./building";

export interface IRoom extends Document {
  name: string;
  _buildingId: IBuilding["_id"];
}

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    _buildingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Building"
    }
  },
  {
    timestamps: true
  }
);

roomSchema.pre("remove", async function(next) {
  const room = this;
  await Device.deleteMany({ _roomId: room._id });
  next();
});

const Room = model<IRoom>("Room", roomSchema);

export default Room;
