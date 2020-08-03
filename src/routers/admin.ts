import { Router } from "express";
import isAdmin from "../middlewares/isAdmin";
import iot from "../aws/iotConfig";
import User from "../models/user";
const router = Router();

router.patch("/api/acceptUser/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    iot.attachPrincipalPolicy(
      {
        policyName: "myIoTPolicy",
        principal: user.cognitoIdentityId!
      },
      async (err, _data) => {
        if (err) throw new Error();
        else {
          user.isRequesting = false;
          user.isAccepted = true;
          await user.save();
          res.send(user);
        }
      }
    );
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/api/detachUser/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    iot.detachPrincipalPolicy(
      {
        policyName: "myIoTPolicy",
        principal: user.cognitoIdentityId!
      },
      async (err, _data) => {
        if (err) throw new Error();
        else {
          user.isAccepted = false;
          await user.save();
          res.send(user);
        }
      }
    );
  } catch (e) {
    res.send(400).send(e.message);
  }
});

export default router;
