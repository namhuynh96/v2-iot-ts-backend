import { Router } from "express";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/isAdmin";
const router = Router();

import Room from "../models/room";
import Device from "../models/device";
import { checkDeviceName } from "../middlewares/checkName";
import { deleteAWSDevice } from "../middlewares/iot";
import { checkDeviceConnected } from "../aws/pubsub";
import { IDevice } from "../models/device";
import iot from "../aws/iotConfig";

router.post(
  "/api/devices/:buildingId/:roomId",
  isAdmin,
  checkDeviceName,
  async (req, res) => {
    try {
      const { name, configs } = req.body as IDevice;
      const { buildingId, roomId } = req.params;

      const device = new Device({
        name,
        configs,
        _buildingId: buildingId,
        _roomId: roomId
      });
      await device.save();

      iot.createThing({ thingName: device._id.toString() }, (err, _data) => {
        if (err) throw new Error();
      });

      checkDeviceConnected(device._id.toString());
      res.status(201).send(device);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/api/devices/:roomId", auth, async (req, res) => {
  try {
    if (!(await Room.findById(req.params.roomId))) {
      return res.status(404).send();
    }
    const devices = await Device.find({ _roomId: req.params.roomId });
    res.send(devices);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/api/alldevicesid", auth, async (_req, res) => {
  try {
    const devices = await Device.find({});
    const devicesId = devices.map(d => d._id);
    res.send(devicesId);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch(
  "/api/devices/:roomId/:deviceId",
  isAdmin,
  checkDeviceName,
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "configs"];
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperation) {
      return res.status(400).send({ error: "Unvalid updates" });
    }
    try {
      const device = await Device.findById(req.params.deviceId);
      if (!device) {
        return res.status(404).send();
      }
      updates.forEach(u => (device[u as "name" | "configs"] = req.body[u]));
      await device.save();
      res.send(device);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.patch("/api/deviceconfigs/:deviceId", isAdmin, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["configs"];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Unvalid updates" });
  }
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).send();
    }
    updates.forEach(u => (device[u as "configs"] = req.body[u]));
    await device.save();
    res.send(device);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete(
  "/api/devices/:deviceId",
  isAdmin,
  deleteAWSDevice,
  async (req, res) => {
    try {
      const device = await Device.findByIdAndDelete(req.params.deviceId);
      res.send(device);
    } catch (e) {
      res.status(500).send();
    }
  }
);

export default router;
