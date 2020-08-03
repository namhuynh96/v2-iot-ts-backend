import { Router } from "express";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/isAdmin";
import Building from "../models/building";
import { checkBuildingName } from "../middlewares/checkName";
import { deleteAWSBuilding } from "../middlewares/iot";

const router = Router();

router.post("/api/buildings", isAdmin, checkBuildingName, async (req, res) => {
  try {
    const building = new Building({ name: req.body.name });
    await building.save();
    res.status(201).send(building);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/api/buildings", auth, async (_req, res) => {
  try {
    const buildings = await Building.find({});
    res.send(buildings);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch(
  "/api/buildings/:id",
  isAdmin,
  checkBuildingName,
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));
    if (!isValidOperation) {
      return res.status(404).send({ error: "Unvalid updates" });
    }
    try {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(404).send();
      }
      updates.forEach(
        update => (building[update as "name"] = req.body[update])
      );
      await building.save();
      res.send(building);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.delete(
  "/api/buildings/:id",
  isAdmin,
  deleteAWSBuilding,
  async (req, res) => {
    try {
      const building = await Building.findById(req.params.id);
      await building!.remove();
      res.send(building);
    } catch (e) {
      res.status(500).send();
    }
  }
);

export default router;
