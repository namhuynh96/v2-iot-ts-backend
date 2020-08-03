import { RequestHandler } from "express";
import iot from "../../aws/iotConfig";
import Building from "../../models/building";
import Device from "../../models/device";

const deleteAWSBuilding: RequestHandler<{id: string}> = async (req, res, next) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).send();
    }

    const devices = await Device.find({ _buildingId: building._id });
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

export { deleteAWSBuilding };
