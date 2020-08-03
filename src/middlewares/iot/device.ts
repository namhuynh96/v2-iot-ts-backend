import { RequestHandler } from "express";
import iot from "../../aws/iotConfig";
import Device from "../../models/device";

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

const deleteAWSDevice: RequestHandler = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).send();
    }

    iot.deleteThing(
      {
        thingName: device._id.toString()
      },
      (err, _data) => {
        if (err) throw new Error();
      }
    );

    next();
  } catch (e) {
    res.status(503).send();
  }
};

export { deleteAWSDevice };
