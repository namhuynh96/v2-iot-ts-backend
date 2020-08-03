import { RequestHandler } from "express";
import iot from "../../aws/iotConfig";
import Room from "../../models/room";
import Device from "../../models/device";

const deleteAWSRoom: RequestHandler = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).send();
    }

    const devices = await Device.find({ _roomId: room._id });
    devices.forEach(device => {
      iot.deleteThing(
        {
          thingName: device._id.toString()
        },
        (err, _data) => {
          if (err) throw new Error();
        }
      );
    });

    next();
  } catch (e) {
    res.status(503).send();
  }
};

export { deleteAWSRoom };
