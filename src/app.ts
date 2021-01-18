import express from "express";
require("./db/mongoose");
import adminRouter from "./routers/admin";
import userRouter from "./routers/user";
import buildingRouter from "./routers/building";
import roomRouter from "./routers/room";
import deviceRouter from "./routers/device";
import checkDevicesConnected from "./aws/checkConnected";
import path from "path";
checkDevicesConnected();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join("frontend", "build")));

app.use(adminRouter);
app.use(userRouter);
app.use(buildingRouter);
app.use(roomRouter);
app.use(deviceRouter);

app.use((_req, res, _next) => {
  res.sendFile(path.resolve("frontend", "build", "index.html"));
});

export default app;
