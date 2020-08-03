import Building from "../models/building";
import Room from "../models/room";
import Device from "../models/device";
import { RequestHandler } from "express";

const checkBuildingName: RequestHandler = async (req, res, next) => {
  try {
    const existingBuilding = await Building.findOne({ name: req.body.name });
    if (existingBuilding) {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(400).send({ error: "Building name was taken" });
  }
};

const checkRoomName: RequestHandler = async (req, res, next) => {
  try {
    const existingRoom = await Room.findOne({
      name: req.body.name,
      _buildingId: req.params.buildingId
    });
    if (existingRoom) {
      throw new Error();
    }

    const building = await Building.findById(req.params.buildingId);
    if (!building) {
      return res.status(404).send();
    }

    next();
  } catch (e) {
    res.status(400).send({ error: "Room name was taken" });
  }
};

const checkDeviceName: RequestHandler = async (req, res, next) => {
  try {
    const existingDevice = await Device.findOne({
      name: req.body.name,
      _roomId: req.params.roomId
    });
    if (existingDevice) {
      throw new Error();
    }

    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).send();
    }

    next();
  } catch (e) {
    res.status(400).send({ error: "Device name was taken" });
  }
};

export { checkBuildingName, checkDeviceName, checkRoomName };
