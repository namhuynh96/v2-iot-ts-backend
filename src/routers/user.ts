import { Router } from "express";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/isAdmin";
import User from "../models/user";
import Admin from "../models/admin";

const router = Router();

router.get("/api/users", auth, async (req, res) => {
  try {
    const admin = await Admin.findOne({
      cognitoUsername: req.user.cognitoUsername
    });
   
    if (admin) {
      return res.send({ isAdmin: true });
    }

    const existingUser = await User.findOne({
      cognitoUsername: req.user.cognitoUsername
    });

    if (!existingUser) {
      const newUser = new User(req.user);
      await newUser.save();
      return res.send(newUser);
    }

    res.send(existingUser);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/api/allUsers", isAdmin, async (req, res) => {
  try {
    let match: { email?: string } = {};

    const emailQuery = (req.query as { email: string }).email;
    if (emailQuery) {
      match.email = emailQuery;
    }

    const users = await User.find({ ...match });
    res.send(users);
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/api/requestControll", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      cognitoUsername: req.user.cognitoUsername
    });
    if (user) {
      user.isRequesting = true;
      user.cognitoIdentityId = req.body.cognitoIdentityId;
      await user.save();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

export default router;
