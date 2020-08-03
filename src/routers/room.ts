import { Router } from "express";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/isAdmin";
import Building from "../models/building";
import Room from "../models/room";
import { checkRoomName } from "../middlewares/checkName";
import { deleteAWSRoom } from "../middlewares/iot";
const router = Router();

router.post(
  "/api/rooms/:buildingId",
  isAdmin,
  checkRoomName,
  async (req, res) => {
    try {
      const room = new Room({
        name: req.body.name,
        _buildingId: req.params.buildingId
      });

      await room.save();
      res.status(201).send(room);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/api/rooms/:buildingId", auth, async (req, res) => {
  try {
    if (!(await Building.findById(req.params.buildingId))) {
      return res.status(404).send();
    }
    const rooms = await Room.find({ _buildingId: req.params.buildingId });
    res.send(rooms);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch(
  "/api/rooms/:buildingId/:roomId",
  isAdmin,
  checkRoomName,
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperaition = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperaition) {
      return res.status(404).send({ error: "Unvalid Updates" });
    }
    try {
      const room = await Room.findById(req.params.roomId);
      if (!room) {
        return res.status(404).send();
      }
      updates.forEach(u => (room[u as "name"] = req.body[u]));
      await room.save();
      res.send(room);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.delete("/api/rooms/:id", isAdmin, deleteAWSRoom, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    await room!.remove();
    res.send(room);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
